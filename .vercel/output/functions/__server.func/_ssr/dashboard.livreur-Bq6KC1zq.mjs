import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useSession, a as useOrders, b as useRestaurants, f as formatGNF, B as Button, w as whatsappUrl, s as store } from "./router-CbXqaiQQ.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { O as OrderTimeline } from "./OrderTimeline-D71EqfMy.mjs";
import { m as MapPin, P as Phone, d as MessageCircle } from "../_libs/lucide-react.mjs";
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
function DriverDashboard() {
  const user = useSession();
  const navigate = useNavigate();
  const orders = useOrders();
  const restaurants = useRestaurants();
  reactExports.useEffect(() => {
    if (user === null) {
      navigate({
        to: "/login"
      });
      return;
    }
    if (user && user.role !== "livreur" && user.role !== "admin") navigate({
      to: "/"
    });
  }, [user, navigate]);
  if (!user) return null;
  const available = orders.filter((o) => o.status === "preparation" && !o.driverEmail);
  const mine = orders.filter((o) => o.driverEmail === user.email);
  const totalFees = mine.reduce((s, o) => s + o.feeLivreurGNF, 0);
  const take = (id) => {
    store.updateOrder(id, {
      driverEmail: user.email
    });
    toast.success("Commande prise");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Espace Livreur" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-3 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Disponibles", value: String(available.length) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Mes livraisons", value: String(mine.length) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Revenus", value: formatGNF(totalFees) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Commandes disponibles" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-2", children: [
        available.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-dashed p-4 text-sm text-muted-foreground", children: "Aucune commande à prendre." }),
        available.map((o) => {
          const r = restaurants.find((x) => x.id === o.restaurantId);
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border bg-card p-3 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
                o.dishName,
                " ×",
                o.quantity,
                " — ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs", children: o.code })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                o.restaurantName,
                " · ",
                r?.address
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => take(o.id), children: [
              "Accepter (+",
              formatGNF(o.feeLivreurGNF),
              ")"
            ] })
          ] }) }, o.id);
        })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Mes livraisons" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-2", children: [
        mine.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-dashed p-4 text-sm text-muted-foreground", children: "Aucune livraison." }),
        mine.map((o) => {
          const r = restaurants.find((x) => x.id === o.restaurantId);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-card p-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
                  o.dishName,
                  " ×",
                  o.quantity,
                  " — ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs", children: o.code })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground space-y-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "inline size-3" }),
                    " ",
                    o.address
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "inline size-3" }),
                    " ",
                    o.buyerName,
                    " — ",
                    o.buyerPhone
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    "Restaurant : ",
                    r?.address
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    "Paiement : ",
                    o.payment === "cash" ? "Cash" : "Orange Money",
                    " — ",
                    formatGNF(o.totalGNF)
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: whatsappUrl(o.buyerPhone, `Bonjour, je suis votre livreur HaliMad pour la commande ${o.code}.`), target: "_blank", rel: "noreferrer", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "size-4" }),
                " Client"
              ] }) }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(OrderTimeline, { status: o.status }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap gap-1", children: [
              o.status === "preparation" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => store.advanceOrder(o.id, "en_livraison"), children: "Démarrer la livraison" }),
              o.status === "en_livraison" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => store.advanceOrder(o.id, "livree"), children: "Marquer livrée" })
            ] })
          ] }, o.id);
        })
      ] })
    ] })
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-2xl font-bold", children: value })
  ] });
}
export {
  DriverDashboard as component
};
