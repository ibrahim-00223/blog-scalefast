type Props = {
  status: string;
};

function getStatusClasses(status: string): string {
  switch (status) {
    case "published":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "review":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "scheduled":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "archived":
      return "bg-slate-100 text-slate-600 border-slate-200";
    default:
      return "bg-sf-blue-light text-sf-blue border-[#cdd7ff]";
  }
}

export function ArticleStatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${getStatusClasses(status)}`}
    >
      {status}
    </span>
  );
}
