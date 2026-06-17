import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  store, useSession, useUsers, useRestaurants, useDishes, useOrders, useSettings,
  formatGNF, whatsappUrl, type User, type Role, type ApprovalStatus, type Dish, type Restaurant,
} from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Check, X, MessageCircle, Trash2, Settings as SettingsIcon,
  Users as UsersIcon, UtensilsCrossed, Bike, Megaphone, ShoppingBag, Plus, Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ImageUpload";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — HaliMad" }] }),
  component: Admin,
});

type Tab = "vue" | "restaurants" | "ambassadeurs" | "livreurs" | "commandes" | "utilisateurs" | "parametres";

function Admin() {
  const user = useSession();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("vue");

  useEffect(() => {
    if (user === null) { navigate({ to: "/login" }); return; }
    if (user && user.role !== "admin") navigate({ to: "/" });
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  const tabs: { k: Tab; label: string; icon: any }[] = [
    { k: "vue", label: "Vue d'ensemble", icon: ShoppingBag },
    { k: "restaurants", label: "Restaurants", icon: UtensilsCrossed },
    { k: "ambassadeurs", label: "Ambassadeurs", icon: Megaphone },
    { k: "livreurs", label: "Livreurs", icon: Bike },
    { k: "commandes", label: "Commandes", icon: UsersIcon },
    { k: "utilisateurs", label: "Utilisateurs", icon: UsersIcon },
    { k: "parametres", label: "Paramètres", icon: SettingsIcon },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">Tableau de bord Admin</h1>
      <p className="mt-1 text-muted-foreground">Pilotez restaurants, ambassadeurs, livreurs et commissions HaliMad.</p>

      <div className="mt-6 flex flex-wrap gap-1 border-b">
        {tabs.map(t => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition ${tab === t.k ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            <t.icon className="size-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "vue" && <Overview />}
      {tab === "restaurants" && <RestaurantsTab />}
      {tab === "ambassadeurs" && <RoleTab role="ambassadeur" />}
      {tab === "livreurs" && <RoleTab role="livreur" />}
      {tab === "commandes" && <OrdersTab />}
      {tab === "utilisateurs" && <UsersTab />}
      {tab === "parametres" && <SettingsTab />}
    </div>
  );
}

function Overview() {
  const users = useUsers();
  const restaurants = useRestaurants();
  const orders = useOrders();
  const settings = useSettings();
  const totalCA = orders.reduce((s, o) => s + o.totalGNF, 0);
  const totalCommission = orders.reduce((s, o) => s + Math.round(o.totalGNF * o.commissionHalimadPct / 100), 0);

  const cards = [
    { label: "Restaurants", value: restaurants.length },
    { label: "Ambassadeurs", value: users.filter(u => u.role === "ambassadeur").length },
    { label: "Livreurs", value: users.filter(u => u.role === "livreur").length },
    { label: "Clients", value: users.filter(u => u.role === "client").length },
    { label: "Commandes", value: orders.length },
    { label: "CA total", value: formatGNF(totalCA) },
    { label: "Commission HaliMad", value: formatGNF(totalCommission) },
    { label: "Commission par défaut", value: `${settings.commissionHalimadPct}%` },
  ];
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(c => (
        <div key={c.label} className="rounded-xl border bg-card p-4">
          <div className="text-xs text-muted-foreground">{c.label}</div>
          <div className="mt-1 text-2xl font-bold">{c.value}</div>
        </div>
      ))}
    </div>
  );
}

function RestaurantsTab() {
  const restaurants = useRestaurants();
  const dishes = useDishes();
  const orders = useOrders();
  const pending = restaurants.filter(r => r.status === "en_attente");
  const approved = restaurants.filter(r => r.status === "approuve");
  const suspended = restaurants.filter(r => r.status === "suspendu");

  const [createOpen, setCreateOpen] = useState(false);
  const [editRestaurant, setEditRestaurant] = useState<Restaurant | null>(null);
  const [menuRestaurant, setMenuRestaurant] = useState<Restaurant | null>(null);

  const setStatus = (id: string, status: ApprovalStatus) => {
    store.updateRestaurant(id, { status });
    toast.success(status === "approuve" ? "Restaurant approuvé" : status === "suspendu" ? "Restaurant suspendu" : "Mis en attente");
  };
  const remove = (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" et tous ses plats ?`)) return;
    store.deleteRestaurant(id); toast.success("Supprimé");
  };

  const renderList = (list: typeof restaurants, title: string) => (
    <section className="mt-6">
      <h2 className="text-lg font-bold">{title} ({list.length})</h2>
      {list.length === 0 ? (
        <div className="mt-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">Aucun</div>
      ) : (
        <div className="mt-2 space-y-2">
          {list.map(r => {
            const dishCount = dishes.filter(d => d.restaurantId === r.id).length;
            const orderCount = orders.filter(o => o.restaurantId === r.id).length;
            const ca = orders.filter(o => o.restaurantId === r.id).reduce((s, o) => s + o.totalGNF, 0);
            return (
              <div key={r.id} className="flex flex-col gap-3 rounded-xl border bg-card p-3 sm:flex-row">
                <img src={r.imageUrl} alt="" className="h-16 w-16 rounded object-cover" />
                <div className="flex-1">
                  <Link to="/restaurants/$id" params={{ id: r.id }} className="font-semibold hover:underline">{r.name}</Link>
                  <div className="text-xs text-muted-foreground">{r.address} · {r.phone}</div>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span>{dishCount} plats</span>
                    <span>{orderCount} commandes</span>
                    <span>CA : <span className="font-semibold text-foreground">{formatGNF(ca)}</span></span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  <Button size="sm" variant="secondary" onClick={() => setMenuRestaurant(r)}>Menu</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditRestaurant(r)}>Modifier</Button>
                  {r.status !== "approuve" && <Button size="sm" onClick={() => setStatus(r.id, "approuve")}><Check className="size-4" /> Approuver</Button>}
                  {r.status === "approuve" && <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "suspendu")}>Suspendre</Button>}
                  <Button size="icon" variant="ghost" asChild>
                    <a href={whatsappUrl(r.phone, `Bonjour ${r.name}, message de HaliMad.`)} target="_blank" rel="noreferrer"><MessageCircle className="size-4" /></a>
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(r.id, r.name)}><Trash2 className="size-4 text-destructive" /></Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );

  return <>
    <div className="mt-6 flex justify-end">
      <Button onClick={() => setCreateOpen(true)}><Plus className="size-4 mr-1" /> Nouveau restaurant</Button>
    </div>
    
    {createOpen && <RestaurantFormAdmin onClose={() => setCreateOpen(false)} />}
    {editRestaurant && <RestaurantFormAdmin restaurant={editRestaurant} onClose={() => setEditRestaurant(null)} />}
    {menuRestaurant && <MenuManagerAdmin restaurant={menuRestaurant} onClose={() => setMenuRestaurant(null)} />}

    {renderList(pending, "À approuver")}
    {renderList(approved, "Approuvés")}
    {renderList(suspended, "Suspendus")}
  </>;
}

function RestaurantFormAdmin({ onClose, restaurant }: { onClose: () => void; restaurant?: Restaurant }) {
  const users = useUsers().filter(u => u.role === "restaurant" || u.role === "admin");
  const [ownerEmail, setOwnerEmail] = useState(restaurant?.ownerEmail || "");
  const [name, setName] = useState(restaurant?.name ?? "");
  const [description, setDescription] = useState(restaurant?.description ?? "");
  const [phone, setPhone] = useState(restaurant?.phone ?? "");
  const [address, setAddress] = useState(restaurant?.address ?? "");
  const [hours, setHours] = useState(restaurant?.hours ?? "10h - 22h");
  const [imageUrl, setImageUrl] = useState(restaurant?.imageUrl ?? "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800");

  const submit = () => {
    if (!name || !description || !phone || !address) return toast.error("Tous les champs sont requis");
    const id = restaurant?.id ?? `r_${Date.now()}`;
    const data = {
      id, ownerEmail: ownerEmail || "", name, description, phone: phone.replace(/\D/g, ""),
      city: "Labé", address, imageUrl, hours,
      status: restaurant?.status ?? "approuve",
      createdAt: restaurant?.createdAt ?? Date.now(),
    };
    if (restaurant) store.updateRestaurant(id, data); else store.addRestaurant(data);
    toast.success(restaurant ? "Restaurant modifié" : "Restaurant créé");
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{restaurant ? "Modifier" : "Créer"} un restaurant</DialogTitle></DialogHeader>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 text-left">
          <div>
            <Label>Propriétaire (restaurateur)</Label>
            <select value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
              <option value="">Sélectionnez un restaurateur (optionnel)</option>
              {users.map(u => <option key={u.email} value={u.email}>{u.name} ({u.email})</option>)}
            </select>
          </div>
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

function MenuManagerAdmin({ restaurant, onClose }: { restaurant: Restaurant; onClose: () => void }) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-left">Menu de : {restaurant.name}</DialogTitle>
        </DialogHeader>
        <div className="mt-2 text-left">
          <DishManagerAdmin restaurant={restaurant} />
        </div>
        <DialogFooter className="mt-4">
          <Button onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DishManagerAdmin({ restaurant }: { restaurant: Restaurant }) {
  const dishes = useDishes().filter(d => d.restaurantId === restaurant.id);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Dish | null>(null);
  const close = () => { setOpen(false); setEdit(null); };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Plats ({dishes.length})</h3>
        <Button size="sm" onClick={() => { setEdit(null); setOpen(true); }}><Plus className="size-4 mr-1" /> Ajouter un plat</Button>
      </div>
      <div className="mt-2 grid gap-2 sm:grid-cols-2 max-h-[45vh] overflow-y-auto pr-1">
        {dishes.length === 0 && <div className="col-span-full rounded-lg border border-dashed p-4 text-sm text-muted-foreground text-center">Aucun plat dans ce restaurant.</div>}
        {dishes.map(d => (
          <div key={d.id} className="flex gap-3 rounded-lg border p-2 bg-background">
            <img src={d.imageUrl} alt="" className="h-16 w-16 rounded object-cover" />
            <div className="flex-1">
              <div className="font-semibold text-xs">{d.name}</div>
              <div className="font-bold text-primary text-xs">{formatGNF(d.priceGNF)}</div>
              <div className="mt-1 flex items-center gap-2">
                <Switch checked={d.available} onCheckedChange={(v) => store.updateDish(d.id, { available: v })} />
                <span className="text-[10px] text-muted-foreground">{d.available ? "Disponible" : "Indisponible"}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 justify-center">
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEdit(d); setOpen(true); }}><Pencil className="size-3.5" /></Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { if (confirm("Supprimer ?")) store.deleteDish(d.id); }}><Trash2 className="size-3.5 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
      {open && <DishFormAdmin restaurantId={restaurant.id} dish={edit} onClose={close} />}
    </div>
  );
}

function DishFormAdmin({ restaurantId, dish, onClose }: { restaurantId: string; dish: Dish | null; onClose: () => void }) {
  const [name, setName] = useState(dish?.name ?? "");
  const [description, setDescription] = useState(dish?.description ?? "");
  const [price, setPrice] = useState(String(dish?.priceGNF ?? ""));
  const [imageUrl, setImageUrl] = useState(dish?.imageUrl ?? "");

  const submit = async () => {
    const p = Number(price);
    if (!name) return toast.error("Nom requis");
    if (isNaN(p) || p <= 0) return toast.error("Prix invalide");
    const id = dish?.id ?? `d_${Date.now()}`;
    const data = {
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
        <div className="space-y-3 text-left">
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

function UsersTab() {
  const users = useUsers();
  const [openUserForm, setOpenUserForm] = useState(false);
  
  const changeRole = async (userId: string | undefined, role: Role) => {
    if (!userId) return;
    try {
      await store.assignRole(userId, role);
      toast.success("Rôle mis à jour");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const changeStatus = async (userId: string | undefined, status: ApprovalStatus) => {
    if (!userId) return;
    try {
      await store.updateUserRoleStatus(userId, "client", status);
      toast.success("Statut mis à jour");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <section className="mt-6 space-y-4 text-left">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Tous les utilisateurs ({users.length})</h2>
        <Button onClick={() => setOpenUserForm(true)} className="gap-2 text-sm h-8"><Plus className="size-4" /> Nouvel Utilisateur</Button>
      </div>
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b bg-muted/50 font-medium">
              <th className="p-3">Nom</th>
              <th className="p-3">Email</th>
              <th className="p-3">WhatsApp</th>
              <th className="p-3">Rôle</th>
              <th className="p-3">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map(u => (
              <tr key={u.id || u.email}>
                <td className="p-3 font-semibold">{u.name}</td>
                <td className="p-3 text-muted-foreground">{u.email}</td>
                <td className="p-3 text-muted-foreground">{u.whatsapp || '—'}</td>
                <td className="p-3">
                  <select
                    value={u.role}
                    onChange={e => changeRole(u.id, e.target.value as Role)}
                    className="rounded border bg-background px-2 py-1 text-xs"
                  >
                    <option value="client">Client</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="ambassadeur">Ambassadeur</option>
                    <option value="livreur">Livreur</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-3">
                  <select
                    value={u.status}
                    onChange={e => changeStatus(u.id, e.target.value as ApprovalStatus)}
                    className="rounded border bg-background px-2 py-1 text-xs"
                  >
                    <option value="en_attente">En attente</option>
                    <option value="approuve">Approuvé</option>
                    <option value="suspendu">Suspendu</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {openUserForm && <UserFormAdmin onClose={() => setOpenUserForm(false)} />}
    </section>
  );
}

function UserFormAdmin({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [role, setRole] = useState<Role>("client");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !password || !name) return toast.error("Email, mot de passe et nom requis");
    setLoading(true);
    try {
      await store.addUser({ email, password, name, whatsapp, role });
      toast.success("Utilisateur créé");
      onClose();
    } catch (err: any) {
      toast.error(err?.message ?? "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Nouvel Utilisateur</DialogTitle></DialogHeader>
        <div className="space-y-3 text-left">
          <div><Label>Nom complet</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
          <div><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div><Label>Mot de passe</Label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
          <div><Label>WhatsApp (optionnel)</Label><Input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} /></div>
          <div>
            <Label>Rôle</Label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as Role)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="client">Client</option>
              <option value="restaurant">Restaurant</option>
              <option value="ambassadeur">Ambassadeur</option>
              <option value="livreur">Livreur</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Annuler</Button>
          <Button onClick={submit} disabled={loading}>{loading ? "Création..." : "Créer l'utilisateur"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RoleTab({ role }: { role: Role }) {
  const users = useUsers().filter(u => u.role === role);
  const orders = useOrders();
  const setStatus = async (userId: string | undefined, status: ApprovalStatus) => {
    if (!userId) return;
    try { await store.updateUserRoleStatus(userId, role, status); toast.success(status === "approuve" ? "Approuvé" : "Suspendu"); }
    catch (e: any) { toast.error(e.message); }
  };
  const remove = (u: User) => {
    if (!confirm(`Suspendre le compte ${u.name} ?`)) return;
    setStatus(u.id, "suspendu");
  };
  return (
    <section className="mt-6 space-y-2">
      {users.length === 0 && <div className="rounded-xl border border-dashed p-6 text-center text-muted-foreground">Aucun {role}.</div>}
      {users.map(u => {
        const own = role === "ambassadeur"
          ? orders.filter(o => o.ambassadorEmail === u.email)
          : role === "livreur"
          ? orders.filter(o => o.driverEmail === u.email)
          : [];
        const rev = role === "ambassadeur"
          ? own.reduce((s, o) => s + Math.round(o.totalGNF * o.commissionAmbassadeurPct / 100), 0)
          : role === "livreur"
          ? own.reduce((s, o) => s + o.feeLivreurGNF, 0)
          : 0;
        return (
          <div key={u.id ?? u.email} className="flex flex-col gap-2 rounded-xl border bg-card p-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <div className="font-semibold">{u.name} <span className={`ml-2 rounded px-2 py-0.5 text-xs ${u.status === "approuve" ? "bg-success/15 text-success" : u.status === "en_attente" ? "bg-warning/20" : "bg-destructive/15 text-destructive"}`}>{u.status}</span></div>
              <div className="text-xs text-muted-foreground">{u.whatsapp ?? "—"}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {own.length} commande(s) · Revenus : <span className="font-semibold text-foreground">{formatGNF(rev)}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {u.status !== "approuve" && <Button size="sm" onClick={() => setStatus(u.id, "approuve")}><Check className="size-4" /> Approuver</Button>}
              {u.status === "approuve" && <Button size="sm" variant="outline" onClick={() => setStatus(u.id, "suspendu")}>Suspendre</Button>}
              {u.whatsapp && (
                <Button size="icon" variant="ghost" asChild>
                  <a href={whatsappUrl(u.whatsapp, `Bonjour ${u.name}, message de HaliMad.`)} target="_blank" rel="noreferrer"><MessageCircle className="size-4" /></a>
                </Button>
              )}
              <Button size="icon" variant="ghost" onClick={() => remove(u)}><Trash2 className="size-4 text-destructive" /></Button>
            </div>
          </div>
        );
      })}
    </section>
  );
}

function OrdersTab() {
  const orders = useOrders();
  return (
    <section className="mt-6 space-y-2">
      {orders.length === 0 && <div className="rounded-xl border border-dashed p-6 text-center text-muted-foreground">Aucune commande.</div>}
      {orders.map(o => (
        <div key={o.id} className="rounded-xl border bg-card p-3 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="font-semibold">{o.dishName} ×{o.quantity}</div>
              <div className="text-xs text-muted-foreground">{o.restaurantName} · <span className="font-mono">{o.code}</span> · {o.status}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-primary">{formatGNF(o.totalGNF)}</div>
              <div className="text-xs text-muted-foreground">Commission HM : {formatGNF(Math.round(o.totalGNF * o.commissionHalimadPct / 100))}</div>
            </div>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {o.buyerName} ({o.buyerPhone}) · {o.address}
            {o.ambassadorEmail && <> · ambassadeur : {o.ambassadorEmail}</>}
            {o.driverEmail && <> · livreur : {o.driverEmail}</>}
          </div>
        </div>
      ))}
    </section>
  );
}

function SettingsTab() {
  const settings = useSettings();
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <ContactSection settings={settings} />
      <CommissionsSection settings={settings} />
      <WhatsappRoutingSection settings={settings} />
      <DeliverySection settings={settings} />
      <AutoMessageSection settings={settings} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 rounded-xl border bg-card p-5">
      <h2 className="text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}

function ContactSection({ settings }: { settings: ReturnType<typeof useSettings> }) {
  const [support, setSupport] = useState(settings.supportWhatsapp);
  const [om, setOm] = useState(settings.orangeMoneyNumber);
  const save = async () => {
    const sp = support.replace(/\D/g, ""); const om2 = om.replace(/\D/g, "");
    if (!/^\d{8,15}$/.test(sp)) return toast.error("Support WhatsApp invalide");
    if (!/^\d{8,15}$/.test(om2)) return toast.error("Numéro Orange Money invalide");
    try { await store.updateSettings({ supportWhatsapp: sp, whatsappPrincipal: sp, orangeMoneyNumber: om2 }); toast.success("Enregistré"); }
    catch (e: any) { toast.error(e.message); }
  };
  return (
    <Section title="Contact & paiement">
      <div><Label>WhatsApp Support / Principal</Label><Input value={support} onChange={e => setSupport(e.target.value)} placeholder="224620000000" /></div>
      <div><Label>Numéro Orange Money</Label><Input value={om} onChange={e => setOm(e.target.value)} placeholder="620000000" /></div>
      <Button onClick={save}>Enregistrer</Button>
    </Section>
  );
}

function CommissionsSection({ settings }: { settings: ReturnType<typeof useSettings> }) {
  const [comHM, setComHM] = useState(String(settings.commissionHalimadPct));
  const [comAmb, setComAmb] = useState(String(settings.commissionAmbassadeurPct));
  const [feeLiv, setFeeLiv] = useState(String(settings.feeLivreurGNF));
  const save = async () => {
    const a = Number(comHM), b = Number(comAmb), c = Number(feeLiv);
    if (isNaN(a) || a < 0 || a > 100) return toast.error("Commission HaliMad invalide");
    if (isNaN(b) || b < 0 || b > 100) return toast.error("Commission ambassadeur invalide");
    if (isNaN(c) || c < 0) return toast.error("Forfait livreur invalide");
    try { await store.updateSettings({ commissionHalimadPct: a, commissionAmbassadeurPct: b, feeLivreurGNF: c }); toast.success("Enregistré"); }
    catch (e: any) { toast.error(e.message); }
  };
  return (
    <Section title="Commissions">
      <div className="grid grid-cols-2 gap-3">
        <div><Label>HaliMad (%)</Label><Input type="number" value={comHM} onChange={e => setComHM(e.target.value)} /></div>
        <div><Label>Ambassadeur (%)</Label><Input type="number" value={comAmb} onChange={e => setComAmb(e.target.value)} /></div>
      </div>
      <div><Label>Forfait livreur / commande (GNF)</Label><Input type="number" value={feeLiv} onChange={e => setFeeLiv(e.target.value)} /></div>
      <Button onClick={save}>Enregistrer</Button>
    </Section>
  );
}

function WhatsappRoutingSection({ settings }: { settings: ReturnType<typeof useSettings> }) {
  const [mode, setMode] = useState<number>(settings.whatsappMode);
  const [agents, setAgents] = useState(settings.whatsappAgents);
  const [name, setName] = useState(""); const [phone, setPhone] = useState("");
  const addAgent = () => {
    const p = phone.replace(/\D/g, "");
    if (!name.trim()) return toast.error("Nom requis");
    if (!/^\d{8,15}$/.test(p)) return toast.error("Numéro invalide");
    setAgents([...agents, { name: name.trim(), phone: p, active: mode !== 4 }]);
    setName(""); setPhone("");
  };
  const toggle = (i: number) => {
    if (mode === 4) {
      // un seul actif autorisé
      setAgents(agents.map((a, j) => ({ ...a, active: j === i ? !a.active : false })));
    } else {
      setAgents(agents.map((a, j) => j === i ? { ...a, active: !a.active } : a));
    }
  };
  const remove = (i: number) => setAgents(agents.filter((_, j) => j !== i));
  const save = async () => {
    try { await store.updateSettings({ whatsappMode: mode as 1|2|3|4, whatsappAgents: agents }); toast.success("Enregistré"); }
    catch (e: any) { toast.error(e.message); }
  };
  const modeLabels: Record<number, string> = {
    1: "Mode 1 — Numéro unique (toutes les commandes vers le WhatsApp principal)",
    2: "Mode 2 — Round-robin (alterne entre les agents actifs)",
    3: "Mode 3 — Aléatoire (tirage au sort parmi les agents actifs)",
    4: "Mode 4 — Agent désigné (un seul agent actif reçoit tout)",
  };
  return (
    <Section title="Routage WhatsApp des commandes">
      <div>
        <Label>Mode de répartition</Label>
        <select value={mode} onChange={e => setMode(Number(e.target.value))} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
          {[1,2,3,4].map(m => <option key={m} value={m}>{modeLabels[m]}</option>)}
        </select>
      </div>
      {mode !== 1 && (
        <>
          <div className="space-y-2">
            <Label>Agents WhatsApp ({agents.filter(a=>a.active).length} actif·s)</Label>
            {agents.length === 0 && <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">Aucun agent. Ajoutez-en au moins un.</div>}
            {agents.map((a, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border p-2 text-sm">
                <input type="checkbox" checked={a.active} onChange={() => toggle(i)} />
                <div className="flex-1"><div className="font-semibold">{a.name}</div><div className="text-xs text-muted-foreground">{a.phone}</div></div>
                <Button size="icon" variant="ghost" onClick={() => remove(i)}><Trash2 className="size-4 text-destructive" /></Button>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input placeholder="Nom" value={name} onChange={e => setName(e.target.value)} />
            <Input placeholder="WhatsApp (224620000000)" value={phone} onChange={e => setPhone(e.target.value)} />
            <Button onClick={addAgent} variant="outline">Ajouter</Button>
          </div>
        </>
      )}
      <Button onClick={save}>Enregistrer</Button>
    </Section>
  );
}

function DeliverySection({ settings }: { settings: ReturnType<typeof useSettings> }) {
  const [fee, setFee] = useState(String(settings.deliveryFeeGNF));
  const [threshold, setThreshold] = useState(settings.freeDeliveryThresholdGNF === null ? "" : String(settings.freeDeliveryThresholdGNF));
  const [zones, setZones] = useState(settings.zonesLivraison);
  const [zName, setZName] = useState(""); const [zFee, setZFee] = useState("");
  const addZone = () => {
    if (!zName.trim()) return toast.error("Nom de zone requis");
    const f = Number(zFee);
    if (isNaN(f) || f < 0) return toast.error("Frais invalides");
    setZones([...zones, { name: zName.trim(), fee: f }]);
    setZName(""); setZFee("");
  };
  const removeZone = (i: number) => setZones(zones.filter((_, j) => j !== i));
  const save = async () => {
    const f = Number(fee); if (isNaN(f) || f < 0) return toast.error("Frais invalides");
    const t = threshold.trim() === "" ? null : Number(threshold);
    if (t !== null && (isNaN(t) || t < 0)) return toast.error("Seuil invalide");
    try { await store.updateSettings({ deliveryFeeGNF: f, freeDeliveryThresholdGNF: t, zonesLivraison: zones }); toast.success("Enregistré"); }
    catch (e: any) { toast.error(e.message); }
  };
  return (
    <Section title="Livraison">
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Frais par défaut (GNF)</Label><Input type="number" value={fee} onChange={e => setFee(e.target.value)} /></div>
        <div><Label>Livraison offerte dès (GNF, optionnel)</Label><Input type="number" value={threshold} onChange={e => setThreshold(e.target.value)} placeholder="Ex 100000" /></div>
      </div>
      <div className="space-y-2">
        <Label>Zones (frais spécifiques)</Label>
        {zones.length === 0 && <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">Aucune zone. Les frais par défaut s'appliquent.</div>}
        {zones.map((z, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg border p-2 text-sm">
            <div className="flex-1"><div className="font-semibold">{z.name}</div><div className="text-xs text-muted-foreground">{formatGNF(z.fee ?? 0)}</div></div>
            <Button size="icon" variant="ghost" onClick={() => removeZone(i)}><Trash2 className="size-4 text-destructive" /></Button>
          </div>
        ))}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input placeholder="Nom de la zone" value={zName} onChange={e => setZName(e.target.value)} />
          <Input placeholder="Frais GNF" type="number" value={zFee} onChange={e => setZFee(e.target.value)} />
          <Button onClick={addZone} variant="outline">Ajouter</Button>
        </div>
      </div>
      <Button onClick={save}>Enregistrer</Button>
    </Section>
  );
}

function AutoMessageSection({ settings }: { settings: ReturnType<typeof useSettings> }) {
  const [tpl, setTpl] = useState(settings.messageAuto);
  const save = async () => {
    if (!tpl.trim()) return toast.error("Message vide");
    try { await store.updateSettings({ messageAuto: tpl }); toast.success("Enregistré"); }
    catch (e: any) { toast.error(e.message); }
  };
  return (
    <Section title="Message automatique WhatsApp">
      <p className="text-xs text-muted-foreground">
        Variables : <code>{"{plat}"}</code> <code>{"{qty}"}</code> <code>{"{total}"}</code> <code>{"{adresse}"}</code> <code>{"{client}"}</code> <code>{"{phone}"}</code> <code>{"{code}"}</code>
      </p>
      <textarea value={tpl} onChange={e => setTpl(e.target.value)} rows={5}
        className="w-full rounded-md border bg-background p-3 text-sm" />
      <Button onClick={save}>Enregistrer</Button>
    </Section>
  );
}
