import { createFileRoute, useParams } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { popularPlaces, posts } from "@/lib/mock";
import { Star, MapPin, Calendar, Thermometer } from "lucide-react";

export const Route = createFileRoute("/local/$id")({ component: Page });

function Page() {
  const { id } = useParams({ from: "/local/$id" });
  const place = popularPlaces.find((p) => p.id === id) ?? popularPlaces[0];

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-2xl border bg-card">
          <img src={place.image} className="w-full aspect-[21/9] object-cover" alt="" />
          <div className="p-6">
            <div className="flex flex-wrap items-start gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="font-display text-3xl font-bold">{place.name}</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="size-4" />{place.region}, Brasil</p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-[color:var(--brand-green)]/15 px-3 py-1 text-sm font-semibold text-[color:var(--brand-green)]">
                <Star className="size-4 fill-current" /> {place.rating}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mt-5">
              <Info icon={Calendar} label="Melhor época" value="Set – Mar" />
              <Info icon={Thermometer} label="Clima médio" value="26°C" />
              <Info icon={MapPin} label="Publicações" value={`${place.posts}`} />
            </div>

            <h2 className="font-display text-lg font-bold mt-6 mb-2">Sobre</h2>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Um dos destinos preferidos dos brasileiros, conhecido pelas praias de águas cristalinas, dunas e cenário paradisíaco. Ideal para quem busca uma fuga da rotina e quer aproveitar o melhor do litoral.
            </p>
          </div>
        </div>

        <h2 className="font-display text-lg font-bold mt-6 mb-3">Publicações deste lugar</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {posts.map((p) => (
            <div key={p.id} className="aspect-square overflow-hidden rounded-xl border">
              <img src={p.image} className="size-full object-cover" alt="" />
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function Info({ icon: Icon, label, value }: any) {
  return (
    <div className="rounded-xl border bg-card p-3 flex items-center gap-3">
      <Icon className="size-5 text-[color:var(--brand-red)]" />
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-semibold text-sm">{value}</div>
      </div>
    </div>
  );
}
