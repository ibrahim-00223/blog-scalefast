import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Blog GTM B2B | Scalefast",
    template: "%s | Scalefast",
  },
  description:
    "Strategies GTM, outbound B2B, RevOps et outils SaaS pour les equipes go-to-market ambitieuses.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "https://scalefast.fr"),
  openGraph: {
    siteName: "Scalefast",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    site: "@scalefast",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-sf-blue focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Aller au contenu principal
        </a>
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
