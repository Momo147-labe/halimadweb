import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { C as Check } from "../_libs/lucide-react.mjs";
const STEPS = [
  { key: "en_attente", label: "Reçue" },
  { key: "preparation", label: "Préparation" },
  { key: "en_livraison", label: "En livraison" },
  { key: "livree", label: "Livrée" }
];
function OrderTimeline({ status }) {
  if (status === "annulee") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive", children: "Commande annulée" });
  }
  const idx = STEPS.findIndex((s) => s.key === status);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "flex items-center gap-2", children: STEPS.map((s, i) => {
    const reached = i <= idx;
    const current = i === idx;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex flex-1 items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid size-7 place-items-center rounded-full text-xs font-semibold ${reached ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"} ${current ? "ring-2 ring-primary/40" : ""}`, children: reached ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" }) : i + 1 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs ${reached ? "font-semibold text-foreground" : "text-muted-foreground"}`, children: s.label }),
      i < STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-0.5 flex-1 ${i < idx ? "bg-primary" : "bg-muted"}` })
    ] }, s.key);
  }) });
}
export {
  OrderTimeline as O
};
