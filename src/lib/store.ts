// HaliMad — Store
// - Auth & Catalogue & Commandes : Backend Express (Neon DB + Supabase Storage)
// - Settings : Backend Express

import { useEffect, useState, useSyncExternalStore } from "react";
import { api, setToken, type ApiUser } from "@/lib/api";

// =========================================================================
// Types
// =========================================================================
export type Role = "admin" | "restaurant" | "ambassadeur" | "livreur" | "client";
export type ApprovalStatus = "en_attente" | "approuve" | "suspendu";
export type PaymentMethod = "cash" | "orange_money";
export type OrderStatus =
  | "en_attente" | "preparation" | "en_livraison" | "livree" | "annulee";

export interface User {
  email: string;
  password: string;          // legacy unused
  name: string;
  role: Role;
  whatsapp?: string;
  city?: string;
  status: ApprovalStatus;
  refCode?: string;          // ambassador unique ref code
  id?: string;               // backend user id
}

export interface Restaurant {
  id: string;
  ownerEmail: string;
  name: string;
  description: string;
  phone: string;
  city: string;
  address: string;
  imageUrl: string;
  hours: string;
  status: ApprovalStatus;
  createdAt: number;
}

export interface Dish {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  priceGNF: number;
  priceWholesaleGNF?: number;
  imageUrl: string;
  available: boolean;
  createdAt: number;
}

export interface Order {
  id: string;
  code: string;
  restaurantId: string;
  restaurantName: string;
  dishId: string;
  dishName: string;
  dishImage: string;
  quantity: number;
  unitPriceGNF: number;
  totalGNF: number;
  buyerEmail?: string;
  buyerName: string;
  buyerPhone: string;
  address: string;
  city: string;
  notes?: string;
  payment: PaymentMethod;
  ambassadorEmail?: string;
  driverEmail?: string;
  status: OrderStatus;
  history: { status: OrderStatus; at: number }[];
  commissionHalimadPct: number;
  commissionAmbassadeurPct: number;
  feeLivreurGNF: number;
  createdAt: number;
}

export interface WhatsappAgent {
  name: string;
  phone: string;
  active: boolean;
}

export type WhatsappMode = 1 | 2 | 3 | 4;

export interface Settings {
  // Champs commerciaux principaux (admin-éditables)
  whatsappPrincipal: string;
  whatsappSecours: string;
  messageAuto: string;              // template {plat} {qty} {total} {adresse} {client} {phone} {code}
  feeLivreurGNF: number;
  commissionHalimadPct: number;
  margeHalimadPct: number;
  commissionAmbassadeurPct: number;
  orangeMoneyNumber: string;
  supportWhatsapp: string;
  zonesLivraison: { name: string; fee?: number }[];
  whatsappMode: WhatsappMode;
  whatsappAgents: WhatsappAgent[];
  deliveryFeeGNF: number;
  freeDeliveryThresholdGNF: number | null;
}

export const CITIES = ["Labé"];

// =========================================================================
// Helpers de notification réactive locale
// =========================================================================

// =========================================================================
// Cloud-backed session + settings (module-level reactive cache)
// =========================================================================
const DEFAULT_SETTINGS: Settings = {
  whatsappPrincipal: "224620000000",
  whatsappSecours: "",
  messageAuto: "Bonjour HaliMad, je souhaite commander : {plat} x{qty}. Total : {total}. Adresse : {adresse}. Client : {client} ({phone}). Code: {code}",
  feeLivreurGNF: 10000,
  commissionHalimadPct: 10,
  margeHalimadPct: 20,
  commissionAmbassadeurPct: 5,
  orangeMoneyNumber: "620000000",
  supportWhatsapp: "224620000000",
  zonesLivraison: [],
  whatsappMode: 1,
  whatsappAgents: [],
  deliveryFeeGNF: 0,
  freeDeliveryThresholdGNF: null,
};

