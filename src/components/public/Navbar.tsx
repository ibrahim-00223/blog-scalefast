"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/blog#categories", label: "Catégories" },
  { href: "/blog#about", label: "À propos" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-sf-blue text-white backdrop-blur-sm">
      <div className="sf-container flex h-14 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/blog" className="flex items-center gap-2.5 shrink-0" onClick={() => setOpen(false)}>
          <svg viewBox="0 0 40 24" aria-hidden="true" className="h-5 w-auto" fill="none">
            <path d="M2 12h14l-4-4m4 4-4 4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M24 12h14l-4-4m4 4-4 4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[15px] font-bold tracking-[-0.03em]">ScaleFast</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Navigation principale">
          {navLinks.map(({ href, label }) => {
            const isActive = href === "/blog"
              ? pathname === "/blog"
              : pathname.startsWith(href.replace(/#.*/, ""));
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className="text-[13px] font-medium text-white/80 transition hover:text-white aria-[current=page]:text-white aria-[current=page]:underline aria-[current=page]:underline-offset-4"
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center md:flex">
          <a
            href="mailto:hello@scalefast.fr?subject=Discovery%20Call"
            className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-[13px] font-semibold text-white transition hover:bg-white hover:text-sf-blue"
          >
            Discovery Call <ArrowRight size={13} />
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/80 hover:text-white md:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-white/10 bg-sf-blue pb-5 md:hidden">
          <nav className="sf-container flex flex-col gap-1 pt-3">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
              >
                {label}
              </Link>
            ))}
            <a
              href="mailto:hello@scalefast.fr?subject=Discovery%20Call"
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-sf-blue"
            >
              Réserver un discovery call <ArrowRight size={14} />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
