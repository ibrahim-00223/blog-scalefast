import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createArticleAction } from "../actions";
import { formatDate } from "@/lib/utils";

type ArticleRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  published_at: string | null;
  created_at: string;
  category: { name: string } | { name: string }[] | null;
};

function getCategoryName(category: ArticleRow["category"]) {
  if (!category) return "-";
  if (Array.isArray(category)) return category[0]?.name ?? "-";
  return category.name ?? "-";
}

function getStatusClasses(status: string) {
  switch (status) {
    case "published":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "review":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "scheduled":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "archived":
      return "bg-slate-100 text-slate-600 border-slate-200";
    default:
      return "bg-sf-blue-light text-sf-blue border-[#cdd7ff]";
  }
}

export default async function AdminArticlesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: categories }, { data: rawArticles }] = await Promise.all([
    supabase.from("categories").select("id,name").order("name"),
    supabase
      .from("articles")
      .select("id,title,slug,status,published_at,created_at,category:categories(name)")
      .eq("author_id", user.id)
      .order("created_at", { ascending: false }),
  ]);
  const articles = (rawArticles ?? []) as ArticleRow[];
  const publishedCount = articles.filter((article) => article.status === "published").length;
  const draftCount = articles.length - publishedCount;

  return (
    <div className="sf-container py-12 space-y-8">
      <section className="sf-card overflow-hidden">
        <div className="border-b border-sf-gray-200 bg-[linear-gradient(135deg,rgba(59,91,219,0.08),rgba(116,143,252,0.02))] p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sf-blue">
                Admin
              </p>
              <h1 className="mt-2 text-4xl">Editorial cockpit</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-sf-gray-600 md:text-base">
                Cree, classe et publie les articles du blog depuis une interface
                plus propre et plus utile.
              </p>
            </div>
            <Link
              href="/admin"
              className="rounded-full border border-sf-gray-200 bg-white px-4 py-2 text-sm font-semibold text-sf-gray-600 shadow-sm"
            >
              Retour
            </Link>
          </div>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-3 md:p-8">
          <div className="rounded-2xl border border-sf-gray-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sf-gray-400">
              Total articles
            </p>
            <p className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-sf-navy">
              {articles.length}
            </p>
          </div>
          <div className="rounded-2xl border border-sf-gray-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sf-gray-400">
              Publies
            </p>
            <p className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-sf-navy">
              {publishedCount}
            </p>
          </div>
          <div className="rounded-2xl border border-sf-gray-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sf-gray-400">
              Brouillons
            </p>
            <p className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-sf-navy">
              {draftCount}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
        <div className="sf-card p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sf-blue">
            Creation rapide
          </p>
          <h2 className="mt-2 text-3xl">Nouveau brouillon</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-sf-gray-600">
            Le brief de depart repose sur tes 3 questions. On transforme ensuite
            ce brief en brouillon editable.
          </p>

          <form action={createArticleAction} className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-sf-navy">
                1. De quoi veux-tu parler ?
              </label>
              <textarea
                name="brief_subject"
                required
                placeholder="Ex. cold email, pipeline GTM, discovery call, IA SDR..."
                className="min-h-28 w-full rounded-xl border border-sf-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-sf-blue-mid"
              />
              <p className="mt-2 text-xs leading-6 text-sf-gray-400">
                Sert a identifier le sujet et a generer les mots-cles associes.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-sf-navy">
                2. A qui veux-tu parler ?
              </label>
              <textarea
                name="brief_audience"
                required
                placeholder="Ex. SDR managers en SaaS B2B, fondateurs early-stage, RevOps..."
                className="min-h-28 w-full rounded-xl border border-sf-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-sf-blue-mid"
              />
              <p className="mt-2 text-xs leading-6 text-sf-gray-400">
                Sert a identifier la cible et adapter le ton, les exemples et le niveau.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-sf-navy">
                3. Quelle valeur veux-tu partager ?
              </label>
              <textarea
                name="brief_message"
                required
                placeholder="Ex. un framework, une analyse, une methode, un retour d experience..."
                className="min-h-32 w-full rounded-xl border border-sf-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-sf-blue-mid"
              />
              <p className="mt-2 text-xs leading-6 text-sf-gray-400">
                Sert a capturer la valeur transmise dans l article.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-sf-navy">Categorie</label>
              <select
                name="category_id"
                className="w-full rounded-xl border border-sf-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-sf-blue-mid"
                defaultValue=""
              >
                <option value="">Choisir une categorie</option>
                {(categories ?? []).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="sf-button-primary">
                Creer le brouillon
              </button>
            </div>
          </form>
        </div>

        <aside className="sf-card p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sf-blue">
            Workflow
          </p>
          <h2 className="mt-2 text-3xl">Mode d emploi</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-sf-gray-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sf-gray-400">
                01
              </p>
              <p className="mt-2 font-semibold text-sf-navy">Creer</p>
              <p className="mt-1 text-sm leading-6 text-sf-gray-600">
                Commence avec sujet, audience et valeur. Le brouillon se structure a partir de ca.
              </p>
            </div>
            <div className="rounded-2xl border border-sf-gray-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sf-gray-400">
                02
              </p>
              <p className="mt-2 font-semibold text-sf-navy">Editer</p>
              <p className="mt-1 text-sm leading-6 text-sf-gray-600">
                Complete le contenu, le slug, l image et les metas.
              </p>
            </div>
            <div className="rounded-2xl border border-sf-gray-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sf-gray-400">
                03
              </p>
              <p className="mt-2 font-semibold text-sf-navy">Publier</p>
              <p className="mt-1 text-sm leading-6 text-sf-gray-600">
                Passe le statut a <span className="font-semibold">published</span>
                pour rendre l article visible sur le front public.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <section className="sf-card overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-sf-gray-200 px-6 py-5 md:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sf-blue">
              Bibliotheque
            </p>
            <h2 className="mt-1 text-2xl">Articles existants</h2>
          </div>
          <p className="text-sm text-sf-gray-600">{articles.length} article(s)</p>
        </div>

        {articles.length === 0 ? (
          <div className="px-6 py-14 md:px-8">
            <div className="rounded-[24px] border border-dashed border-sf-gray-200 bg-sf-gray-100/70 p-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sf-blue">
                Empty state
              </p>
              <h3 className="mt-3 text-3xl">Aucun article pour l instant</h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-sf-gray-600">
                Cree ton premier brouillon avec le formulaire ci-dessus. Il
                apparaitra ici avec son statut et son lien d edition.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto px-3 pb-3 md:px-5 md:pb-5">
            <table className="min-w-full border-separate border-spacing-y-3 text-sm">
              <thead>
                <tr className="text-left text-sf-gray-600">
                  <th className="px-4 py-3">Titre</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Categorie</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="bg-white shadow-[0_10px_24px_rgba(26,31,60,0.05)]">
                    <td className="rounded-l-2xl border-y border-l border-sf-gray-200 px-4 py-4">
                      <div className="font-semibold text-sf-navy">{article.title}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.14em] text-sf-gray-400">
                        {article.slug}
                      </div>
                    </td>
                    <td className="border-y border-sf-gray-200 px-4 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${getStatusClasses(article.status)}`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="border-y border-sf-gray-200 px-4 py-4 text-sf-gray-600">
                      {getCategoryName(article.category)}
                    </td>
                    <td className="border-y border-sf-gray-200 px-4 py-4 text-sf-gray-600">
                      {article.published_at
                        ? formatDate(article.published_at)
                        : formatDate(article.created_at)}
                    </td>
                    <td className="rounded-r-2xl border-y border-r border-sf-gray-200 px-4 py-4">
                      <Link
                        href={`/admin/articles/${article.id}`}
                        className="inline-flex rounded-full border border-sf-gray-200 px-4 py-2 text-sm font-semibold text-sf-blue hover:border-sf-blue-mid"
                      >
                        Editer
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
