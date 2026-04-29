import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/client";
import type { Article, Category } from "@/types";

// seed.ts is imported dynamically so it is excluded from the production bundle
// when Supabase env vars are set (the only path that executes this import is
// the demo/dev fallback branch where hasSupabaseEnv() returns false).
async function loadDemoData() {
  const { demoArticles, demoCategories } = await import("@/lib/supabase/seed");
  return { demoArticles, demoCategories };
}

type ArticleWithCategory = Article & { category: Category };

function sortArticles(items: ArticleWithCategory[]): ArticleWithCategory[] {
  return [...items].sort((a, b) => {
    const aDate = a.published_at ? new Date(a.published_at).getTime() : 0;
    const bDate = b.published_at ? new Date(b.published_at).getTime() : 0;
    return bDate - aDate;
  });
}

// ─── Supabase fetchers ────────────────────────────────────────────────────────

async function fetchCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  if (error) throw new Error(`Failed to fetch categories: ${error.message}`);
  return data ?? [];
}

async function fetchPublishedArticles(): Promise<ArticleWithCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw new Error(`Failed to fetch articles: ${error.message}`);
  return (data ?? []) as ArticleWithCategory[];
}

async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();
  return data ?? null;
}

async function fetchArticleBySlug(
  categorySlug: string,
  slug: string
): Promise<ArticleWithCategory | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (!data) return null;
  const article = data as ArticleWithCategory;
  // Verify the article belongs to the expected category
  if (article.category?.slug !== categorySlug) return null;
  return article;
}

// ─── Demo fallback (used when Supabase env vars are not configured) ───────────

async function getDemoPublishedArticles(): Promise<ArticleWithCategory[]> {
  const { demoArticles } = await loadDemoData();
  return sortArticles(
    (demoArticles as Article[]).filter(
      (a): a is ArticleWithCategory => a.status === "published" && Boolean((a as ArticleWithCategory).category)
    )
  );
}

// ─── Public exports (with React cache for request deduplication) ──────────────

export const getCategories = cache(async (): Promise<Category[]> => {
  if (!hasSupabaseEnv()) {
    const { demoCategories } = await loadDemoData();
    return demoCategories;
  }
  return fetchCategories();
});

export const getPublishedArticles = cache(
  async (): Promise<ArticleWithCategory[]> => {
    if (!hasSupabaseEnv()) return getDemoPublishedArticles();
    return fetchPublishedArticles();
  }
);

export const getLatestArticles = cache(async (limit = 6) =>
  (await getPublishedArticles()).slice(0, limit)
);

export const getCategoryBySlug = cache(
  async (slug: string): Promise<Category | null> => {
    if (!hasSupabaseEnv()) {
      const { demoCategories } = await loadDemoData();
      return demoCategories.find((c) => c.slug === slug) ?? null;
    }
    return fetchCategoryBySlug(slug);
  }
);

export const getArticlesByCategory = cache(async (categorySlug: string) =>
  (await getPublishedArticles()).filter(
    (a) => a.category.slug === categorySlug
  )
);

export const getArticleBySlug = cache(
  async (
    categorySlug: string,
    slug: string
  ): Promise<ArticleWithCategory | null> => {
    if (!hasSupabaseEnv()) {
      return (
        (await getPublishedArticles()).find(
          (a) => a.category.slug === categorySlug && a.slug === slug
        ) ?? null
      );
    }
    return fetchArticleBySlug(categorySlug, slug);
  }
);

export const getRelatedArticles = cache(
  async (categorySlug: string, slug: string) =>
    (await getArticlesByCategory(categorySlug))
      .filter((a) => a.slug !== slug)
      .slice(0, 3)
);

export const getCategorySpotlights = cache(async () => {
  const [categories, articles] = await Promise.all([
    getCategories(),
    getPublishedArticles(),
  ]);
  return categories
    .map((category) => ({
      category,
      article: articles.find((a) => a.category.slug === category.slug) ?? null,
    }))
    .filter(
      (entry): entry is { category: Category; article: ArticleWithCategory } =>
        Boolean(entry.article)
    );
});

export const searchArticles = cache(async (query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return (await getPublishedArticles()).filter((article) =>
    [
      article.title,
      article.excerpt,
      article.meta_description,
      article.category.name,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(q)
  );
});
