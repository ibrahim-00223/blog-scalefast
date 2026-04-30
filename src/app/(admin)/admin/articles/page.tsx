export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArticleListClient } from "@/components/admin/ArticleListClient";
import { Plus } from "lucide-react";
import type { ArticleStatus } from "@/types";

type SearchParams = Promise<{ error?: string; status?: string }>;

export default async function AdminArticlesPage(props: { searchParams: SearchParams }) {
  const { error, status } = await props.searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: rawArticles } = await supabase
    .from("articles")
    .select("id,title,slug,status,published_at,created_at,category:categories(name)")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  const articles = (rawArticles ?? []).map((a) => {
    const cat = Array.isArray(a.category) ? a.category[0] : a.category;
    return {
      id: a.id as string,
      title: a.title as string,
      slug: a.slug as string,
      status: a.status as ArticleStatus,
      published_at: a.published_at as string | null,
      created_at: a.created_at as string,
      categoryName: (cat as { name: string } | null)?.name ?? "",
    };
  });

  return (
    <div className="sf-container space-y-6 py-8">
      {/* Notifications */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          Erreur : {decodeURIComponent(error)}
        </div>
      )}
      {status === "draft-created" && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
          Brouillon créé — tu peux l&apos;éditer ci-dessous.
        </div>
      )}
      {status === "ai-generated" && (
        <div className="rounded-xl border border-sf-blue-mid bg-sf-blue-light px-5 py-4 text-sm font-medium text-sf-blue">
          Article généré par l&apos;IA — vérifie le contenu avant de publier.
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-sf-blue">CMS</p>
          <h1 className="mt-1 text-2xl font-extrabold text-sf-navy">Articles</h1>
          <p className="mt-1 text-sm text-sf-gray-600">{articles.length} article(s) au total</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 rounded-full bg-sf-blue px-4 py-2 text-sm font-semibold text-white hover:bg-sf-blue-dark"
        >
          <Plus size={16} />
          Nouvel article
        </Link>
      </div>

      {/* List */}
      <ArticleListClient articles={articles} />
    </div>
  );
}
