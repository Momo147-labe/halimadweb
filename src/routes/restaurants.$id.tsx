import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  useRestaurants, useDishes, useSettings, useSession, store, formatGNF, generateCode, whatsappUrl,
  pickWhatsappTarget, formatAutoMessage,
  type Dish,
} from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, Clock, Phone, Plus, Minus, ShoppingBag, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/restaurants/$id")({
  head: ({ params }) => ({ meta: [{ title: `Menu — HaliMad` }] }),
  component: RestaurantPage,
});

const orderSchema = z.object({
  buyerName: z.string().trim().min(2, "Nom trop court").max(80),
  buyerPhone: z.string().transform(s => s.replace(/\D/g, "")).pipe(z.string().regex(/^\d{8,15}$/, "Numéro WhatsApp invalide")),
  address: z.string().trim().min(5, "Adresse trop courte").max(200),
  notes: z.string().trim().max(300).optional(),
  payment: z.enum(["cash", "orange_money"]),
  quantity: z.number().int().min(1).max(20),
});

function RestaurantPage() {
  const { id } = Route.useParams();
  const restaurant = useRestaurants().find(r => r.id === id);
  const dishes = useDishes().filter(d => d.restaurantId === id);

  if (!restaurant) throw notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="aspect-[16/6] overflow-hidden bg-muted">
          <img src={restaurant.imageUrl} alt={restaurant.name} className="size-full object-cover" />
        </div>
        <div className="p-5">
          <h1 className="text-2xl font-bold">{restaurant.name}</h1>
          <p className="mt-1 text-muted-foreground">{restaurant.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="size-4" />{restaurant.address}, {restaurant.city}</span>
            <span className="inline-flex items-center gap-1"><Clock className="size-4" />{restaurant.hours}</span>
            <span className="inline-flex items-center gap-1"><Phone className="size-4" />{restaurant.phone}</span>
          </div>
        </div>
      </div>

      <h2 className="mt-8 text-xl font-bold">Menu ({dishes.filter(d => d.available).length} plats)</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {dishes.map(d => (
          <DishCard key={d.id} dish={d} restaurantName={restaurant.name} restaurantId={restaurant.id} />
        ))}
        {dishes.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed p-8 text-center text-muted-foreground">
            Ce restaurant n'a pas encore publié de plat.
          </div>
        )}
      </div>
    </div>
  );
}

