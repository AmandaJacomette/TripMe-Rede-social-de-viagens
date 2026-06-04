import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { posts, routes } from "@/lib/mock";
import { Settings, MapPin, Calendar, Heart, Bookmark } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/perfil/")({ component: Page });

type Tab = "posts" | "roteiros" | "salvos";

function Page() {
  const [tab, setTab] = useState<Tab>("posts");

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border bg-card p-6 flex flex-wrap items-center gap-5">
          <img src="https://i.pravatar.cc/200?img=47" className="size-24 rounded-full object-cover ring-4 ring-[color:var(--brand-red)]/20" alt="" />
          <div className="flex-1 min-w-[200px]">
            <h1 className="font-display text-2xl font-bold">Amanda Lis</h1>
            <p className="text-sm text-muted-foreground">@amandatrip · <MapPin className="inline size-3" /> Rio de Janeiro</p>
            <p className="text-sm mt-2">Viajante apaixonada por praias escondidas e roteiros fora do óbvio ✈️</p>
            <div className="flex gap-4 mt-3 text-sm">
              <span><b>248</b> <span className="text-muted-foreground">publicações</span></span>
              <span><b>{routes.length}</b> <span className="text-muted-foreground">roteiros</span></span>
            </div>
          </div>
          <Link to="/perfil/ajustes" className="rounded-full border p-2 hover:bg-muted" aria-label="Ajustes do perfil">
            <Settings className="size-5" />
          </Link>
        </div>

        <div className="mt-6 flex gap-6 border-b text-sm font-semibold overflow-x-auto">
          <TabBtn active={tab === "posts"} onClick={() => setTab("posts")}>Publicações</TabBtn>
          <TabBtn active={tab === "roteiros"} onClick={() => setTab("roteiros")}>Roteiros</TabBtn>
          <TabBtn active={tab === "salvos"} onClick={() => setTab("salvos")}>Salvos</TabBtn>
        </div>

        {tab === "posts" && (
          <div className="grid grid-cols-3 gap-1 mt-4">
            {posts.concat(posts).map((p, i) => (
              <div key={i} className="aspect-square overflow-hidden">
                <img src={p.image} className="size-full object-cover" alt="" />
              </div>
            ))}
          </div>
        )}

        {tab === "roteiros" && (
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {routes.map((r) => (
              <Link key={r.id} to="/roteiros/$id" params={{ id: r.id }} className="group overflow-hidden rounded-2xl border bg-card hover:shadow-md transition">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={r.cover} className="size-full object-cover group-hover:scale-105 transition" alt="" />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm">{r.title}</h3>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="size-3" />{r.days} dias</span>
                    <span className="flex items-center gap-1"><MapPin className="size-3" />{r.stops.length} paradas</span>
                    <span className="flex items-center gap-1 ml-auto"><Heart className="size-3 text-[color:var(--brand-red)]" />{r.likes}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {tab === "salvos" && (
          <div className="mt-4">
            {routes.slice(0, 2).length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Bookmark className="mx-auto size-8 mb-2" />
                <p className="text-sm">Você ainda não salvou nada.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {routes.slice(0, 2).map((r) => (
                  <Link key={r.id} to="/roteiros/$id" params={{ id: r.id }} className="group overflow-hidden rounded-2xl border bg-card hover:shadow-md transition">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={r.cover} className="size-full object-cover group-hover:scale-105 transition" alt="" />
                    </div>
                    <div className="p-3 flex items-center gap-2">
                      <Bookmark className="size-4 text-[color:var(--brand-red)]" />
                      <h3 className="font-semibold text-sm flex-1">{r.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`py-2 whitespace-nowrap ${active ? "border-b-2 border-[color:var(--brand-red)] text-[color:var(--brand-red)]" : "text-muted-foreground"}`}
    >
      {children}
    </button>
  );
}
