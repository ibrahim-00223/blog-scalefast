import { TrendingUp } from "lucide-react";

export function SeoPlaceholder() {
  return (
    <div className="sf-card flex flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sf-blue-light">
        <TrendingUp size={22} className="text-sf-blue" />
      </div>
      <h2 className="text-base font-bold text-sf-navy">Ranking SEO &amp; GEO</h2>
      <p className="max-w-xs text-sm text-sf-gray-600">
        Connecte Google Search Console pour suivre tes positions, impressions et clics
        directement ici.
      </p>
      <span className="mt-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
        Coming soon
      </span>
    </div>
  );
}
