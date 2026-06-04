import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { suggestions } from "@/lib/mock";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/criadores")({ component: Page });

function Page() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return suggestions;
    return suggestions.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.handle.toLowerCase().includes(term) ||
        s.bio.toLowerCase().includes(term),
    );
  }, [q]);

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-2xl font-bold mb-4">Criadores</h1>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar criadores por nome, @ ou tema..."
            className="w-full rounded-full border bg-card pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-red)]/30"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Nenhum criador encontrado.</p>
        ) : (
          <ul className="space-y-2">
            {filtered.map((s) => (
              <li key={s.id} className="flex items-center gap-3 rounded-2xl border bg-card p-3">
                <img src={s.avatar} className="size-12 rounded-full object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{s.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{s.handle} · {s.bio}</div>
                </div>
                <Link to="/perfil" className="rounded-full border border-[color:var(--brand-red)] px-3 py-1 text-xs font-semibold text-[color:var(--brand-red)] hover:bg-[color:var(--brand-red)] hover:text-white">
                  Ver perfil
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
