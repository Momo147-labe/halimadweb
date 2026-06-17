import { createFileRoute, Link } from "@tanstack/react-router";
import { useOrders, useSession, formatGNF, whatsappUrl, useRestaurants } from "@/lib/store";
import { OrderTimeline } from "@/components/OrderTimeline";
import { Button } from "@/components/ui/button";
import { MessageCircle, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Mes commandes — HaliMad" }] }),
  component: OrdersPage,
});

function OrdersPage() {
  const user = useSession();
  const allOrders = useOrders();
  const restaurants = useRestaurants();

  const mine = user?.email
    ? allOrders.filter(o => o.buyerEmail === user.email)
    : allOrders.filter(o => !o.buyerEmail); // anonyme — peu utile, on demande de se connecter

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Mes commandes</h1>
        <p className="mt-2 text-muted-foreground">Connectez-vous pour voir vos commandes.</p>
        <Button asChild className="mt-4"><Link to="/login">Se connecter</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold">Mes commandes</h1>
      {mine.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed p-10 text-center">
          <ShoppingBag className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">Aucune commande pour l'instant.</p>
          <Button asChild className="mt-4"><Link to="/restaurants">Voir les restaurants</Link></Button>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {mine.map(o => {
            const r = restaurants.find(x => x.id === o.restaurantId);
            return (
              <div key={o.id} className="rounded-xl border bg-card p-4">
                <div className="flex gap-3">
                  <img src={o.dishImage} className="h-16 w-16 rounded object-cover" alt="" />
                  <div className="flex-1">
                    <div className="font-semibold">{o.dishName} <span className="text-muted-foreground">x{o.quantity}</span></div>
                    <div className="text-xs text-muted-foreground">{o.restaurantName} · <span className="font-mono">{o.code}</span></div>
                    <div className="mt-1 font-bold text-primary">{formatGNF(o.totalGNF)}</div>
                  </div>
                  {r && (
                    <Button asChild size="icon" variant="outline">
                      <a href={whatsappUrl(r.phone, `Bonjour, à propos de ma commande ${o.code}`)} target="_blank" rel="noreferrer">
                        <MessageCircle className="size-4" />
                      </a>
                    </Button>
                  )}
                </div>
                <div className="mt-3"><OrderTimeline status={o.status} /></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
