"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { ArticleStatusBadge } from "@/components/admin/ArticleStatusBadge";
import { DeleteArticleButton } from "@/components/admin/DeleteArticleButton";
import { formatDate } from "@/lib/utils";
import type { ArticleStatus } from "@/types";

type ArticleRow = {
  id: string;
  title: string;
  slug: string;
  status: ArticleStatus;
  published_at: string | null;
  created_at: string;
  categoryName: string;
};

interface ArticleListClientProps {
  articles: ArticleRow[];
}

const FILTER_OPTIONS: { label: string; value: ArticleStatus | "all" }[] = [
  { label: "Tous", value: "all" },
  { label: "Publiés", value: "published" },
  { label: "En review", value: "review" },
  { label: "Idées", value: "idea" },
  { label: "Plan", value: "plan" },
  { label: "Planifiés", value: "scheduled" },
  { label: "Archivés", value: "archived" },
];

export function ArticleListClient({ articles: initialArticles }: ArticleListClientProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [filter, setFilter] = useState<ArticleStatus | "all">("all");

  const filtered =
    filter === "all" ? articles : articles.filter((a) => a.status === filter);

  function handleDeleted(id: string) {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTER_OPTIONS.map(({ label, value }) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              filter === value
                ? "bg-sf-blue text-white"
                : "bg-sf-gray-100 text-sf-gray-600 hover:bg-sf-gray-200"
            }`}
          >
            {label}
            <span className="ml-1.5 opacity-70">
              {value === "all"
                ? articles.length
                : articles.filter((a) => a.status === value).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-sf-gray-200 py-16 text-center">
          <p className="text-sm text-sf-gray-400">Aucun article dans ce filtre.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-sf-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sf-gray-200 bg-sf-gray-100 text-xs font-semibold uppercase tracking-wider text-sf-gray-400">
                <th className="px-4 py-3 text-left">Titre</th>
                <th className="hidden px-4 py-3 text-left md:table-cell">Catégorie</th>
                <th className="px-4 py-3 text-left">Statut</th>
                <th className="hidden px-4 py-3 text-left lg:table-cell">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sf-gray-200">
              {filtered.map((article) => (
                <tr key={article.id} className="hover:bg-sf-gray-100/50">
                  <td className="max-w-xs px-4 py-3">
                    <p className="truncate font-medium text-sf-navy">{article.title}</p>
                    <p className="truncate text-xs text-sf-gray-400">/{article.slug}</p>
                  </td>
                  <td className="hidden px-4 py-3 text-sf-gray-600 md:table-cell">
                    {article.categoryName || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <ArticleStatusBadge status={article.status} />
                  </td>
                  <td className="hidden px-4 py-3 text-sf-gray-400 lg:table-cell">
                    {article.published_at
                      ? formatDate(article.published_at)
                      : formatDate(article.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/articles/${article.id}`}
                        className="rounded-lg p-1.5 text-sf-gray-400 hover:bg-sf-blue-light hover:text-sf-blue"
                        title="Éditer"
                      >
                        <Pencil size={15} />
                      </Link>
                      <DeleteArticleButton
                        id={article.id}
                        title={article.title}
                        onDeleted={handleDeleted}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
