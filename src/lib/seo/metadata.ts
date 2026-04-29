import type { Metadata } from "next";
import type { Article, Category } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://scalefast.fr";

export function generateArticleMetadata(
  article: Article,
  category: Category
): Metadata {
  const title = article.meta_title || article.title;
  const description =
    article.meta_description ||
    article.excerpt ||
    `${article.title} - Scalefast Blog`;
  const url = `${BASE_URL}/blog/${category.slug}/${article.slug}`;
  const image = article.og_image_url || article.featured_image_url;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: article.published_at ?? undefined,
      modifiedTime: article.updated_at,
      section: category.name,
      images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export function generateCategoryMetadata(category: Category): Metadata {
  const title = `${category.name} - Blog Scalefast`;
  const description =
    category.description ||
    `Articles sur ${category.name} par l'equipe Scalefast`;
  const url = `${BASE_URL}/blog/${category.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
  };
}

export function generateBlogMetadata(): Metadata {
  return {
    title: "Blog GTM B2B | Scalefast",
    description:
      "Le blog GTM de Scalefast pour les equipes sales, RevOps et growth qui veulent scaler plus vite.",
    alternates: {
      canonical: `${BASE_URL}/blog`,
    },
    openGraph: {
      title: "Blog GTM B2B | Scalefast",
      description:
        "Analyses, playbooks et frameworks pour construire une machine GTM plus rapide.",
      url: `${BASE_URL}/blog`,
      type: "website",
    },
  };
}
