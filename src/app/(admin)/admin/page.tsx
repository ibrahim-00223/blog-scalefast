import { redirect } from "next/navigation";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/client";
import { SignOutButton } from "./SignOutButton";

export default async function AdminPage() {
  if (!hasSupabaseEnv()) {
    return (
      <div className="sf-container py-20">
        <div className="sf-card max-w-3xl p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sf-blue">
            Admin
          </p>
          <h1 className="mt-4 text-4xl">Configuration Supabase requise</h1>
          <p className="mt-4 max-w-2xl text-sf-gray-600">
            Renseigne `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`
            dans `.env.local`, puis redemarre le serveur.
          </p>
        </div>
      </div>
    );
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="sf-container py-20">
      <div className="sf-card max-w-3xl p-8">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sf-blue">
            Admin
          </p>
          <SignOutButton />
        </div>
        <h1 className="mt-4 text-4xl">Bienvenue dans l espace admin</h1>
        <p className="mt-4 max-w-2xl text-sf-gray-600">
          Session active: <span className="font-semibold">{user.email}</span>
        </p>
      </div>
    </div>
  );
}
