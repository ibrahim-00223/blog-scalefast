import type { MetadataRoute } from "next";
import { getCategories, getPublishedArticles } from "@/lib/content/data";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://scalefast.fr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, articles] = await Promise.all([getCategories(), getPublishedArticles()]);
  return [
    { url: `${BASE_URL}/blog`, lastModified: new Date() },
    ...categories.map((category) => ({ url: `${BASE_URL}/blog/${category.slug}`, lastModified: new Date(category.created_at) })),
    ...articles.map((article) => ({ url: `${BASE_URL}/blog/${article.category.slug}/${article.slug}`, lastModified: new Date(article.updated_at) })),
  ];
}

