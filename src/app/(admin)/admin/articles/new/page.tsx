export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewArticleWizard } from "@/components/admin/NewArticleWizard";

export default async function NewArticlePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: categories } = await supabase
    .from("categories")
    .select("id,name,slug,description")
    .order("name");

  return (
    <div className="sf-container py-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-sf-blue">
          Nouvel article
        </p>
        <h1 className="mt-1 text-2xl font-extrabold text-sf-navy">
          Créer avec l&apos;IA
        </h1>
        <p className="mt-1 text-sm text-sf-gray-600">
          Réponds à 3 questions — le pipeline multi-agents rédige ton article.
        </p>
      </div>

      <NewArticleWizard
        categories={(categories ?? []).map((c) => ({
          id: c.id as string,
          name: c.name as string,
          slug: c.slug as string,
          description: (c.description as string | null) ?? null,
        }))}
      />
    </div>
  );
}
