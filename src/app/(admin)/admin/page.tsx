export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/client";
import { KpiCard } from "@/components/admin/KpiCard";
import { StatusBreakdown } from "@/components/admin/StatusBreakdown";
import { CategoryBreakdown } from "@/components/admin/CategoryBreakdown";
import { SeoPlaceholder } from "@/components/admin/SeoPlaceholder";
import type { ArticleStatus } from "@/types";
import { Plus, FileText, BookOpen, Clock, TrendingUp } from "lucide-react";

export default async function AdminDashboardPage() {
  if (!hasSupabaseEnv()) redirect("/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // ── Fetch all stats in parallel ────────────────────────────────────────────
  const [{ data: allArticles }, { data: publishedWithCategory }] = await Promise.all([
    supabase
      .from("articles")
      .select("status, created_at")
      .eq("author_id", user.id),
    supabase
      .from("articles")
      .select("category:categories(name)")
      .eq("author_id", user.id)
      .eq("status", "published"),
  ]);

  const articles = allArticles ?? [];
  const total = articles.length;

  // Count by status
  const statusCounts = articles.reduce(
    (acc, a) => {
      const s = a.status as ArticleStatus;
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    },
    {} as Record<ArticleStatus, number>
  );

  const publishedCount = statusCounts["published"] ?? 0;
  const reviewCount = statusCounts["review"] ?? 0;

  // Articles created this month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const thisMonthCount = articles.filter((a) => a.created_at >= monthStart).length;

  // Count by category (published articles only)
  const categoryMap = new Map<string, number>();
  for (const row of publishedWithCategory ?? []) {
    const cat = Array.isArray(row.category) ? row.category[0] : row.category;
    const name = (cat as { name: string } | null)?.name ?? "Sans catégorie";
    categoryMap.set(name, (categoryMap.get(name) ?? 0) + 1);
  }
  const categoryRows = Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="sf-container space-y-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-sf-blue">
            Dashboard
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-sf-navy">Vue d&apos;ensemble</h1>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 rounded-full bg-sf-blue px-4 py-2 text-sm font-semibold text-white hover:bg-sf-blue-dark"
        >
          <Plus size={16} />
          Nouvel article
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="Total articles"
          value={total}
          sublabel="tous statuts"
          accent="blue"
          icon={FileText}
        />
        <KpiCard
          label="Publiés"
          value={publishedCount}
          sublabel={total > 0 ? `${Math.round((publishedCount / total) * 100)}% du total` : "—"}
          accent="green"
          icon={BookOpen}
        />
        <KpiCard
          label="En review"
          value={reviewCount}
          sublabel="à valider"
          accent="amber"
          icon={Clock}
        />
        <KpiCard
          label="Ce mois-ci"
          value={thisMonthCount}
          sublabel="nouveaux articles"
          accent="purple"
          icon={TrendingUp}
        />
      </div>

      {/* Middle row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <StatusBreakdown counts={statusCounts} total={total} />
        <CategoryBreakdown rows={categoryRows} />
      </div>

      {/* SEO placeholder */}
      <SeoPlaceholder />
    </div>
  );
}
