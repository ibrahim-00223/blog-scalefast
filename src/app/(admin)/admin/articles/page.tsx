import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createArticleAction } from "../actions";
import { formatDate } from "@/lib/utils";

export default async function AdminArticlesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: categories }, { data: articles }] = await Promise.all([
    supabase.from("categories").select("id,name").order("name"),
    supabase
      .from("articles")
      .select("id,title,slug,status,published_at,created_at,category:categories(name)")
      .eq("author_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="sf-container py-12 space-y-8">
      <div className="sf-card p-6 md:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sf-blue">
              Admin
            </p>
            <h1 className="mt-2 text-3xl">Articles</h1>
          </div>
          <Link
            href="/admin"
            className="rounded-full border border-sf-gray-200 px-4 py-2 text-sm font-semibold text-sf-gray-600"
          >
            Retour
          </Link>
        </div>
      </div>

      <div className="sf-card p-6 md:p-8">
        <h2 className="text-2xl">Creer un article</h2>
        <form action={createArticleAction} className="mt-5 grid gap-4 md:grid-cols-2">
          <input
            name="title"
            required
            placeholder="Titre"
            className="rounded-xl border border-sf-gray-200 px-4 py-3 text-sm"
          />
          <select
            name="category_id"
            className="rounded-xl border border-sf-gray-200 px-4 py-3 text-sm"
            defaultValue=""
          >
            <option value="">Choisir une categorie</option>
            {(categories ?? []).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <textarea
            name="excerpt"
            placeholder="Extrait court"
            className="md:col-span-2 rounded-xl border border-sf-gray-200 px-4 py-3 text-sm min-h-24"
          />
          <button type="submit" className="sf-button-primary md:col-span-2 md:w-fit">
            Creer
          </button>
        </form>
      </div>

      <div className="sf-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-sf-gray-100 text-left text-sf-gray-600">
                <th className="px-4 py-3">Titre</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Categorie</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {(articles ?? []).map((article) => (
                <tr key={article.id} className="border-t border-sf-gray-200">
                  <td className="px-4 py-3 font-medium text-sf-navy">{article.title}</td>
                  <td className="px-4 py-3 uppercase text-xs tracking-[0.1em]">{article.status}</td>
                  <td className="px-4 py-3">{article.category?.name ?? "-"}</td>
                  <td className="px-4 py-3">
                    {article.published_at
                      ? formatDate(article.published_at)
                      : formatDate(article.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="text-sf-blue font-semibold"
                    >
                      Editer
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

