import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ArrowLeft, Camera, LogOut } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/perfil/ajustes")({ component: Page });

function Page() {
  const [avatar, setAvatar] = useState("https://i.pravatar.cc/200?img=47");
  const [form, setForm] = useState({
    name: "Amanda Lis",
    handle: "amandatrip",
    location: "Rio de Janeiro",
    bio: "Viajante apaixonada por praias escondidas e roteiros fora do óbvio ✈️",
  });

  const onAvatar = (f?: File) => f && setAvatar(URL.createObjectURL(f));
  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <Link to="/perfil" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3">
          <ArrowLeft className="size-4" /> Voltar para o perfil
        </Link>

        <h1 className="font-display text-2xl font-bold mb-4">Editar perfil</h1>

        <section className="rounded-2xl border bg-card p-5 space-y-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={avatar} alt="" className="size-20 rounded-full object-cover ring-2 ring-[color:var(--brand-red)]/30" />
              <label className="absolute -bottom-1 -right-1 size-8 rounded-full bg-[color:var(--brand-red)] text-white flex items-center justify-center cursor-pointer">
                <Camera className="size-4" />
                <input type="file" accept="image/*" className="hidden" onChange={(e) => onAvatar(e.target.files?.[0])} />
              </label>
            </div>
            <div>
              <div className="font-semibold">Foto de perfil</div>
              <p className="text-xs text-muted-foreground">JPG ou PNG, até 5MB.</p>
            </div>
          </div>

          <Field label="Nome">
            <input value={form.name} onChange={(e) => set("name", e.target.value)} className={input} />
          </Field>

          <Field label="Nome de usuário" hint="Outras pessoas vão te encontrar por este @">
            <div className="flex items-center rounded-xl border bg-card focus-within:ring-2 focus-within:ring-[color:var(--brand-red)]/30">
              <span className="pl-3 text-muted-foreground text-sm">@</span>
              <input value={form.handle} onChange={(e) => set("handle", e.target.value.replace(/\s/g, ""))} className="flex-1 bg-transparent px-2 py-2.5 text-sm outline-none" />
            </div>
          </Field>

          <Field label="Localização">
            <input value={form.location} onChange={(e) => set("location", e.target.value)} className={input} />
          </Field>

          <Field label="Bio">
            <textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} rows={3} className={input} />
          </Field>

          <div className="flex flex-wrap gap-3 pt-2">
            <button className="rounded-full bg-[color:var(--brand-red)] px-5 py-2.5 text-sm font-semibold text-white">Salvar alterações</button>
            <Link to="/perfil" className="rounded-full border px-5 py-2.5 text-sm font-semibold hover:bg-muted">Cancelar</Link>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border bg-card p-5 flex items-center justify-between gap-4">
          <div>
            <div className="font-semibold">Sair da conta</div>
            <p className="text-xs text-muted-foreground">Você precisará entrar novamente para acessar.</p>
          </div>
          <Link to="/login" className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-red)] px-4 py-2 text-sm font-semibold text-white">
            <LogOut className="size-4" /> Sair
          </Link>
        </section>
      </div>
    </AppShell>
  );
}

const input = "w-full rounded-xl border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-red)]/30";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-foreground/80 mb-1 block">{label}</span>
      {children}
      {hint && <span className="text-[11px] text-muted-foreground mt-1 block">{hint}</span>}
    </label>
  );
}
