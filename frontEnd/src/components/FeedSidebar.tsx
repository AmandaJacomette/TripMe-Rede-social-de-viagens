import { Link } from "@tanstack/react-router";
import { trending, routes } from "@/lib/mock";
import { Search, Calendar, MapPin } from "lucide-react";

export function FeedSidebar() {
  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input placeholder="Buscar lugares, roteiros..." className="w-full rounded-full border bg-card pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-red)]/30" />
      </div>

      <section className="rounded-2xl border bg-card p-4">
        <h3 className="mb-3 font-display text-base font-bold">Lugares mais visitados</h3>
        <ul className="space-y-2.5">
          {trending.map((t) => (
            <li key={t.name} className="flex items-center justify-between text-sm">
              <span className="font-medium">{t.name}</span>
              <span className="rounded-full bg-[color:var(--brand-mint)] px-2 py-0.5 text-xs text-muted-foreground">{t.posts} posts</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border bg-card p-4">
        <h3 className="mb-3 font-display text-base font-bold">Roteiros sugeridos</h3>
        <ul className="space-y-3">
          {routes.map((r) => (
            <li key={r.id}>
              <Link to="/roteiros/$id" params={{ id: r.id }} className="flex items-center gap-3 rounded-xl hover:bg-muted p-1 -m-1 transition">
                <img src={r.cover} alt="" className="size-12 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{r.title}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="size-3" />{r.days}d</span>
                    <span className="flex items-center gap-1"><MapPin className="size-3" />{r.stops.length} paradas</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/roteiros" className="mt-3 block text-center text-xs font-semibold text-[color:var(--brand-red)] hover:underline">Ver todos os roteiros</Link>
      </section>

      <p className="text-[11px] text-muted-foreground">© 2026 TripMe · Sobre · Privacidade · Termos</p>
    </div>
  );
}
