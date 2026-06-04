import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { popularPlaces, suggestions } from "@/lib/mock";
import { Search, MapPin, Star } from "lucide-react";

export const Route = createFileRoute("/explorar")({ component: Page });

function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="font-display text-2xl font-bold mb-3">Explorar</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input placeholder="Para onde você quer ir?" className="w-full rounded-full border bg-card pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-red)]/30" />
          </div>
        </div>

        <section>
          <h2 className="mb-3 font-display text-lg font-bold">Veja os lugares mais visitados</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularPlaces.map((p) => (
              <Link key={p.id} to="/local/$id" params={{ id: p.id }} className="group overflow-hidden rounded-2xl bg-card border shadow-sm hover:shadow-md transition">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={p.image} className="size-full object-cover group-hover:scale-105 transition" alt="" />
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm flex items-center gap-1"><MapPin className="size-3 text-[color:var(--brand-red)]" />{p.name}</div>
                    <div className="text-xs flex items-center gap-0.5"><Star className="size-3 fill-[color:var(--brand-green)] text-[color:var(--brand-green)]" />{p.rating}</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{p.posts} publicações · {p.region}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg font-bold">Inspire-se com nossos criadores</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {suggestions.map((s) => (
              <Link key={s.id} to="/perfil" className="flex items-center gap-3 rounded-2xl border bg-card p-3 hover:shadow-md transition">
                <img src={s.avatar} className="size-12 rounded-full object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{s.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{s.bio}</div>
                </div>
                <span className="rounded-full border border-[color:var(--brand-red)] px-3 py-1 text-xs font-semibold text-[color:var(--brand-red)]">Ver perfil</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
