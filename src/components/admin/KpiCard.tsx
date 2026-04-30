interface KpiCardProps {
  label: string;
  value: number | string;
  sublabel?: string;
  accent?: "blue" | "green" | "amber" | "purple";
}

const accentMap = {
  blue: "border-l-sf-blue bg-sf-blue-light text-sf-blue",
  green: "border-l-emerald-500 bg-emerald-50 text-emerald-700",
  amber: "border-l-amber-500 bg-amber-50 text-amber-700",
  purple: "border-l-purple-500 bg-purple-50 text-purple-700",
};

export function KpiCard({ label, value, sublabel, accent = "blue" }: KpiCardProps) {
  return (
    <div
      className={`rounded-2xl border-l-4 px-6 py-5 shadow-sm ${accentMap[accent]} bg-white`}
    >
      <p className="text-xs font-semibold uppercase tracking-widest opacity-70">{label}</p>
      <p className="mt-1 text-3xl font-extrabold tracking-tight text-sf-navy">{value}</p>
      {sublabel && <p className="mt-1 text-xs opacity-60">{sublabel}</p>}
    </div>
  );
}
