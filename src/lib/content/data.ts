import { cache } from "react";
import type { Article, Category } from "@/types";
import { demoArticles, demoCategories } from "@/lib/supabase/seed";

type ArticleWithCategory = Article & { category: Category };

function sortArticles(items: Article[]) {
  return [...items].sort((a, b) => {
    const aDate = a.published_at ? new Date(a.published_at).getTime() : 0;
    const bDate = b.published_at ? new Date(b.published_at).getTime() : 0;
    return bDate - aDate;
  }) as ArticleWithCategory[];
}

export const getCategories = cache(async () => demoCategories);
export const getPublishedArticles = cache(async () => sortArticles(demoArticles));
export const getLatestArticles = cache(async (limit = 6) => (await getPublishedArticles()).slice(0, limit));
export const getCategoryBySlug = cache(async (slug: string) => demoCategories.find((item) => item.slug === slug) ?? null);
export const getArticlesByCategory = cache(async (categorySlug: string) => (await getPublishedArticles()).filter((item) => item.category.slug === categorySlug));
export const getArticleBySlug = cache(async (categorySlug: string, slug: string) => (await getPublishedArticles()).find((item) => item.category.slug === categorySlug && item.slug === slug) ?? null);
export const getRelatedArticles = cache(async (categorySlug: string, slug: string) => (await getArticlesByCategory(categorySlug)).filter((item) => item.slug !== slug).slice(0, 3));
export const getCategorySpotlights = cache(async () => {
  const categories = await getCategories();
  const articles = await getPublishedArticles();
  return categories
    .map((category) => ({ category, article: articles.find((item) => item.category.slug === category.slug) ?? null }))
    .filter((entry): entry is { category: Category; article: ArticleWithCategory } => Boolean(entry.article));
});
export const searchArticles = cache(async (query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return (await getPublishedArticles()).filter((article) =>
    [article.title, article.excerpt, article.meta_description, article.category.name]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(q)
  );
});
