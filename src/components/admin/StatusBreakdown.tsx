import type { ArticleStatus } from "@/types";

interface StatusBreakdownProps {
  counts: Record<ArticleStatus, number>;
  total: number;
}

const statusConfig: { status: ArticleStatus; label: string; color: string }[] = [
  { status: "published", label: "Publiés", color: "bg-emerald-500" },
  { status: "review", label: "En review", color: "bg-sf-blue" },
  { status: "scheduled", label: "Planifiés", color: "bg-purple-500" },
  { status: "plan", label: "En plan", color: "bg-amber-400" },
  { status: "idea", label: "Idées", color: "bg-sf-gray-400" },
  { status: "archived", label: "Archivés", color: "bg-gray-300" },
];

export function StatusBreakdown({ counts, total }: StatusBreakdownProps) {
  return (
    <div className="sf-card p-6">
      <h2 className="mb-4 text-base font-bold text-sf-navy">Répartition par statut</h2>

      {/* Stacked bar */}
      {total > 0 && (
        <div className="mb-5 flex h-3 overflow-hidden rounded-full">
          {statusConfig.map(({ status, color }) => {
            const count = counts[status] ?? 0;
            const pct = (count / total) * 100;
            if (pct === 0) return null;
            return (
              <div
                key={status}
                className={`${color} transition-all`}
                style={{ width: `${pct}%` }}
                title={`${status}: ${count}`}
              />
            );
          })}
        </div>
      )}

      {/* Legend */}
      <ul className="space-y-2">
        {statusConfig.map(({ status, label, color }) => {
          const count = counts[status] ?? 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <li key={status} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                <span className="text-sf-gray-600">{label}</span>
              </span>
              <span className="font-semibold text-sf-navy">
                {count}
                <span className="ml-1 text-xs font-normal text-sf-gray-400">({pct}%)</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
