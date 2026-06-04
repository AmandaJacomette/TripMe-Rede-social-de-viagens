import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Plus, ImagePlus, Trash2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/publicar/roteiro")({ component: Page });

type DraftStop = { id: number; name: string; description: string; image: string | null };

function Page() {
  const [stops, setStops] = useState<DraftStop[]>([
    { id: 1, name: "", description: "", image: null },
    { id: 2, name: "", description: "", image: null },
  ]);

  const update = (id: number, patch: Partial<DraftStop>) =>
    setStops((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const remove = (id: number) => setStops((s) => s.filter((x) => x.id !== id));
  const add = () => setStops((s) => [...s, { id: Date.now(), name: "", description: "", image: null }]);

  const onPickImage = (id: number, file?: File) => {
    if (!file) return;
    update(id, { image: URL.createObjectURL(file) });
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-2xl font-bold mb-4">Novo roteiro</h1>
        <div className="rounded-2xl border bg-card p-5 space-y-4">
          <label className="aspect-[16/7] rounded-2xl border-2 border-dashed bg-muted/40 hover:bg-muted cursor-pointer flex items-center justify-center text-muted-foreground">
            <div className="text-center"><ImagePlus className="mx-auto size-8" /><div className="text-xs mt-1">Foto de capa</div></div>
            <input type="file" accept="image/*" className="hidden" />
          </label>
          <input placeholder="Nome do roteiro" className="w-full rounded-xl border bg-card px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-red)]/30" />
          <textarea placeholder="Descreva sua jornada..." rows={3} className="w-full rounded-xl border bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-red)]/30" />

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">Paradas</h3>
              <button onClick={add} className="text-xs flex items-center gap-1 text-[color:var(--brand-red)] font-semibold">
                <Plus className="size-3" /> Adicionar
              </button>
            </div>
            <ol className="space-y-3">
              {stops.map((s, i) => (
                <li key={s.id} className="rounded-xl border bg-card p-3">
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-full bg-[color:var(--brand-red)] text-white text-sm font-bold flex items-center justify-center shrink-0 mt-1">{i + 1}</div>

                    <label className="size-20 shrink-0 overflow-hidden rounded-xl border-2 border-dashed bg-muted/40 hover:bg-muted cursor-pointer flex items-center justify-center text-muted-foreground">
                      {s.image ? (
                        <img src={s.image} alt="" className="size-full object-cover" />
                      ) : (
                        <ImagePlus className="size-5" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => onPickImage(s.id, e.target.files?.[0])}
                      />
                    </label>

                    <div className="flex-1 min-w-0 space-y-2">
                      <input
                        value={s.name}
                        onChange={(e) => update(s.id, { name: e.target.value })}
                        placeholder={`Nome da parada ${i + 1}`}
                        className="w-full bg-transparent text-sm font-medium outline-none border-b focus:border-[color:var(--brand-red)] pb-1"
                      />
                      <textarea
                        value={s.description}
                        onChange={(e) => update(s.id, { description: e.target.value })}
                        placeholder="Descrição rápida desta parada..."
                        rows={2}
                        className="w-full bg-transparent text-xs outline-none resize-none text-foreground/80"
                      />
                    </div>

                    <button onClick={() => remove(s.id)} className="text-muted-foreground hover:text-[color:var(--brand-red)] p-1">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <button className="w-full rounded-full bg-[color:var(--brand-red)] py-3 text-sm font-semibold text-white">Publicar roteiro</button>
        </div>
      </div>
    </AppShell>
  );
}
