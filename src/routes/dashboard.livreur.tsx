import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  store, useSession, useOrders, useRestaurants, formatGNF, whatsappUrl,
} from "@/lib/store";
import { Button } from "@/components/ui/button";
import { MessageCircle, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { OrderTimeline } from "@/components/OrderTimeline";

export const Route = createFileRoute("/dashboard/livreur")({
  head: () => ({ meta: [{ title: "Espace Livreur — HaliMad" }] }),
  component: DriverDashboard,
});

function DriverDashboard() {
  const user = useSession();
  const navigate = useNavigate();
  const orders = useOrders();
  const restaurants = useRestaurants();

  useEffect(() => {
    if (user === null) { navigate({ to: "/login" }); return; }
    if (user && user.role !== "livreur" && user.role !== "admin") navigate({ to: "/" });
  }, [user, navigate]);

  if (!user) return null;

  const available = orders.filter(o => o.status === "preparation" && !o.driverEmail);
  const mine = orders.filter(o => o.driverEmail === user.email);
  const totalFees = mine.reduce((s, o) => s + o.feeLivreurGNF, 0);

  const take = (id: string) => {
    store.updateOrder(id, { driverEmail: user.email });
    toast.success("Commande prise");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold">Espace Livreur</h1>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Stat label="Disponibles" value={String(available.length)} />
        <Stat label="Mes livraisons" value={String(mine.length)} />
        <Stat label="Revenus" value={formatGNF(totalFees)} />
      </div>

      <section className="mt-6">
        <h2 className="font-semibold">Commandes disponibles</h2>
        <div className="mt-2 space-y-2">
          {available.length === 0 && <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">Aucune commande à prendre.</div>}
          {available.map(o => {
            const r = restaurants.find(x => x.id === o.restaurantId);
            return (
              <div key={o.id} className="rounded-lg border bg-card p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-semibold">{o.dishName} ×{o.quantity} — <span className="font-mono text-xs">{o.code}</span></div>
                    <div className="text-xs text-muted-foreground">{o.restaurantName} · {r?.address}</div>
                  </div>
                  <Button size="sm" onClick={() => take(o.id)}>Accepter (+{formatGNF(o.feeLivreurGNF)})</Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-semibold">Mes livraisons</h2>
        <div className="mt-2 space-y-2">
          {mine.length === 0 && <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">Aucune livraison.</div>}
          {mine.map(o => {
            const r = restaurants.find(x => x.id === o.restaurantId);
            return (
              <div key={o.id} className="rounded-lg border bg-card p-3 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold">{o.dishName} ×{o.quantity} — <span className="font-mono text-xs">{o.code}</span></div>
                    <div className="mt-1 text-xs text-muted-foreground space-y-0.5">
                      <div><MapPin className="inline size-3" /> {o.address}</div>
                      <div><Phone className="inline size-3" /> {o.buyerName} — {o.buyerPhone}</div>
                      <div>Restaurant : {r?.address}</div>
                      <div>Paiement : {o.payment === "cash" ? "Cash" : "Orange Money"} — {formatGNF(o.totalGNF)}</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button size="sm" variant="outline" asChild>
                      <a href={whatsappUrl(o.buyerPhone, `Bonjour, je suis votre livreur HaliMad pour la commande ${o.code}.`)} target="_blank" rel="noreferrer">
                        <MessageCircle className="size-4" /> Client
                      </a>
                    </Button>
                  </div>
                </div>
                <div className="mt-3"><OrderTimeline status={o.status} /></div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {o.status === "preparation" && <Button size="sm" onClick={() => store.advanceOrder(o.id, "en_livraison")}>Démarrer la livraison</Button>}
                  {o.status === "en_livraison" && <Button size="sm" onClick={() => store.advanceOrder(o.id, "livree")}>Marquer livrée</Button>}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}
