"use client";

import { useRef, useState, useTransition } from "react";
import { TipTapEditor } from "@/components/admin/TipTapEditor";
import { RegenerateButton } from "@/components/admin/RegenerateButton";
import { updateArticleAction } from "@/app/(admin)/admin/actions";
import type { TipTapContent, ArticleStatus, Category } from "@/types";
import { Save, Loader2, CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";

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

const allowedStatuses: { value: ArticleStatus; label: string; color: string }[] = [
  { value: "idea", label: "Idée", color: "text-sf-gray-400" },
  { value: "plan", label: "En plan", color: "text-amber-600" },
  { value: "review", label: "En review", color: "text-violet-600" },
  { value: "scheduled", label: "Planifié", color: "text-sf-blue" },
  { value: "published", label: "Publié", color: "text-emerald-600" },
  { value: "archived", label: "Archivé", color: "text-sf-gray-400" },
];

export function ArticleEditorClient({ article, categories }: ArticleEditorClientProps) {
  const [editorContent, setEditorContent] = useState<TipTapContent | null>(article.content);
  const [isPending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const hiddenContentRef = useRef<HTMLInputElement>(null);

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (hiddenContentRef.current && editorContent) {
      hiddenContentRef.current.value = JSON.stringify(editorContent);
    }
    const formData = new FormData(formRef.current!);
    startTransition(async () => {
      await updateArticleAction(formData);
      setSavedAt(new Date());
    });
  }

  const publicUrl = `/blog/${article.slug}`;

  return (
    <form ref={formRef} onSubmit={handleSave}>
      <input type="hidden" name="id" value={article.id} />
      <input type="hidden" name="content_json" ref={hiddenContentRef} />

      {/* ── Sticky top bar ─────────────────────────────────────── */}
      <div className="sticky top-0 z-20 -mx-6 -mt-6 mb-6 flex items-center justify-between border-b border-sf-gray-200 bg-white/95 px-6 py-3 backdrop-blur-sm lg:-mx-8 lg:px-8">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="text-xs font-semibold text-sf-gray-400 hover:text-sf-navy"
          >
            ← Articles
          </Link>
          <span className="text-sf-gray-200">/</span>
          <span className="max-w-[200px] truncate text-sm font-semibold text-sf-navy">
            {article.title}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {savedAt && !isPending && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-600">
              <CheckCircle2 size={13} />
              Enregistré
            </span>
          )}
          {article.status === "published" && (
            <Link
              href={publicUrl}
              target="_blank"
              className="flex items-center gap-1.5 rounded-full border border-sf-gray-200 px-3 py-1.5 text-xs font-semibold text-sf-gray-400 hover:border-sf-blue hover:text-sf-blue"
            >
              <ExternalLink size={12} />
              Voir
            </Link>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 rounded-full bg-sf-blue px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sf-blue-dark disabled:opacity-60"
          >
            {isPending ? (
              <><Loader2 size={14} className="animate-spin" /> Enregistrement…</>
            ) : (
              <><Save size={14} /> Enregistrer</>
            )}
          </button>
        </div>
      </div>

      {/* ── Main layout: editor (left) + sidebar (right) ─────── */}
      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">

        {/* Left column — content */}
        <div className="space-y-5">
          {/* Title */}
          <div className="sf-card p-6">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-sf-gray-400">
              Titre
            </label>
            <input
              name="title"
              defaultValue={article.title}
              required
              placeholder="Titre de l'article…"
              className="w-full rounded-xl border border-sf-gray-200 px-4 py-3 text-xl font-bold text-sf-navy placeholder:font-normal placeholder:text-sf-gray-400 focus:border-sf-blue focus:outline-none"
            />
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-sf-gray-400">
                  Slug
                </label>
                <div className="flex items-center rounded-xl border border-sf-gray-200 focus-within:border-sf-blue">
                  <span className="select-none pl-3 text-xs text-sf-gray-400">/blog/</span>
                  <input
                    name="slug"
                    defaultValue={article.slug}
                    className="flex-1 rounded-r-xl bg-transparent py-2 pr-4 text-sm font-mono text-sf-gray-600 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-sf-gray-400">
                  Extrait
                </label>
                <input
                  name="excerpt"
                  defaultValue={article.excerpt ?? ""}
                  placeholder="Résumé court…"
                  className="w-full rounded-xl border border-sf-gray-200 px-4 py-2 text-sm text-sf-gray-600 placeholder:text-sf-gray-400 focus:border-sf-blue focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* TipTap editor */}
          <div className="sf-card p-0 overflow-hidden">
            <div className="border-b border-sf-gray-200 bg-sf-gray-100 px-5 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-sf-gray-400">Contenu</p>
            </div>
            <div className="p-4">
              <TipTapEditor
                initialContent={article.content}
                onChange={setEditorContent}
              />
            </div>
          </div>

          {/* Brief */}
          <div className="sf-card p-6">
            <h3 className="mb-4 text-sm font-bold text-sf-navy">Brief de l&apos;article</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-sf-gray-400">
                  Sujet
                </label>
                <input
                  name="brief_subject"
                  defaultValue={article.brief_subject ?? ""}
                  placeholder="Thème principal…"
                  className="w-full rounded-xl border border-sf-gray-200 px-4 py-2.5 text-sm placeholder:text-sf-gray-400 focus:border-sf-blue focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-sf-gray-400">
                  Audience
                </label>
                <input
                  name="brief_audience"
                  defaultValue={article.brief_audience ?? ""}
                  placeholder="Lecteur cible…"
                  className="w-full rounded-xl border border-sf-gray-200 px-4 py-2.5 text-sm placeholder:text-sf-gray-400 focus:border-sf-blue focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-sf-gray-400">
                  Message clé
                </label>
                <input
                  name="brief_message"
                  defaultValue={article.brief_message ?? ""}
                  placeholder="Idée principale…"
                  className="w-full rounded-xl border border-sf-gray-200 px-4 py-2.5 text-sm placeholder:text-sf-gray-400 focus:border-sf-blue focus:outline-none"
                />
              </div>
            </div>
            {/* Regenerate button sits under the brief */}
            <div className="mt-5 border-t border-sf-gray-200 pt-5">
              <RegenerateButton
                articleId={article.id}
                briefSubject={article.brief_subject ?? ""}
                briefAudience={article.brief_audience ?? ""}
                briefMessage={article.brief_message ?? ""}
                categoryId={article.category_id}
                onComplete={setEditorContent}
              />
            </div>
          </div>
        </div>

        {/* Right column — sidebar */}
        <div className="space-y-5">
          {/* Publication */}
          <div className="sf-card p-5">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-sf-gray-400">Publication</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-sf-gray-400">Statut</label>
                <select
                  name="status"
                  defaultValue={article.status}
                  className="w-full rounded-xl border border-sf-gray-200 px-3 py-2.5 text-sm font-semibold focus:border-sf-blue focus:outline-none"
                >
                  {allowedStatuses.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-sf-gray-400">Catégorie</label>
                <select
                  name="category_id"
                  defaultValue={article.category_id ?? ""}
                  className="w-full rounded-xl border border-sf-gray-200 px-3 py-2.5 text-sm focus:border-sf-blue focus:outline-none"
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
                <label className="mb-1 block text-xs font-semibold text-sf-gray-400">
                  Temps de lecture (min)
                </label>
                <input
                  type="number"
                  name="reading_time_minutes"
                  defaultValue={article.reading_time_minutes ?? ""}
                  min={1}
                  placeholder="5"
                  className="w-full rounded-xl border border-sf-gray-200 px-3 py-2.5 text-sm focus:border-sf-blue focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="sf-card p-5">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-sf-gray-400">SEO</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-sf-gray-400">Meta title</label>
                <input
                  name="meta_title"
                  defaultValue={article.meta_title ?? ""}
                  placeholder="Titre pour Google…"
                  className="w-full rounded-xl border border-sf-gray-200 px-3 py-2.5 text-sm placeholder:text-sf-gray-400 focus:border-sf-blue focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-sf-gray-400">Meta description</label>
                <textarea
                  name="meta_description"
                  defaultValue={article.meta_description ?? ""}
                  rows={3}
                  placeholder="Description pour Google (≤ 160 car.)…"
                  className="w-full resize-none rounded-xl border border-sf-gray-200 px-3 py-2.5 text-sm placeholder:text-sf-gray-400 focus:border-sf-blue focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-sf-gray-400">Image à la une</label>
                <input
                  name="featured_image_url"
                  defaultValue={article.featured_image_url ?? ""}
                  placeholder="https://…"
                  className="w-full rounded-xl border border-sf-gray-200 px-3 py-2.5 text-sm font-mono text-sf-gray-600 placeholder:font-sans placeholder:text-sf-gray-400 focus:border-sf-blue focus:outline-none"
                />
                {article.featured_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.featured_image_url}
                    alt=""
                    className="mt-2 w-full rounded-xl object-cover"
                    style={{ maxHeight: 120 }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
