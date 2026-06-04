import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Image as ImageIcon, Map } from "lucide-react";

export const Route = createFileRoute("/publicar/")({ component: Page });

function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-2xl font-bold mb-6">O que você quer criar?</h1>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link to="/publicar/post" className="group rounded-3xl border-2 border-dashed bg-card p-10 text-center hover:border-[color:var(--brand-red)] hover:bg-[color:var(--brand-red)]/5 transition">
            <div className="mx-auto size-16 rounded-full bg-[color:var(--brand-red)]/10 flex items-center justify-center text-[color:var(--brand-red)] mb-3">
              <ImageIcon className="size-7" />
            </div>
            <div className="font-semibold">Criar nova publicação</div>
            <p className="text-xs text-muted-foreground mt-1">Compartilhe uma foto da viagem</p>
          </Link>
          <Link to="/publicar/roteiro" className="group rounded-3xl border-2 border-dashed bg-card p-10 text-center hover:border-[color:var(--brand-red)] hover:bg-[color:var(--brand-red)]/5 transition">
            <div className="mx-auto size-16 rounded-full bg-[color:var(--brand-red)]/10 flex items-center justify-center text-[color:var(--brand-red)] mb-3">
              <Map className="size-7" />
            </div>
            <div className="font-semibold">Criar novo roteiro</div>
            <p className="text-xs text-muted-foreground mt-1">Monte uma jornada por etapas</p>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
