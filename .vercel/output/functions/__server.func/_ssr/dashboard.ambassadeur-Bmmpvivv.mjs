import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useSession, a as useOrders, e as useDishes, b as useRestaurants, d as useSettings, k as ambassadorShareLink, f as formatGNF, B as Button } from "./router-CJfOYUek.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as Copy, c as MessageCircle, F as Facebook, t as Share2 } from "../_libs/lucide-react.mjs";
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
function AmbassadorDashboard() {
  const user = useSession();
  const navigate = useNavigate();
  const orders = useOrders();
  const dishes = useDishes();
  const restaurants = useRestaurants().filter((r) => r.status === "approuve");
  const settings = useSettings();
  const [link, setLink] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (user === null) {
      navigate({
        to: "/login"
      });
      return;
    }
    if (user && user.role !== "ambassadeur" && user.role !== "admin") navigate({
      to: "/"
    });
    if (user) setLink(ambassadorShareLink(user.email));
  }, [user, navigate]);
  if (!user) return null;
  const mine = orders.filter((o) => o.ambassadorEmail === user.email);
  const totalCA = mine.reduce((s, o) => s + o.totalGNF, 0);
  const totalCom = mine.reduce((s, o) => s + Math.round(o.totalGNF * o.commissionAmbassadeurPct / 100), 0);
  const copy = () => {
    navigator.clipboard.writeText(link);
    toast.success("Lien copié");
  };
  const shareWA = () => {
    const msg = `Commandez vos repas à Labé sur HaliMad : ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };
  const shareFB = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`, "_blank");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Espace Ambassadeur" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
      "Partagez votre lien, gagnez ",
      settings.commissionAmbassadeurPct,
      "% sur chaque commande."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-3 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Commandes", value: String(mine.length) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "CA généré", value: formatGNF(totalCA) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Mes commissions", value: formatGNF(totalCom) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-6 rounded-xl border bg-card p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Mon lien personnel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Toute commande passée via ce lien vous est attribuée." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-col gap-2 sm:flex-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { readOnly: true, value: link, className: "flex-1 rounded-md border bg-muted/30 px-3 py-2 text-sm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: copy, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "size-4" }),
            " Copier"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: shareWA, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "size-4" }),
            " WhatsApp"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: shareFB, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Facebook, { className: "size-4" }),
            " Facebook"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Plats à partager" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3", children: dishes.filter((d) => d.available).slice(0, 9).map((d) => {
        const r = restaurants.find((x) => x.id === d.restaurantId);
        const dishLink = `${link.split("?")[0]}/${d.restaurantId}?ref=${encodeURIComponent(user.email)}`;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-xl border bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: d.imageUrl, alt: d.name, className: "aspect-[4/3] w-full object-cover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: d.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: r?.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-bold text-primary text-sm", children: formatGNF(d.priceGNF) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "mt-2 w-full", variant: "outline", onClick: () => {
              navigator.clipboard.writeText(dishLink);
              toast.success("Lien copié");
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "size-4" }),
              " Copier le lien"
            ] })
          ] })
        ] }, d.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Historique de mes commandes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-2", children: [
        mine.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-dashed p-4 text-sm text-muted-foreground", children: "Aucune commande pour l'instant." }),
        mine.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg border p-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
              o.dishName,
              " ×",
              o.quantity
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: o.code }),
              " · ",
              o.status
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-primary", children: formatGNF(o.totalGNF) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-success", children: [
              "Commission : ",
              formatGNF(Math.round(o.totalGNF * o.commissionAmbassadeurPct / 100))
            ] })
          ] })
        ] }, o.id))
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
  AmbassadorDashboard as component
};