let cachedSession: User | null = null;
let cachedSettings: Settings = DEFAULT_SETTINGS;
let cachedUsers: User[] | null = null;
let cachedRestaurants: Restaurant[] | null = null;
let cachedDishes: Dish[] | null = null;
let cachedOrders: Order[] | null = null;

let initialized = false;
const listeners = new Set<() => void>();

function notify() { listeners.forEach(l => l()); }

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

function apiUserToUser(u: ApiUser): User {
  return {
    id: u.id,
    email: u.email,
    password: "",
    name: u.name,
    role: u.role as Role,
    whatsapp: u.whatsapp,
    city: u.city ?? "Labé",
    status: u.status as ApprovalStatus,
    refCode: u.refCode,
  };
}

async function loadSettings() {
  try {
    const data = await api.settings.get();
    cachedSettings = data as Settings;
    notify();
  } catch {}
}

async function loadUsers() {
  try {
    const data = await api.users.list();
    cachedUsers = data.map((u: any) => apiUserToUser(u));
    notify();
  } catch {}
}

async function loadRestaurants() {
  try {
    cachedRestaurants = await api.restaurants.list();
    notify();
  } catch {}
}

async function loadDishes() {
  try {
    cachedDishes = await api.dishes.list();
    notify();
  } catch {}
}

async function loadOrders() {
  try {
    cachedOrders = await api.orders.list();
    notify();
  } catch {}
}

async function ensureInit() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  // Vérifier le token JWT stocké
  try {
    const { user } = await api.auth.me();
    cachedSession = apiUserToUser(user);
  } catch {
    cachedSession = null;
    setToken(null);
  }
  await loadSettings();
  notify();
}

// SSR-safe snapshot (avoids tearing)
const EMPTY_USERS: User[] = [];
const EMPTY_RESTAURANTS: Restaurant[] = [];
const EMPTY_DISHES: Dish[] = [];
const EMPTY_ORDERS: Order[] = [];

function getSessionSnapshot(): User | null { return cachedSession; }
function getSettingsSnapshot(): Settings { return cachedSettings; }
function getUsersSnapshot(): User[] { return cachedUsers || EMPTY_USERS; }
function getRestaurantsSnapshot(): Restaurant[] { return cachedRestaurants || EMPTY_RESTAURANTS; }
function getDishesSnapshot(): Dish[] { return cachedDishes || EMPTY_DISHES; }
function getOrdersSnapshot(): Order[] { return cachedOrders || EMPTY_ORDERS; }

export const useSession = (): User | null => {
  useEffect(() => { ensureInit(); }, []);
  return useSyncExternalStore(subscribe, getSessionSnapshot, () => null);
};

export const useSettings = (): Settings => {
  useEffect(() => { ensureInit(); }, []);
  return useSyncExternalStore(subscribe, getSettingsSnapshot, () => DEFAULT_SETTINGS);
};

// Accès direct (hors hooks)
export function getSession(): User | null { return cachedSession; }

// =========================================================================
// Users (Backend API)
// =========================================================================
export const useUsers = (): User[] => {
  useEffect(() => { if (!cachedUsers) loadUsers(); }, []);
  return useSyncExternalStore(subscribe, getUsersSnapshot, () => []);
};

