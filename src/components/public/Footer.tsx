import Link from "next/link";

export function Footer() {
  return (
    <footer id="about" className="mt-20 bg-sf-navy py-12 text-white">
      <div className="sf-container flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/65">Scalefast</p>
          <p className="text-2xl font-extrabold tracking-[-0.04em]">GTM Team as a Service pour les equipes B2B.</p>
          <p className="text-sm text-white/70">Analyses, playbooks et systemes d execution pour aligner croissance, sales et operations.</p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-white/70">
          <Link href="/blog" className="hover:text-white">Blog</Link>
          <a href="mailto:hello@scalefast.fr" className="hover:text-white">Contact</a>
          <a href="/admin" className="hover:text-white">Admin</a>
          <p className="pt-3 text-xs text-white/45">© {new Date().getFullYear()} Scalefast. Tous droits reserves.</p>
        </div>
      </div>
    </footer>
  );
}

