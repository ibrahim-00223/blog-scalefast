import { CATEGORY_COLORS } from "@/types";

type CategoryBadgeProps = {
  slug: string;
  label: string;
  className?: string;
};

export function CategoryBadge({ slug, label, className = "" }: CategoryBadgeProps) {
  const colors = CATEGORY_COLORS[slug] ?? { bg: "#EEF2FF", text: "#3B5BDB", border: "#C7D2FE" };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${className}`}
      style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border ?? colors.bg }}
    >
      {label}
    </span>
  );
}

