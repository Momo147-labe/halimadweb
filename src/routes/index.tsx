import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useRestaurants, useDishes, formatGNF } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Search, MapPin, Bike, Megaphone, ArrowRight, Clock } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HaliMad — Shopping et livraison à Labé" },
      { name: "description", content: "Commandez vos produits auprès des boutiques partenaires à Labé. Livraison rapide par nos livreurs." },
    ],
  }),
  component: Home,
});

function Home() {
  const restaurants = useRestaurants().filter(r => r.status === "approuve");
  const dishes = useDishes().filter(d => d.available);
  const [q, setQ] = useState("");

  const filteredRestaurants = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return restaurants;
    return restaurants.filter(r =>
      r.name.toLowerCase().includes(s) ||
      r.description.toLowerCase().includes(s),
    );
  }, [q, restaurants]);

  const topDishes = dishes.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-14">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="inline-flex items-center gap-1 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <MapPin className="size-3" /> Disponible à Labé
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Faites votre shopping <span className="text-primary">à Labé</span> en quelques clics
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Boutiques partenaires, ambassadeurs étudiants, livraison rapide.
            Paiement cash ou Orange Money.
          </p>
          <div className="mx-auto mt-6 flex max-w-md items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Rechercher une boutique ou un produit…" className="pl-9 h-11" />
            </div>
            <Button asChild size="lg"><Link to="/restaurants">Voir tout</Link></Button>
          </div>
        </div>
      </section>

      {/* Boutiques populaires */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold">Boutiques populaires</h2>
          <Link to="/restaurants" className="text-sm text-primary hover:underline">Tout voir</Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRestaurants.slice(0, 6).map(r => (
            <Link key={r.id} to="/restaurants/$id" params={{ id: r.id }} className="group overflow-hidden rounded-xl border bg-card transition hover:shadow-md">
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <img src={r.imageUrl} alt={r.name} loading="lazy" className="size-full object-cover transition group-hover:scale-105" />
              </div>
              <div className="p-4">
                <div className="font-semibold">{r.name}</div>
                <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.description}</div>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{r.city}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="size-3" />{r.hours}</span>
                </div>
              </div>
            </Link>
          ))}
          {filteredRestaurants.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed p-8 text-center text-muted-foreground">
              Aucune boutique ne correspond à votre recherche.
            </div>
          )}
        </div>
      </section>

      {/* Produits populaires */}
      <section className="border-y bg-muted/30 py-10">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold">Produits populaires</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topDishes.map(d => {
              const r = restaurants.find(x => x.id === d.restaurantId);
              return (
                <Link key={d.id} to="/restaurants/$id" params={{ id: d.restaurantId }} className="group flex gap-3 overflow-hidden rounded-xl border bg-card p-3 transition hover:shadow-md">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <img src={d.imageUrl} alt={d.name} loading="lazy" className="size-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{d.name}</div>
                    <div className="text-xs text-muted-foreground">{r?.name}</div>
                    <div className="mt-1 font-bold text-primary">{formatGNF(d.priceGNF)}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold text-center">Comment ça marche</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { n: 1, t: "Choisissez", d: "Parcourez les boutiques de Labé et leurs produits." },
            { n: 2, t: "Commandez", d: "Renseignez votre adresse et payez en cash ou via Orange Money." },
            { n: 3, t: "Recevez", d: "Un livreur HaliMad vous apporte votre commande rapidement." },
          ].map(s => (
            <div key={s.n} className="rounded-xl border bg-card p-5 text-center">
              <div className="mx-auto grid size-10 place-items-center rounded-full bg-primary text-primary-foreground font-bold">{s.n}</div>
              <div className="mt-3 font-semibold">{s.t}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA partners */}
      <section className="bg-primary/5 py-12">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2">
          <PartnerCard
            icon={UtensilsCrossed} title="Devenir boutique partenaire"
            desc="Publiez vos produits, recevez des commandes et touchez plus de clients à Labé."
            cta="Inscrire ma boutique" to="/register"
          />
          <PartnerCard
            icon={Megaphone} title="Devenir ambassadeur HaliMad"
            desc="Étudiants, jeunes : partagez les produits, gagnez une commission sur chaque commande."
            cta="Devenir ambassadeur" to="/register"
          />
        </div>
        <div className="mx-auto mt-4 max-w-6xl px-4">
          <PartnerCard
            icon={Bike} title="Devenir livreur"
            desc="Inscrivez-vous comme livreur, acceptez les commandes disponibles et gagnez un forfait par livraison."
            cta="Devenir livreur" to="/register"
          />
        </div>
      </section>
    </div>
  );
}

function PartnerCard({ icon: Icon, title, desc, cta, to }: { icon: any; title: string; desc: string; cta: string; to: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-5 sm:flex-row sm:items-center">
      <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-6" />
      </div>
      <div className="flex-1">
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-muted-foreground">{desc}</div>
      </div>
      <Button asChild><Link to={to}>{cta} <ArrowRight className="size-4" /></Link></Button>
    </div>
  );
}
