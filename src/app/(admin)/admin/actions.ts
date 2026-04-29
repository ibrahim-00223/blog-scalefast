"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { ArticleStatus } from "@/types";

const allowedStatuses: ArticleStatus[] = [
  "idea",
  "plan",
  "review",
  "scheduled",
  "published",
  "archived",
];

function toTipTapDoc(text: string) {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text }],
      },
    ],
  };
}

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
  if (!user) {
    redirect("/login");
  }

  const slugBase = slugify(title);
  const slug = `${slugBase}-${Date.now().toString().slice(-6)}`;

  const { error } = await supabase.from("articles").insert({
    title,
    slug,
    excerpt: excerpt || null,
    status: "idea",
    category_id: categoryId,
    author_id: user.id,
    brief_subject: briefSubject,
    brief_audience: briefAudience,
    brief_message: briefMessage,
    content: toTipTapDoc(`${briefMessage}\n\nAudience: ${briefAudience}`),
    meta_title: `${title} | Scalefast`,
    meta_description: excerpt || `Article ${title}`,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/articles");
}

export async function updateArticleAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const bodyText = String(formData.get("body_text") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim() || null;
  const featuredImage = String(formData.get("featured_image_url") ?? "").trim();
  const statusInput = String(formData.get("status") ?? "idea") as ArticleStatus;
  const readingTimeRaw = Number.parseInt(
    String(formData.get("reading_time_minutes") ?? "0"),
    10
  );
  const status = allowedStatuses.includes(statusInput) ? statusInput : "idea";
  const readingTime = Number.isFinite(readingTimeRaw) && readingTimeRaw > 0 ? readingTimeRaw : null;

  if (!id || !title) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("articles")
    .update({
      title,
      slug: slugify(slugInput || title),
      excerpt: excerpt || null,
      content: toTipTapDoc(bodyText || excerpt || title),
      category_id: categoryId,
      featured_image_url: featuredImage || null,
      og_image_url: featuredImage || null,
      status,
      reading_time_minutes: readingTime,
      published_at: status === "published" ? new Date().toISOString() : null,
      meta_title: `${title} | Scalefast`,
      meta_description: excerpt || `Article ${title}`,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("author_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${id}`);
}
