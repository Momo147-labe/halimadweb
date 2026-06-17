import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  store, useSession, useRestaurants, useDishes, useOrders,
  formatGNF, generateCode, type Restaurant, type Dish,
} from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { toast } from "sonner";
import { OrderTimeline } from "@/components/OrderTimeline";

export const Route = createFileRoute("/dashboard/restaurant")({
  head: () => ({ meta: [{ title: "Mon restaurant — HaliMad" }] }),
  component: RestaurantDashboard,
});

function RestaurantDashboard() {
  const user = useSession();
  const navigate = useNavigate();
  const restaurants = useRestaurants();
  const dishes = useDishes();
  const orders = useOrders();

  useEffect(() => {
    if (user === null) { navigate({ to: "/login" }); return; }
    if (user && user.role !== "restaurant" && user.role !== "admin") navigate({ to: "/" });
  }, [user, navigate]);

  if (!user) return null;

  const mine = restaurants.filter(r => r.ownerEmail === user.email);
  const [createOpen, setCreateOpen] = useState(false);

  if (mine.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Mon restaurant</h1>
        <p className="mt-2 text-muted-foreground">Vous n'avez pas encore enregistré de restaurant.</p>
        <Button className="mt-4" onClick={() => setCreateOpen(true)}><Plus className="size-4" /> Créer mon restaurant</Button>
        {createOpen && <RestaurantForm ownerEmail={user.email} onClose={() => setCreateOpen(false)} />}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Mon restaurant</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gérez vos plats et suivez les commandes.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}><Plus className="size-4" /> Nouveau restaurant</Button>
      </div>
      {createOpen && <RestaurantForm ownerEmail={user.email} onClose={() => setCreateOpen(false)} />}

      {mine.map(r => {
        const ds = dishes.filter(d => d.restaurantId === r.id);
        const os = orders.filter(o => o.restaurantId === r.id);
        const ca = os.reduce((s, o) => s + o.totalGNF, 0);
        return (
          <section key={r.id} className="mt-6 rounded-xl border bg-card p-4">
            <div className="flex flex-wrap items-start gap-3">
              <img src={r.imageUrl} alt="" className="h-20 w-20 rounded object-cover" />
              <div className="flex-1">
                <div className="font-bold text-lg">{r.name} <span className={`ml-2 rounded px-2 py-0.5 text-xs ${r.status === "approuve" ? "bg-success/15 text-success" : "bg-warning/20"}`}>{r.status}</span></div>
                <div className="text-sm text-muted-foreground">{r.address}</div>
                <div className="mt-1 text-xs text-muted-foreground">{ds.length} plats · {os.length} commandes · CA : {formatGNF(ca)}</div>
              </div>
            </div>

            <DishManager restaurant={r} />

            <h3 className="mt-6 font-semibold">Commandes ({os.length})</h3>
            <div className="mt-2 space-y-2">
              {os.length === 0 && <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">Aucune commande pour l'instant.</div>}
              {os.map(o => (
                <div key={o.id} className="rounded-lg border p-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold">{o.dishName} ×{o.quantity} — <span className="font-mono text-xs">{o.code}</span></div>
                      <div className="text-xs text-muted-foreground">{o.buyerName} · {o.buyerPhone} · {o.address}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{formatGNF(o.totalGNF)}</div>
                      <div className="text-xs text-muted-foreground">{o.payment === "cash" ? "Cash" : "Orange Money"}</div>
                    </div>
                  </div>
                  <div className="mt-2"><OrderTimeline status={o.status} /></div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {o.status === "en_attente" && <Button size="sm" onClick={() => store.advanceOrder(o.id, "preparation")}>Confirmer & préparer</Button>}
                    {o.status === "preparation" && <Button size="sm" variant="outline" disabled>En attente du livreur</Button>}
                    {(o.status === "en_attente" || o.status === "preparation") && <Button size="sm" variant="ghost" onClick={() => { if (confirm("Annuler ?")) store.advanceOrder(o.id, "annulee"); }}>Annuler</Button>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function RestaurantForm({ ownerEmail, onClose, restaurant }: { ownerEmail: string; onClose: () => void; restaurant?: Restaurant }) {
  const [name, setName] = useState(restaurant?.name ?? "");
  const [description, setDescription] = useState(restaurant?.description ?? "");
  const [phone, setPhone] = useState(restaurant?.phone ?? "");
  const [address, setAddress] = useState(restaurant?.address ?? "");
  const [hours, setHours] = useState(restaurant?.hours ?? "10h - 22h");
  const [imageUrl, setImageUrl] = useState(restaurant?.imageUrl ?? "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800");

  const submit = () => {
    if (!name || !description || !phone || !address) return toast.error("Tous les champs sont requis");
    const id = restaurant?.id ?? `r_${Date.now()}`;
    const data: Restaurant = {
      id, ownerEmail, name, description, phone: phone.replace(/\D/g, ""),
      city: "Labé", address, imageUrl, hours,
      status: restaurant?.status ?? "en_attente",
      createdAt: restaurant?.createdAt ?? Date.now(),
    };
    if (restaurant) store.updateRestaurant(id, data); else store.addRestaurant(data);
    toast.success(restaurant ? "Restaurant modifié" : "Restaurant créé (en attente de validation par HaliMad)");
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{restaurant ? "Modifier" : "Créer"} mon restaurant</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Nom</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
          <div><Label>Description</Label><Textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} /></div>
          <div><Label>Téléphone / WhatsApp</Label><Input value={phone} onChange={e => setPhone(e.target.value)} /></div>
          <div><Label>Adresse (Labé)</Label><Input value={address} onChange={e => setAddress(e.target.value)} /></div>
          <div><Label>Horaires</Label><Input value={hours} onChange={e => setHours(e.target.value)} /></div>
          <div><Label>URL image de couverture</Label><Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={submit}>{restaurant ? "Enregistrer" : "Créer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DishManager({ restaurant }: { restaurant: Restaurant }) {
  const dishes = useDishes().filter(d => d.restaurantId === restaurant.id);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Dish | null>(null);
  const close = () => { setOpen(false); setEdit(null); };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Menu ({dishes.length})</h3>
        <Button size="sm" onClick={() => { setEdit(null); setOpen(true); }}><Plus className="size-4" /> Plat</Button>
      </div>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {dishes.length === 0 && <div className="col-span-full rounded-lg border border-dashed p-4 text-sm text-muted-foreground">Ajoutez votre premier plat.</div>}
        {dishes.map(d => (
          <div key={d.id} className="flex gap-3 rounded-lg border p-2">
            <img src={d.imageUrl} alt="" className="h-16 w-16 rounded object-cover" />
            <div className="flex-1">
              <div className="font-semibold text-sm">{d.name}</div>
              <div className="font-bold text-primary text-sm">{formatGNF(d.priceGNF)}</div>
              <div className="mt-1 flex items-center gap-2">
                <Switch checked={d.available} onCheckedChange={(v) => store.updateDish(d.id, { available: v })} />
                <span className="text-xs text-muted-foreground">{d.available ? "Disponible" : "Indispo"}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Button size="icon" variant="ghost" onClick={() => { setEdit(d); setOpen(true); }}><Pencil className="size-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => { if (confirm("Supprimer ?")) store.deleteDish(d.id); }}><Trash2 className="size-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
      {open && <DishForm restaurantId={restaurant.id} dish={edit} onClose={close} />}
    </div>
  );
}

function DishForm({ restaurantId, dish, onClose }: { restaurantId: string; dish: Dish | null; onClose: () => void }) {
  const [name, setName] = useState(dish?.name ?? "");
  const [description, setDescription] = useState(dish?.description ?? "");
  const [price, setPrice] = useState(String(dish?.priceGNF ?? ""));
  const [imageUrl, setImageUrl] = useState(dish?.imageUrl ?? "");

  const submit = async () => {
    const p = Number(price);
    if (!name) return toast.error("Nom requis");
    if (isNaN(p) || p <= 0) return toast.error("Prix invalide");
    const id = dish?.id ?? `d_${Date.now()}`;
    const data: Dish = {
      id, restaurantId, name, description, priceGNF: p, imageUrl,
      available: dish?.available ?? true, createdAt: dish?.createdAt ?? Date.now(),
    };
    try {
      if (dish) await store.updateDish(id, data); else await store.addDish(data);
      toast.success(dish ? "Plat modifié" : "Plat ajouté");
      onClose();
    } catch (err: any) {
      toast.error(err?.message ?? "Erreur lors de la sauvegarde");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{dish ? "Modifier" : "Ajouter"} un plat</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Image du plat</Label><ImageUpload value={imageUrl} onChange={setImageUrl} /></div>
          <div><Label>Nom</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
          <div><Label>Description</Label><Textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} /></div>
          <div><Label>Prix (GNF)</Label><Input type="number" value={price} onChange={e => setPrice(e.target.value)} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={submit}>{dish ? "Enregistrer" : "Ajouter"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
