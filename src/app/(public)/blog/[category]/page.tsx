import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, ArrowUpRight, ArrowRight } from "lucide-react";
import { CategoryBadge } from "@/components/public/CategoryBadge";
import { getArticlesByCategory, getCategories, getCategoryBySlug } from "@/lib/content/data";
import { generateCategoryMetadata } from "@/lib/seo/metadata";
import { formatDate, getArticleUrl } from "@/lib/utils";
import { CATEGORY_COLORS } from "@/types";

export const revalidate = 60;

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
  const [categoryItem, allCategories] = await Promise.all([
    getCategoryBySlug(category),
    getCategories(),
  ]);
  if (!categoryItem) notFound();

  const currentPage = Math.max(1, Number.parseInt(page, 10) || 1);
  const articles = await getArticlesByCategory(category);
  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
  const paginated = articles.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const colors = CATEGORY_COLORS[categoryItem.slug] ?? { bg: "#EEF2FF", text: "#3B5BDB", border: "#C7D2FE" };

  const featuredArticle = paginated[0] ?? null;
  const restArticles = paginated.slice(1);

  return (
    <div className="pb-24">
      {/* ── Category header ─────────────────────────────────────────── */}
      <section
        className="border-b"
        style={{ borderColor: colors.border ?? colors.bg, backgroundColor: colors.bg }}
      >
        <div className="sf-container py-12 md:py-16">
          <Link href="/blog" className="mb-5 inline-flex items-center gap-1 text-xs font-semibold text-sf-gray-400 hover:text-sf-blue">
            ← Tous les articles
          </Link>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <CategoryBadge slug={categoryItem.slug} label={categoryItem.name} />
              <h1
                className="text-4xl font-extrabold tracking-tight md:text-5xl"
                style={{ color: colors.text }}
              >
                {categoryItem.name}
              </h1>
              {categoryItem.description && (
                <p className="max-w-xl text-base leading-7 text-sf-gray-600">
                  {categoryItem.description}
                </p>
              )}
            </div>
            <div className="shrink-0 text-sm font-semibold" style={{ color: colors.text }}>
              {articles.length} article{articles.length > 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </section>

      {/* ── Other categories nav ────────────────────────────────────── */}
      <div className="border-b border-sf-gray-200 bg-white">
        <div className="sf-container">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
            {allCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog/${cat.slug}`}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  cat.slug === categoryItem.slug
                    ? "bg-sf-blue text-white"
                    : "text-sf-gray-600 hover:bg-sf-gray-100"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="sf-container pt-10">
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-sf-gray-200 py-20 text-center">
            <p className="font-semibold text-sf-navy">Aucun article dans cette catégorie</p>
            <Link href="/blog" className="rounded-full bg-sf-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-sf-blue-dark">
              Voir tous les articles
            </Link>
          </div>
        ) : (
          <>
            {/* Featured article (first of page) */}
            {featuredArticle && currentPage === 1 && (
              <div className="mb-8">
                <Link
                  href={getArticleUrl(featuredArticle.category.slug, featuredArticle.slug)}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-sf-gray-200 bg-white shadow-sm transition hover:border-sf-blue-mid hover:shadow-md lg:flex-row"
                >
                  <div className="relative aspect-[16/9] shrink-0 overflow-hidden lg:aspect-auto lg:w-[52%]">
                    {featuredArticle.featured_image_url ? (
                      <Image
                        src={featuredArticle.featured_image_url}
                        alt={featuredArticle.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 1024px) 100vw, 52vw"
                        priority
                      />
                    ) : (
                      <div
                        className="h-full w-full"
                        style={{ background: `linear-gradient(135deg, ${colors.bg} 0%, #fff 100%)` }}
                      />
                    )}
                  </div>
                  <div className="flex flex-col justify-between gap-5 p-7 lg:py-10">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <CategoryBadge slug={featuredArticle.category.slug} label={featuredArticle.category.name} />
                        <span className="rounded-full bg-sf-blue px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                          À la une
                        </span>
                      </div>
                      <h2 className="text-2xl font-extrabold leading-tight text-sf-navy lg:text-3xl">
                        {featuredArticle.title}
                      </h2>
                      {featuredArticle.excerpt && (
                        <p className="line-clamp-2 text-sm leading-7 text-sf-gray-600">
                          {featuredArticle.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-sf-gray-400">
                        {featuredArticle.published_at && <span>{formatDate(featuredArticle.published_at)}</span>}
                        {featuredArticle.reading_time_minutes && (
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {featuredArticle.reading_time_minutes} min
                          </span>
                        )}
                      </div>
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-sf-blue group-hover:underline">
                        Lire l&apos;article <ArrowUpRight size={15} />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Rest of articles */}
            {restArticles.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {restArticles.map((article) => (
                  <article key={article.id} className="group h-full">
                    <Link
                      href={getArticleUrl(article.category.slug, article.slug)}
                      className="flex h-full flex-col overflow-hidden rounded-2xl border border-sf-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-sf-blue-mid hover:shadow-md"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        {article.featured_image_url ? (
                          <Image
                            src={article.featured_image_url}
                            alt={article.title}
                            fill
                            className="object-cover transition duration-300 group-hover:scale-[1.03]"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <div
                            className="h-full w-full"
                            style={{ background: `linear-gradient(135deg, ${colors.bg} 0%, #fff 100%)` }}
                          />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-3 p-5">
                        <div className="flex items-center justify-between gap-2">
                          <CategoryBadge slug={article.category.slug} label={article.category.name} />
                          {article.published_at && (
                            <span className="text-[11px] text-sf-gray-400">{formatDate(article.published_at)}</span>
                          )}
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <h3 className="line-clamp-2 text-base font-bold leading-snug text-sf-navy">
                            {article.title}
                          </h3>
                          <p className="line-clamp-2 text-sm leading-6 text-sf-gray-600">
                            {article.excerpt ?? "Analyse et framework GTM actionnable."}
                          </p>
                        </div>
                        <div className="flex items-center justify-between border-t border-sf-gray-100 pt-3">
                          <div className="flex items-center gap-1.5 text-xs text-sf-gray-400">
                            {article.reading_time_minutes && (
                              <>
                                <Clock size={11} />
                                <span>{article.reading_time_minutes} min</span>
                              </>
                            )}
                          </div>
                          <ArrowUpRight size={14} className="text-sf-blue opacity-0 transition group-hover:opacity-100" />
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-3">
            {currentPage > 1 && (
              <Link
                href={`/blog/${categoryItem.slug}?page=${currentPage - 1}`}
                className="rounded-full border border-sf-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-sf-navy transition hover:border-sf-blue-mid hover:text-sf-blue"
              >
                ← Page précédente
              </Link>
            )}
            <span className="text-sm text-sf-gray-400">
              {currentPage} / {totalPages}
            </span>
            {currentPage < totalPages && (
              <Link
                href={`/blog/${categoryItem.slug}?page=${currentPage + 1}`}
                className="flex items-center gap-1.5 rounded-full border border-sf-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-sf-navy transition hover:border-sf-blue-mid hover:text-sf-blue"
              >
                Page suivante <ArrowRight size={14} />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
