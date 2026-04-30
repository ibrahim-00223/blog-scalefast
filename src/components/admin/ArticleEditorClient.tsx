"use client";

import { useRef, useState } from "react";
import { TipTapEditor } from "@/components/admin/TipTapEditor";
import { RegenerateButton } from "@/components/admin/RegenerateButton";
import { updateArticleAction } from "@/app/(admin)/admin/actions";
import type { TipTapContent, ArticleStatus, Category } from "@/types";
import { Save, Loader2 } from "lucide-react";
import { useTransition } from "react";

interface ArticleEditorClientProps {
  article: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: TipTapContent | null;
    status: ArticleStatus;
    category_id: string | null;
    brief_subject: string | null;
    brief_audience: string | null;
    brief_message: string | null;
    meta_title: string | null;
    meta_description: string | null;
    featured_image_url: string | null;
    reading_time_minutes: number | null;
  };
  categories: Pick<Category, "id" | "name">[];
}

const allowedStatuses: { value: ArticleStatus; label: string }[] = [
  { value: "idea", label: "Idée" },
  { value: "plan", label: "En plan" },
  { value: "review", label: "En review" },
  { value: "scheduled", label: "Planifié" },
  { value: "published", label: "Publié" },
  { value: "archived", label: "Archivé" },
];

export function ArticleEditorClient({ article, categories }: ArticleEditorClientProps) {
  const [editorContent, setEditorContent] = useState<TipTapContent | null>(
    article.content
  );
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const hiddenContentRef = useRef<HTMLInputElement>(null);

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (hiddenContentRef.current && editorContent) {
      hiddenContentRef.current.value = JSON.stringify(editorContent);
    }
    const formData = new FormData(formRef.current!);
    startTransition(() => updateArticleAction(formData));
  }

  return (
    <div className="space-y-6">
      <form ref={formRef} onSubmit={handleSave} className="space-y-6">
        <input type="hidden" name="id" value={article.id} />
        {/* Hidden field for TipTap JSON */}
        <input type="hidden" name="content_json" ref={hiddenContentRef} />

        {/* Title + Slug */}
        <div className="sf-card p-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-sf-gray-400">
              Titre
            </label>
            <input
              name="title"
              defaultValue={article.title}
              required
              className="w-full rounded-xl border border-sf-gray-200 px-4 py-2.5 text-lg font-bold text-sf-navy focus:border-sf-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-sf-gray-400">
              Slug
            </label>
            <input
              name="slug"
              defaultValue={article.slug}
              className="w-full rounded-xl border border-sf-gray-200 px-4 py-2 text-sm font-mono text-sf-gray-600 focus:border-sf-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-sf-gray-400">
              Extrait
            </label>
            <textarea
              name="excerpt"
              defaultValue={article.excerpt ?? ""}
              rows={2}
              className="w-full rounded-xl border border-sf-gray-200 px-4 py-2.5 text-sm text-sf-gray-600 focus:border-sf-blue focus:outline-none"
            />
          </div>
        </div>

        {/* TipTap editor */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-sf-gray-400">
            Contenu
          </label>
          <TipTapEditor
            initialContent={article.content}
            onChange={setEditorContent}
          />
        </div>

        {/* Sidebar metadata */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Status + Category */}
          <div className="sf-card space-y-4 p-6">
            <h3 className="text-sm font-bold text-sf-navy">Publication</h3>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-sf-gray-400">
                Statut
              </label>
              <select
                name="status"
                defaultValue={article.status}
                className="w-full rounded-xl border border-sf-gray-200 px-4 py-2.5 text-sm focus:border-sf-blue focus:outline-none"
              >
                {allowedStatuses.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-sf-gray-400">
                Catégorie
              </label>
              <select
                name="category_id"
                defaultValue={article.category_id ?? ""}
                className="w-full rounded-xl border border-sf-gray-200 px-4 py-2.5 text-sm focus:border-sf-blue focus:outline-none"
              >
                <option value="">— Aucune —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-sf-gray-400">
                Temps de lecture (min)
              </label>
              <input
                type="number"
                name="reading_time_minutes"
                defaultValue={article.reading_time_minutes ?? ""}
                min={1}
                className="w-full rounded-xl border border-sf-gray-200 px-4 py-2.5 text-sm focus:border-sf-blue focus:outline-none"
              />
            </div>
          </div>

          {/* SEO */}
          <div className="sf-card space-y-4 p-6">
            <h3 className="text-sm font-bold text-sf-navy">SEO</h3>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-sf-gray-400">
                Meta title
              </label>
              <input
                name="meta_title"
                defaultValue={article.meta_title ?? ""}
                className="w-full rounded-xl border border-sf-gray-200 px-4 py-2.5 text-sm focus:border-sf-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-sf-gray-400">
                Meta description
              </label>
              <textarea
                name="meta_description"
                defaultValue={article.meta_description ?? ""}
                rows={3}
                className="w-full rounded-xl border border-sf-gray-200 px-4 py-2.5 text-sm focus:border-sf-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-sf-gray-400">
                Image à la une (URL)
              </label>
              <input
                name="featured_image_url"
                defaultValue={article.featured_image_url ?? ""}
                className="w-full rounded-xl border border-sf-gray-200 px-4 py-2.5 text-sm focus:border-sf-blue focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Brief */}
        <div className="sf-card space-y-4 p-6">
          <h3 className="text-sm font-bold text-sf-navy">Brief de l&apos;article</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-sf-gray-400">
                Sujet
              </label>
              <input
                name="brief_subject"
                defaultValue={article.brief_subject ?? ""}
                className="w-full rounded-xl border border-sf-gray-200 px-4 py-2.5 text-sm focus:border-sf-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-sf-gray-400">
                Audience
              </label>
              <input
                name="brief_audience"
                defaultValue={article.brief_audience ?? ""}
                className="w-full rounded-xl border border-sf-gray-200 px-4 py-2.5 text-sm focus:border-sf-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-sf-gray-400">
                Message clé
              </label>
              <input
                name="brief_message"
                defaultValue={article.brief_message ?? ""}
                className="w-full rounded-xl border border-sf-gray-200 px-4 py-2.5 text-sm focus:border-sf-blue focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between">
          <RegenerateButton
            articleId={article.id}
            briefSubject={article.brief_subject ?? ""}
            briefAudience={article.brief_audience ?? ""}
            briefMessage={article.brief_message ?? ""}
            categoryId={article.category_id}
            onComplete={setEditorContent}
          />
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 rounded-full bg-sf-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-sf-blue-dark disabled:opacity-60"
          >
            {isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}
