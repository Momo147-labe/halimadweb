import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useSession, c as useUsers, b as useRestaurants, a as useOrders, d as useSettings, f as formatGNF, e as useDishes, B as Button, w as whatsappUrl, s as store } from "./router-CJfOYUek.mjs";
import { I as Input } from "./input-ChhbQhSV.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, L as Label, T as Textarea, d as DialogFooter } from "./dialog-BBlx7fPJ.mjs";
import { S as Switch, I as ImageUpload } from "./ImageUpload-B7JAVqJG.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as ShoppingBag, U as UtensilsCrossed, M as Megaphone, B as Bike, h as Users, i as Settings, j as Plus, C as Check, c as MessageCircle, T as Trash2, k as Pencil } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-switch.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
function Admin() {
  const user = useSession();
  const navigate = useNavigate();
  const [tab, setTab] = reactExports.useState("vue");
  reactExports.useEffect(() => {
    if (user === null) {
      navigate({
        to: "/login"
      });
      return;
    }
    if (user && user.role !== "admin") navigate({
      to: "/"
    });
  }, [user, navigate]);
  if (!user || user.role !== "admin") return null;
  const tabs = [{
    k: "vue",
    label: "Vue d'ensemble",
    icon: ShoppingBag
  }, {
    k: "restaurants",
    label: "Restaurants",
    icon: UtensilsCrossed
  }, {
    k: "ambassadeurs",
    label: "Ambassadeurs",
    icon: Megaphone
  }, {
    k: "livreurs",
    label: "Livreurs",
    icon: Bike
  }, {
    k: "commandes",
    label: "Commandes",
    icon: Users
  }, {
    k: "utilisateurs",
    label: "Utilisateurs",
    icon: Users
  }, {
    k: "parametres",
    label: "Paramètres",
    icon: Settings
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Tableau de bord Admin" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-muted-foreground", children: "Pilotez restaurants, ambassadeurs, livreurs et commissions HaliMad." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex flex-wrap gap-1 border-b", children: tabs.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab(t.k), className: `flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition ${tab === t.k ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(t.icon, { className: "size-4" }),
      " ",
      t.label
    ] }, t.k)) }),
    tab === "vue" && /* @__PURE__ */ jsxRuntimeExports.jsx(Overview, {}),
    tab === "restaurants" && /* @__PURE__ */ jsxRuntimeExports.jsx(RestaurantsTab, {}),
    tab === "ambassadeurs" && /* @__PURE__ */ jsxRuntimeExports.jsx(RoleTab, { role: "ambassadeur" }),
    tab === "livreurs" && /* @__PURE__ */ jsxRuntimeExports.jsx(RoleTab, { role: "livreur" }),
    tab === "commandes" && /* @__PURE__ */ jsxRuntimeExports.jsx(OrdersTab, {}),
    tab === "utilisateurs" && /* @__PURE__ */ jsxRuntimeExports.jsx(UsersTab, {}),
    tab === "parametres" && /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsTab, {})
  ] });
}
function Overview() {
  const users = useUsers();
  const restaurants = useRestaurants();
  const orders = useOrders();
  const settings = useSettings();
  const totalCA = orders.reduce((s, o) => s + o.totalGNF, 0);
  const totalCommission = orders.reduce((s, o) => s + Math.round(o.totalGNF * o.commissionHalimadPct / 100), 0);
  const cards = [{
    label: "Restaurants",
    value: restaurants.length
  }, {
    label: "Ambassadeurs",
    value: users.filter((u) => u.role === "ambassadeur").length
  }, {
    label: "Livreurs",
    value: users.filter((u) => u.role === "livreur").length
  }, {
    label: "Clients",
    value: users.filter((u) => u.role === "client").length
  }, {
    label: "Commandes",
    value: orders.length
  }, {
    label: "CA total",
    value: formatGNF(totalCA)
  }, {
    label: "Commission HaliMad",
    value: formatGNF(totalCommission)
  }, {
    label: "Commission par défaut",
    value: `${settings.commissionHalimadPct}%`
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4", children: cards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: c.label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-2xl font-bold", children: c.value })
  ] }, c.label)) });
}
function RestaurantsTab() {
  const restaurants = useRestaurants();
  const dishes = useDishes();
  const orders = useOrders();
  const pending = restaurants.filter((r) => r.status === "en_attente");
  const approved = restaurants.filter((r) => r.status === "approuve");
  const suspended = restaurants.filter((r) => r.status === "suspendu");
  const [createOpen, setCreateOpen] = reactExports.useState(false);
  const [editRestaurant, setEditRestaurant] = reactExports.useState(null);
  const [menuRestaurant, setMenuRestaurant] = reactExports.useState(null);
  const setStatus = (id, status) => {
    store.updateRestaurant(id, {
      status
    });
    toast.success(status === "approuve" ? "Restaurant approuvé" : status === "suspendu" ? "Restaurant suspendu" : "Mis en attente");
  };
  const remove = (id, name) => {
    if (!confirm(`Supprimer "${name}" et tous ses plats ?`)) return;
    store.deleteRestaurant(id);
    toast.success("Supprimé");
  };
  const renderList = (list, title) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-bold", children: [
      title,
      " (",
      list.length,
      ")"
    ] }),
    list.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground", children: "Aucun" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 space-y-2", children: list.map((r) => {
      const dishCount = dishes.filter((d) => d.restaurantId === r.id).length;
      const orderCount = orders.filter((o) => o.restaurantId === r.id).length;
      const ca = orders.filter((o) => o.restaurantId === r.id).reduce((s, o) => s + o.totalGNF, 0);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 rounded-xl border bg-card p-3 sm:flex-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: r.imageUrl, alt: "", className: "h-16 w-16 rounded object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/restaurants/$id", params: {
            id: r.id
          }, className: "font-semibold hover:underline", children: r.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            r.address,
            " · ",
            r.phone
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              dishCount,
              " plats"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              orderCount,
              " commandes"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "CA : ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: formatGNF(ca) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "secondary", onClick: () => setMenuRestaurant(r), children: "Menu" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => setEditRestaurant(r), children: "Modifier" }),
          r.status !== "approuve" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => setStatus(r.id, "approuve"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4" }),
            " Approuver"
          ] }),
          r.status === "approuve" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => setStatus(r.id, "suspendu"), children: "Suspendre" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: whatsappUrl(r.phone, `Bonjour ${r.name}, message de HaliMad.`), target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "size-4" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => remove(r.id, r.name), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4 text-destructive" }) })
        ] })
      ] }, r.id);
    }) })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setCreateOpen(true), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-1" }),
      " Nouveau restaurant"
    ] }) }),
    createOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(RestaurantFormAdmin, { onClose: () => setCreateOpen(false) }),
    editRestaurant && /* @__PURE__ */ jsxRuntimeExports.jsx(RestaurantFormAdmin, { restaurant: editRestaurant, onClose: () => setEditRestaurant(null) }),
    menuRestaurant && /* @__PURE__ */ jsxRuntimeExports.jsx(MenuManagerAdmin, { restaurant: menuRestaurant, onClose: () => setMenuRestaurant(null) }),
    renderList(pending, "À approuver"),
    renderList(approved, "Approuvés"),
    renderList(suspended, "Suspendus")
  ] });
}
function RestaurantFormAdmin({
  onClose,
  restaurant
}) {
  const users = useUsers().filter((u) => u.role === "restaurant" || u.role === "admin");
  const [ownerEmail, setOwnerEmail] = reactExports.useState(restaurant?.ownerEmail || "");
  const [name, setName] = reactExports.useState(restaurant?.name ?? "");
  const [description, setDescription] = reactExports.useState(restaurant?.description ?? "");
  const [phone, setPhone] = reactExports.useState(restaurant?.phone ?? "");
  const [address, setAddress] = reactExports.useState(restaurant?.address ?? "");
  const [hours, setHours] = reactExports.useState(restaurant?.hours ?? "10h - 22h");
  const [imageUrl, setImageUrl] = reactExports.useState(restaurant?.imageUrl ?? "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800");
  const submit = () => {
    if (!name || !description || !phone || !address) return toast.error("Tous les champs sont requis");
    const id = restaurant?.id ?? `r_${Date.now()}`;
    const data = {
      id,
      ownerEmail: ownerEmail || "",
      name,
      description,
      phone: phone.replace(/\D/g, ""),
      city: "Labé",
      address,
      imageUrl,
      hours,
      status: restaurant?.status ?? "approuve",
      createdAt: restaurant?.createdAt ?? Date.now()
    };
    if (restaurant) store.updateRestaurant(id, data);
    else store.addRestaurant(data);
    toast.success(restaurant ? "Restaurant modifié" : "Restaurant créé");
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
      restaurant ? "Modifier" : "Créer",
      " un restaurant"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 max-h-[60vh] overflow-y-auto pr-1 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Propriétaire (restaurateur)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: ownerEmail, onChange: (e) => setOwnerEmail(e.target.value), className: "mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Sélectionnez un restaurateur (optionnel)" }),
          users.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: u.email, children: [
            u.name,
            " (",
            u.email,
            ")"
          ] }, u.email))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Nom" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: name, onChange: (e) => setName(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: description, onChange: (e) => setDescription(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Téléphone / WhatsApp" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: phone, onChange: (e) => setPhone(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Adresse (Labé)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: address, onChange: (e) => setAddress(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Horaires" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: hours, onChange: (e) => setHours(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "URL image de couverture" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: imageUrl, onChange: (e) => setImageUrl(e.target.value) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Annuler" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submit, children: restaurant ? "Enregistrer" : "Créer" })
    ] })
  ] }) });
}
function MenuManagerAdmin({
  restaurant,
  onClose
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl max-h-[85vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-left", children: [
      "Menu de : ",
      restaurant.name
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DishManagerAdmin, { restaurant }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: onClose, children: "Fermer" }) })
  ] }) });
}
function DishManagerAdmin({
  restaurant
}) {
  const dishes = useDishes().filter((d) => d.restaurantId === restaurant.id);
  const [open, setOpen] = reactExports.useState(false);
  const [edit, setEdit] = reactExports.useState(null);
  const close = () => {
    setOpen(false);
    setEdit(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-sm", children: [
        "Plats (",
        dishes.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => {
        setEdit(null);
        setOpen(true);
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-1" }),
        " Ajouter un plat"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 grid gap-2 sm:grid-cols-2 max-h-[45vh] overflow-y-auto pr-1", children: [
      dishes.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-full rounded-lg border border-dashed p-4 text-sm text-muted-foreground text-center", children: "Aucun plat dans ce restaurant." }),
      dishes.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 rounded-lg border p-2 bg-background", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: d.imageUrl, alt: "", className: "h-16 w-16 rounded object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-xs", children: d.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-primary text-xs", children: formatGNF(d.priceGNF) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: d.available, onCheckedChange: (v) => store.updateDish(d.id, {
              available: v
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: d.available ? "Disponible" : "Indisponible" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-7 w-7", onClick: () => {
            setEdit(d);
            setOpen(true);
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-7 w-7", onClick: () => {
            if (confirm("Supprimer ?")) store.deleteDish(d.id);
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5 text-destructive" }) })
        ] })
      ] }, d.id))
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(DishFormAdmin, { restaurantId: restaurant.id, dish: edit, onClose: close })
  ] });
}
function DishFormAdmin({
  restaurantId,
  dish,
  onClose
}) {
  const [name, setName] = reactExports.useState(dish?.name ?? "");
  const [description, setDescription] = reactExports.useState(dish?.description ?? "");
  const [price, setPrice] = reactExports.useState(String(dish?.priceGNF ?? ""));
  const [imageUrl, setImageUrl] = reactExports.useState(dish?.imageUrl ?? "");
  const submit = async () => {
    const p = Number(price);
    if (!name) return toast.error("Nom requis");
    if (isNaN(p) || p <= 0) return toast.error("Prix invalide");
    const id = dish?.id ?? `d_${Date.now()}`;
    const data = {
      id,
      restaurantId,
      name,
      description,
      priceGNF: p,
      imageUrl,
      available: dish?.available ?? true,
      createdAt: dish?.createdAt ?? Date.now()
    };
    try {
      if (dish) await store.updateDish(id, data);
      else await store.addDish(data);
      toast.success(dish ? "Plat modifié" : "Plat ajouté");
      onClose();
    } catch (err) {
      toast.error(err?.message ?? "Erreur lors de la sauvegarde");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
      dish ? "Modifier" : "Ajouter",
      " un plat"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Image du plat" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ImageUpload, { value: imageUrl, onChange: setImageUrl })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Nom" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: name, onChange: (e) => setName(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: description, onChange: (e) => setDescription(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Prix (GNF)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: price, onChange: (e) => setPrice(e.target.value) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Annuler" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submit, children: dish ? "Enregistrer" : "Ajouter" })
    ] })
  ] }) });
}
function UsersTab() {
  const users = useUsers();
  const [openUserForm, setOpenUserForm] = reactExports.useState(false);
  const changeRole = async (userId, role) => {
    if (!userId) return;
    try {
      await store.assignRole(userId, role);
      toast.success("Rôle mis à jour");
    } catch (e) {
      toast.error(e.message);
    }
  };
  const changeStatus = async (userId, status) => {
    if (!userId) return;
    try {
      await store.updateUserRoleStatus(userId, "client", status);
      toast.success("Statut mis à jour");
    } catch (e) {
      toast.error(e.message);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-6 space-y-4 text-left", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-bold", children: [
        "Tous les utilisateurs (",
        users.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setOpenUserForm(true), className: "gap-2 text-sm h-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
        " Nouvel Utilisateur"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b bg-muted/50 font-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Nom" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "WhatsApp" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Rôle" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Statut" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y", children: users.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-semibold", children: u.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-muted-foreground", children: u.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-muted-foreground", children: u.whatsapp || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: u.role, onChange: (e) => changeRole(u.id, e.target.value), className: "rounded border bg-background px-2 py-1 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "client", children: "Client" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "restaurant", children: "Restaurant" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ambassadeur", children: "Ambassadeur" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "livreur", children: "Livreur" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "admin", children: "Admin" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: u.status, onChange: (e) => changeStatus(u.id, e.target.value), className: "rounded border bg-background px-2 py-1 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "en_attente", children: "En attente" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "approuve", children: "Approuvé" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "suspendu", children: "Suspendu" })
        ] }) })
      ] }, u.id || u.email)) })
    ] }) }),
    openUserForm && /* @__PURE__ */ jsxRuntimeExports.jsx(UserFormAdmin, { onClose: () => setOpenUserForm(false) })
  ] });
}
function UserFormAdmin({
  onClose
}) {
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [whatsapp, setWhatsapp] = reactExports.useState("");
  const [role, setRole] = reactExports.useState("client");
  const [loading, setLoading] = reactExports.useState(false);
  const submit = async () => {
    if (!email || !password || !name) return toast.error("Email, mot de passe et nom requis");
    setLoading(true);
    try {
      await store.addUser({
        email,
        password,
        name,
        whatsapp,
        role
      });
      toast.success("Utilisateur créé");
      onClose();
    } catch (err) {
      toast.error(err?.message ?? "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Nouvel Utilisateur" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Nom complet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: name, onChange: (e) => setName(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", value: email, onChange: (e) => setEmail(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Mot de passe" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", value: password, onChange: (e) => setPassword(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "WhatsApp (optionnel)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "tel", value: whatsapp, onChange: (e) => setWhatsapp(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Rôle" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: role, onChange: (e) => setRole(e.target.value), className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "client", children: "Client" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "restaurant", children: "Restaurant" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ambassadeur", children: "Ambassadeur" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "livreur", children: "Livreur" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "admin", children: "Admin" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, disabled: loading, children: "Annuler" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submit, disabled: loading, children: loading ? "Création..." : "Créer l'utilisateur" })
    ] })
  ] }) });
}
function RoleTab({
  role
}) {
  const users = useUsers().filter((u) => u.role === role);
  const orders = useOrders();
  const setStatus = async (userId, status) => {
    if (!userId) return;
    try {
      await store.updateUserRoleStatus(userId, role, status);
      toast.success(status === "approuve" ? "Approuvé" : "Suspendu");
    } catch (e) {
      toast.error(e.message);
    }
  };
  const remove = (u) => {
    if (!confirm(`Suspendre le compte ${u.name} ?`)) return;
    setStatus(u.id, "suspendu");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-6 space-y-2", children: [
    users.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-dashed p-6 text-center text-muted-foreground", children: [
      "Aucun ",
      role,
      "."
    ] }),
    users.map((u) => {
      const own = role === "ambassadeur" ? orders.filter((o) => o.ambassadorEmail === u.email) : role === "livreur" ? orders.filter((o) => o.driverEmail === u.email) : [];
      const rev = role === "ambassadeur" ? own.reduce((s, o) => s + Math.round(o.totalGNF * o.commissionAmbassadeurPct / 100), 0) : role === "livreur" ? own.reduce((s, o) => s + o.feeLivreurGNF, 0) : 0;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 rounded-xl border bg-card p-3 sm:flex-row sm:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
            u.name,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `ml-2 rounded px-2 py-0.5 text-xs ${u.status === "approuve" ? "bg-success/15 text-success" : u.status === "en_attente" ? "bg-warning/20" : "bg-destructive/15 text-destructive"}`, children: u.status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: u.whatsapp ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
            own.length,
            " commande(s) · Revenus : ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: formatGNF(rev) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
          u.status !== "approuve" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => setStatus(u.id, "approuve"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4" }),
            " Approuver"
          ] }),
          u.status === "approuve" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => setStatus(u.id, "suspendu"), children: "Suspendre" }),
          u.whatsapp && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: whatsappUrl(u.whatsapp, `Bonjour ${u.name}, message de HaliMad.`), target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "size-4" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => remove(u), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4 text-destructive" }) })
        ] })
      ] }, u.id ?? u.email);
    })
  ] });
}
function OrdersTab() {
  const orders = useOrders();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-6 space-y-2", children: [
    orders.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-dashed p-6 text-center text-muted-foreground", children: "Aucune commande." }),
    orders.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
            o.dishName,
            " ×",
            o.quantity
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            o.restaurantName,
            " · ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: o.code }),
            " · ",
            o.status
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-primary", children: formatGNF(o.totalGNF) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            "Commission HM : ",
            formatGNF(Math.round(o.totalGNF * o.commissionHalimadPct / 100))
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
        o.buyerName,
        " (",
        o.buyerPhone,
        ") · ",
        o.address,
        o.ambassadorEmail && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          " · ambassadeur : ",
          o.ambassadorEmail
        ] }),
        o.driverEmail && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          " · livreur : ",
          o.driverEmail
        ] })
      ] })
    ] }, o.id))
  ] });
}
function SettingsTab() {
  const settings = useSettings();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-6 lg:grid-cols-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ContactSection, { settings }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CommissionsSection, { settings }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsappRoutingSection, { settings }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DeliverySection, { settings }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AutoMessageSection, { settings })
  ] });
}
function Section({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3 rounded-xl border bg-card p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold", children: title }),
    children
  ] });
}
function ContactSection({
  settings
}) {
  const [support, setSupport] = reactExports.useState(settings.supportWhatsapp);
  const [om, setOm] = reactExports.useState(settings.orangeMoneyNumber);
  const save = async () => {
    const sp = support.replace(/\D/g, "");
    const om2 = om.replace(/\D/g, "");
    if (!/^\d{8,15}$/.test(sp)) return toast.error("Support WhatsApp invalide");
    if (!/^\d{8,15}$/.test(om2)) return toast.error("Numéro Orange Money invalide");
    try {
      await store.updateSettings({
        supportWhatsapp: sp,
        whatsappPrincipal: sp,
        orangeMoneyNumber: om2
      });
      toast.success("Enregistré");
    } catch (e) {
      toast.error(e.message);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Contact & paiement", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "WhatsApp Support / Principal" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: support, onChange: (e) => setSupport(e.target.value), placeholder: "224620000000" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Numéro Orange Money" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: om, onChange: (e) => setOm(e.target.value), placeholder: "620000000" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: save, children: "Enregistrer" })
  ] });
}
function CommissionsSection({
  settings
}) {
  const [comHM, setComHM] = reactExports.useState(String(settings.commissionHalimadPct));
  const [comAmb, setComAmb] = reactExports.useState(String(settings.commissionAmbassadeurPct));
  const [feeLiv, setFeeLiv] = reactExports.useState(String(settings.feeLivreurGNF));
  const save = async () => {
    const a = Number(comHM), b = Number(comAmb), c = Number(feeLiv);
    if (isNaN(a) || a < 0 || a > 100) return toast.error("Commission HaliMad invalide");
    if (isNaN(b) || b < 0 || b > 100) return toast.error("Commission ambassadeur invalide");
    if (isNaN(c) || c < 0) return toast.error("Forfait livreur invalide");
    try {
      await store.updateSettings({
        commissionHalimadPct: a,
        commissionAmbassadeurPct: b,
        feeLivreurGNF: c
      });
      toast.success("Enregistré");
    } catch (e) {
      toast.error(e.message);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Commissions", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "HaliMad (%)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: comHM, onChange: (e) => setComHM(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Ambassadeur (%)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: comAmb, onChange: (e) => setComAmb(e.target.value) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Forfait livreur / commande (GNF)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: feeLiv, onChange: (e) => setFeeLiv(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: save, children: "Enregistrer" })
  ] });
}
function WhatsappRoutingSection({
  settings
}) {
  const [mode, setMode] = reactExports.useState(settings.whatsappMode);
  const [agents, setAgents] = reactExports.useState(settings.whatsappAgents);
  const [name, setName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const addAgent = () => {
    const p = phone.replace(/\D/g, "");
    if (!name.trim()) return toast.error("Nom requis");
    if (!/^\d{8,15}$/.test(p)) return toast.error("Numéro invalide");
    setAgents([...agents, {
      name: name.trim(),
      phone: p,
      active: mode !== 4
    }]);
    setName("");
    setPhone("");
  };
  const toggle = (i) => {
    if (mode === 4) {
      setAgents(agents.map((a, j) => ({
        ...a,
        active: j === i ? !a.active : false
      })));
    } else {
      setAgents(agents.map((a, j) => j === i ? {
        ...a,
        active: !a.active
      } : a));
    }
  };
  const remove = (i) => setAgents(agents.filter((_, j) => j !== i));
  const save = async () => {
    try {
      await store.updateSettings({
        whatsappMode: mode,
        whatsappAgents: agents
      });
      toast.success("Enregistré");
    } catch (e) {
      toast.error(e.message);
    }
  };
  const modeLabels = {
    1: "Mode 1 — Numéro unique (toutes les commandes vers le WhatsApp principal)",
    2: "Mode 2 — Round-robin (alterne entre les agents actifs)",
    3: "Mode 3 — Aléatoire (tirage au sort parmi les agents actifs)",
    4: "Mode 4 — Agent désigné (un seul agent actif reçoit tout)"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Routage WhatsApp des commandes", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Mode de répartition" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: mode, onChange: (e) => setMode(Number(e.target.value)), className: "mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm", children: [1, 2, 3, 4].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: m, children: modeLabels[m] }, m)) })
    ] }),
    mode !== 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
          "Agents WhatsApp (",
          agents.filter((a) => a.active).length,
          " actif·s)"
        ] }),
        agents.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-dashed p-3 text-sm text-muted-foreground", children: "Aucun agent. Ajoutez-en au moins un." }),
        agents.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg border p-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: a.active, onChange: () => toggle(i) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: a.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: a.phone })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => remove(i), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4 text-destructive" }) })
        ] }, i))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 sm:flex-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Nom", value: name, onChange: (e) => setName(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "WhatsApp (224620000000)", value: phone, onChange: (e) => setPhone(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: addAgent, variant: "outline", children: "Ajouter" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: save, children: "Enregistrer" })
  ] });
}
function DeliverySection({
  settings
}) {
  const [fee, setFee] = reactExports.useState(String(settings.deliveryFeeGNF));
  const [threshold, setThreshold] = reactExports.useState(settings.freeDeliveryThresholdGNF === null ? "" : String(settings.freeDeliveryThresholdGNF));
  const [zones, setZones] = reactExports.useState(settings.zonesLivraison);
  const [zName, setZName] = reactExports.useState("");
  const [zFee, setZFee] = reactExports.useState("");
  const addZone = () => {
    if (!zName.trim()) return toast.error("Nom de zone requis");
    const f = Number(zFee);
    if (isNaN(f) || f < 0) return toast.error("Frais invalides");
    setZones([...zones, {
      name: zName.trim(),
      fee: f
    }]);
    setZName("");
    setZFee("");
  };
  const removeZone = (i) => setZones(zones.filter((_, j) => j !== i));
  const save = async () => {
    const f = Number(fee);
    if (isNaN(f) || f < 0) return toast.error("Frais invalides");
    const t = threshold.trim() === "" ? null : Number(threshold);
    if (t !== null && (isNaN(t) || t < 0)) return toast.error("Seuil invalide");
    try {
      await store.updateSettings({
        deliveryFeeGNF: f,
        freeDeliveryThresholdGNF: t,
        zonesLivraison: zones
      });
      toast.success("Enregistré");
    } catch (e) {
      toast.error(e.message);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Livraison", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Frais par défaut (GNF)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: fee, onChange: (e) => setFee(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Livraison offerte dès (GNF, optionnel)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: threshold, onChange: (e) => setThreshold(e.target.value), placeholder: "Ex 100000" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Zones (frais spécifiques)" }),
      zones.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-dashed p-3 text-sm text-muted-foreground", children: "Aucune zone. Les frais par défaut s'appliquent." }),
      zones.map((z, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg border p-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: z.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: formatGNF(z.fee ?? 0) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => removeZone(i), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4 text-destructive" }) })
      ] }, i)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 sm:flex-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Nom de la zone", value: zName, onChange: (e) => setZName(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Frais GNF", type: "number", value: zFee, onChange: (e) => setZFee(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: addZone, variant: "outline", children: "Ajouter" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: save, children: "Enregistrer" })
  ] });
}
function AutoMessageSection({
  settings
}) {
  const [tpl, setTpl] = reactExports.useState(settings.messageAuto);
  const save = async () => {
    if (!tpl.trim()) return toast.error("Message vide");
    try {
      await store.updateSettings({
        messageAuto: tpl
      });
      toast.success("Enregistré");
    } catch (e) {
      toast.error(e.message);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Message automatique WhatsApp", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
      "Variables : ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "{plat}" }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "{qty}" }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "{total}" }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "{adresse}" }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "{client}" }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "{phone}" }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "{code}" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: tpl, onChange: (e) => setTpl(e.target.value), rows: 5, className: "w-full rounded-md border bg-background p-3 text-sm" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: save, children: "Enregistrer" })
  ] });
}
export {
  Admin as component
};
