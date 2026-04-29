import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CategoryBadge } from "@/components/public/CategoryBadge";
import { formatDate, getArticleUrl } from "@/lib/utils";

type Props = {
  title: string;
  slug: string;
  category: { slug: string; name: string };
  excerpt: string | null;
  published_at: string | null;
  reading_time: number | null;
  featured_image_url: string | null;
};

export function ArticleCard(props: Props) {
  const href = getArticleUrl(props.category.slug, props.slug);
  return (
    <article className="group h-full">
      <Link href={href} className="flex h-full flex-col overflow-hidden rounded-[10px] border border-sf-gray-200 bg-white shadow-[0_1px_3px_rgba(26,31,60,0.04)] transition hover:-translate-y-0.5 hover:border-sf-blue-mid hover:shadow-[0_2px_12px_rgba(59,91,219,0.08)]">
        {props.featured_image_url ? (
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image src={props.featured_image_url} alt={props.title} fill className="object-cover transition duration-300 group-hover:scale-[1.03]" sizes="(max-width: 768px) 100vw, 33vw" />
          </div>
        ) : null}
        <div className="flex flex-1 flex-col gap-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <CategoryBadge slug={props.category.slug} label={props.category.name} />
            <ArrowUpRight className="h-4 w-4 text-sf-blue transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl leading-tight">{props.title}</h3>
            <p className="text-sm leading-6 text-sf-gray-600">{props.excerpt || "Analyse et framework GTM actionnable."}</p>
          </div>
          <div className="mt-auto flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-sf-gray-400">
            {props.published_at ? <span>{formatDate(props.published_at)}</span> : null}
            {props.reading_time ? <span>{props.reading_time} min</span> : null}
          </div>
        </div>
      </Link>
    </article>
  );
}