function DishCard({ dish, restaurantName, restaurantId }: { dish: Dish; restaurantName: string; restaurantId: string }) {
  const [open, setOpen] = useState(false);
  const unavailable = !dish.available;
  return (
    <div className={`flex gap-3 rounded-xl border bg-card p-3 ${unavailable ? "opacity-60" : ""}`}>
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
        <img src={dish.imageUrl} alt={dish.name} loading="lazy" className="size-full object-cover" />
      </div>
      <div className="flex-1">
        <div className="font-semibold">{dish.name}</div>
        <div className="line-clamp-2 text-xs text-muted-foreground">{dish.description}</div>
        <div className="mt-2 flex items-center justify-between">
          <div className="font-bold text-primary">{formatGNF(dish.priceGNF)}</div>
          <Button size="sm" disabled={unavailable} onClick={() => setOpen(true)}>
            <ShoppingBag className="size-4" /> Commander
          </Button>
        </div>
        {unavailable && <div className="mt-1 text-xs text-destructive">Indisponible</div>}
      </div>
      {open && (
        <OrderDialog
          dish={dish}
          restaurantName={restaurantName}
          restaurantId={restaurantId}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

function OrderDialog({ dish, restaurantName, restaurantId, onClose }:
  { dish: Dish; restaurantName: string; restaurantId: string; onClose: () => void }) {
  const settings = useSettings();
  const session = useSession();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [buyerName, setBuyerName] = useState(session?.name ?? "");
  const [buyerPhone, setBuyerPhone] = useState(session?.whatsapp ?? "");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState<"cash" | "orange_money">("cash");
  const [zoneIdx, setZoneIdx] = useState<number>(-1); // -1 = frais par défaut
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<string | null>(null);

  const zone = zoneIdx >= 0 ? settings.zonesLivraison[zoneIdx] : null;
  const subtotal = dish.priceGNF * qty;
  const baseFee = zone ? (zone.fee ?? 0) : settings.deliveryFeeGNF;
  const freeThreshold = settings.freeDeliveryThresholdGNF;
  const freeShipping = freeThreshold !== null && subtotal >= freeThreshold;
  const deliveryFee = freeShipping ? 0 : baseFee;
  const total = subtotal + deliveryFee;

  const submit = () => {
    const parsed = orderSchema.safeParse({
      buyerName, buyerPhone, address, notes: notes || undefined, payment, quantity: qty,
    });
    if (!parsed.success) {
      const e: Record<string, string> = {};
      parsed.error.issues.forEach(i => { e[i.path[0] as string] = i.message; });
      setErrors(e);
      toast.error("Vérifiez le formulaire");
      return;
    }
    setErrors({});

    const ref = typeof window !== "undefined" ? sessionStorage.getItem("halimad.ref") ?? undefined : undefined;
    const code = generateCode();
    const now = Date.now();

    const order = {
      id: `o_${now}`,
      code, restaurantId, restaurantName,
      dishId: dish.id, dishName: dish.name, dishImage: dish.imageUrl,
      quantity: qty, unitPriceGNF: dish.priceGNF, totalGNF: total,
      buyerEmail: session?.email,
      buyerName: parsed.data.buyerName, buyerPhone: parsed.data.buyerPhone,
      address: parsed.data.address + (zone ? ` (Zone : ${zone.name})` : ""),
      city: "Labé", notes: parsed.data.notes, payment,
      ambassadorEmail: ref,
      status: "en_attente" as const,
      history: [{ status: "en_attente" as const, at: now }],
      commissionHalimadPct: settings.commissionHalimadPct,
      commissionAmbassadeurPct: ref ? settings.commissionAmbassadeurPct : 0,
      feeLivreurGNF: settings.feeLivreurGNF,
      createdAt: now,
    };
    store.addOrder(order);
    setDone(code);

    // Routage WhatsApp vers l'admin (selon mode configuré)
    const target = pickWhatsappTarget(settings);
    const msg = formatAutoMessage(settings.messageAuto, {
      plat: `${dish.name} (${restaurantName})`,
      qty,
      total: formatGNF(total),
      adresse: parsed.data.address + (zone ? ` — Zone : ${zone.name}` : ""),
      client: parsed.data.buyerName,
      phone: parsed.data.buyerPhone,
      code,
    });
    window.open(whatsappUrl(target.phone, msg), "_blank");
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        {done ? (
          <div className="space-y-3 text-center">
            <CheckCircle2 className="mx-auto size-12 text-success" />
            <DialogTitle>Commande envoyée !</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Code : <span className="font-mono font-semibold text-foreground">{done}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Le restaurant a été notifié. Vous pouvez suivre votre commande dans « Mes commandes ».
            </p>
            {payment === "orange_money" && (
              <div className="rounded-lg border bg-warning/10 p-3 text-left text-sm">
                <div className="font-semibold">Paiement Orange Money</div>
                <p>Envoyez <span className="font-bold">{formatGNF(total)}</span> au numéro <span className="font-mono">{settings.orangeMoneyNumber}</span>, puis prévenez le livreur ou le support : <span className="font-mono">{settings.supportWhatsapp}</span>.</p>
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={onClose}>Fermer</Button>
              <Button className="flex-1" onClick={() => { onClose(); navigate({ to: "/orders" }); }}>Mes commandes</Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Commander : {dish.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-2">
                <span className="text-sm">Quantité</span>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="outline" onClick={() => setQty(q => Math.max(1, q - 1))}><Minus className="size-4" /></Button>
                  <span className="w-8 text-center font-semibold">{qty}</span>
                  <Button size="icon" variant="outline" onClick={() => setQty(q => Math.min(20, q + 1))}><Plus className="size-4" /></Button>
                </div>
              </div>
              <Field label="Nom complet *" error={errors.buyerName}>
                <Input value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder="Mamadou Diallo" />
              </Field>
              <Field label="WhatsApp *" error={errors.buyerPhone}>
                <Input value={buyerPhone} onChange={e => setBuyerPhone(e.target.value)} placeholder="224620000000" />
              </Field>
              <Field label="Adresse de livraison (Labé) *" error={errors.address}>
                <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Quartier, repère…" />
              </Field>
              <Field label="Note pour le restaurant (optionnel)" error={errors.notes}>
                <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Sans piment, bien cuit…" />
              </Field>
              {settings.zonesLivraison.length > 0 && (
                <div>
                  <Label className="text-sm">Zone de livraison</Label>
                  <select value={zoneIdx} onChange={e => setZoneIdx(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
                    <option value={-1}>Frais par défaut ({formatGNF(settings.deliveryFeeGNF)})</option>
                    {settings.zonesLivraison.map((z, i) => (
                      <option key={i} value={i}>{z.name} — {formatGNF(z.fee ?? 0)}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <Label className="text-sm">Paiement</Label>
                <RadioGroup value={payment} onValueChange={(v) => setPayment(v as any)} className="mt-1 grid grid-cols-2 gap-2">
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border p-2">
                    <RadioGroupItem value="cash" /> Cash à la livraison
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border p-2">
                    <RadioGroupItem value="orange_money" /> Orange Money
                  </label>
                </RadioGroup>
              </div>
              <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                <div className="flex justify-between"><span>Sous-total</span><span>{formatGNF(subtotal)}</span></div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Livraison{zone ? ` (${zone.name})` : ""}{freeShipping ? " — offerte" : ""}</span>
                  <span>{freeShipping ? "Offerte" : formatGNF(deliveryFee)}</span>
                </div>
                <div className="mt-1 flex justify-between font-bold"><span>Total</span><span className="text-primary">{formatGNF(total)}</span></div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Annuler</Button>
              <Button onClick={submit}>Valider la commande</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-sm">{label}</Label>
      <div className="mt-1">{children}</div>
      {error && <div className="mt-1 text-xs text-destructive">{error}</div>}
    </div>
  );
}
