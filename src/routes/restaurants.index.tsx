import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useRestaurants, useDishes, formatGNF } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Clock } from "lucide-react";

type Search = { ref?: string };

export const Route = createFileRoute("/restaurants/")({
  head: () => ({ meta: [{ title: "Restaurants à Labé — HaliMad" }] }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    ref: typeof s.ref === "string" ? s.ref : undefined,
  }),
  component: Restaurants,
});

function Restaurants() {
  const restaurants = useRestaurants().filter(r => r.status === "approuve");
  const dishes = useDishes();
  const { ref } = useSearch({ from: "/restaurants/" });
  const [q, setQ] = useState("");

  // Stash ambassador ref so it follows the user through the order flow.
  if (typeof window !== "undefined" && ref) {
    sessionStorage.setItem("halimad.ref", ref);
  }

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return restaurants;
    return restaurants.filter(r =>
      r.name.toLowerCase().includes(s) ||
      r.description.toLowerCase().includes(s),
    );
  }, [q, restaurants]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">Restaurants à Labé</h1>
      {ref && (
        <p className="mt-1 text-sm text-muted-foreground">
          Vous arrivez via l'ambassadeur <span className="font-medium text-foreground">{ref}</span>.
        </p>
      )}
      <div className="relative mt-4 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
        <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Rechercher un restaurant…" className="pl-9 h-11" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(r => {
          const count = dishes.filter(d => d.restaurantId === r.id && d.available).length;
          const minPrice = dishes
            .filter(d => d.restaurantId === r.id && d.available)
            .reduce((m, d) => Math.min(m, d.priceGNF), Infinity);
          return (
            <Link key={r.id} to="/restaurants/$id" params={{ id: r.id }} className="group overflow-hidden rounded-xl border bg-card transition hover:shadow-md">
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <img src={r.imageUrl} alt={r.name} loading="lazy" className="size-full object-cover transition group-hover:scale-105" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{r.name}</div>
                  <span className="text-xs text-muted-foreground">{count} plats</span>
                </div>
                <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.description}</div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{r.city}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="size-3" />{r.hours}</span>
                  </span>
                  {isFinite(minPrice) && <span className="font-semibold text-primary">dès {formatGNF(minPrice)}</span>}
                </div>
              </div>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed p-8 text-center text-muted-foreground">
            Aucun restaurant disponible.
          </div>
        )}
      </div>
    </div>
  );
}
