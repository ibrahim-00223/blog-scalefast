import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/public/ArticleCard";
import { CategoryBadge } from "@/components/public/CategoryBadge";
import { getArticlesByCategory, getCategories, getCategoryBySlug } from "@/lib/content/data";
import { generateCategoryMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ category: string }>; searchParams: Promise<{ page?: string }> };
const PAGE_SIZE = 12;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((item) => ({ category: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const item = await getCategoryBySlug(category);
  if (!item) return {};
  return generateCategoryMetadata(item);
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const { page = "1" } = await searchParams;
  const categoryItem = await getCategoryBySlug(category);
  if (!categoryItem) notFound();
  const currentPage = Math.max(1, Number.parseInt(page, 10) || 1);
  const articles = await getArticlesByCategory(category);
  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
  const paginated = articles.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="sf-container py-14">
      <section className="sf-card p-8 md:p-10">
        <CategoryBadge slug={categoryItem.slug} label={categoryItem.name} />
        <h1 className="mt-5 text-4xl md:text-5xl">{categoryItem.name}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-sf-gray-600">{categoryItem.description}</p>
      </section>
      <section className="pt-10">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {paginated.map((article) => <ArticleCard key={article.id} title={article.title} slug={article.slug} category={article.category} excerpt={article.excerpt} published_at={article.published_at} reading_time={article.reading_time_minutes} featured_image_url={article.featured_image_url} />)}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          {currentPage > 1 ? <Link href={`/blog/${categoryItem.slug}?page=${currentPage - 1}`} className="rounded-full border border-sf-gray-200 bg-white px-4 py-2 text-sm font-semibold text-sf-navy">Page precedente</Link> : null}
          <span className="text-sm text-sf-gray-600">Page {currentPage} / {totalPages}</span>
          {currentPage < totalPages ? <Link href={`/blog/${categoryItem.slug}?page=${currentPage + 1}`} className="rounded-full border border-sf-gray-200 bg-white px-4 py-2 text-sm font-semibold text-sf-navy">Page suivante</Link> : null}
        </div>
      </section>
    </div>
  );
}

