"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Btn, Field, Notice, Panel, Stat, Unsupported } from "./ui";
import { Sticker } from "@/components/landing/Sticker";

type Status = "idle" | "asking" | "live" | "denied" | "error";

/** Webcam test: live mirrored preview, resolution and frame rate, snapshot. Nothing leaves your device. */
export function WebcamTest(props: { page?: string }) {
  void props;
  const [status, setStatus] = useState<Status>("idle");
  const [supported, setSupported] = useState(true);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState("");
  const [mirror, setMirror] = useState(true);
  const [info, setInfo] = useState<{ w: number; h: number; fps: number } | null>(null);
  const [shot, setShot] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia);
  }, []);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setInfo(null);
  }, []);

  useEffect(() => () => stop(), [stop]);

  const start = useCallback(
    async (id?: string) => {
      stop();
      setStatus("asking");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: id ? { deviceId: { exact: id } } : true,
          audio: false,
        });
        streamRef.current = stream;
        setStatus("live");
        const track = stream.getVideoTracks()[0];
        const s = track?.getSettings();
        setInfo({ w: s?.width ?? 0, h: s?.height ?? 0, fps: Math.round(s?.frameRate ?? 0) });
        if (s?.deviceId) setDeviceId(s.deviceId);
        const all = await navigator.mediaDevices.enumerateDevices();
        setDevices(all.filter((d) => d.kind === "videoinput"));
      } catch (e) {
        const name = e instanceof DOMException ? e.name : "";
        setStatus(name === "NotAllowedError" || name === "SecurityError" ? "denied" : "error");
      }
    },
    [stop],
  );

  // Attach the stream once the <video> exists (it only renders while live).
  useEffect(() => {
    if (status === "live" && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      void videoRef.current.play().catch(() => {});
    }
  }, [status]);

  const snapshot = () => {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return;
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    if (mirror) {
      ctx.translate(c.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(v, 0, 0);
    setShot(c.toDataURL("image/png"));
  };

  if (!supported) {
    return (
      <Panel>
        <Unsupported what="Camera access" />
      </Panel>
    );
  }

  return (
    <Panel className="space-y-5">
      {status === "idle" || status === "asking" ? (
        <div className="space-y-3 text-center">
          <Sticker name="eye" size={72} className="mx-auto" />
          <p className="text-[15px] text-[var(--foreground-muted)]">Your video stays on this device. Nothing is recorded or uploaded.</p>
          <Btn onClick={() => start()} disabled={status === "asking"} className="w-full !py-4 !text-[17px]">
            {status === "asking" ? " Waiting for permission…" : " Start camera test"}
          </Btn>
        </div>
      ) : null}

      {status === "denied" ? (
        <div className="space-y-3">
          <Notice tone="warn">
             The browser blocked your camera. Click the lock or camera icon next to the address bar, set Camera to Allow, then try again. Also check that no other app is using the camera.
          </Notice>
          <Btn onClick={() => start(deviceId || undefined)}> Try again</Btn>
        </div>
      ) : null}

      {status === "error" ? (
        <div className="space-y-3">
          <Notice tone="warn"> No working camera was found. Plug one in, close other apps that use it, or pick another device.</Notice>
          <Btn onClick={() => start()}> Try again</Btn>
        </div>
      ) : null}

      {status === "live" ? (
        <>
          <div className="overflow-hidden rounded-2xl bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="block aspect-video w-full object-contain" style={{ transform: mirror ? "scaleX(-1)" : undefined }} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Stat label="Resolution" value={info && info.w ? `${info.w}×${info.h}` : "–"} />
            <Stat label="Frame rate" value={info && info.fps ? `${info.fps} fps` : "–"} />
          </div>

          {devices.length > 1 ? (
            <Field label=" Camera">
              <select
                value={deviceId}
                onChange={(e) => {
                  setDeviceId(e.target.value);
                  void start(e.target.value);
                }}
                className="w-full rounded-2xl border border-[var(--border-strong)] bg-white px-4 py-3 text-[15px] text-[var(--foreground)]"
              >
                {devices.map((d, i) => (
                  <option key={d.deviceId || i} value={d.deviceId}>
                    {d.label || `Camera ${i + 1}`}
                  </option>
                ))}
              </select>
            </Field>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Btn onClick={snapshot}> Take snapshot</Btn>
            <Btn tone="ghost" onClick={() => setMirror((m) => !m)}>
               Mirror: {mirror ? "on" : "off"}
            </Btn>
            <Btn
              tone="danger"
              onClick={() => {
                stop();
                setStatus("idle");
              }}
            >
               Stop
            </Btn>
          </div>
        </>
      ) : null}

      {shot ? (
        <div className="space-y-3">
          <p className="text-[14px] font-medium"> Your snapshot</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shot} alt="Webcam snapshot" className="w-full rounded-2xl border border-[var(--border-strong)]" />
          <a
            href={shot}
            download="webcam-snapshot.png"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-5 py-3 text-[15px] font-semibold hover:bg-[var(--background-deep)]"
          >
            Download PNG
          </a>
        </div>
      ) : null}
    </Panel>
  );
}
