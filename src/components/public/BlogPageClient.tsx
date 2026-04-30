"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, ArrowUpRight } from "lucide-react";
import { CategoryBadge } from "@/components/public/CategoryBadge";
import { formatDate, getArticleUrl, getCategoryUrl } from "@/lib/utils";
import type { Article, Category } from "@/types";
import { CATEGORY_COLORS } from "@/types";

type ArticleWithCategory = Article & { category: Category };

interface BlogPageClientProps {
  articles: ArticleWithCategory[];
  categories: Category[];
  categorySpotlights: { category: Category; article: ArticleWithCategory }[];
}

// ─── Featured article (large, left 3/5 of hero) ──────────────────────────────

function FeaturedCard({ article }: { article: ArticleWithCategory }) {
  const href = getArticleUrl(article.category.slug, article.slug);
  return (
    <Link href={href} className="group relative flex h-full min-h-[340px] flex-col overflow-hidden rounded-2xl bg-[#0d1240] lg:min-h-[400px]">
      {/* Background image — low opacity so text is always readable */}
      {article.featured_image_url && (
        <div className="absolute inset-0">
          <Image
            src={article.featured_image_url}
            alt={article.title}
            fill
            className="object-cover opacity-25 transition duration-500 group-hover:opacity-35 group-hover:scale-[1.03]"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
        </div>
      )}
      {/* Strong gradient — covers bottom 70% fully */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1240] from-50% via-[#0d1240]/80 to-transparent" />

      {/* Content always at bottom, fully readable */}
      <div className="relative mt-auto flex flex-col gap-4 p-7 lg:p-8">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-sf-blue px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
            À la une
          </span>
          <CategoryBadge slug={article.category.slug} label={article.category.name} />
        </div>
        <h2 className="text-2xl font-extrabold leading-tight text-white lg:text-3xl">
          {article.title}
        </h2>
        {article.excerpt && (
          <p className="line-clamp-2 text-sm leading-6 text-white/75">
            {article.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3 text-xs font-medium text-white/60">
            {article.published_at && <span>{formatDate(article.published_at)}</span>}
            {article.reading_time_minutes && (
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {article.reading_time_minutes} min
              </span>
            )}
          </div>
          <span className="flex items-center gap-1.5 text-sm font-semibold text-white group-hover:underline">
            Lire <ArrowUpRight size={15} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Secondary card (compact, right column stacked) ───────────────────────────

function SecondaryCard({ article }: { article: ArticleWithCategory }) {
  const href = getArticleUrl(article.category.slug, article.slug);
  return (
    <Link
      href={href}
      className="group flex gap-4 overflow-hidden rounded-2xl border border-sf-gray-200 bg-white p-4 transition hover:border-sf-blue-mid hover:shadow-md"
    >
      {/* Thumbnail */}
      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl lg:h-24 lg:w-32">
        {article.featured_image_url ? (
          <Image
            src={article.featured_image_url}
            alt={article.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.05]"
            sizes="128px"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-sf-blue-light to-white" />
        )}
      </div>
      <div className="flex min-w-0 flex-col justify-between gap-2 py-0.5">
        <div className="space-y-1.5">
          <CategoryBadge slug={article.category.slug} label={article.category.name} className="text-[10px]" />
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-sf-navy">
            {article.title}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-sf-gray-400">
          {article.published_at && <span>{formatDate(article.published_at)}</span>}
          {article.reading_time_minutes && (
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {article.reading_time_minutes} min
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Standard article card (grid) ────────────────────────────────────────────

function ArticleGridCard({ article }: { article: ArticleWithCategory }) {
  const href = getArticleUrl(article.category.slug, article.slug);
  return (
    <article className="group h-full">
      <Link href={href} className="flex h-full flex-col overflow-hidden rounded-2xl border border-sf-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-sf-blue-mid hover:shadow-md">
        {/* Image */}
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
              style={{
                background: `linear-gradient(135deg, ${CATEGORY_COLORS[article.category.slug]?.bg ?? "#EEF2FF"} 0%, #fff 100%)`,
              }}
            />
          )}
        </div>
        {/* Body */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-center justify-between gap-2">
            <CategoryBadge slug={article.category.slug} label={article.category.name} />
            {article.published_at && (
              <span className="shrink-0 text-[11px] text-sf-gray-400">
                {formatDate(article.published_at)}
              </span>
            )}
          </div>
          <div className="flex-1 space-y-2">
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
                  <span>{article.reading_time_minutes} min de lecture</span>
                </>
              )}
            </div>
            <ArrowUpRight
              size={15}
              className="text-sf-blue opacity-0 transition group-hover:opacity-100"
            />
          </div>
        </div>
      </Link>
    </article>
  );
}

// ─── Main page client component ───────────────────────────────────────────────

export function BlogPageClient({ articles, categories, categorySpotlights }: BlogPageClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const featuredArticle = articles[0] ?? null;
  const secondaryArticles = articles.slice(1, 3);

  // Filtered grid: all articles when filtering, or articles[3..] when showing all
  const filteredArticles =
    activeCategory === "all"
      ? articles.slice(3)
      : articles.filter((a) => a.category.slug === activeCategory);

  // Article counts per category
  const countByCategory = categories.reduce<Record<string, number>>((acc, cat) => {
    acc[cat.slug] = articles.filter((a) => a.category.slug === cat.slug).length;
    return acc;
  }, {});

  return (
    <div className="pb-24">

      {/* ── Hero / Magazine ─────────────────────────────────────────── */}
      {featuredArticle && (
        <section className="sf-container pt-10 pb-12">
          <div className="grid gap-4 lg:grid-cols-[3fr_2fr] lg:gap-5" style={{ minHeight: 400 }}>
            {/* Featured */}
            <FeaturedCard article={featuredArticle} />

            {/* Secondary stack */}
            {secondaryArticles.length > 0 && (
              <div className="flex flex-col gap-4">
                {secondaryArticles.map((article) => (
                  <SecondaryCard key={article.id} article={article} />
                ))}
                {/* Fill remaining space with CTA if only 1 secondary */}
                {secondaryArticles.length < 2 && (
                  <div className="flex flex-1 flex-col items-start justify-between gap-4 rounded-2xl bg-sf-blue p-6">
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-white/60">
                        Discovery Call
                      </p>
                      <p className="text-lg font-extrabold leading-tight text-white">
                        Accélérer votre machine GTM en 45 min
                      </p>
                    </div>
                    <a
                      href="mailto:hello@scalefast.fr?subject=Discovery%20Call"
                      className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-sf-blue transition hover:bg-sf-blue-light"
                    >
                      Réserver un appel <ArrowRight size={13} />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Category filter pills ───────────────────────────────────── */}
      <div className="sticky top-14 z-10 border-b border-sf-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="sf-container">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                activeCategory === "all"
                  ? "bg-sf-blue text-white shadow-sm"
                  : "text-sf-gray-600 hover:bg-sf-gray-100"
              }`}
            >
              Tous
              <span className="ml-1.5 text-xs opacity-70">{articles.length}</span>
            </button>
            {categories.map((cat) => {
              const count = countByCategory[cat.slug] ?? 0;
              if (count === 0) return null;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                    activeCategory === cat.slug
                      ? "bg-sf-blue text-white shadow-sm"
                      : "text-sf-gray-600 hover:bg-sf-gray-100"
                  }`}
                >
                  {cat.name}
                  <span className="ml-1.5 text-xs opacity-70">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Article grid ────────────────────────────────────────────── */}
      <section className="sf-container pt-10">
        {/* Section heading */}
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sf-blue">
              {activeCategory === "all"
                ? "Tous les articles"
                : categories.find((c) => c.slug === activeCategory)?.name ?? "Articles"}
            </p>
            <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-sf-navy">
              {activeCategory === "all"
                ? "Les sujets qui font bouger la machine GTM"
                : `Ressources ${categories.find((c) => c.slug === activeCategory)?.name ?? ""}`}
            </h2>
          </div>
          {activeCategory !== "all" && (
            <Link
              href={getCategoryUrl(activeCategory)}
              className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-sf-blue hover:underline md:flex"
            >
              Voir tout <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredArticles.map((article) => (
              <ArticleGridCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-sf-gray-200 py-16 text-center">
            <p className="font-semibold text-sf-navy">Aucun article dans cette catégorie</p>
            <p className="text-sm text-sf-gray-400">
              Revenez bientôt ou explorez une autre catégorie.
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className="mt-1 rounded-full bg-sf-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-sf-blue-dark"
            >
              Voir tous les articles
            </button>
          </div>
        )}
      </section>

      {/* ── Lead capture band ───────────────────────────────────────── */}
      <section className="sf-container pt-20">
        <div className="overflow-hidden rounded-3xl bg-sf-blue px-8 py-12 md:px-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-white/60">
                Discovery Call — 45 min, gratuit
              </p>
              <h2 className="text-2xl font-extrabold leading-tight text-white md:text-3xl">
                Besoin d&apos;accélérer votre machine GTM ?
              </h2>
              <p className="text-sm leading-7 text-white/75">
                On cadre vos priorités revenue, on identifie les frictions dans votre funnel
                et on pose un plan d&apos;exécution concret.
              </p>
            </div>
            <div className="shrink-0">
              <a
                href="mailto:hello@scalefast.fr?subject=Discovery%20Call"
                className="flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-sf-blue transition hover:bg-sf-blue-light"
              >
                Réserver un appel <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories showcase ─────────────────────────────────────── */}
      {categorySpotlights.length > 0 && (
        <section id="categories" className="sf-container pt-20">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sf-blue">
              Par catégorie
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-sf-navy md:text-3xl">
              Un article phare pour chaque pilier éditorial
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {categorySpotlights.map(({ category, article }) => {
              const colors = CATEGORY_COLORS[category.slug] ?? { bg: "#EEF2FF", text: "#3B5BDB", border: "#C7D2FE" };
              return (
                <Link
                  key={category.id}
                  href={getCategoryUrl(category.slug)}
                  className="group relative overflow-hidden rounded-2xl border bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-md"
                  style={{ borderColor: colors.border ?? colors.bg }}
                >
                  {/* Colored accent strip */}
                  <div
                    className="absolute left-0 top-0 h-full w-1 rounded-l-2xl"
                    style={{ backgroundColor: colors.text }}
                  />
                  <div className="space-y-4 pl-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <CategoryBadge slug={category.slug} label={category.name} />
                        <p className="text-xs text-sf-gray-400">
                          {countByCategory[category.slug] ?? 0} article{(countByCategory[category.slug] ?? 0) > 1 ? "s" : ""}
                        </p>
                      </div>
                      <ArrowRight
                        size={16}
                        className="mt-1 shrink-0 transition group-hover:translate-x-1"
                        style={{ color: colors.text }}
                      />
                    </div>
                    <h3 className="text-lg font-bold leading-snug text-sf-navy">
                      {article.title}
                    </h3>
                    <p className="text-sm leading-6 text-sf-gray-600">
                      {category.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
