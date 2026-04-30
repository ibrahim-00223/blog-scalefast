"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LayoutDashboard, FileText, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/articles", label: "Articles", icon: FileText, exact: false },
];

// ─── Extracted sidebar content ─────────────────────────────────────────────────

interface SidebarContentProps {
  pathname: string;
  onNavClick: () => void;
  onSignOut: () => void;
}

function SidebarContent({ pathname, onNavClick, onSignOut }: SidebarContentProps) {
  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sf-gray-200 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sf-blue">
          <span className="text-xs font-bold text-white">S</span>
        </div>
        <span className="text-sm font-bold text-sf-navy">Scalefast</span>
        <span className="ml-auto rounded bg-sf-blue-light px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sf-blue">
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavClick}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-sf-blue text-white"
                  : "text-sf-gray-600 hover:bg-sf-gray-100 hover:text-sf-navy"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="border-t border-sf-gray-200 px-3 py-4">
        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sf-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={16} />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}

// ─── Main shell ────────────────────────────────────────────────────────────────

export function AdminShell() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function onSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-sf-gray-200 bg-white lg:block">
        <SidebarContent
          pathname={pathname}
          onNavClick={() => {}}
          onSignOut={onSignOut}
        />
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-sf-gray-200 bg-white px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sf-blue">
            <span className="text-xs font-bold text-white">S</span>
          </div>
          <span className="text-sm font-bold text-sf-navy">Scalefast Admin</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Ouvrir le menu"
          className="rounded-lg p-2 text-sf-gray-600 hover:bg-sf-gray-100"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-sf-gray-200 bg-white lg:hidden">
            <SidebarContent
              pathname={pathname}
              onNavClick={() => setMobileOpen(false)}
              onSignOut={onSignOut}
            />
          </aside>
        </>
      )}
    </>
  );
}
