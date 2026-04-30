import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/public/ArticleCard";
import { CategoryBadge } from "@/components/public/CategoryBadge";
import { TableOfContents } from "@/components/public/TableOfContents";
import { getArticleBySlug, getCategories, getPublishedArticles, getRelatedArticles } from "@/lib/content/data";
import { generateArticleMetadata } from "@/lib/seo/metadata";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { extractFaqs, extractHeadings, formatDate, tipTapToHtml } from "@/lib/utils";

type Props = { params: Promise<{ category: string; slug: string }> };
export const revalidate = 60;

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((article) => ({ category: article.category.slug, slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const article = await getArticleBySlug(category, slug);
  if (!article) return {};
  return generateArticleMetadata(article, article.category);
}

export default async function ArticlePage({ params }: Props) {
  const { category, slug } = await params;
  const article = await getArticleBySlug(category, slug);
  if (!article) notFound();
  const [related, categories] = await Promise.all([getRelatedArticles(category, slug), getCategories()]);
  const headings = extractHeadings(article.content);
  const faqs = extractFaqs(article.content);
  const html = tipTapToHtml(article.content);
  const jsonLd = [articleSchema(article, article.category), breadcrumbSchema(article.category, article), ...(faqs.length ? [faqSchema(faqs)] : [])];

  return (
    <div className="sf-container py-14">
      <article className="space-y-10">
        <section className="sf-card overflow-hidden p-8 md:p-10">
          <div className="max-w-4xl space-y-5">
            <CategoryBadge slug={article.category.slug} label={article.category.name} />
            <h1 className="text-4xl leading-tight md:text-6xl">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-sf-gray-600">
              <span>{article.author?.full_name ?? "Equipe Scalefast"}</span>
              {article.published_at ? <span>{formatDate(article.published_at)}</span> : null}
              {article.reading_time_minutes ? <span>{article.reading_time_minutes} min de lecture</span> : null}
            </div>
            <p className="max-w-3xl text-lg leading-8 text-sf-gray-600">{article.excerpt}</p>
          </div>
          {article.featured_image_url ? (
            <div className="relative mt-8 aspect-[16/8] overflow-hidden rounded-[24px]">
              <Image src={article.featured_image_url} alt={article.title} fill className="object-cover" sizes="100vw" priority />
            </div>
          ) : null}
        </section>
        <section className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(280px,3fr)]">
          <div className="sf-card p-8 md:p-10">
            <div className="prose-scalefast" dangerouslySetInnerHTML={{ __html: html }} />
            {/* In-article lead CTA */}
            <div className="mt-12 overflow-hidden rounded-2xl bg-sf-blue p-8 text-white md:p-10">
              <p className="text-xs font-bold uppercase tracking-widest text-white/60">
                Discovery Call — Gratuit
              </p>
              <h2 className="mt-3 text-2xl font-extrabold leading-tight text-white md:text-3xl">
                Besoin d&apos;accélérer votre machine GTM ?
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-white/75">
                On cadre vos priorités revenue, on identifie les frictions dans votre funnel
                et on pose un plan d&apos;exécution concret — en 45 minutes.
              </p>
              <a
                href="mailto:hello@scalefast.fr?subject=Discovery%20Call"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-sf-blue transition hover:bg-sf-blue-light"
              >
                Parler à Scalefast →
              </a>
            </div>
          </div>
          <div className="sticky top-24 self-start space-y-6">
            <TableOfContents headings={headings} />
            <div className="sf-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sf-gray-400">Explorer</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((item) => (
                  <Link key={item.id} href={`/blog/${item.slug}`} className="rounded-full border border-sf-gray-200 px-3 py-2 text-sm text-sf-gray-600 hover:border-sf-blue-mid hover:text-sf-blue">{item.name}</Link>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section>
          {related.length > 0 && (
            <>
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-sf-blue">Articles connexes</p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-sf-navy md:text-3xl">
                  Continuer dans {article.category.name}
                </h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {related.map((item) => (
                  <ArticleCard
                    key={item.id}
                    title={item.title}
                    slug={item.slug}
                    category={item.category}
                    excerpt={item.excerpt}
                    published_at={item.published_at}
                    reading_time={item.reading_time_minutes}
                    featured_image_url={item.featured_image_url}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </article>
      {jsonLd.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
    </div>
  );
}
