export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArticleEditorClient } from "@/components/admin/ArticleEditorClient";
import type { TipTapContent, ArticleStatus } from "@/types";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminArticleEditPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { status: statusMsg } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: categories }, { data: article }] = await Promise.all([
    supabase.from("categories").select("id,name").order("name"),
    supabase
      .from("articles")
      .select(
        "id,title,slug,excerpt,content,status,category_id,brief_subject,brief_audience,brief_message,meta_title,meta_description,featured_image_url,reading_time_minutes"
      )
      .eq("id", id)
      .eq("author_id", user.id)
      .single(),
  ]);

  if (!article) notFound();

  const notifMap: Record<string, { bg: string; text: string; msg: string }> = {
    saved: {
      bg: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-700",
      msg: "Article enregistré.",
    },
    "draft-created": {
      bg: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-700",
      msg: "Brouillon créé — remplis le contenu.",
    },
    "ai-generated": {
      bg: "bg-sf-blue-light border-sf-blue-mid",
      text: "text-sf-blue",
      msg: "Article généré par l'IA — vérifie avant de publier.",
    },
    "ai-regenerated": {
      bg: "bg-sf-blue-light border-sf-blue-mid",
      text: "text-sf-blue",
      msg: "Article régénéré par l'IA.",
    },
  };
  const notif = statusMsg && !statusMsg.startsWith("error:") ? notifMap[statusMsg] : null;
  const errorMsg =
    statusMsg?.startsWith("error:") ? decodeURIComponent(statusMsg.slice(6)) : null;

  return (
    <div className="sf-container pb-12 pt-0">
      {/* Notifications (shown below sticky bar) */}
      {(notif || errorMsg) && (
        <div className="pt-4 pb-2">
          {notif && (
            <div
              className={`rounded-xl border px-5 py-4 text-sm font-medium ${notif.bg} ${notif.text}`}
            >
              {notif.msg}
            </div>
          )}
          {errorMsg && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
              Erreur : {errorMsg}
            </div>
          )}
        </div>
      )}

      {/* Editor */}
      <ArticleEditorClient
        article={{
          id: article.id as string,
          title: article.title as string,
          slug: article.slug as string,
          excerpt: (article.excerpt as string | null) ?? null,
          content: (article.content as TipTapContent | null) ?? null,
          status: article.status as ArticleStatus,
          category_id: (article.category_id as string | null) ?? null,
          brief_subject: (article.brief_subject as string | null) ?? null,
          brief_audience: (article.brief_audience as string | null) ?? null,
          brief_message: (article.brief_message as string | null) ?? null,
          meta_title: (article.meta_title as string | null) ?? null,
          meta_description: (article.meta_description as string | null) ?? null,
          featured_image_url: (article.featured_image_url as string | null) ?? null,
          reading_time_minutes: (article.reading_time_minutes as number | null) ?? null,
        }}
        categories={(categories ?? []).map((c) => ({
          id: c.id as string,
          name: c.name as string,
        }))}
      />
    </div>
  );
}
