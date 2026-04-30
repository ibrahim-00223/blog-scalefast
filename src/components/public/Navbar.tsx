"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ArrowRight, Search } from "lucide-react";

const navLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/blog#categories", label: "Catégories" },
  { href: "/blog#about", label: "À propos" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/blog/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue("");
      setOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-sf-blue text-white">
      <div className="sf-container flex h-14 items-center gap-4">
        {/* Logo */}
        <Link href="/blog" className="flex shrink-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <svg viewBox="0 0 40 24" aria-hidden="true" className="h-5 w-auto" fill="none">
            <path d="M2 12h14l-4-4m4 4-4 4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M24 12h14l-4-4m4 4-4 4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[15px] font-bold tracking-[-0.03em]">ScaleFast</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center gap-6 md:flex" aria-label="Navigation principale">
          {navLinks.map(({ href, label }) => {
            const isActive = href === "/blog"
              ? pathname === "/blog"
              : pathname.startsWith(href.replace(/#.*/, ""));
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className="text-[13px] font-medium text-white/75 transition hover:text-white aria-[current=page]:text-white aria-[current=page]:underline aria-[current=page]:underline-offset-4"
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="hidden items-center md:flex">
          <div className="flex h-8 items-center gap-2 rounded-full border border-white/20 bg-white/10 pl-3 pr-1 text-sm transition focus-within:bg-white/20">
            <Search size={13} className="text-white/60" />
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Rechercher…"
              className="w-32 bg-transparent text-[13px] text-white placeholder:text-white/50 focus:outline-none focus:w-44 transition-all duration-200"
            />
          </div>
        </form>

        {/* Desktop CTA */}
        <a
          href="mailto:hello@scalefast.fr?subject=Discovery%20Call"
          className="hidden items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-[13px] font-semibold text-white transition hover:bg-white hover:text-sf-blue md:flex"
        >
          Discovery Call <ArrowRight size={12} />
        </a>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-white/80 hover:text-white md:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-white/10 bg-sf-blue pb-5 md:hidden">
          {/* Mobile search */}
          <form onSubmit={handleSearch} className="sf-container pt-3">
            <div className="flex h-9 items-center gap-2 rounded-full border border-white/20 bg-white/10 pl-4 pr-2">
              <Search size={14} className="shrink-0 text-white/60" />
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Rechercher un article…"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
              />
            </div>
          </form>
          <nav className="sf-container mt-2 flex flex-col gap-1">
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
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-sf-blue"
            >
              Réserver un discovery call <ArrowRight size={14} />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
