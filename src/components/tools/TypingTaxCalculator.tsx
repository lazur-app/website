"use client";

import { useState } from "react";
import { Metric } from "./TypingTest";

function Field({ label, value, onChange, min, max, step = 1, suffix }: { label: string; value: number; onChange: (n: number) => void; min: number; max: number; step?: number; suffix?: string }) {
  return (
    <label className="block">
      <span className="flex justify-between text-[14px] font-medium text-[var(--foreground)]">
        {label}
        <span className="tabular-nums text-[var(--foreground-muted)]">
          {value}
          {suffix}
        </span>
      </span>
      <input type="range" className="mt-2 w-full accent-[var(--brand)]" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

/**
 * Hours a year spent typing, what that costs, and what speaking at your speed could give back.
 * Defaults come from published studies (cited on the page); every input is yours to change.
 */
export function TypingTaxCalculator() {
  const [wordsPerDay, setWordsPerDay] = useState(3000);
  const [typeWpm, setTypeWpm] = useState(52);
  const [speakWpm, setSpeakWpm] = useState(150);
  const [rate, setRate] = useState(50);
  const [days, setDays] = useState(230);

  const typeHours = (wordsPerDay / typeWpm / 60) * days;
  const speakHours = (wordsPerDay / speakWpm / 60) * days;
  const saved = Math.max(0, typeHours - speakHours);
  const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

  return (
    <div className="seo-tool grid gap-8 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="Words you write a day" value={wordsPerDay} onChange={setWordsPerDay} min={500} max={15000} step={250} />
        <Field label="Your typing speed" value={typeWpm} onChange={setTypeWpm} min={15} max={140} suffix=" wpm" />
        <Field label="Your speaking speed" value={speakWpm} onChange={setSpeakWpm} min={80} max={220} suffix=" wpm" />
        <Field label="What an hour of your time is worth" value={rate} onChange={setRate} min={10} max={500} step={5} suffix=" $" />
        <Field label="Working days a year" value={days} onChange={setDays} min={100} max={300} />
      </div>
      <div className="rounded-2xl bg-[var(--background-deep)] p-5" role="status">
        <div className="grid grid-cols-2 gap-6">
          <Metric label="Hours typing a year" value={fmt(typeHours)} />
          <Metric label="Cost of that time" value={`$${fmt(typeHours * rate)}`} />
          <Metric label="Hours if you spoke it" value={fmt(speakHours)} />
          <Metric label="Hours back a year" value={fmt(saved)} />
        </div>
        <p className="mt-6 text-[15px] leading-relaxed text-[#3d3834]">
          At {typeWpm} wpm, {wordsPerDay.toLocaleString("en-US")} words a day is {Math.round((wordsPerDay / typeWpm) * 10) / 10} minutes of typing. Spoken at {speakWpm} wpm it is {Math.round((wordsPerDay / speakWpm) * 10) / 10}. That gap is about {fmt(saved)} hours a year, worth ${fmt(saved * rate)} at your rate.
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-[var(--foreground-muted)]">This counts raw typing time only. Fixing what you dictated takes time too, so treat it as the upper bound.</p>
      </div>
    </div>
  );
}
