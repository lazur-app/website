import type { UseCaseDemo, UseCasePage } from "@/lib/use-cases";

function ModeLabel({ mode }: { mode: UseCasePage["mode"] }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--foreground-faint)]">
      {mode === "command" ? "Command Mode" : "Dictation Mode"}
    </p>
  );
}

export function UseCaseDemoCard({
  demo,
  mode,
}: {
  demo: UseCaseDemo;
  mode: UseCasePage["mode"];
}) {
  return (
    <div className="space-y-4">
      <ModeLabel mode={mode} />

      {demo.context ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background-deep)]/50 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
            Looking at
          </p>
          <p className="mt-1 text-[14px] leading-relaxed text-[var(--foreground-muted)]">
            {demo.context}
          </p>
        </div>
      ) : null}

      <div className="rounded-xl bg-[var(--foreground)] px-4 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
          You say
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-white/90">
          “{demo.spoken}”
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] px-4 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
          Lazur pastes
        </p>
        <p className="mt-2 whitespace-pre-line text-[14px] leading-relaxed text-[var(--foreground)]">
          {demo.output}
        </p>
      </div>

      <p className="text-[14px] leading-relaxed text-[var(--foreground-muted)]">
        {demo.caption}
      </p>
    </div>
  );
}
