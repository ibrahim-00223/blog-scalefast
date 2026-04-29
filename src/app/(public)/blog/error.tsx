"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service when available
    console.error("[Blog error]", error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="sf-card max-w-lg w-full p-10 text-center space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sf-blue">
          Une erreur s&apos;est produite
        </p>
        <h2 className="text-4xl">Oops, quelque chose a mal tourné</h2>
        <p className="text-sf-gray-600 leading-7">
          Nous n&apos;avons pas pu charger ce contenu. Réessayez ou revenez au
          blog.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={reset}
            className="sf-button-primary text-sm"
          >
            Réessayer
          </button>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-sf-gray-200 bg-white px-5 py-3 text-sm font-semibold text-sf-navy hover:border-sf-blue-mid hover:text-sf-blue"
          >
            Retour au blog
          </Link>
        </div>
      </div>
    </div>
  );
}
