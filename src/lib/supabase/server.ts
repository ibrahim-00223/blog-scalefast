import { createServerClient, createBrowserClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { hasSupabaseEnv } from "./client";

/**
 * Cookie-free Supabase client — safe to call in generateStaticParams (build time)
 * and anywhere there is no HTTP request context.
 * Use this for read-only public data (articles, categories).
 */
export function createStaticClient() {
  if (!hasSupabaseEnv()) {
    throw new Error("Supabase environment variables are not configured.");
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Cookie-aware Supabase client — requires an HTTP request context.
 * Use this in Server Components, Server Actions, and Route Handlers
 * where you need to read/write the user session.
 */
export async function createClient() {
  if (!hasSupabaseEnv()) {
    throw new Error("Supabase environment variables are not configured.");
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server component - cookies are read-only
          }
        },
      },
    }
  );
}
