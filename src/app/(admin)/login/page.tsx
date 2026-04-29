import Link from "next/link";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="sf-container flex min-h-screen items-center justify-center py-16">
      <div className="sf-card w-full max-w-md p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sf-blue">Login</p>
        <h1 className="mt-4 text-3xl">Connexion admin</h1>
        <p className="mt-3 text-sm leading-6 text-sf-gray-600">
          Connecte-toi avec un compte utilisateur present dans Supabase Auth.
        </p>
        <LoginForm />
        <div className="mt-6">
          <Link href="/blog" className="inline-flex text-sm font-semibold text-sf-blue hover:text-sf-blue-dark">
            Retour au blog
          </Link>
        </div>
      </div>
    </div>
  );
}
