import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { S as notFound } from "../_libs/tanstack__router-core.mjs";
import { R as Route$3, b as useRestaurants, e as useDishes, f as formatGNF, B as Button, d as useSettings, u as useSession, g as cn, s as store, p as pickWhatsappTarget, h as formatAutoMessage, w as whatsappUrl, i as generateCode } from "./router-CbXqaiQQ.mjs";
import { I as Input } from "./input-C9xGZalr.mjs";
import { D as Dialog, a as DialogContent, c as DialogTitle, b as DialogHeader, T as Textarea, L as Label, d as DialogFooter } from "./dialog-CtB2bicI.mjs";
import { R as Root2, I as Item2, a as Indicator } from "../_libs/radix-ui__react-radio-group.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { m as MapPin, o as Clock, P as Phone, b as ShoppingBag, p as CircleCheck, q as Minus, k as Plus, r as Circle } from "../_libs/lucide-react.mjs";
import { o as objectType, n as numberType, e as enumType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
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
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
const RadioGroup = reactExports.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { className: cn("grid gap-2", className), ...props, ref });
});
RadioGroup.displayName = Root2.displayName;
const RadioGroupItem = reactExports.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Item2,
    {
      ref,
      className: cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Indicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-3.5 w-3.5 fill-primary" }) })
    }
  );
});
RadioGroupItem.displayName = Item2.displayName;
const orderSchema = objectType({
  buyerName: stringType().trim().min(2, "Nom trop court").max(80),
  buyerPhone: stringType().transform((s) => s.replace(/\D/g, "")).pipe(stringType().regex(/^\d{8,15}$/, "Numéro WhatsApp invalide")),
  address: stringType().trim().min(5, "Adresse trop courte").max(200),
  notes: stringType().trim().max(300).optional(),
  payment: enumType(["cash", "orange_money"]),
  quantity: numberType().int().min(1).max(20)
});
function RestaurantPage() {
  const {
    id
  } = Route$3.useParams();
  const restaurant = useRestaurants().find((r) => r.id === id);
  const dishes = useDishes().filter((d) => d.restaurantId === id);
  if (!restaurant) throw notFound();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-2xl border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[16/6] overflow-hidden bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: restaurant.imageUrl, alt: restaurant.name, className: "size-full object-cover" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: restaurant.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-muted-foreground", children: restaurant.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-4" }),
            restaurant.address,
            ", ",
            restaurant.city
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-4" }),
            restaurant.hours
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-4" }),
            restaurant.phone
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-8 text-xl font-bold", children: [
      "Menu (",
      dishes.filter((d) => d.available).length,
      " plats)"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid gap-3 sm:grid-cols-2", children: [
      dishes.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(DishCard, { dish: d, restaurantName: restaurant.name, restaurantId: restaurant.id }, d.id)),
      dishes.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-full rounded-xl border border-dashed p-8 text-center text-muted-foreground", children: "Ce restaurant n'a pas encore publié de plat." })
    ] })
  ] });
}
function DishCard({
  dish,
  restaurantName,
  restaurantId
}) {
  const [open, setOpen] = reactExports.useState(false);
  const unavailable = !dish.available;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex gap-3 rounded-xl border bg-card p-3 ${unavailable ? "opacity-60" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: dish.imageUrl, alt: dish.name, loading: "lazy", className: "size-full object-cover" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: dish.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "line-clamp-2 text-xs text-muted-foreground", children: dish.description }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-primary", children: formatGNF(dish.priceGNF) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", disabled: unavailable, onClick: () => setOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "size-4" }),
          " Commander"
        ] })
      ] }),
      unavailable && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-destructive", children: "Indisponible" })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(OrderDialog, { dish, restaurantName, restaurantId, onClose: () => setOpen(false) })
  ] });
}
function OrderDialog({
  dish,
  restaurantName,
  restaurantId,
  onClose
}) {
  const settings = useSettings();
  const session = useSession();
  const navigate = useNavigate();
  const [qty, setQty] = reactExports.useState(1);
  const [buyerName, setBuyerName] = reactExports.useState(session?.name ?? "");
  const [buyerPhone, setBuyerPhone] = reactExports.useState(session?.whatsapp ?? "");
  const [address, setAddress] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const [payment, setPayment] = reactExports.useState("cash");
  const [zoneIdx, setZoneIdx] = reactExports.useState(-1);
  const [errors, setErrors] = reactExports.useState({});
  const [done, setDone] = reactExports.useState(null);
  const zone = zoneIdx >= 0 ? settings.zonesLivraison[zoneIdx] : null;
  const subtotal = dish.priceGNF * qty;
  const baseFee = zone ? zone.fee ?? 0 : settings.deliveryFeeGNF;
  const freeThreshold = settings.freeDeliveryThresholdGNF;
  const freeShipping = freeThreshold !== null && subtotal >= freeThreshold;
  const deliveryFee = freeShipping ? 0 : baseFee;
  const total = subtotal + deliveryFee;
  const submit = () => {
    const parsed = orderSchema.safeParse({
      buyerName,
      buyerPhone,
      address,
      notes: notes || void 0,
      payment,
      quantity: qty
    });
    if (!parsed.success) {
      const e = {};
      parsed.error.issues.forEach((i) => {
        e[i.path[0]] = i.message;
      });
      setErrors(e);
      toast.error("Vérifiez le formulaire");
      return;
    }
    setErrors({});
    const ref = typeof window !== "undefined" ? sessionStorage.getItem("halimad.ref") ?? void 0 : void 0;
    const code = generateCode();
    const now = Date.now();
    const order = {
      id: `o_${now}`,
      code,
      restaurantId,
      restaurantName,
      dishId: dish.id,
      dishName: dish.name,
      dishImage: dish.imageUrl,
      quantity: qty,
      unitPriceGNF: dish.priceGNF,
      totalGNF: total,
      buyerEmail: session?.email,
      buyerName: parsed.data.buyerName,
      buyerPhone: parsed.data.buyerPhone,
      address: parsed.data.address + (zone ? ` (Zone : ${zone.name})` : ""),
      city: "Labé",
      notes: parsed.data.notes,
      payment,
      ambassadorEmail: ref,
      status: "en_attente",
      history: [{
        status: "en_attente",
        at: now
      }],
      commissionHalimadPct: settings.commissionHalimadPct,
      commissionAmbassadeurPct: ref ? settings.commissionAmbassadeurPct : 0,
      feeLivreurGNF: settings.feeLivreurGNF,
      createdAt: now
    };
    store.addOrder(order);
    setDone(code);
    const target = pickWhatsappTarget(settings);
    const msg = formatAutoMessage(settings.messageAuto, {
      plat: `${dish.name} (${restaurantName})`,
      qty,
      total: formatGNF(total),
      adresse: parsed.data.address + (zone ? ` — Zone : ${zone.name}` : ""),
      client: parsed.data.buyerName,
      phone: parsed.data.buyerPhone,
      code
    });
    window.open(whatsappUrl(target.phone, msg), "_blank");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "max-w-md", children: done ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mx-auto size-12 text-success" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Commande envoyée !" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
      "Code : ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold text-foreground", children: done })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Le restaurant a été notifié. Vous pouvez suivre votre commande dans « Mes commandes »." }),
    payment === "orange_money" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-warning/10 p-3 text-left text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Paiement Orange Money" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "Envoyez ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: formatGNF(total) }),
        " au numéro ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: settings.orangeMoneyNumber }),
        ", puis prévenez le livreur ou le support : ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: settings.supportWhatsapp }),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "flex-1", onClick: onClose, children: "Fermer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "flex-1", onClick: () => {
        onClose();
        navigate({
          to: "/orders"
        });
      }, children: "Mes commandes" })
    ] })
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
      "Commander : ",
      dish.name
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg border p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Quantité" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "outline", onClick: () => setQty((q) => Math.max(1, q - 1)), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "size-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8 text-center font-semibold", children: qty }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "outline", onClick: () => setQty((q) => Math.min(20, q + 1)), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Nom complet *", error: errors.buyerName, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: buyerName, onChange: (e) => setBuyerName(e.target.value), placeholder: "Mamadou Diallo" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "WhatsApp *", error: errors.buyerPhone, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: buyerPhone, onChange: (e) => setBuyerPhone(e.target.value), placeholder: "224620000000" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Adresse de livraison (Labé) *", error: errors.address, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: address, onChange: (e) => setAddress(e.target.value), placeholder: "Quartier, repère…" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Note pour le restaurant (optionnel)", error: errors.notes, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: notes, onChange: (e) => setNotes(e.target.value), rows: 2, placeholder: "Sans piment, bien cuit…" }) }),
      settings.zonesLivraison.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm", children: "Zone de livraison" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: zoneIdx, onChange: (e) => setZoneIdx(Number(e.target.value)), className: "mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: -1, children: [
            "Frais par défaut (",
            formatGNF(settings.deliveryFeeGNF),
            ")"
          ] }),
          settings.zonesLivraison.map((z2, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: i, children: [
            z2.name,
            " — ",
            formatGNF(z2.fee ?? 0)
          ] }, i))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm", children: "Paiement" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(RadioGroup, { value: payment, onValueChange: (v) => setPayment(v), className: "mt-1 grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex cursor-pointer items-center gap-2 rounded-lg border p-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupItem, { value: "cash" }),
            " Cash à la livraison"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex cursor-pointer items-center gap-2 rounded-lg border p-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupItem, { value: "orange_money" }),
            " Orange Money"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-muted/40 p-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sous-total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatGNF(subtotal) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Livraison",
            zone ? ` (${zone.name})` : "",
            freeShipping ? " — offerte" : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: freeShipping ? "Offerte" : formatGNF(deliveryFee) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex justify-between font-bold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: formatGNF(total) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Annuler" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submit, children: "Valider la commande" })
    ] })
  ] }) }) });
}
function Field({
  label,
  error,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-destructive", children: error })
  ] });
}
export {
  RestaurantPage as component
};
