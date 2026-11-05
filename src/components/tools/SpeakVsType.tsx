"use client";

import { useEffect, useState } from "react";
import { Metric, TypingTest } from "./TypingTest";

const READ_ALOUD =
  "I need the quarterly numbers by Thursday so I can send the board update on Friday morning. If the churn figure is still being checked, send me the rest first and flag that one. Thanks for pulling this together so quickly.";
const READ_WORDS = READ_ALOUD.split(/\s+/).length;

/**
 * Step 1: a 30-second typing test. Step 2: read a passage out loud with a start/stop timer.
 * Nothing is recorded or sent anywhere; the speaking part only measures time.
 */
export function SpeakVsType() {
  const [typing, setTyping] = useState<number | null>(null);
  const [start, setStart] = useState<number | null>(null);
  const [speakMs, setSpeakMs] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (start === null || speakMs !== null) return;
    const t = setInterval(() => setTick(Date.now()), 100);
    return () => clearInterval(t);
  }, [start, speakMs]);

  const speaking = speakMs ? Math.round(READ_WORDS / (speakMs / 60000)) : null;
  const ratio = typing && speaking ? speaking / typing : null;

  return (
    <div className="space-y-6">
      <div>
        <p className="seo-label mb-3">Step 1 · Type for 30 seconds</p>
        <TypingTest duration={30} passageIndex={1} onResult={(r) => setTyping(r.wpm)} />
      </div>
      <div className="seo-tool">
        <p className="seo-label">Step 2 · Read this out loud at a normal pace</p>
        <p className="mt-3 rounded-xl bg-[var(--background-deep)] p-4 text-[17px] leading-[1.8] text-[var(--foreground)]">{READ_ALOUD}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {start === null || speakMs !== null ? (
            <button
              type="button"
              className="seo-btn"
              onClick={() => {
                setSpeakMs(null);
                setStart(Date.now());
                setTick(Date.now());
              }}
            >
              {speakMs !== null ? "Read it again" : "Start reading"}
            </button>
          ) : (
            <button type="button" className="seo-btn" onClick={() => setSpeakMs(Date.now() - start)}>
              Done reading
            </button>
          )}
          {start !== null && speakMs === null ? <span className="tabular-nums text-[var(--foreground-muted)]">{((tick - start) / 1000).toFixed(1)}s</span> : null}
        </div>
        <p className="mt-3 text-[13px] text-[var(--foreground-faint)]">No microphone needed. Nothing is recorded; this only times you.</p>
      </div>
      <div className="seo-tool" role="status">
        <p className="seo-label">Your result</p>
        <div className="mt-3 flex flex-wrap gap-8">
          <Metric label="Typing" value={typing !== null ? `${typing} wpm` : "-"} />
          <Metric label="Speaking" value={speaking !== null ? `${speaking} wpm` : "-"} />
          <Metric label="Speaking is" value={ratio ? `${ratio.toFixed(1)}x` : "-"} />
        </div>
        {ratio ? (
          <p className="mt-4 text-[15px] leading-relaxed text-[#3d3834]">
            {ratio >= 1
              ? `You speak ${ratio.toFixed(1)} times faster than you type. A 300-word email takes you about ${Math.round((300 / (typing || 1)) * 10) / 10} minutes to type and ${Math.round((300 / (speaking || 1)) * 10) / 10} to say.`
              : "You type faster than you read aloud. Nice. Speaking still helps when your hands are busy or tired."}
          </p>
        ) : null}
      </div>
    </div>
  );
}
