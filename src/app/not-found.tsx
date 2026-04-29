import Link from "next/link";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";

export default function NotFound() {
  return (
    <div className="sf-shell flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-24">
        <div className="sf-card max-w-lg w-full p-10 text-center space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sf-blue">
            Erreur 404
          </p>
          <h1 className="text-5xl">Page introuvable</h1>
          <p className="text-sf-gray-600 leading-7">
            La page que vous cherchez n&apos;existe pas ou a été déplacée.
            Revenez au blog pour continuer votre lecture.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/blog" className="sf-button-primary text-sm">
              Retour au blog
            </Link>
            <Link
              href="/blog/search"
              className="inline-flex items-center gap-2 rounded-full border border-sf-gray-200 bg-white px-5 py-3 text-sm font-semibold text-sf-navy hover:border-sf-blue-mid hover:text-sf-blue"
            >
              Rechercher un article
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
