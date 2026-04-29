"use server";

import OpenAI from "openai";
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

type GeneratedArticlePayload = {
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  readingTimeMinutes: number;
  angle: string;
  keywords: string[];
  sections: Array<{
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }>;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  cta?: string;
};

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

function stripCodeFences(value: string) {
  return value
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

function createOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

function buildTipTapDocFromGeneratedArticle(payload: GeneratedArticlePayload) {
  const content: Array<Record<string, unknown>> = [
    {
      type: "paragraph",
      content: [{ type: "text", text: payload.excerpt }],
    },
  ];

  for (const section of payload.sections) {
    content.push({
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: section.heading }],
    });

    for (const paragraph of section.paragraphs) {
      content.push({
        type: "paragraph",
        content: [{ type: "text", text: paragraph }],
      });
    }

    if (section.bullets?.length) {
      content.push({
        type: "bulletList",
        content: section.bullets.map((bullet) => ({
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: bullet }],
            },
          ],
        })),
      });
    }
  }

  if (payload.faq?.length) {
    content.push({
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "FAQ" }],
    });

    for (const item of payload.faq) {
      content.push({
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: item.question }],
      });
      content.push({
        type: "paragraph",
        content: [{ type: "text", text: item.answer }],
      });
    }
  }

  if (payload.cta) {
    content.push({
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Conclusion" }],
    });
    content.push({
      type: "paragraph",
      content: [{ type: "text", text: payload.cta }],
    });
  }

  return {
    type: "doc",
    content,
  };
}

async function generateSeoArticleFromBrief(input: {
  briefSubject: string;
  briefAudience: string;
  briefMessage: string;
  categoryName?: string;
}) {
  const client = createOpenAIClient();
  const model = process.env.OPENAI_MODEL || "gpt-5.2";

  const response = await client.responses.create({
    model,
    instructions:
      "You are an expert B2B SaaS content strategist. Generate a French blog article brief output as strict JSON only. The article must be SEO-oriented, follow EEAT principles, stay practical, and feel like a premium GTM operator wrote it. Optimize for relevance, clarity, search intent, and credibility. Include concrete frameworks, structured sections, and FAQ content when useful. Never wrap JSON in markdown fences.",
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text:
              `Sujet: ${input.briefSubject}\n` +
              `Audience: ${input.briefAudience}\n` +
              `Valeur a transmettre: ${input.briefMessage}\n` +
              `Categorie: ${input.categoryName || "Non precisee"}\n\n` +
              "Return valid JSON with this exact shape: " +
              '{"title":"string","excerpt":"string","metaTitle":"string","metaDescription":"string","readingTimeMinutes":8,"angle":"string","keywords":["kw1","kw2"],"sections":[{"heading":"string","paragraphs":["string"],"bullets":["string"]}],"faq":[{"question":"string?","answer":"string"}],"cta":"string"}',
          },
        ],
      },
    ],
  });

  const output = stripCodeFences(response.output_text);
  return JSON.parse(output) as GeneratedArticlePayload;
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

export async function createArticleWithAIAction(formData: FormData) {
  const briefSubject = String(formData.get("brief_subject") ?? "").trim();
  const briefAudience = String(formData.get("brief_audience") ?? "").trim();
  const briefMessage = String(formData.get("brief_message") ?? "").trim();
  if (!briefSubject || !briefAudience || !briefMessage) return;

  const categoryId = String(formData.get("category_id") ?? "").trim() || null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  let categoryName = "";
  if (categoryId) {
    const { data: category } = await supabase
      .from("categories")
      .select("name")
      .eq("id", categoryId)
      .single();
    categoryName = category?.name ?? "";
  }

  const generated = await generateSeoArticleFromBrief({
    briefSubject,
    briefAudience,
    briefMessage,
    categoryName,
  });

  const slug = `${slugify(generated.title)}-${Date.now().toString().slice(-6)}`;
  const { error } = await supabase.from("articles").insert({
    title: generated.title,
    slug,
    excerpt: generated.excerpt,
    status: "review",
    category_id: categoryId,
    author_id: user.id,
    brief_subject: briefSubject,
    brief_audience: briefAudience,
    brief_message: briefMessage,
    ai_plan: {
      h1: generated.title,
      angle: generated.angle,
      sections: generated.sections.map((section) => ({
        h2: section.heading,
        description: section.paragraphs[0] ?? "",
      })),
      estimated_words: generated.readingTimeMinutes * 180,
      keywords: generated.keywords,
      tone: "expert, practical, credible",
    },
    ai_plan_validated_at: new Date().toISOString(),
    content: buildTipTapDocFromGeneratedArticle(generated),
    meta_title: generated.metaTitle,
    meta_description: generated.metaDescription,
    reading_time_minutes: generated.readingTimeMinutes,
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
  const briefSubject = String(formData.get("brief_subject") ?? "").trim();
  const briefAudience = String(formData.get("brief_audience") ?? "").trim();
  const briefMessage = String(formData.get("brief_message") ?? "").trim();
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
      brief_subject: briefSubject || null,
      brief_audience: briefAudience || null,
      brief_message: briefMessage || null,
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

export async function generateArticleForExistingDraftAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const briefSubject = String(formData.get("brief_subject") ?? "").trim();
  const briefAudience = String(formData.get("brief_audience") ?? "").trim();
  const briefMessage = String(formData.get("brief_message") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim() || null;

  if (!id || !briefSubject || !briefAudience || !briefMessage) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  let categoryName = "";
  if (categoryId) {
    const { data: category } = await supabase
      .from("categories")
      .select("name")
      .eq("id", categoryId)
      .single();
    categoryName = category?.name ?? "";
  }

  const generated = await generateSeoArticleFromBrief({
    briefSubject,
    briefAudience,
    briefMessage,
    categoryName,
  });

  const { error } = await supabase
    .from("articles")
    .update({
      title: generated.title,
      slug: slugify(generated.title),
      excerpt: generated.excerpt,
      brief_subject: briefSubject,
      brief_audience: briefAudience,
      brief_message: briefMessage,
      category_id: categoryId,
      status: "review",
      ai_plan: {
        h1: generated.title,
        angle: generated.angle,
        sections: generated.sections.map((section) => ({
          h2: section.heading,
          description: section.paragraphs[0] ?? "",
        })),
        estimated_words: generated.readingTimeMinutes * 180,
        keywords: generated.keywords,
        tone: "expert, practical, credible",
      },
      ai_plan_validated_at: new Date().toISOString(),
      content: buildTipTapDocFromGeneratedArticle(generated),
      meta_title: generated.metaTitle,
      meta_description: generated.metaDescription,
      reading_time_minutes: generated.readingTimeMinutes,
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
