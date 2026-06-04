import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { notifications } from "@/lib/mock";

export const Route = createFileRoute("/notificacoes")({ component: Page });

function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl font-bold mb-4">Notificações</h1>
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li key={n.id} className="flex items-center gap-3 rounded-2xl border bg-card p-3">
              <img src={n.avatar} className="size-10 rounded-full object-cover" alt="" />
              <div className="flex-1 text-sm"><b>{n.who}</b> {n.action}</div>
              <span className="text-xs text-muted-foreground">{n.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
