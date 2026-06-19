import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useSession, b as useRestaurants, e as useDishes, a as useOrders, B as Button, f as formatGNF, s as store } from "./router-CbXqaiQQ.mjs";
import { I as Input } from "./input-C9xGZalr.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, L as Label, T as Textarea, d as DialogFooter } from "./dialog-CtB2bicI.mjs";
import { S as Switch, I as ImageUpload } from "./ImageUpload-BGYOmoQE.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { O as OrderTimeline } from "./OrderTimeline-D71EqfMy.mjs";
import { k as Plus, l as Pencil, T as Trash2 } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-switch.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
function RestaurantDashboard() {
  const user = useSession();
  const navigate = useNavigate();
  const restaurants = useRestaurants();
  const dishes = useDishes();
  const orders = useOrders();
  reactExports.useEffect(() => {
    if (user === null) {
      navigate({
        to: "/login"
      });
      return;
    }
    if (user && user.role !== "restaurant" && user.role !== "admin") navigate({
      to: "/"
    });
  }, [user, navigate]);
  if (!user) return null;
  const mine = restaurants.filter((r) => r.ownerEmail === user.email);
  const [createOpen, setCreateOpen] = reactExports.useState(false);
  if (mine.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-4 py-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Mon restaurant" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "Vous n'avez pas encore enregistré de restaurant." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "mt-4", onClick: () => setCreateOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
        " Créer mon restaurant"
      ] }),
      createOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(RestaurantForm, { ownerEmail: user.email, onClose: () => setCreateOpen(false) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Mon restaurant" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Gérez vos plats et suivez les commandes." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setCreateOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
        " Nouveau restaurant"
      ] })
    ] }),
    createOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(RestaurantForm, { ownerEmail: user.email, onClose: () => setCreateOpen(false) }),
    mine.map((r) => {
      const ds = dishes.filter((d) => d.restaurantId === r.id);
      const os = orders.filter((o) => o.restaurantId === r.id);
      const ca = os.reduce((s, o) => s + o.totalGNF, 0);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-6 rounded-xl border bg-card p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: r.imageUrl, alt: "", className: "h-20 w-20 rounded object-cover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-bold text-lg", children: [
              r.name,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `ml-2 rounded px-2 py-0.5 text-xs ${r.status === "approuve" ? "bg-success/15 text-success" : "bg-warning/20"}`, children: r.status })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: r.address }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
              ds.length,
              " plats · ",
              os.length,
              " commandes · CA : ",
              formatGNF(ca)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DishManager, { restaurant: r }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "mt-6 font-semibold", children: [
          "Commandes (",
          os.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-2", children: [
          os.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-dashed p-4 text-sm text-muted-foreground", children: "Aucune commande pour l'instant." }),
          os.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border p-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
                  o.dishName,
                  " ×",
                  o.quantity,
                  " — ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs", children: o.code })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                  o.buyerName,
                  " · ",
                  o.buyerPhone,
                  " · ",
                  o.address
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-primary", children: formatGNF(o.totalGNF) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: o.payment === "cash" ? "Cash" : "Orange Money" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(OrderTimeline, { status: o.status }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap gap-1", children: [
              o.status === "en_attente" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => store.advanceOrder(o.id, "preparation"), children: "Confirmer & préparer" }),
              o.status === "preparation" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", disabled: true, children: "En attente du livreur" }),
              (o.status === "en_attente" || o.status === "preparation") && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: () => {
                if (confirm("Annuler ?")) store.advanceOrder(o.id, "annulee");
              }, children: "Annuler" })
            ] })
          ] }, o.id))
        ] })
      ] }, r.id);
    })
  ] });
}
function RestaurantForm({
  ownerEmail,
  onClose,
  restaurant
}) {
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
      ownerEmail,
      name,
      description,
      phone: phone.replace(/\D/g, ""),
      city: "Labé",
      address,
      imageUrl,
      hours,
      status: restaurant?.status ?? "en_attente",
      createdAt: restaurant?.createdAt ?? Date.now()
    };
    if (restaurant) store.updateRestaurant(id, data);
    else store.addRestaurant(data);
    toast.success(restaurant ? "Restaurant modifié" : "Restaurant créé (en attente de validation par HaliMad)");
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
      restaurant ? "Modifier" : "Créer",
      " mon restaurant"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
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
function DishManager({
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold", children: [
        "Menu (",
        dishes.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => {
        setEdit(null);
        setOpen(true);
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
        " Plat"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 grid gap-2 sm:grid-cols-2", children: [
      dishes.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-full rounded-lg border border-dashed p-4 text-sm text-muted-foreground", children: "Ajoutez votre premier plat." }),
      dishes.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 rounded-lg border p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: d.imageUrl, alt: "", className: "h-16 w-16 rounded object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: d.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-primary text-sm", children: formatGNF(d.priceGNF) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: d.available, onCheckedChange: (v) => store.updateDish(d.id, {
              available: v
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: d.available ? "Disponible" : "Indispo" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => {
            setEdit(d);
            setOpen(true);
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => {
            if (confirm("Supprimer ?")) store.deleteDish(d.id);
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4 text-destructive" }) })
        ] })
      ] }, d.id))
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(DishForm, { restaurantId: restaurant.id, dish: edit, onClose: close })
  ] });
}
function DishForm({
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
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
export {
  RestaurantDashboard as component
};
