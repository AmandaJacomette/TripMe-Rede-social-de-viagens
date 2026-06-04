import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { routes } from "@/lib/mock";
import { Calendar, Heart, MapPin } from "lucide-react";

export const Route = createFileRoute("/roteiros/")({ component: Page });

function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h1 className="font-display text-2xl font-bold">Roteiros</h1>
            <p className="text-sm text-muted-foreground">Inspire-se em jornadas montadas pela comunidade</p>
          </div>
          <Link to="/publicar/roteiro" className="rounded-full bg-[color:var(--brand-red)] px-4 py-2 text-sm font-semibold text-white">+ Novo roteiro</Link>
        </div>

        <div className="mb-6 overflow-hidden rounded-2xl border bg-card">
          <div className="h-40 bg-gradient-to-br from-[color:var(--brand-green)]/40 to-[color:var(--brand-blue)]/60 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="mx-auto size-8 text-[color:var(--brand-red)]" />
              <p className="text-xs text-muted-foreground mt-1">Mapa interativo (preview)</p>
            </div>
          </div>
        </div>

        <h2 className="font-display text-lg font-bold mb-3">Você curte um desses?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {routes.map((r) => (
            <Link key={r.id} to="/roteiros/$id" params={{ id: r.id }} className="group overflow-hidden rounded-2xl border bg-card shadow-sm hover:shadow-md transition">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={r.cover} className="size-full object-cover group-hover:scale-105 transition" alt="" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{r.title}</h3>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="size-3" />{r.days} dias</span>
                  <span className="flex items-center gap-1"><MapPin className="size-3" />{r.stops.length} paradas</span>
                  <span className="flex items-center gap-1 ml-auto"><Heart className="size-3 text-[color:var(--brand-red)]" />{r.likes}</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <img src={r.author.avatar} className="size-6 rounded-full" alt="" />
                  <span className="text-xs text-muted-foreground">por {r.author.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
