import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Mail, Lock } from "lucide-react";

export const Route = createFileRoute("/login")({ component: Page });

function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[color:var(--brand-mint)] p-4">
      <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-xl border">
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground">Bem vindo de volta!</p>
          <div className="mt-2 flex justify-center"><Logo size="lg" /></div>
        </div>
        <form className="space-y-4">
          <Field icon={Mail} placeholder="Insira o seu e-mail" type="email" />
          <Field icon={Lock} placeholder="Insira sua senha" type="password" />
          <button type="button" className="w-full rounded-full bg-[color:var(--brand-red)] py-3 text-sm font-semibold text-white hover:opacity-95">ENTRAR</button>
          <div className="flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" /> ou <div className="h-px flex-1 bg-border" /></div>
          <button type="button" className="w-full rounded-full border bg-card py-3 text-sm font-semibold hover:bg-muted flex items-center justify-center gap-2">
            <img src="https://www.google.com/favicon.ico" className="size-4" alt="" /> CONTINUE COM O GOOGLE
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Não tem conta? <Link to="/cadastro" className="font-semibold text-[color:var(--brand-red)]">Cadastre-se já!</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ icon: Icon, ...props }: any) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <input {...props} className="w-full rounded-full border bg-card pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-red)]/30" />
    </div>
  );
}
