import type { Metadata } from "next";
import { Search } from "lucide-react";
import { ArticleCard } from "@/components/public/ArticleCard";
import { searchArticles } from "@/lib/content/data";

type Props = { searchParams: Promise<{ q?: string }> };

export const metadata: Metadata = {
  title: "Recherche | Scalefast",
  description: "Rechercher un article GTM, sales ou RevOps dans le blog Scalefast.",
};

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const results = query ? await searchArticles(query) : [];
  return (
    <div className="sf-container py-14">
      <section className="sf-card p-8 md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sf-blue">Search</p>
        <h1 className="mt-3 text-4xl md:text-5xl">Chercher dans le blog</h1>
        <form action="/blog/search" className="mt-8">
          <label className="flex items-center gap-3 rounded-full border border-sf-gray-200 bg-white px-5 py-4">
            <Search className="h-5 w-5 text-sf-gray-400" />
            <input type="search" name="q" defaultValue={query} placeholder="Ex. GTM, pipeline, discovery call" className="w-full bg-transparent text-base outline-none placeholder:text-sf-gray-400" />
          </label>
        </form>
      </section>
      <section className="pt-10">
        {query ? <p className="mb-6 text-sm text-sf-gray-600">{results.length} resultat(s) pour <span className="font-semibold text-sf-navy">&quot;{query}&quot;</span></p> : <p className="mb-6 text-sm text-sf-gray-600">Lance une recherche pour filtrer les articles de demo.</p>}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {results.map((article) => <ArticleCard key={article.id} title={article.title} slug={article.slug} category={article.category} excerpt={article.excerpt} published_at={article.published_at} reading_time={article.reading_time_minutes} featured_image_url={article.featured_image_url} />)}
        </div>
      </section>
    </div>
  );
}

