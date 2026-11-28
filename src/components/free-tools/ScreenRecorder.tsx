"use client";

import { useEffect, useRef, useState } from "react";
import { Btn, Notice, Panel, Unsupported } from "./ui";
import { PulseDot, downloadBlob } from "./Dictation";

type Status = "idle" | "picking" | "countdown" | "recording" | "paused" | "done" | "denied" | "error";

function pickMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const options = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm", "video/mp4"];
  return options.find((m) => MediaRecorder.isTypeSupported(m)) ?? "";
}

function fmt(sec: number) {
  const s = Math.floor(sec);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/** Screen recorder: record a screen, window or tab (optionally with audio and mic) straight in the browser. */
export function ScreenRecorder(props: { page?: string }) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [count, setCount] = useState(3);
  const [elapsed, setElapsed] = useState(0);
  const [mic, setMic] = useState(props.page === "with-audio");
  const [sysAudio, setSysAudio] = useState(true);
  const [url, setUrl] = useState<string | null>(null);
  const [ext, setExt] = useState("webm");
  const [note, setNote] = useState("");

  const displayRef = useRef<MediaStream | null>(null);
  const micRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const urlRef = useRef<string | null>(null);
  const blobRef = useRef<Blob | null>(null);
  const accRef = useRef(0);
  const lastRef = useRef(0);
  const cancelledRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(typeof MediaRecorder !== "undefined" && !!navigator.mediaDevices && typeof navigator.mediaDevices.getDisplayMedia === "function");
  }, []);

  const releaseAll = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    displayRef.current?.getTracks().forEach((t) => t.stop());
    micRef.current?.getTracks().forEach((t) => t.stop());
    displayRef.current = null;
    micRef.current = null;
    void ctxRef.current?.close();
    ctxRef.current = null;
  };

  useEffect(
    () => () => {
      cancelledRef.current = true;
      try {
        if (recRef.current && recRef.current.state !== "inactive") {
          recRef.current.onstop = null;
          recRef.current.stop();
        }
      } catch {
        /* ignore */
      }
      if (timerRef.current) clearTimeout(timerRef.current);
      displayRef.current?.getTracks().forEach((t) => t.stop());
      micRef.current?.getTracks().forEach((t) => t.stop());
      void ctxRef.current?.close();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [],
  );

  useEffect(() => {
    if (status !== "recording") return;
    lastRef.current = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      accRef.current += (now - lastRef.current) / 1000;
      lastRef.current = now;
      setElapsed(accRef.current);
    }, 250);
    return () => clearInterval(id);
  }, [status]);

  const beginRecording = (final: MediaStream, mime: string) => {
    const rec = mime ? new MediaRecorder(final, { mimeType: mime }) : new MediaRecorder(final);
    recRef.current = rec;
    chunksRef.current = [];
    rec.ondataavailable = (e) => {
      if (e.data.size) chunksRef.current.push(e.data);
    };
    rec.onstop = () => {
      const type = rec.mimeType || mime || "video/webm";
      const blob = new Blob(chunksRef.current, { type });
      blobRef.current = blob;
      const u = URL.createObjectURL(blob);
      urlRef.current = u;
      setExt(type.includes("mp4") ? "mp4" : "webm");
      setUrl(u);
      setStatus("done");
      releaseAll();
    };
    rec.start(1000);
    setStatus("recording");
  };

  const start = async () => {
    cancelledRef.current = false;
    setNote("");
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    blobRef.current = null;
    setUrl(null);
    accRef.current = 0;
    setElapsed(0);
    setStatus("picking");
    try {
      const display = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 30 }, audio: sysAudio });
      displayRef.current = display;
      let micStream: MediaStream | null = null;
      if (mic) {
        try {
          micStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
          micRef.current = micStream;
        } catch {
          setNote("The microphone was blocked or missing, so this recording has no voice.");
        }
      }

      // Mix every audio source into one track.
      const tracks: MediaStreamTrack[] = [...display.getVideoTracks()];
      const hasDisplayAudio = display.getAudioTracks().length > 0;
      if (hasDisplayAudio || micStream) {
        const ctx = new AudioContext();
        ctxRef.current = ctx;
        const dest = ctx.createMediaStreamDestination();
        if (hasDisplayAudio) ctx.createMediaStreamSource(new MediaStream(display.getAudioTracks())).connect(dest);
        if (micStream) ctx.createMediaStreamSource(micStream).connect(dest);
        tracks.push(...dest.stream.getAudioTracks());
      } else if (sysAudio) {
        setNote((n) => n || "No system or tab audio was shared. In Chrome, tick “Share audio” in the picker to include it.");
      }
      const final = new MediaStream(tracks);
      display.getVideoTracks()[0]?.addEventListener("ended", () => {
        if (recRef.current && recRef.current.state !== "inactive") recRef.current.stop();
        else if (!cancelledRef.current) {
          releaseAll();
          setStatus("idle");
        }
      });

      // 3-2-1 countdown, then record.
      setStatus("countdown");
      let n = 3;
      setCount(n);
      const tick = () => {
        if (cancelledRef.current) return;
        n -= 1;
        if (n <= 0) {
          if (!displayRef.current?.active) {
            releaseAll();
            setStatus("idle");
            return;
          }
          beginRecording(final, pickMime());
        } else {
          setCount(n);
          timerRef.current = setTimeout(tick, 1000);
        }
      };
      timerRef.current = setTimeout(tick, 1000);
    } catch (e) {
      releaseAll();
      const name = e instanceof DOMException ? e.name : "";
      // Closing the picker counts as a permission error too; that is not a failure worth shouting about.
      setStatus(name === "NotAllowedError" || name === "SecurityError" ? "denied" : "error");
    }
  };

  const cancelCountdown = () => {
    cancelledRef.current = true;
    releaseAll();
    setStatus("idle");
  };
  const pause = () => {
    recRef.current?.pause();
    setStatus("paused");
  };
  const resume = () => {
    recRef.current?.resume();
    setStatus("recording");
  };
  const stop = () => {
    if (recRef.current && recRef.current.state !== "inactive") recRef.current.stop();
  };

  if (supported === false) {
    return (
      <Panel>
        <Unsupported what="Screen recording" />
        <p className="mt-3 text-[14px] text-[var(--foreground-muted)]">Phones and tablets generally can&apos;t record their screen from a web page. Use a laptop or desktop.</p>
      </Panel>
    );
  }

  const active = status === "recording" || status === "paused";
  const busy = status === "picking" || status === "countdown" || active;

  return (
    <Panel>
      {!busy ? (
        <div className="space-y-3">
          <label className="flex items-start gap-3 rounded-2xl bg-[var(--background-deep)] px-4 py-3">
            <input type="checkbox" checked={mic} onChange={(e) => setMic(e.target.checked)} className="mt-1 h-4 w-4 accent-[var(--brand)]" />
            <span>
              <span className="block text-[15px] font-medium"> Record my microphone</span>
              <span className="block text-[13px] text-[var(--foreground-muted)]">Add your voice for narration.</span>
            </span>
          </label>
          <label className="flex items-start gap-3 rounded-2xl bg-[var(--background-deep)] px-4 py-3">
            <input type="checkbox" checked={sysAudio} onChange={(e) => setSysAudio(e.target.checked)} className="mt-1 h-4 w-4 accent-[var(--brand)]" />
            <span>
              <span className="block text-[15px] font-medium"> Include tab or system audio</span>
              <span className="block text-[13px] text-[var(--foreground-muted)]">Tick &ldquo;Share audio&rdquo; in the picker. Not every browser or screen type can share it.</span>
            </span>
          </label>
          {props.page === "mac" ? (
            <Notice>On a Mac, if the picker shows no screens, open System Settings, Privacy &amp; Security, Screen Recording, and allow your browser. System audio is usually only available when sharing a Chrome tab.</Notice>
          ) : null}
          <div className="pt-2 text-center">
            <Btn onClick={start} className="!px-8 !py-4 !text-[17px]">
              {status === "done" ? " Record again" : " Start recording"}
            </Btn>
          </div>
        </div>
      ) : null}

      {status === "picking" ? <p className="py-6 text-center text-[15px] text-[var(--foreground-muted)]">Choose a screen, window or tab in the browser prompt…</p> : null}

      {status === "countdown" ? (
        <div className="py-4 text-center">
          <div className="text-[88px] font-semibold leading-none text-[var(--brand)]" aria-live="assertive">
            {count}
          </div>
          <p className="mt-3 text-[15px] text-[var(--foreground-muted)]">Recording starts in a moment…</p>
          <div className="mt-4">
            <Btn tone="ghost" onClick={cancelCountdown}>
              Cancel
            </Btn>
          </div>
        </div>
      ) : null}

      {active ? (
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="text-[44px] font-semibold tabular-nums leading-none">{fmt(elapsed)}</div>
          {status === "recording" ? <PulseDot label="Recording your screen" /> : <span className="text-[14px] font-medium text-[var(--foreground-muted)]"> Paused</span>}
          <div className="flex flex-wrap justify-center gap-3">
            {status === "recording" ? (
              <Btn tone="ghost" onClick={pause}>
                 Pause
              </Btn>
            ) : (
              <Btn tone="ghost" onClick={resume}>
                Resume
              </Btn>
            )}
            <Btn tone="danger" onClick={stop}>
               Stop
            </Btn>
          </div>
        </div>
      ) : null}

      {status === "denied" ? (
        <div className="mt-4">
          <Notice tone="warn">Screen sharing was cancelled or blocked, so nothing was recorded. Press Start and pick a screen, window or tab to share.</Notice>
        </div>
      ) : null}
      {status === "error" ? (
        <div className="mt-4">
          <Notice tone="warn">Something went wrong starting the recording. Please try again.</Notice>
        </div>
      ) : null}
      {note ? (
        <div className="mt-4">
          <Notice>{note}</Notice>
        </div>
      ) : null}

      {url ? (
        <div className="mt-6 space-y-3">
          <p className="text-[14px] font-medium text-[#2f7a3d]"> Done. Watch it back, then download.</p>
          <video controls src={url} className="w-full rounded-2xl bg-black" />
          <Btn tone="dark" onClick={() => blobRef.current && downloadBlob(blobRef.current, `screen-recording.${ext}`)}>
            Download screen-recording.{ext}
          </Btn>
        </div>
      ) : null}

      <p className="mt-6 text-[13px] text-[var(--foreground-muted)]">
         This records only what you choose to share, and only on your device. Nothing is uploaded, and there is no watermark.
      </p>
    </Panel>
  );
}
