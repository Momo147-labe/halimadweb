import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  useSession, useOrders, useDishes, useRestaurants, useSettings,
  ambassadorShareLink, formatGNF,
} from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Copy, Share2, MessageCircle, Facebook } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/ambassadeur")({
  head: () => ({ meta: [{ title: "Espace Ambassadeur — HaliMad" }] }),
  component: AmbassadorDashboard,
});

function AmbassadorDashboard() {
  const user = useSession();
  const navigate = useNavigate();
  const orders = useOrders();
  const dishes = useDishes();
  const restaurants = useRestaurants().filter(r => r.status === "approuve");
  const settings = useSettings();
  const [link, setLink] = useState("");

  useEffect(() => {
    if (user === null) { navigate({ to: "/login" }); return; }
    if (user && user.role !== "ambassadeur" && user.role !== "admin") navigate({ to: "/" });
    if (user) setLink(ambassadorShareLink(user.refCode || user.email));
  }, [user, navigate]);

  if (!user) return null;

  const mine = orders.filter(o => o.ambassadorEmail === user.email);
  const totalCA = mine.reduce((s, o) => s + o.totalGNF, 0);
  const totalCom = mine.reduce((s, o) => s + Math.round(o.totalGNF * o.commissionAmbassadeurPct / 100), 0);

  const copy = () => { navigator.clipboard.writeText(link); toast.success("Lien copié"); };
  const shareWA = () => {
    const msg = `Commandez vos repas à Labé sur HaliMad : ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };
  const shareFB = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`, "_blank");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold">Espace Ambassadeur</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Partagez votre lien, gagnez {settings.commissionAmbassadeurPct}% sur chaque commande.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Stat label="Commandes" value={String(mine.length)} />
        <Stat label="CA généré" value={formatGNF(totalCA)} />
        <Stat label="Mes commissions" value={formatGNF(totalCom)} />
      </div>

      <section className="mt-6 rounded-xl border bg-card p-4">
        <h2 className="font-semibold">Mon lien personnel</h2>
        <p className="mt-1 text-xs text-muted-foreground">Toute commande passée via ce lien vous est attribuée.</p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input readOnly value={link} className="flex-1 rounded-md border bg-muted/30 px-3 py-2 text-sm" />
          <div className="flex gap-2">
            <Button variant="outline" onClick={copy}><Copy className="size-4" /> Copier</Button>
            <Button variant="outline" onClick={shareWA}><MessageCircle className="size-4" /> WhatsApp</Button>
            <Button variant="outline" onClick={shareFB}><Facebook className="size-4" /> Facebook</Button>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-semibold">Produits à partager</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.filter(d => d.available).slice(0, 9).map(d => {
            const r = restaurants.find(x => x.id === d.restaurantId);
            const dishLink = `${link.split("?")[0]}/${d.restaurantId}?ref=${encodeURIComponent(user.refCode || user.email)}`;
            return (
              <div key={d.id} className="overflow-hidden rounded-xl border bg-card">
                <img src={d.imageUrl} alt={d.name} className="aspect-[4/3] w-full object-cover" />
                <div className="p-3">
                  <div className="font-semibold text-sm">{d.name}</div>
                  <div className="text-xs text-muted-foreground">{r?.name}</div>
                  <div className="mt-1 font-bold text-primary text-sm">{formatGNF(d.priceGNF)}</div>
                  <Button size="sm" className="mt-2 w-full" variant="outline" onClick={() => {
                    navigator.clipboard.writeText(dishLink); toast.success("Lien copié");
                  }}>
                    <Share2 className="size-4" /> Copier le lien
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-semibold">Historique de mes commandes</h2>
        <div className="mt-2 space-y-2">
          {mine.length === 0 && <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">Aucune commande pour l'instant.</div>}
          {mine.map(o => (
            <div key={o.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
              <div>
                <div className="font-semibold">{o.dishName} ×{o.quantity}</div>
                <div className="text-xs text-muted-foreground"><span className="font-mono">{o.code}</span> · {o.status}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-primary">{formatGNF(o.totalGNF)}</div>
                <div className="text-xs text-success">Commission : {formatGNF(Math.round(o.totalGNF * o.commissionAmbassadeurPct / 100))}</div>
              </div>
            </div>
          ))}
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
