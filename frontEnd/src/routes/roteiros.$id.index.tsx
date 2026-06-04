import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { routes } from "@/lib/mock";
import { Heart, MapPin, Calendar, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/roteiros/$id/")({ component: Page });

function Page() {
  const { id } = useParams({ from: "/roteiros/$id/" });
  const r = routes.find((x) => x.id === id) ?? routes[0];

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-2xl border bg-card">
          <img src={r.cover} className="w-full aspect-[16/7] object-cover" alt="" />
          <div className="p-5">
            <div className="flex items-start gap-3">
              <h1 className="font-display text-2xl font-bold flex-1">{r.title}</h1>
              <button className="rounded-full p-2 hover:bg-muted"><Heart className="size-5 text-[color:var(--brand-red)]" /></button>
            </div>
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="size-4" />{r.days} dias</span>
              <span className="flex items-center gap-1"><MapPin className="size-4" />{r.stops.length} paradas</span>
              <span>{r.likes} curtidas</span>
            </div>
            {r.description && <p className="text-sm text-foreground/80 mt-3 leading-relaxed">{r.description}</p>}
            <Link to="/perfil" className="mt-4 inline-flex items-center gap-2 text-sm hover:underline">
              <img src={r.author.avatar} className="size-8 rounded-full" alt="" />
              <span>por <b>{r.author.name}</b></span>
            </Link>
          </div>
        </div>

        <h2 className="font-display text-lg font-bold mt-6 mb-3">Paradas do roteiro</h2>
        <ol className="space-y-3">
          {r.stops.map((s, i) => (
            <li key={s.id}>
              <Link
                to="/roteiros/$id/parada/$stopId"
                params={{ id: r.id, stopId: s.id }}
                className="group flex items-center gap-3 rounded-2xl border bg-card p-2 pr-3 hover:shadow-md transition"
              >
                <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
                  <img src={s.image} className="size-full object-cover group-hover:scale-105 transition" alt="" />
                  <div className="absolute left-1 top-1 size-6 rounded-full bg-[color:var(--brand-red)] text-white text-xs font-bold flex items-center justify-center">{i + 1}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{s.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{s.description}</div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </AppShell>
  );
}
