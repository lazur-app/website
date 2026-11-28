"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMomentWhen } from "./Letter";

type Status = "idle" | "asking" | "listening" | "denied" | "error";

/** Mic test: live level bar, device picker, and a short record-and-play-back clip. Nothing is uploaded. */
export function MicTest() {
  const [status, setStatus] = useState<Status>("idle");
  const [level, setLevel] = useState(0);
  const [peak, setPeak] = useState(0);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState("");
  const [recording, setRecording] = useState(false);
  const [clipUrl, setClipUrl] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const clipRef = useRef<string | null>(null);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    void ctxRef.current?.close();
    ctxRef.current = null;
    setLevel(0);
  }, []);

  useEffect(
    () => () => {
      stop();
      if (clipRef.current) URL.revokeObjectURL(clipRef.current);
    },
    [stop],
  );

  const start = useCallback(
    async (id?: string) => {
      stop();
      setStatus("asking");
      setPeak(0);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: id ? { deviceId: { exact: id } } : true,
        });
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
          const rms = Math.sqrt(sum / data.length);
          const pct = Math.min(100, Math.round(rms * 320));
          setLevel(pct);
          setPeak((p) => Math.max(p, pct));
          rafRef.current = requestAnimationFrame(tick);
        };
        tick();
        setStatus("listening");
        // Labels only appear after permission is granted.
        const all = await navigator.mediaDevices.enumerateDevices();
        setDevices(all.filter((d) => d.kind === "audioinput"));
        const active = stream.getAudioTracks()[0]?.getSettings().deviceId;
        if (active) setDeviceId(active);
      } catch (e) {
        const name = e instanceof DOMException ? e.name : "";
        setStatus(name === "NotAllowedError" || name === "SecurityError" ? "denied" : "error");
      }
    },
    [stop],
  );

  const toggleRecord = () => {
    const stream = streamRef.current;
    if (!stream) return;
    if (recording) {
      recorderRef.current?.stop();
      return;
    }
    if (clipRef.current) URL.revokeObjectURL(clipRef.current);
    clipRef.current = null;
    setClipUrl(null);
    chunksRef.current = [];
    const rec = new MediaRecorder(stream);
    recorderRef.current = rec;
    rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
    rec.onstop = () => {
      const url = URL.createObjectURL(new Blob(chunksRef.current, { type: rec.mimeType }));
      clipRef.current = url;
      setClipUrl(url);
      setRecording(false);
    };
    rec.start();
    setRecording(true);
    // Keep clips short: 10 seconds is plenty to check a mic.
    setTimeout(() => rec.state === "recording" && rec.stop(), 10_000);
  };

  const heard = peak > 4;

  // Once the mic has picked the visitor up for a few seconds, the test has done its job.
  useMomentWhen(heard && status === "listening", "your mic is working", 2500);
  return (
    <div className="mx-auto w-full max-w-[640px] keep-case rounded-[28px] border-[1.5px] border-[#1c1917] bg-white p-6 shadow-[0_2px_0_rgba(28,25,23,0.9),0_18px_40px_-16px_rgba(28,25,23,0.22)] sm:p-8">
      {status === "idle" || status === "asking" ? (
        <button
          type="button"
          onClick={() => start()}
          disabled={status === "asking"}
          className="w-full rounded-full bg-[#1c1917] px-6 py-4 text-[17px] font-bold text-white transition hover:bg-black disabled:opacity-60"
        >
          {status === "asking" ? "Waiting for permission…" : "Start mic test"}
        </button>
      ) : null}

      {status === "denied" ? (
        <p role="alert" className="text-[16px] leading-[1.6] text-[var(--foreground)]">
          The browser blocked the microphone. Click the lock or camera icon next to the address, set Microphone to Allow, then{" "}
          <button type="button" className="underline" onClick={() => start(deviceId || undefined)}>
            try again
          </button>
          .
        </p>
      ) : null}
      {status === "error" ? (
        <p role="alert" className="text-[16px] leading-[1.6] text-[var(--foreground)]">
          No microphone was found. Plug one in or pick another device, then{" "}
          <button type="button" className="underline" onClick={() => start()}>
            try again
          </button>
          .
        </p>
      ) : null}

      {status === "listening" ? (
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-baseline justify-between text-[14px] text-[var(--foreground-muted)]">
              <span>Say something</span>
              <span aria-live="polite">{heard ? "Your mic is working" : "Waiting to hear you…"}</span>
            </div>
            <div
              role="meter"
              aria-label="Microphone level"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={level}
              className="relative h-6 overflow-hidden rounded-full bg-[var(--background-deep)]"
            >
              <div className="h-full rounded-full bg-[var(--brand)] transition-[width] duration-75" style={{ width: `${level}%` }} />
              <div className="absolute top-0 h-full w-[2px] bg-[var(--foreground)]/50" style={{ left: `${peak}%` }} title="Loudest so far" />
            </div>
          </div>

          {devices.length > 1 ? (
            <label className="block text-[14px] text-[var(--foreground-muted)]">
              Microphone
              <select
                value={deviceId}
                onChange={(e) => {
                  setDeviceId(e.target.value);
                  void start(e.target.value);
                }}
                className="mt-1 block w-full rounded-xl border border-[var(--border-strong)] bg-white px-3 py-2 text-[15px] text-[var(--foreground)]"
              >
                {devices.map((d, i) => (
                  <option key={d.deviceId || i} value={d.deviceId}>
                    {d.label || `Microphone ${i + 1}`}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={toggleRecord}
              className={`rounded-full px-5 py-3 text-[15px] font-bold ${recording ? "bg-[#d94040] text-white" : "bg-[#1c1917] text-white"}`}
            >
              {recording ? "Stop recording" : "Record a clip"}
            </button>
            <button
              type="button"
              onClick={() => {
                stop();
                setStatus("idle");
              }}
              className="rounded-full border-[1.5px] border-[#1c1917] bg-white px-5 py-3 text-[15px] font-bold text-[var(--foreground)]"
            >
              Stop test
            </button>
          </div>

          {clipUrl ? (
            <div>
              <p className="mb-2 text-[14px] text-[var(--foreground-muted)]">Your recording. Play it to hear how you sound.</p>
              <audio controls src={clipUrl} className="w-full" />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
