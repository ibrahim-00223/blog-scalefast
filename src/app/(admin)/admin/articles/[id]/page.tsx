import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  generateArticleForExistingDraftAction,
  updateArticleAction,
} from "../../actions";

type Props = {
  params: Promise<{ id: string }>;
};

const statuses = ["idea", "plan", "review", "scheduled", "published", "archived"];

export default async function AdminArticleEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: categories }, { data: article }] = await Promise.all([
    supabase.from("categories").select("id,name").order("name"),
    supabase.from("articles").select("*").eq("id", id).eq("author_id", user.id).single(),
  ]);

  if (!article) notFound();

  const bodyText =
    article.content?.content?.[0]?.content?.[0]?.text ??
    article.excerpt ??
    "";

  return (
    <div className="sf-container py-12">
      <div className="sf-card p-6 md:p-8">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl">Editer l article</h1>
          <Link
            href="/admin/articles"
            className="rounded-full border border-sf-gray-200 px-4 py-2 text-sm font-semibold text-sf-gray-600"
          >
            Retour liste
          </Link>
        </div>

        <form action={updateArticleAction} className="mt-6 grid gap-4 md:grid-cols-2">
          <input type="hidden" name="id" value={article.id} />

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-sf-navy">Titre</label>
            <input
              name="title"
              defaultValue={article.title}
              required
              className="w-full rounded-xl border border-sf-gray-200 px-4 py-3 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-sf-navy">
              1. De quoi veux-tu parler ?
            </label>
            <textarea
              name="brief_subject"
              defaultValue={article.brief_subject ?? ""}
              className="w-full rounded-xl border border-sf-gray-200 px-4 py-3 text-sm min-h-24"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-sf-navy">
              2. A qui veux-tu parler ?
            </label>
            <textarea
              name="brief_audience"
              defaultValue={article.brief_audience ?? ""}
              className="w-full rounded-xl border border-sf-gray-200 px-4 py-3 text-sm min-h-24"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-sf-navy">
              3. Quelle valeur veux-tu partager ?
            </label>
            <textarea
              name="brief_message"
              defaultValue={article.brief_message ?? ""}
              className="w-full rounded-xl border border-sf-gray-200 px-4 py-3 text-sm min-h-28"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-sf-navy">Slug</label>
            <input
              name="slug"
              defaultValue={article.slug}
              className="w-full rounded-xl border border-sf-gray-200 px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-sf-navy">Statut</label>
            <select
              name="status"
              defaultValue={article.status}
              className="w-full rounded-xl border border-sf-gray-200 px-4 py-3 text-sm"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-sf-navy">Categorie</label>
            <select
              name="category_id"
              defaultValue={article.category_id ?? ""}
              className="w-full rounded-xl border border-sf-gray-200 px-4 py-3 text-sm"
            >
              <option value="">Aucune</option>
              {(categories ?? []).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-sf-navy">
              Temps de lecture (min)
            </label>
            <input
              type="number"
              min={1}
              name="reading_time_minutes"
              defaultValue={article.reading_time_minutes ?? ""}
              className="w-full rounded-xl border border-sf-gray-200 px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-sf-navy">Image URL</label>
            <input
              name="featured_image_url"
              defaultValue={article.featured_image_url ?? ""}
              className="w-full rounded-xl border border-sf-gray-200 px-4 py-3 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-sf-navy">Extrait</label>
            <textarea
              name="excerpt"
              defaultValue={article.excerpt ?? ""}
              className="w-full rounded-xl border border-sf-gray-200 px-4 py-3 text-sm min-h-24"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-sf-navy">Contenu brut</label>
            <textarea
              name="body_text"
              defaultValue={bodyText}
              className="w-full rounded-xl border border-sf-gray-200 px-4 py-3 text-sm min-h-52"
            />
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-3">
            <button type="submit" className="sf-button-primary md:w-fit">
              Enregistrer
            </button>
            <button
              type="submit"
              formAction={generateArticleForExistingDraftAction}
              className="inline-flex items-center justify-center rounded-full border border-sf-blue bg-white px-5 py-3 text-sm font-semibold text-sf-blue hover:bg-sf-blue-light"
            >
              Regenerer avec IA
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
