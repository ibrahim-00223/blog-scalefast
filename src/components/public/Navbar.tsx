import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/15 bg-sf-blue text-white backdrop-blur">
      <div className="sf-container flex h-[52px] items-center justify-between gap-4">
        <Link href="/blog" className="flex items-center gap-2 text-sm font-bold">
          <svg viewBox="0 0 40 24" aria-hidden="true" className="h-5 w-auto" fill="none">
            <path d="M2 12h14l-4-4m4 4-4 4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M24 12h14l-4-4m4 4-4 4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[15px] font-bold tracking-[-0.03em]">ScaleFast</span>
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          <Link href="/blog" className="text-[13px] font-medium text-white/90 hover:text-white">Blog</Link>
          <Link href="/blog#categories" className="text-[13px] font-medium text-white/90 hover:text-white">Categories</Link>
          <Link href="/blog#about" className="text-[13px] font-medium text-white/90 hover:text-white">A propos</Link>
        </nav>
        <a href="mailto:hello@scalefast.fr?subject=Discovery%20Call" className="sf-button-ghost text-[13px]">Discovery Call</a>
      </div>
    </header>
  );
}

