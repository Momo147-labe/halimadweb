import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as useRestaurants, e as useDishes, B as Button, f as formatGNF } from "./router-CbXqaiQQ.mjs";
import { I as Input } from "./input-C9xGZalr.mjs";
import "../_libs/sonner.mjs";
import { m as MapPin, n as Search, o as Clock, U as UtensilsCrossed, a as Megaphone, B as Bike, A as ArrowRight } from "../_libs/lucide-react.mjs";
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
function Home() {
  const restaurants = useRestaurants().filter((r) => r.status === "approuve");
  const dishes = useDishes().filter((d) => d.available);
  const [q, setQ] = reactExports.useState("");
  const filteredRestaurants = reactExports.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return restaurants;
    return restaurants.filter((r) => r.name.toLowerCase().includes(s) || r.description.toLowerCase().includes(s));
  }, [q, restaurants]);
  const topDishes = dishes.slice(0, 6);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-gradient-to-br from-primary/10 via-background to-accent/10 py-14", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-4 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-3" }),
        " Disponible à Labé"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-4 text-4xl font-bold tracking-tight sm:text-5xl", children: [
        "Commandez votre repas ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "à Labé" }),
        " en quelques clics"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-3 max-w-xl text-muted-foreground", children: "Restaurants partenaires, ambassadeurs étudiants, livraison rapide. Paiement cash ou Orange Money." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto mt-6 flex max-w-md items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Rechercher un restaurant ou un plat…", className: "pl-9 h-11" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/restaurants", children: "Voir tout" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-6xl px-4 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "Restaurants populaires" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/restaurants", className: "text-sm text-primary hover:underline", children: "Tout voir" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: [
        filteredRestaurants.slice(0, 6).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/restaurants/$id", params: {
          id: r.id
        }, className: "group overflow-hidden rounded-xl border bg-card transition hover:shadow-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[16/10] overflow-hidden bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: r.imageUrl, alt: r.name, loading: "lazy", className: "size-full object-cover transition group-hover:scale-105" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: r.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 line-clamp-2 text-sm text-muted-foreground", children: r.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-3 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-3" }),
                r.city
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3" }),
                r.hours
              ] })
            ] })
          ] })
        ] }, r.id)),
        filteredRestaurants.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-full rounded-xl border border-dashed p-8 text-center text-muted-foreground", children: "Aucun restaurant ne correspond à votre recherche." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-y bg-muted/30 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "Menus du jour" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: topDishes.map((d) => {
        const r = restaurants.find((x) => x.id === d.restaurantId);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/restaurants/$id", params: {
          id: d.restaurantId
        }, className: "group flex gap-3 overflow-hidden rounded-xl border bg-card p-3 transition hover:shadow-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: d.imageUrl, alt: d.name, loading: "lazy", className: "size-full object-cover" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: d.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: r?.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-bold text-primary", children: formatGNF(d.priceGNF) })
          ] })
        ] }, d.id);
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-6xl px-4 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-center", children: "Comment ça marche" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-4 sm:grid-cols-3", children: [{
        n: 1,
        t: "Choisissez",
        d: "Parcourez les restaurants de Labé et leur menu du jour."
      }, {
        n: 2,
        t: "Commandez",
        d: "Renseignez votre adresse et payez en cash ou via Orange Money."
      }, {
        n: 3,
        t: "Recevez",
        d: "Un livreur HaliMad vous apporte votre repas rapidement."
      }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-5 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto grid size-10 place-items-center rounded-full bg-primary text-primary-foreground font-bold", children: s.n }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 font-semibold", children: s.t }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm text-muted-foreground", children: s.d })
      ] }, s.n)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-primary/5 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PartnerCard, { icon: UtensilsCrossed, title: "Devenir restaurant partenaire", desc: "Publiez votre menu, recevez des commandes et touchez plus de clients à Labé.", cta: "Inscrire mon restaurant", to: "/register" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PartnerCard, { icon: Megaphone, title: "Devenir ambassadeur HaliMad", desc: "Étudiants, jeunes : partagez les plats, gagnez une commission sur chaque commande.", cta: "Devenir ambassadeur", to: "/register" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mt-4 max-w-6xl px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PartnerCard, { icon: Bike, title: "Devenir livreur", desc: "Inscrivez-vous comme livreur, acceptez les commandes disponibles et gagnez un forfait par livraison.", cta: "Devenir livreur", to: "/register" }) })
    ] })
  ] });
}
function PartnerCard({
  icon: Icon,
  title,
  desc,
  cta,
  to
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 rounded-xl border bg-card p-5 sm:flex-row sm:items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid size-12 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-6" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: desc })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to, children: [
      cta,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
    ] }) })
  ] });
}
export {
  Home as component
};
