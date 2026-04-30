import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowUpRight } from "lucide-react";
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
  featured?: boolean;
};

export function ArticleCard(props: Props) {
  const href = getArticleUrl(props.category.slug, props.slug);

  if (props.featured) {
    return (
      <article className="group">
        <Link
          href={href}
          className="flex flex-col overflow-hidden rounded-2xl border border-sf-gray-200 bg-white shadow-sm transition hover:border-sf-blue-mid hover:shadow-md lg:flex-row"
        >
          {/* Image */}
          <div className="relative aspect-[16/9] shrink-0 overflow-hidden lg:aspect-auto lg:w-[55%]">
            {props.featured_image_url ? (
              <Image
                src={props.featured_image_url}
                alt={props.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 55vw"
                priority
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-sf-blue-light to-white" />
            )}
          </div>
          {/* Content */}
          <div className="flex flex-col justify-between gap-6 p-8 lg:py-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CategoryBadge slug={props.category.slug} label={props.category.name} />
                <span className="rounded-full bg-sf-blue px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                  À la une
                </span>
              </div>
              <h2 className="text-2xl font-extrabold leading-tight text-sf-navy lg:text-3xl">
                {props.title}
              </h2>
              <p className="text-base leading-7 text-sf-gray-600">
                {props.excerpt || "Analyse et framework GTM actionnable."}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs font-medium text-sf-gray-400">
                {props.published_at && <span>{formatDate(props.published_at)}</span>}
                {props.reading_time && (
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {props.reading_time} min
                  </span>
                )}
              </div>
              <span className="flex items-center gap-1 text-sm font-semibold text-sf-blue group-hover:underline">
                Lire l&apos;article <ArrowUpRight size={15} />
              </span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group h-full">
      <Link
        href={href}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-sf-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-sf-blue-mid hover:shadow-md"
      >
        {/* Image or gradient placeholder */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {props.featured_image_url ? (
            <Image
              src={props.featured_image_url}
              alt={props.title}
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-sf-blue-light via-white to-sf-gray-100" />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <CategoryBadge slug={props.category.slug} label={props.category.name} />
            <ArrowUpRight
              size={16}
              className="shrink-0 text-sf-blue opacity-0 transition group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-bold leading-snug text-sf-navy">
              {props.title}
            </h3>
            <p className="line-clamp-2 text-sm leading-6 text-sf-gray-600">
              {props.excerpt || "Analyse et framework GTM actionnable."}
            </p>
          </div>
          <div className="flex items-center gap-3 border-t border-sf-gray-100 pt-3 text-xs font-medium text-sf-gray-400">
            {props.published_at && <span>{formatDate(props.published_at)}</span>}
            {props.reading_time && (
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {props.reading_time} min
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
