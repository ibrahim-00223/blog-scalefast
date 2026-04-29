import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="sf-container flex min-h-screen items-center justify-center py-16">
      <div className="sf-card w-full max-w-md p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sf-blue">Login</p>
        <h1 className="mt-4 text-3xl">Connexion admin</h1>
        <p className="mt-3 text-sm leading-6 text-sf-gray-600">Le middleware protege deja /admin. Le formulaire Supabase arrive en phase admin.</p>
        <div className="mt-6"><Link href="/blog" className="sf-button-primary">Retour au blog</Link></div>
      </div>
    </div>
  );
}

