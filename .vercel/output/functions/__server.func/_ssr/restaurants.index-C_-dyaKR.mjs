import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useSearch, L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as useRestaurants, e as useDishes, f as formatGNF } from "./router-CbXqaiQQ.mjs";
import { I as Input } from "./input-C9xGZalr.mjs";
import "../_libs/sonner.mjs";
import { n as Search, m as MapPin, o as Clock } from "../_libs/lucide-react.mjs";
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
function Restaurants() {
  const restaurants = useRestaurants().filter((r) => r.status === "approuve");
  const dishes = useDishes();
  const {
    ref
  } = useSearch({
    from: "/restaurants/"
  });
  const [q, setQ] = reactExports.useState("");
  if (typeof window !== "undefined" && ref) {
    sessionStorage.setItem("halimad.ref", ref);
  }
  const filtered = reactExports.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return restaurants;
    return restaurants.filter((r) => r.name.toLowerCase().includes(s) || r.description.toLowerCase().includes(s));
  }, [q, restaurants]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Restaurants à Labé" }),
    ref && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
      "Vous arrivez via l'ambassadeur ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: ref }),
      "."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-4 max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Rechercher un restaurant…", className: "pl-9 h-11" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: [
      filtered.map((r) => {
        const count = dishes.filter((d) => d.restaurantId === r.id && d.available).length;
        const minPrice = dishes.filter((d) => d.restaurantId === r.id && d.available).reduce((m, d) => Math.min(m, d.priceGNF), Infinity);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/restaurants/$id", params: {
          id: r.id
        }, className: "group overflow-hidden rounded-xl border bg-card transition hover:shadow-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[16/10] overflow-hidden bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: r.imageUrl, alt: r.name, loading: "lazy", className: "size-full object-cover transition group-hover:scale-105" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: r.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                count,
                " plats"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 line-clamp-2 text-sm text-muted-foreground", children: r.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-3" }),
                  r.city
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3" }),
                  r.hours
                ] })
              ] }),
              isFinite(minPrice) && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-primary", children: [
                "dès ",
                formatGNF(minPrice)
              ] })
            ] })
          ] })
        ] }, r.id);
      }),
      filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-full rounded-xl border border-dashed p-8 text-center text-muted-foreground", children: "Aucun restaurant disponible." })
    ] })
  ] });
}
export {
  Restaurants as component
};
