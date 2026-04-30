import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: number | string;
  sublabel?: string;
  accent?: "blue" | "green" | "amber" | "purple";
  icon?: LucideIcon;
}

const accentMap = {
  blue: {
    border: "border-l-sf-blue",
    iconBg: "bg-sf-blue-light",
    iconColor: "text-sf-blue",
    valueColor: "text-sf-navy",
  },
  green: {
    border: "border-l-emerald-500",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    valueColor: "text-sf-navy",
  },
  amber: {
    border: "border-l-amber-500",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    valueColor: "text-sf-navy",
  },
  purple: {
    border: "border-l-purple-500",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    valueColor: "text-sf-navy",
  },
};

export function KpiCard({ label, value, sublabel, accent = "blue", icon: Icon }: KpiCardProps) {
  const a = accentMap[accent];
  return (
    <div
      className={`flex items-start gap-4 rounded-2xl border-l-4 bg-white px-5 py-5 shadow-sm ${a.border}`}
    >
      {Icon && (
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${a.iconBg}`}>
          <Icon size={20} className={a.iconColor} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-sf-gray-400">{label}</p>
        <p className={`mt-1 text-3xl font-extrabold tracking-tight ${a.valueColor}`}>{value}</p>
        {sublabel && <p className="mt-0.5 text-xs text-sf-gray-400">{sublabel}</p>}
      </div>
    </div>
  );
}
