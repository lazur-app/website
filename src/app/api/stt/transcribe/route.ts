import { db } from "@/db";
import { appSessions, transcriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

/**
 * Resample 16-bit PCM audio from source sample rate to target sample rate
 * Uses linear interpolation for simplicity
 */
function resampleAudio(pcmBuffer: Buffer, sourceSampleRate: number, targetSampleRate: number): Buffer {
    const ratio = sourceSampleRate / targetSampleRate;
    const sourceLength = pcmBuffer.length / 2; // 16-bit = 2 bytes per sample
    const targetLength = Math.floor(sourceLength / ratio);
    const result = Buffer.alloc(targetLength * 2);

    for (let i = 0; i < targetLength; i++) {
        const srcIndex = i * ratio;
        const srcIndexFloor = Math.floor(srcIndex);
        const srcIndexCeil = Math.min(srcIndexFloor + 1, sourceLength - 1);
        const frac = srcIndex - srcIndexFloor;

        const sample1 = pcmBuffer.readInt16LE(srcIndexFloor * 2);
        const sample2 = pcmBuffer.readInt16LE(srcIndexCeil * 2);
        const interpolated = Math.round(sample1 * (1 - frac) + sample2 * frac);

        result.writeInt16LE(Math.max(-32768, Math.min(32767, interpolated)), i * 2);
    }

    return result;
}

export async function POST(req: Request) {
    console.log("STT: --- New Transcription Request (Google Cloud) ---");
    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sessionToken = authHeader.split(" ")[1];
        const session = await db.query.appSessions.findFirst({
            where: eq(appSessions.sessionToken, sessionToken),
        });

        if (!session) {
            console.error("STT: Auth failed - session not found");
            return NextResponse.json({ error: "Invalid session" }, { status: 401 });
        }

        const formData = await req.formData();
        const audioFile = formData.get("file") as File;
        const sampleRate = formData.get("sample_rate") || "16000";

        if (!audioFile) {
            return NextResponse.json({ error: "No audio file" }, { status: 400 });
        }

        const fullBuffer = Buffer.from(await audioFile.arrayBuffer());
        const pcmBuffer = fullBuffer.slice(44);

        // Debug: Log first 16 bytes to check for RIFF header
        const headerHex = fullBuffer.slice(0, 16).toString("hex");
        const riff = fullBuffer.slice(0, 4).toString();

        const sourceSampleRate = Number(sampleRate);
        const targetSampleRate = 16000;

        console.log(`STT: Received file: ${audioFile.name}, size: ${fullBuffer.length} bytes, rate: ${sourceSampleRate}`);
        console.log(`STT: PCM size: ${pcmBuffer.length} bytes`);
        console.log(`STT: RIFF: ${riff}, Header: ${headerHex}`);

        // Resample audio to 16kHz if needed
        let finalPcmBuffer: Buffer = pcmBuffer;
        if (sourceSampleRate !== targetSampleRate) {
            console.log(`STT: Resampling from ${sourceSampleRate}Hz to ${targetSampleRate}Hz...`);
            finalPcmBuffer = resampleAudio(pcmBuffer, sourceSampleRate, targetSampleRate) as Buffer;
            console.log(`STT: Resampled PCM size: ${finalPcmBuffer.length} bytes`);
        }

        // Check audio levels to verify there's actual sound
        let sumSquares = 0;
        let peak = 0;
        const sampleCount = finalPcmBuffer.length / 2;
        for (let i = 0; i < finalPcmBuffer.length; i += 2) {
            const sample = finalPcmBuffer.readInt16LE(i);
            sumSquares += sample * sample;
            peak = Math.max(peak, Math.abs(sample));
        }
        const rms = Math.sqrt(sumSquares / sampleCount);
        console.log(`STT: Audio levels - RMS: ${rms.toFixed(0)}, Peak: ${peak}, Duration: ${(sampleCount / targetSampleRate).toFixed(2)}s`);
        if (rms < 100) {
            console.warn("STT: WARNING - Audio appears silent or very quiet (RMS < 100)");
        }

        if (!GOOGLE_API_KEY) {
            return NextResponse.json({ error: "Google STT API Key not configured" }, { status: 500 });
        }

        const googleUrl = `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`;

        const googlePayload = {
            config: {
                encoding: "LINEAR16",
                sampleRateHertz: targetSampleRate,
                languageCode: "en-US",
                enableAutomaticPunctuation: true,
                model: "default"
            },
            audio: {
                content: finalPcmBuffer.toString("base64")
            }
        };

        const response = await fetch(googleUrl, {
            method: "POST",
            body: JSON.stringify(googlePayload),
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("STT: Google Error ->", JSON.stringify(data));
            return NextResponse.json({ error: "Google STT failed" }, { status: 502 });
        }

        const transcript = data.results?.[0]?.alternatives?.[0]?.transcript || "";
        console.log(`STT: Result from Google -> "${transcript}"`);

        if (!transcript) {
            console.log("STT: Full Google response for empty transcript ->", JSON.stringify(data));
        }

        if (transcript) {
            console.log("STT: Saving history for user:", session.userId);
            try {
                await db.insert(transcriptions).values({
                    userId: session.userId,
                    content: transcript,
                });
            } catch (dbErr) {
                console.error("STT: Database Error saving transcription ->", dbErr);
                // We still return the transcript to the user even if DB fails
            }
        }

        return NextResponse.json({ transcript });

    } catch (error) {
        console.error("STT: System Error ->", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
