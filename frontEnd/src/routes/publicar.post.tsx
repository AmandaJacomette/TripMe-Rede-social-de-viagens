import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ImagePlus, MapPin } from "lucide-react";

export const Route = createFileRoute("/publicar/post")({ component: Page });

function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl font-bold mb-4">Nova publicação</h1>
        <div className="rounded-2xl border bg-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <img src="https://i.pravatar.cc/80?img=47" className="size-10 rounded-full" alt="" />
            <div className="font-semibold text-sm">Amanda <span className="text-muted-foreground font-normal">@amandatrip</span></div>
          </div>
          <label className="block aspect-[4/3] rounded-2xl border-2 border-dashed bg-muted/40 hover:bg-muted cursor-pointer flex items-center justify-center text-muted-foreground">
            <div className="text-center"><ImagePlus className="mx-auto size-8" /><div className="text-xs mt-1">Adicionar foto</div></div>
          </label>
          <textarea placeholder="Escreva uma legenda..." rows={3} className="w-full rounded-xl border bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-red)]/30" />
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input placeholder="Adicionar localização" className="w-full rounded-full border bg-card pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-red)]/30" />
          </div>
          <button className="w-full rounded-full bg-[color:var(--brand-red)] py-3 text-sm font-semibold text-white">Publicar</button>
        </div>
      </div>
    </AppShell>
  );
}
