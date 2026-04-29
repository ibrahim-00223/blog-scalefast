import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/public/ArticleCard";
import { CategoryBadge } from "@/components/public/CategoryBadge";
import { getCategorySpotlights, getLatestArticles } from "@/lib/content/data";
import { generateBlogMetadata } from "@/lib/seo/metadata";
import { getCategoryUrl } from "@/lib/utils";

export const metadata: Metadata = generateBlogMetadata();
export const revalidate = 3600;

export default async function BlogHomePage() {
  const [latestArticles, categorySpotlights] = await Promise.all([getLatestArticles(6), getCategorySpotlights()]);
  return (
    <div className="pb-16">
      <section className="sf-container pt-14 md:pt-20">
        <div className="sf-card overflow-hidden p-8 md:p-12">
          <div className="max-w-3xl space-y-6">
            <CategoryBadge slug="ressources" label="GTM Team as a Service" className="bg-white" />
            <h1 className="max-w-2xl text-5xl leading-[0.95] md:text-7xl">Le blog GTM de Scalefast</h1>
            <p className="max-w-2xl text-lg leading-8 text-sf-gray-600 md:text-xl">Playbooks, benchmarks et systemes d execution pour les equipes B2B.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/blog/search" className="sf-button-primary">Explorer les articles</Link>
              <a href="mailto:hello@scalefast.fr?subject=Discovery%20Call" className="inline-flex items-center gap-2 rounded-full border border-sf-gray-200 bg-white px-5 py-3 text-sm font-semibold text-sf-navy hover:border-sf-blue-mid hover:text-sf-blue">Book a discovery call <ArrowRight className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
      </section>
      <section className="sf-container pt-16">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sf-blue">Derniers articles</p>
          <h2 className="mt-2 text-3xl">Les sujets qui font bouger la machine GTM</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {latestArticles.map((article) => (
            <ArticleCard key={article.id} title={article.title} slug={article.slug} category={article.category} excerpt={article.excerpt} published_at={article.published_at} reading_time={article.reading_time_minutes} featured_image_url={article.featured_image_url} />
          ))}
        </div>
      </section>
      <section id="categories" className="sf-container pt-20">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sf-blue">Par categorie</p>
          <h2 className="mt-2 text-3xl">Un article phare pour chaque pilier editorial</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {categorySpotlights.map(({ category, article }) => (
            <Link key={category.id} href={getCategoryUrl(category.slug)} className="sf-card group flex flex-col gap-5 p-6 hover:border-sf-blue-mid">
              <div className="flex items-center justify-between gap-3">
                <CategoryBadge slug={category.slug} label={category.name} />
                <ArrowRight className="h-4 w-4 text-sf-blue transition group-hover:translate-x-1" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl">{article.title}</h3>
                <p className="text-sm leading-7 text-sf-gray-600">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

