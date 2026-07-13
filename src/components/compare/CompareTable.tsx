import type { CompareTableRow } from "@/lib/compare/types";

type CompareTableProps = {
  rows: CompareTableRow[];
  competitorName: string;
};

export function CompareTable({ rows, competitorName }: CompareTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
      <table className="w-full min-w-[520px] border-collapse text-left text-[14px]">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--background-deep)]">
            <th className="px-4 py-3 font-semibold text-[var(--foreground)]">
              Feature
            </th>
            <th className="px-4 py-3 font-semibold text-[var(--brand-ink)]">
              Lazur
            </th>
            <th className="px-4 py-3 font-semibold text-[var(--foreground-muted)]">
              {competitorName}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.feature}
              className="border-b border-[var(--border)] last:border-b-0"
            >
              <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                {row.feature}
              </td>
              <td className="px-4 py-3 text-[var(--foreground-muted)]">
                {row.lazur}
              </td>
              <td className="px-4 py-3 text-[var(--foreground-muted)]">
                {row.competitor}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
