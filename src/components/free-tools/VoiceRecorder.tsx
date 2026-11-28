"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Btn, CopyBtn, Notice, Panel, Unsupported } from "./ui";
import { PulseDot, downloadBlob, useSpeechRecognition } from "./Dictation";

type Status = "idle" | "asking" | "recording" | "paused" | "done" | "denied" | "error";

function pickMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const options = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4"];
  return options.find((m) => MediaRecorder.isTypeSupported(m)) ?? "";
}

function extFor(mime: string): string {
  if (mime.includes("ogg")) return "ogg";
  if (mime.includes("mp4") || mime.includes("aac")) return "m4a";
  return "webm";
}

function fmt(sec: number) {
  const s = Math.floor(sec);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/** Voice recorder: record from the mic, pause, play back and download. A live transcript runs alongside where supported. */
export function VoiceRecorder(_props: { page?: string }) {
  void _props;
  const [status, setStatus] = useState<Status>("idle");
  const [level, setLevel] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [url, setUrl] = useState<string | null>(null);
  const [ext, setExt] = useState("webm");
  const [supported, setSupported] = useState<boolean | null>(null);
  const [transcript, setTranscript] = useState("");

  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef(0);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const urlRef = useRef<string | null>(null);
  const blobRef = useRef<Blob | null>(null);
  const accRef = useRef(0);
  const lastRef = useRef(0);
  const statusRef = useRef<Status>("idle");

  useEffect(() => {
    statusRef.current = status;
  });
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(typeof MediaRecorder !== "undefined" && !!navigator.mediaDevices?.getUserMedia);
  }, []);

  const onFinal = useCallback((t: string) => setTranscript((p) => (p ? p + " " : "") + t), []);
  const stt = useSpeechRecognition({ lang: typeof navigator !== "undefined" ? navigator.language || "en-US" : "en-US", onFinal });
  const sttStart = stt.start;
  const sttStop = stt.stop;

  const releaseMic = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    void ctxRef.current?.close();
    ctxRef.current = null;
    setLevel(0);
  }, []);

  useEffect(
    () => () => {
      cancelAnimationFrame(rafRef.current);
      try {
        if (recRef.current && recRef.current.state !== "inactive") {
          recRef.current.onstop = null;
          recRef.current.stop();
        }
      } catch {
        /* ignore */
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
      void ctxRef.current?.close();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [],
  );

  // Elapsed timer that ignores paused time.
  useEffect(() => {
    if (status !== "recording") return;
    lastRef.current = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      accRef.current += (now - lastRef.current) / 1000;
      lastRef.current = now;
      setElapsed(accRef.current);
    }, 200);
    return () => clearInterval(id);
  }, [status]);

  const start = async () => {
    setStatus("asking");
    setTranscript("");
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    blobRef.current = null;
    setUrl(null);
    accRef.current = 0;
    setElapsed(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      ctxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const data = new Uint8Array(analyser.fftSize);
      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (const v of data) sum += ((v - 128) / 128) ** 2;
        setLevel(Math.min(100, Math.round(Math.sqrt(sum / data.length) * 320)));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();

      const mime = pickMime();
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      recRef.current = rec;
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const type = rec.mimeType || mime || "audio/webm";
        const blob = new Blob(chunksRef.current, { type });
        blobRef.current = blob;
        const u = URL.createObjectURL(blob);
        urlRef.current = u;
        setExt(extFor(type));
        setUrl(u);
        setStatus("done");
        releaseMic();
      };
      rec.start(500);
      setStatus("recording");
      sttStart();
    } catch (e) {
      releaseMic();
      const name = e instanceof DOMException ? e.name : "";
      setStatus(name === "NotAllowedError" || name === "SecurityError" ? "denied" : "error");
    }
  };

  const pause = () => {
    recRef.current?.pause();
    sttStop();
    setStatus("paused");
  };
  const resume = () => {
    recRef.current?.resume();
    sttStart();
    setStatus("recording");
  };
  const stop = () => {
    sttStop();
    if (recRef.current && recRef.current.state !== "inactive") recRef.current.stop();
  };

  if (supported === false) {
    return (
      <Panel>
        <Unsupported what="Audio recording" />
      </Panel>
    );
  }

  const active = status === "recording" || status === "paused";
  const showTranscript = stt.supported && (active || transcript);

  return (
    <Panel>
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="text-[44px] font-semibold tabular-nums leading-none">{fmt(elapsed)}</div>
        <div className="min-h-[24px]">
          {status === "recording" ? <PulseDot label="Recording" /> : null}
          {status === "paused" ? <span className="text-[14px] font-medium text-[var(--foreground-muted)]"> Paused</span> : null}
          {status === "done" ? <span className="text-[14px] font-medium text-[#2f7a3d]"> Recording saved. Play it back below.</span> : null}
          {status === "idle" || status === "asking" ? (
            <span className="text-[14px] text-[var(--foreground-muted)]">{status === "asking" ? "Waiting for microphone permission…" : "Ready when you are"}</span>
          ) : null}
        </div>

        {active ? (
          <div
            role="meter"
            aria-label="Microphone level"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={level}
            className="h-4 w-full max-w-[420px] overflow-hidden rounded-full bg-[var(--background-deep)]"
          >
            <div className="h-full rounded-full bg-[var(--brand)] transition-[width] duration-75" style={{ width: `${level}%` }} />
          </div>
        ) : null}

        <div className="flex flex-wrap justify-center gap-3">
          {!active ? (
            <Btn onClick={start} disabled={status === "asking" || supported === null} className="!px-7 !py-4 !text-[17px]">
              {status === "done" ? " Record again" : " Start recording"}
            </Btn>
          ) : (
            <>
              {status === "recording" ? <Btn tone="ghost" onClick={pause}> Pause</Btn> : <Btn tone="ghost" onClick={resume}>Resume</Btn>}
              <Btn tone="danger" onClick={stop}> Stop</Btn>
            </>
          )}
        </div>
      </div>

      {status === "denied" ? (
        <div className="mt-5">
          <Notice tone="warn">
            The browser blocked the microphone. Click the lock icon next to the address bar, set Microphone to Allow, then press Start again.
          </Notice>
        </div>
      ) : null}
      {status === "error" ? (
        <div className="mt-5">
          <Notice tone="warn">No microphone was found. Plug one in or check your sound settings, then try again.</Notice>
        </div>
      ) : null}

      {url ? (
        <div className="mt-6 space-y-3">
          <audio controls src={url} className="w-full" />
          <Btn tone="dark" onClick={() => blobRef.current && downloadBlob(blobRef.current, `voice-recording.${ext}`)}>
            Download voice-recording.{ext}
          </Btn>
        </div>
      ) : null}

      {showTranscript ? (
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h3 className="text-[15px] font-semibold"> Live transcript</h3>
            <CopyBtn text={transcript} label="Copy transcript" />
          </div>
          <div className="min-h-[72px] rounded-2xl bg-[var(--background-deep)] px-4 py-3 text-[15px] leading-[1.6]">
            {transcript}
            {stt.interim ? <span className="italic text-[var(--foreground-faint)]"> {stt.interim}</span> : null}
            {!transcript && !stt.interim ? <span className="text-[var(--foreground-faint)]">Words appear here as you speak.</span> : null}
          </div>
        </div>
      ) : null}

      <p className="mt-5 text-[13px] text-[var(--foreground-muted)]">
        Your recording stays on this device. Nothing is uploaded. The live transcript uses your browser&apos;s speech engine when it has one.
      </p>
    </Panel>
  );
}
