import type { Metadata } from "next";
import Link from "next/link";
import { getCategorySpotlights, getCategories, getPublishedArticles } from "@/lib/content/data";
import { generateBlogMetadata } from "@/lib/seo/metadata";
import { BlogPageClient } from "@/components/public/BlogPageClient";
import { ArrowRight, BookOpen, Users, Zap } from "lucide-react";

export const metadata: Metadata = generateBlogMetadata();
export const revalidate = 60;

export default async function BlogHomePage() {
  const [articles, categories, categorySpotlights] = await Promise.all([
    getPublishedArticles(),
    getCategories(),
    getCategorySpotlights(),
  ]);

  const hasArticles = articles.length > 0;

  return (
    <div>
      {/* ── Hero editorial ────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-[#EAF0FF] to-white">
        <div className="sf-container pt-14 pb-12 md:pt-20 md:pb-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            {/* Left: headline + description */}
            <div className="max-w-2xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-sf-blue/20 bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-sf-blue shadow-sm">
                GTM Team as a Service
              </div>
              <h1 className="text-5xl font-extrabold leading-[1.02] tracking-tight text-sf-navy md:text-[3.75rem]">
                Le blog<br />
                <span className="text-sf-blue">GTM</span> de Scalefast
              </h1>
              <p className="max-w-lg text-lg leading-8 text-sf-gray-600">
                Playbooks, benchmarks et systèmes d&apos;exécution pour
                accélérer votre Go-to-Market B2B.
              </p>
              {/* Social proof pills */}
              <div className="flex flex-wrap gap-5 pt-1">
                {[
                  { icon: BookOpen, label: `${articles.length}+ articles` },
                  { icon: Users, label: "Équipes GTM B2B" },
                  { icon: Zap, label: "Frameworks actionnables" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-sm font-medium text-sf-gray-400">
                    <Icon size={14} className="text-sf-blue" />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: CTA card */}
            <div className="shrink-0 rounded-2xl border border-sf-gray-200 bg-white p-6 shadow-sm lg:w-72">
              <p className="text-xs font-bold uppercase tracking-widest text-sf-blue">
                Discovery Call — Gratuit
              </p>
              <p className="mt-2 text-base font-bold text-sf-navy">
                Prêt à scaler votre Go-to-Market ?
              </p>
              <p className="mt-1.5 text-sm leading-6 text-sf-gray-600">
                45 min pour cadrer vos priorités revenue et poser un plan d&apos;exécution.
              </p>
              <div className="mt-5 flex flex-col gap-2.5">
                <a
                  href="mailto:hello@scalefast.fr?subject=Discovery%20Call"
                  className="flex items-center justify-center gap-2 rounded-full bg-sf-blue px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-sf-blue-dark"
                >
                  Réserver un appel <ArrowRight size={14} />
                </a>
                <Link
                  href="/blog/search"
                  className="flex items-center justify-center gap-2 rounded-full border border-sf-gray-200 px-5 py-2.5 text-sm font-semibold text-sf-navy transition hover:border-sf-blue-mid hover:text-sf-blue"
                >
                  Explorer les articles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Magazine + filter + grid (client component) ───────────────── */}
      {hasArticles ? (
        <BlogPageClient
          articles={articles}
          categories={categories}
          categorySpotlights={categorySpotlights}
        />
      ) : (
        /* Empty state */
        <section className="sf-container py-20">
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-dashed border-sf-gray-200 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sf-blue-light">
              <BookOpen size={24} className="text-sf-blue" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold text-sf-navy">Aucun article publié pour l&apos;instant</p>
              <p className="text-sm text-sf-gray-400">
                Les premiers articles arrivent bientôt. Revenez dans quelques jours.
              </p>
            </div>
            <a
              href="mailto:hello@scalefast.fr?subject=Je%20veux%20être%20notifié"
              className="flex items-center gap-2 rounded-full bg-sf-blue px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sf-blue-dark"
            >
              Être notifié à la publication
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
