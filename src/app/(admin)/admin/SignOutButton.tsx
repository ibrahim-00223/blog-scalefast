"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  async function onSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onSignOut}
      className="rounded-full border border-sf-gray-200 px-4 py-2 text-sm font-semibold text-sf-gray-600 hover:border-sf-blue-mid hover:text-sf-blue"
    >
      Se deconnecter
    </button>
  );
}

