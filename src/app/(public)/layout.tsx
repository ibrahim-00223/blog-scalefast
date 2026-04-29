import type { ReactNode } from "react";
import { Footer } from "@/components/public/Footer";
import { Navbar } from "@/components/public/Navbar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="sf-shell flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