// =========================================================================
// Store API
// =========================================================================
export const store = {
  // -------- Auth (Backend JWT) --------
  async signUp(opts: { email: string; password: string; name: string; whatsapp?: string; role?: Role }) {
    const { token, user } = await api.auth.signUp(opts);
    setToken(token);
    cachedSession = apiUserToUser(user);
    notify();
    return { user };
  },
  async signIn(email: string, password: string) {
    const { token, user } = await api.auth.signIn(email, password);
    setToken(token);
    cachedSession = apiUserToUser(user);
    notify();
    return { user };
  },
  async logout() {
    setToken(null);
    cachedSession = null;
    notify();
    if (typeof window !== "undefined") window.location.href = "/";
  },

  // -------- Settings (Backend) --------
  async updateSettings(patch: Partial<Settings>) {
    const updated = await api.settings.update(patch);
    cachedSettings = updated as Settings;
    notify();
  },
  getSettings(): Settings { return cachedSettings; },

  // Admin role/status management
  async addUser(u: any): Promise<void> {
    await api.users.create(u);
    await loadUsers();
  },
  async updateUserRoleStatus(userId: string, _role: Role, status: ApprovalStatus) {
    await api.users.update(userId, { status });
    await loadUsers();
  },
  async assignRole(userId: string, role: Role) {
    await api.users.update(userId, { role });
    await loadUsers();
  },

  // -------- Restaurants (Backend API) --------
  async getRestaurants(): Promise<Restaurant[]> {
    if (!cachedRestaurants) await loadRestaurants();
    return cachedRestaurants || [];
  },
  async addRestaurant(r: Omit<Restaurant, 'id' | 'createdAt'>): Promise<Restaurant> {
    const res = await api.restaurants.create(r) as Restaurant;
    await loadRestaurants();
    return res;
  },
  async updateRestaurant(id: string, patch: Partial<Restaurant>): Promise<void> {
    await api.restaurants.update(id, patch);
    await loadRestaurants();
  },
  async deleteRestaurant(id: string): Promise<void> {
    await api.restaurants.delete(id);
    await loadRestaurants();
  },

  // -------- Dishes (Backend API) --------
  async getDishes(): Promise<Dish[]> {
    if (!cachedDishes) await loadDishes();
    return cachedDishes || [];
  },
  async addDish(d: Omit<Dish, 'id' | 'createdAt'>): Promise<Dish> {
    const res = await api.dishes.create(d) as Dish;
    await loadDishes();
    return res;
  },
  async updateDish(id: string, patch: Partial<Dish>): Promise<void> {
    await api.dishes.update(id, patch);
    await loadDishes();
  },
  async deleteDish(id: string): Promise<void> {
    await api.dishes.delete(id);
    await loadDishes();
  },

  // -------- Orders (Backend API) --------
  async getOrders(): Promise<Order[]> {
    if (!cachedOrders) await loadOrders();
    return cachedOrders || [];
  },
  async addOrder(o: Omit<Order, 'id' | 'code' | 'createdAt' | 'history' | 'status'>): Promise<{ id: string; code: string }> {
    const res = await api.orders.create(o);
    await loadOrders();
    return res;
  },
  async updateOrder(id: string, patch: Partial<Order>): Promise<void> {
    await api.orders.update(id, patch);
    await loadOrders();
  },
  async advanceOrder(id: string, status: OrderStatus, extra?: Partial<Order>): Promise<void> {
    const order = (await store.getOrders()).find(o => o.id === id);
    const history = [...(order?.history ?? []), { status, at: Date.now() }];
    await api.orders.update(id, { status, history, ...extra });
    await loadOrders();
  },

  // Legacy compat
  deleteUser(_email: string) { throw new Error("Géré désormais par le backend"); },
};

// =========================================================================
// Hooks réactifs (Backend API)
// =========================================================================

export const useRestaurants = () => {
  useEffect(() => { if (!cachedRestaurants) loadRestaurants(); }, []);
  return useSyncExternalStore(subscribe, getRestaurantsSnapshot, () => []);
};

export const useDishes = () => {
  useEffect(() => { if (!cachedDishes) loadDishes(); }, []);
  return useSyncExternalStore(subscribe, getDishesSnapshot, () => []);
};

export const useOrders = () => {
  useEffect(() => { if (!cachedOrders) loadOrders(); }, []);
  return useSyncExternalStore(subscribe, getOrdersSnapshot, () => []);
};

// =========================================================================
// Utils
// =========================================================================
export function useOnlineStatus() {
  const [online, setOnline] = useState<boolean>(true);
  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener("online", on); window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  return online;
}

