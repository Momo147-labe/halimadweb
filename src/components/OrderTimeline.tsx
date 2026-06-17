import { Check } from "lucide-react";
import type { OrderStatus } from "@/lib/store";

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "en_attente", label: "Reçue" },
  { key: "preparation", label: "Préparation" },
  { key: "en_livraison", label: "En livraison" },
  { key: "livree", label: "Livrée" },
];

export function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "annulee") {
    return <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">Commande annulée</div>;
  }
  const idx = STEPS.findIndex(s => s.key === status);
  return (
    <ol className="flex items-center gap-2">
      {STEPS.map((s, i) => {
        const reached = i <= idx;
        const current = i === idx;
        return (
          <li key={s.key} className="flex flex-1 items-center gap-2">
            <div className={`grid size-7 place-items-center rounded-full text-xs font-semibold ${reached ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"} ${current ? "ring-2 ring-primary/40" : ""}`}>
              {reached ? <Check className="size-3.5" /> : i + 1}
            </div>
            <span className={`text-xs ${reached ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
            {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 ${i < idx ? "bg-primary" : "bg-muted"}`} />}
          </li>
        );
      })}
    </ol>
  );
}
