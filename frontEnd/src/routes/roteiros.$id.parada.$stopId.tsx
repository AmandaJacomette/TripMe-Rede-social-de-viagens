import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { routes, posts } from "@/lib/mock";
import { ArrowLeft, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

export const Route = createFileRoute("/roteiros/$id/parada/$stopId")({ component: Page });

function Page() {
  const { id, stopId } = useParams({ from: "/roteiros/$id/parada/$stopId" });
  const r = routes.find((x) => x.id === id) ?? routes[0];
  const idx = Math.max(0, r.stops.findIndex((s) => s.id === stopId));
  const stop = r.stops[idx];
  const prev = r.stops[idx - 1];
  const next = r.stops[idx + 1];

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <Link to="/roteiros/$id" params={{ id: r.id }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3">
          <ArrowLeft className="size-4" /> Voltar para {r.title}
        </Link>

        <div className="overflow-hidden rounded-2xl border bg-card">
          <img src={stop.image} className="w-full aspect-[16/9] object-cover" alt={stop.name} />
          <div className="p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-[color:var(--brand-mint)] px-2 py-0.5 font-semibold text-foreground">Parada {idx + 1} de {r.stops.length}</span>
              <span className="flex items-center gap-1"><MapPin className="size-3" /> {r.title}</span>
            </div>
            <h1 className="font-display text-2xl font-bold mt-2">{stop.name}</h1>
            <p className="text-sm text-foreground/80 mt-3 leading-relaxed">{stop.description}</p>
          </div>
        </div>

        <h2 className="font-display text-lg font-bold mt-6 mb-3">Fotos da comunidade</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {posts.map((p) => (
            <div key={p.id} className="aspect-square overflow-hidden rounded-xl border">
              <img src={p.image} className="size-full object-cover" alt="" />
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          {prev ? (
            <Link to="/roteiros/$id/parada/$stopId" params={{ id: r.id, stopId: prev.id }} className="flex-1 rounded-2xl border bg-card p-3 hover:shadow-md transition">
              <div className="text-xs text-muted-foreground flex items-center gap-1"><ChevronLeft className="size-3" /> Parada anterior</div>
              <div className="font-semibold text-sm truncate">{prev.name}</div>
            </Link>
          ) : <div className="flex-1" />}
          {next ? (
            <Link to="/roteiros/$id/parada/$stopId" params={{ id: r.id, stopId: next.id }} className="flex-1 rounded-2xl border bg-card p-3 hover:shadow-md transition text-right">
              <div className="text-xs text-muted-foreground flex items-center justify-end gap-1">Próxima parada <ChevronRight className="size-3" /></div>
              <div className="font-semibold text-sm truncate">{next.name}</div>
            </Link>
          ) : <div className="flex-1" />}
        </div>
      </div>
    </AppShell>
  );
}