export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

export function formatGNF(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " GNF";
}

export function generateCode(prefix = "CMD") {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = prefix + "-";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export function whatsappUrl(phone: string, message: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

/**
 * Sélectionne le numéro WhatsApp cible selon le mode configuré.
 * - Mode 1 : whatsappPrincipal (ou supportWhatsapp en secours)
 * - Mode 2 : round-robin sur agents actifs (compteur localStorage)
 * - Mode 3 : aléatoire parmi agents actifs
 * - Mode 4 : premier agent actif (un seul attendu)
 * Fallback : supportWhatsapp / whatsappPrincipal si aucun agent actif.
 */
export function pickWhatsappTarget(settings: Settings): { phone: string; name: string } {
  const fallback = {
    phone: settings.whatsappPrincipal || settings.supportWhatsapp,
    name: "HaliMad",
  };
  const active = (settings.whatsappAgents || []).filter(a => a.active && a.phone);
  if (settings.whatsappMode === 1 || active.length === 0) return fallback;
  if (settings.whatsappMode === 3) {
    const a = active[Math.floor(Math.random() * active.length)];
    return { phone: a.phone, name: a.name || "Agent" };
  }
  if (settings.whatsappMode === 4) {
    const a = active[0];
    return { phone: a.phone, name: a.name || "Agent" };
  }
  // Mode 2 — round-robin
  let idx = 0;
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("halimad.wa_rr_index");
    idx = raw ? (parseInt(raw, 10) || 0) : 0;
    localStorage.setItem("halimad.wa_rr_index", String((idx + 1) % active.length));
  }
  const a = active[idx % active.length];
  return { phone: a.phone, name: a.name || "Agent" };
}

/**
 * Remplit le template messageAuto avec les variables de la commande.
 * Variables : {plat} {qty} {total} {adresse} {client} {phone} {code}
 */
export function formatAutoMessage(
  template: string,
  vars: { plat: string; qty: number; total: string; adresse: string; client: string; phone: string; code: string },
): string {
  return template
    .replaceAll("{plat}", vars.plat)
    .replaceAll("{qty}", String(vars.qty))
    .replaceAll("{total}", vars.total)
    .replaceAll("{adresse}", vars.adresse)
    .replaceAll("{client}", vars.client)
    .replaceAll("{phone}", vars.phone)
    .replaceAll("{code}", vars.code);
}

export async function compressImage(
  file: File,
  maxBytes = 800 * 1024,
  onProgress?: (p: number) => void,
): Promise<{ dataUrl: string; size: number }> {
  onProgress?.(0.05);
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image(); i.onload = () => resolve(i); i.onerror = reject; i.src = dataUrl;
  });
  let maxDim = 1600, quality = 0.85, out = dataUrl;
  let size = Math.ceil((dataUrl.length * 3) / 4);
  const render = (dim: number, q: number) => {
    const ratio = Math.min(1, dim / Math.max(img.width, img.height));
    const w = Math.round(img.width * ratio), h = Math.round(img.height * ratio);
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
    const u = canvas.toDataURL("image/jpeg", q);
    return { u, s: Math.ceil((u.length * 3) / 4) };
  };
  for (let i = 0; i < 8; i++) {
    const r = render(maxDim, quality);
    out = r.u; size = r.s;
    onProgress?.(0.3 + i * 0.08);
    if (size <= maxBytes) break;
    if (quality > 0.45) quality -= 0.1; else maxDim = Math.max(640, Math.round(maxDim * 0.85));
  }
  onProgress?.(1);
  return { dataUrl: out, size };
}

export function ambassadorShareLink(refCode: string) {
  if (typeof window === "undefined") return `?ref=${encodeURIComponent(refCode)}`;
  return `${window.location.origin}/restaurants?ref=${encodeURIComponent(refCode)}`;
}
