import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer id="about" className="mt-24 bg-sf-navy text-white">
      {/* Lead capture band */}
      <div className="border-b border-white/10">
        <div className="sf-container py-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Discovery Call
              </p>
              <h2 className="text-2xl font-extrabold leading-tight tracking-tight md:text-3xl">
                Vous scaler votre machine GTM ?
              </h2>
              <p className="text-sm leading-7 text-white/65">
                On cadre vos priorités revenue et on pose un plan d&apos;exécution concret — en 45 minutes.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="mailto:hello@scalefast.fr?subject=Discovery%20Call"
                className="flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-sf-blue transition hover:bg-sf-blue-light"
              >
                Réserver un appel <ArrowRight size={15} />
              </a>
              <a
                href="mailto:hello@scalefast.fr"
                className="flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
              >
                <Mail size={14} />
                hello@scalefast.fr
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer links */}
      <div className="sf-container flex flex-col gap-8 py-10 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 40 24" aria-hidden="true" className="h-4 w-auto" fill="none">
              <path d="M2 12h14l-4-4m4 4-4 4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M24 12h14l-4-4m4 4-4 4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-bold tracking-tight">ScaleFast</span>
          </div>
          <p className="text-xs text-white/45">GTM Team as a Service pour les équipes B2B.</p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/60">
          <Link href="/blog" className="transition hover:text-white">Blog</Link>
          <Link href="/blog#categories" className="transition hover:text-white">Catégories</Link>
          <a href="mailto:hello@scalefast.fr" className="transition hover:text-white">Contact</a>
          <Link href="/admin" className="transition hover:text-white">Admin</Link>
          <span className="text-white/30">© {new Date().getFullYear()} Scalefast</span>
        </div>
      </div>
    </footer>
  );
}
