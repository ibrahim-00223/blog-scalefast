import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Users, Zap } from "lucide-react";
import { ArticleCard } from "@/components/public/ArticleCard";
import { CategoryBadge } from "@/components/public/CategoryBadge";
import { getCategorySpotlights, getLatestArticles } from "@/lib/content/data";
import { generateBlogMetadata } from "@/lib/seo/metadata";
import { getCategoryUrl } from "@/lib/utils";

export const metadata: Metadata = generateBlogMetadata();
export const revalidate = 3600;

export default async function BlogHomePage() {
  const [latestArticles, categorySpotlights] = await Promise.all([
    getLatestArticles(7),
    getCategorySpotlights(),
  ]);

  const featuredArticle = latestArticles[0] ?? null;
  const gridArticles = latestArticles.slice(1, 7);

  return (
    <div className="pb-24">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-[#EEF2FF] to-white">
        <div className="sf-container pt-16 pb-14 md:pt-24 md:pb-20">
          <div className="max-w-3xl space-y-6">
            <CategoryBadge slug="ressources" label="GTM Team as a Service" />
            <h1 className="text-5xl font-extrabold leading-[1.02] tracking-tight text-sf-navy md:text-7xl">
              Le blog GTM<br />de Scalefast
            </h1>
            <p className="max-w-xl text-lg leading-8 text-sf-gray-600 md:text-xl">
              Playbooks, benchmarks et systèmes d&apos;exécution pour accélérer
              votre Go-to-Market B2B.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/blog/search"
                className="flex items-center gap-2 rounded-full bg-sf-blue px-5 py-3 text-sm font-bold text-white shadow-md shadow-sf-blue/20 transition hover:bg-sf-blue-dark"
              >
                Explorer les articles <ArrowRight size={15} />
              </Link>
              <a
                href="mailto:hello@scalefast.fr?subject=Discovery%20Call"
                className="flex items-center gap-2 rounded-full border border-sf-gray-200 bg-white px-5 py-3 text-sm font-semibold text-sf-navy transition hover:border-sf-blue-mid hover:text-sf-blue"
              >
                Réserver un discovery call
              </a>
            </div>

            {/* Social proof pills */}
            <div className="flex flex-wrap gap-4 pt-2">
              {[
                { icon: BookOpen, label: `${latestArticles.length > 0 ? latestArticles.length + "+" : ""} articles publiés` },
                { icon: Users, label: "Équipes GTM B2B" },
                { icon: Zap, label: "Frameworks actionnables" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs font-medium text-sf-gray-400">
                  <Icon size={13} className="text-sf-blue" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured article ──────────────────────────────────────────── */}
      {featuredArticle && (
        <section className="sf-container pt-14">
          <ArticleCard
            featured
            title={featuredArticle.title}
            slug={featuredArticle.slug}
            category={featuredArticle.category}
            excerpt={featuredArticle.excerpt}
            published_at={featuredArticle.published_at}
            reading_time={featuredArticle.reading_time_minutes}
            featured_image_url={featuredArticle.featured_image_url}
          />
        </section>
      )}

      {/* ── Latest articles grid ──────────────────────────────────────── */}
      <section className="sf-container pt-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sf-blue">
              Derniers articles
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-sf-navy md:text-3xl">
              Les sujets qui font bouger la machine GTM
            </h2>
          </div>
          <Link
            href="/blog/search"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-sf-blue hover:underline md:flex"
          >
            Tous les articles <ArrowRight size={14} />
          </Link>
        </div>

        {gridArticles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {gridArticles.map((article) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                slug={article.slug}
                category={article.category}
                excerpt={article.excerpt}
                published_at={article.published_at}
                reading_time={article.reading_time_minutes}
                featured_image_url={article.featured_image_url}
              />
            ))}
          </div>
        ) : !featuredArticle ? (
          /* Empty state — no articles at all */
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-sf-gray-200 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sf-blue-light">
              <BookOpen size={24} className="text-sf-blue" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-sf-navy">Aucun article publié pour l&apos;instant</p>
              <p className="text-sm text-sf-gray-400">
                Les premiers articles arrivent bientôt. Revenez dans quelques jours.
              </p>
            </div>
            <a
              href="mailto:hello@scalefast.fr?subject=Je%20veux%20être%20notifié"
              className="flex items-center gap-2 rounded-full bg-sf-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sf-blue-dark"
            >
              Être notifié à la publication
            </a>
          </div>
        ) : null}

        <div className="mt-8 flex justify-center md:hidden">
          <Link
            href="/blog/search"
            className="flex items-center gap-2 rounded-full border border-sf-gray-200 px-5 py-2.5 text-sm font-semibold text-sf-navy hover:border-sf-blue-mid hover:text-sf-blue"
          >
            Voir tous les articles <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Lead CTA band ─────────────────────────────────────────────── */}
      <section className="sf-container pt-20">
        <div className="overflow-hidden rounded-3xl bg-sf-blue px-8 py-12 md:px-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-white/60">
                Discovery Call — Gratuit
              </p>
              <h2 className="text-2xl font-extrabold leading-tight text-white md:text-3xl">
                Besoin d&apos;accélérer votre machine GTM ?
              </h2>
              <p className="text-sm leading-7 text-white/75">
                On cadre vos priorités revenue, on identifie les frictions dans votre
                funnel et on pose un plan d&apos;exécution concret — en 45 minutes.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="mailto:hello@scalefast.fr?subject=Discovery%20Call"
                className="flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-sf-blue transition hover:bg-sf-blue-light"
              >
                Réserver un appel <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────────── */}
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
            {categorySpotlights.map(({ category, article }) => (
              <Link
                key={category.id}
                href={getCategoryUrl(category.slug)}
                className="group flex flex-col gap-4 rounded-2xl border border-sf-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-sf-blue-mid hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <CategoryBadge slug={category.slug} label={category.name} />
                  <ArrowRight
                    size={16}
                    className="mt-1 shrink-0 text-sf-blue transition group-hover:translate-x-1"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold leading-snug text-sf-navy">
                    {article.title}
                  </h3>
                  <p className="text-sm leading-6 text-sf-gray-600">
                    {category.description}
                  </p>
                </div>
                <p className="text-xs font-semibold text-sf-blue">
                  Explorer la catégorie →
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
