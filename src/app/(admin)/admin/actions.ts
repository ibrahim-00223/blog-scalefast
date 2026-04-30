"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { ArticleStatus, TipTapContent } from "@/types";

const allowedStatuses: ArticleStatus[] = [
  "idea",
  "plan",
  "review",
  "scheduled",
  "published",
  "archived",
];

function buildArticlesErrorRedirect(message: string) {
  return `/admin/articles?error=${encodeURIComponent(message)}`;
}

function buildArticleEditorRedirect(id: string, status?: string) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return `/admin/articles/${id}${query}`;
}

// ─── Create manual draft ──────────────────────────────────────────────────────

export async function createArticleAction(formData: FormData) {
  const briefSubject = String(formData.get("brief_subject") ?? "").trim();
  const briefAudience = String(formData.get("brief_audience") ?? "").trim();
  const briefMessage = String(formData.get("brief_message") ?? "").trim();
  if (!briefSubject || !briefAudience || !briefMessage) return;

  const categoryId = String(formData.get("category_id") ?? "").trim() || null;
  const title = briefSubject;
  const excerpt = `${briefMessage} Pour ${briefAudience.toLowerCase()}.`;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const slugBase = slugify(title);
  const slug = `${slugBase}-${Date.now().toString().slice(-6)}`;

  const { data, error } = await supabase
    .from("articles")
    .insert({
      title,
      slug,
      excerpt: excerpt || null,
      status: "idea",
      category_id: categoryId,
      author_id: user.id,
      brief_subject: briefSubject,
      brief_audience: briefAudience,
      brief_message: briefMessage,
      content: {
        type: "doc",
        content: [{ type: "paragraph", content: [{ type: "text", text: excerpt }] }],
      },
      meta_title: `${title} | Scalefast`,
      meta_description: excerpt || `Article ${title}`,
    })
    .select("id")
    .single();

  if (error) redirect(buildArticlesErrorRedirect(error.message));

  revalidatePath("/admin");
  revalidatePath("/admin/articles");
  revalidatePath("/blog", "layout");
  redirect(buildArticleEditorRedirect(data.id, "draft-created"));
}

// ─── Update article ───────────────────────────────────────────────────────────

export async function updateArticleAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const contentJsonRaw = String(formData.get("content_json") ?? "").trim();
  const briefSubject = String(formData.get("brief_subject") ?? "").trim();
  const briefAudience = String(formData.get("brief_audience") ?? "").trim();
  const briefMessage = String(formData.get("brief_message") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim() || null;
  const featuredImage = String(formData.get("featured_image_url") ?? "").trim();
  const metaTitle = String(formData.get("meta_title") ?? "").trim();
  const metaDescription = String(formData.get("meta_description") ?? "").trim();
  const statusInput = String(formData.get("status") ?? "idea") as ArticleStatus;
  const readingTimeRaw = Number.parseInt(
    String(formData.get("reading_time_minutes") ?? "0"),
    10
  );
  const status = allowedStatuses.includes(statusInput) ? statusInput : "idea";
  const readingTime =
    Number.isFinite(readingTimeRaw) && readingTimeRaw > 0 ? readingTimeRaw : null;

  if (!id || !title) return;

  // Parse TipTap JSON if provided by the editor
  let contentJson: TipTapContent | null = null;
  if (contentJsonRaw) {
    try {
      contentJson = JSON.parse(contentJsonRaw) as TipTapContent;
    } catch {
      // Ignore parse errors — keep existing content
    }
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Preserve published_at:
  // - First publication → set to now
  // - Re-save while published → keep original date
  // - Move away from published → preserve historical date (never null)
  const { data: currentArticle } = await supabase
    .from("articles")
    .select("published_at")
    .eq("id", id)
    .single();

  const publishedAt =
    status === "published"
      ? (currentArticle?.published_at ?? new Date().toISOString())
      : (currentArticle?.published_at ?? null);

  const updatePayload: Record<string, unknown> = {
    title,
    slug: slugify(slugInput || title),
    excerpt: excerpt || null,
    brief_subject: briefSubject || null,
    brief_audience: briefAudience || null,
    brief_message: briefMessage || null,
    category_id: categoryId,
    featured_image_url: featuredImage || null,
    og_image_url: featuredImage || null,
    status,
    reading_time_minutes: readingTime,
    published_at: publishedAt,
    meta_title: metaTitle || `${title} | Scalefast`,
    meta_description: metaDescription || excerpt || `Article ${title}`,
    updated_at: new Date().toISOString(),
  };

  // Only overwrite content if the editor sent new TipTap JSON
  if (contentJson) {
    updatePayload.content = contentJson;
  }

  const { error } = await supabase
    .from("articles")
    .update(updatePayload)
    .eq("id", id)
    .eq("author_id", user.id);

  if (error) redirect(buildArticleEditorRedirect(id, `error:${error.message}`));

  revalidatePath("/admin");
  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${id}`);
  // Revalidate all public blog pages so published/unpublished changes appear instantly
  revalidatePath("/blog", "layout");
  redirect(buildArticleEditorRedirect(id, "saved"));
}

// ─── Delete article ───────────────────────────────────────────────────────────

export async function deleteArticleAction(id: string): Promise<{ error?: string }> {
  if (!id) return { error: "ID manquant." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié." };

  const { error } = await supabase
    .from("articles")
    .delete()
    .eq("id", id)
    .eq("author_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/admin/articles");
  revalidatePath("/blog", "layout");
  return {};
}
