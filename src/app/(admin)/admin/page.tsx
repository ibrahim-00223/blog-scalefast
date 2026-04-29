export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/client";

export default async function AdminPage() {
  if (!hasSupabaseEnv()) redirect("/login");

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  redirect("/admin/articles");
}
