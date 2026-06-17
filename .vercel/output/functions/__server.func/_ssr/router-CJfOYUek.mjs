import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent, d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { Q as redirect } from "../_libs/tanstack__router-core.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import { S as ShieldCheck, U as UtensilsCrossed, M as Megaphone, B as Bike, a as ShoppingBag, b as Store, L as LogOut, W as WifiOff } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-compose-refs.mjs";
const appCss = "/assets/styles-CTCjx1Dc.css";
const API_BASE = typeof import.meta !== "undefined" && "https://halimadbackend.onrender.com" ? "https://halimadbackend.onrender.com" : "http://localhost:3000";
function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("halimad.token");
}
function setToken(token) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("halimad.token", token);
  } else {
    localStorage.removeItem("halimad.token");
  }
}
async function request(method, path, body, formData) {
  const headers = {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (body && !formData) headers["Content-Type"] = "application/json";
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: formData ?? (body ? JSON.stringify(body) : void 0),
    credentials: "include"
  });
  if (!res.ok) {
    let err;
    try {
      err = await res.json();
    } catch {
      err = { message: `HTTP ${res.status}` };
    }
    throw new Error(err?.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}
const api = {
  auth: {
    async signUp(opts) {
      return request("POST", "/api/auth/signup", opts);
    },
    async signIn(email, password) {
      return request("POST", "/api/auth/login", { email, password });
    },
    async me() {
      return request("GET", "/api/auth/me");
    }
  },
  // =========================================================================
  // Restaurants
  // =========================================================================
  restaurants: {
    async list() {
      return request("GET", "/api/restaurants");
    },
    async get(id) {
      return request("GET", `/api/restaurants/${id}`);
    },
    async create(body) {
      return request("POST", "/api/restaurants", body);
    },
    async update(id, body) {
      return request("PUT", `/api/restaurants/${id}`, body);
    },
    async delete(id) {
      return request("DELETE", `/api/restaurants/${id}`);
    }
  },
  // =========================================================================
  // Dishes
  // =========================================================================
  dishes: {
    async list() {
      return request("GET", "/api/dishes");
    },
    async create(body) {
      return request("POST", "/api/dishes", body);
    },
    async update(id, body) {
      return request("PUT", `/api/dishes/${id}`, body);
    },
    async delete(id) {
      return request("DELETE", `/api/dishes/${id}`);
    }
  },
  // =========================================================================
  // Orders
  // =========================================================================
  orders: {
    async list() {
      return request("GET", "/api/orders");
    },
    async create(body) {
      return request("POST", "/api/orders", body);
    },
    async update(id, body) {
      return request("PATCH", `/api/orders/${id}`, body);
    }
  },
  // =========================================================================
  // Settings
  // =========================================================================
  settings: {
    async get() {
      return request("GET", "/api/settings");
    },
    async update(body) {
      return request("PUT", "/api/settings", body);
    }
  },
  // =========================================================================
  // Users (admin)
  // =========================================================================
  users: {
    async list() {
      return request("GET", "/api/users");
    },
    async create(body) {
      return request("POST", "/api/users", body);
    },
    async update(id, body) {
      return request("PATCH", `/api/users/${id}`, body);
    }
  },
  // =========================================================================
  // Storage
  // =========================================================================
  storage: {
    async upload(file) {
      const fd = new FormData();
      fd.append("file", file);
      return request("POST", "/api/storage/upload", void 0, fd);
    }
  }
};
const DEFAULT_SETTINGS = {
  whatsappPrincipal: "224620000000",
  whatsappSecours: "",
  messageAuto: "Bonjour HaliMad, je souhaite commander : {plat} x{qty}. Total : {total}. Adresse : {adresse}. Client : {client} ({phone}). Code: {code}",
  feeLivreurGNF: 1e4,
  commissionHalimadPct: 10,
  commissionAmbassadeurPct: 5,
  orangeMoneyNumber: "620000000",
  supportWhatsapp: "224620000000",
  zonesLivraison: [],
  whatsappMode: 1,
  whatsappAgents: [],
  deliveryFeeGNF: 0,
  freeDeliveryThresholdGNF: null
};
let cachedSession = null;
let cachedSettings = DEFAULT_SETTINGS;
let cachedUsers = null;
let cachedRestaurants = null;
let cachedDishes = null;
let cachedOrders = null;
let initialized = false;
const listeners = /* @__PURE__ */ new Set();
function notify() {
  listeners.forEach((l) => l());
}
function subscribe(cb) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
function apiUserToUser(u) {
  return {
    id: u.id,
    email: u.email,
    password: "",
    name: u.name,
    role: u.role,
    whatsapp: u.whatsapp,
    city: u.city ?? "Labé",
    status: u.status
  };
}
async function loadSettings() {
  try {
    const data = await api.settings.get();
    cachedSettings = data;
    notify();
  } catch {
  }
}
async function loadUsers() {
  try {
    const data = await api.users.list();
    cachedUsers = data.map((u) => apiUserToUser(u));
    notify();
  } catch {
  }
}
async function loadRestaurants() {
  try {
    cachedRestaurants = await api.restaurants.list();
    notify();
  } catch {
  }
}
async function loadDishes() {
  try {
    cachedDishes = await api.dishes.list();
    notify();
  } catch {
  }
}
async function loadOrders() {
  try {
    cachedOrders = await api.orders.list();
    notify();
  } catch {
  }
}
async function ensureInit() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
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
const EMPTY_USERS = [];
const EMPTY_RESTAURANTS = [];
const EMPTY_DISHES = [];
const EMPTY_ORDERS = [];
function getSessionSnapshot() {
  return cachedSession;
}
function getSettingsSnapshot() {
  return cachedSettings;
}
function getUsersSnapshot() {
  return cachedUsers || EMPTY_USERS;
}
function getRestaurantsSnapshot() {
  return cachedRestaurants || EMPTY_RESTAURANTS;
}
function getDishesSnapshot() {
  return cachedDishes || EMPTY_DISHES;
}
function getOrdersSnapshot() {
  return cachedOrders || EMPTY_ORDERS;
}
const useSession = () => {
  reactExports.useEffect(() => {
    ensureInit();
  }, []);
  return reactExports.useSyncExternalStore(subscribe, getSessionSnapshot, () => null);
};
const useSettings = () => {
  reactExports.useEffect(() => {
    ensureInit();
  }, []);
  return reactExports.useSyncExternalStore(subscribe, getSettingsSnapshot, () => DEFAULT_SETTINGS);
};
const useUsers = () => {
  reactExports.useEffect(() => {
    if (!cachedUsers) loadUsers();
  }, []);
  return reactExports.useSyncExternalStore(subscribe, getUsersSnapshot, () => []);
};
const store = {
  // -------- Auth (Backend JWT) --------
  async signUp(opts) {
    const { token, user } = await api.auth.signUp(opts);
    setToken(token);
    cachedSession = apiUserToUser(user);
    notify();
    return { user };
  },
  async signIn(email, password) {
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
  async updateSettings(patch) {
    const updated = await api.settings.update(patch);
    cachedSettings = updated;
    notify();
  },
  getSettings() {
    return cachedSettings;
  },
  // Admin role/status management
  async addUser(u) {
    await api.users.create(u);
    await loadUsers();
  },
  async updateUserRoleStatus(userId, _role, status) {
    await api.users.update(userId, { status });
    await loadUsers();
  },
  async assignRole(userId, role) {
    await api.users.update(userId, { role });
    await loadUsers();
  },
  // -------- Restaurants (Backend API) --------
  async getRestaurants() {
    if (!cachedRestaurants) await loadRestaurants();
    return cachedRestaurants || [];
  },
  async addRestaurant(r) {
    const res = await api.restaurants.create(r);
    await loadRestaurants();
    return res;
  },
  async updateRestaurant(id, patch) {
    await api.restaurants.update(id, patch);
    await loadRestaurants();
  },
  async deleteRestaurant(id) {
    await api.restaurants.delete(id);
    await loadRestaurants();
  },
  // -------- Dishes (Backend API) --------
  async getDishes() {
    if (!cachedDishes) await loadDishes();
    return cachedDishes || [];
  },
  async addDish(d) {
    const res = await api.dishes.create(d);
    await loadDishes();
    return res;
  },
  async updateDish(id, patch) {
    await api.dishes.update(id, patch);
    await loadDishes();
  },
  async deleteDish(id) {
    await api.dishes.delete(id);
    await loadDishes();
  },
  // -------- Orders (Backend API) --------
  async getOrders() {
    if (!cachedOrders) await loadOrders();
    return cachedOrders || [];
  },
  async addOrder(o) {
    const res = await api.orders.create(o);
    await loadOrders();
    return res;
  },
  async updateOrder(id, patch) {
    await api.orders.update(id, patch);
    await loadOrders();
  },
  async advanceOrder(id, status, extra) {
    const order = (await store.getOrders()).find((o) => o.id === id);
    const history = [...order?.history ?? [], { status, at: Date.now() }];
    await api.orders.update(id, { status, history, ...extra });
    await loadOrders();
  },
  // Legacy compat
  deleteUser(_email) {
    throw new Error("Géré désormais par le backend");
  }
};
const useRestaurants = () => {
  reactExports.useEffect(() => {
    if (!cachedRestaurants) loadRestaurants();
  }, []);
  return reactExports.useSyncExternalStore(subscribe, getRestaurantsSnapshot, () => []);
};
const useDishes = () => {
  reactExports.useEffect(() => {
    if (!cachedDishes) loadDishes();
  }, []);
  return reactExports.useSyncExternalStore(subscribe, getDishesSnapshot, () => []);
};
const useOrders = () => {
  reactExports.useEffect(() => {
    if (!cachedOrders) loadOrders();
  }, []);
  return reactExports.useSyncExternalStore(subscribe, getOrdersSnapshot, () => []);
};
function useOnlineStatus() {
  const [online, setOnline] = reactExports.useState(true);
  reactExports.useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return online;
}
function useMounted() {
  const [m, setM] = reactExports.useState(false);
  reactExports.useEffect(() => setM(true), []);
  return m;
}
function formatGNF(amount) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " GNF";
}
function generateCode(prefix = "CMD") {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = prefix + "-";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}
function whatsappUrl(phone, message) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
function pickWhatsappTarget(settings) {
  const fallback = {
    phone: settings.whatsappPrincipal || settings.supportWhatsapp,
    name: "HaliMad"
  };
  const active = (settings.whatsappAgents || []).filter((a2) => a2.active && a2.phone);
  if (settings.whatsappMode === 1 || active.length === 0) return fallback;
  if (settings.whatsappMode === 3) {
    const a2 = active[Math.floor(Math.random() * active.length)];
    return { phone: a2.phone, name: a2.name || "Agent" };
  }
  if (settings.whatsappMode === 4) {
    const a2 = active[0];
    return { phone: a2.phone, name: a2.name || "Agent" };
  }
  let idx = 0;
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("halimad.wa_rr_index");
    idx = raw ? parseInt(raw, 10) || 0 : 0;
    localStorage.setItem("halimad.wa_rr_index", String((idx + 1) % active.length));
  }
  const a = active[idx % active.length];
  return { phone: a.phone, name: a.name || "Agent" };
}
function formatAutoMessage(template, vars) {
  return template.replaceAll("{plat}", vars.plat).replaceAll("{qty}", String(vars.qty)).replaceAll("{total}", vars.total).replaceAll("{adresse}", vars.adresse).replaceAll("{client}", vars.client).replaceAll("{phone}", vars.phone).replaceAll("{code}", vars.code);
}
function ambassadorShareLink(email) {
  if (typeof window === "undefined") return `?ref=${encodeURIComponent(email)}`;
  return `${window.location.origin}/restaurants?ref=${encodeURIComponent(email)}`;
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
function SiteHeader() {
  const user = useSession();
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 border-b bg-background/85 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex h-16 max-w-6xl items-center justify-between px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-bold", children: "H" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leading-tight", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: "HaliMad" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground -mt-0.5", children: "Repas livrés à Labé" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden md:flex items-center gap-6 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", activeOptions: { exact: true }, activeProps: { className: "text-primary font-semibold" }, children: "Accueil" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/restaurants", activeProps: { className: "text-primary font-semibold" }, children: "Restaurants" }),
      user?.role === "client" && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/orders", activeProps: { className: "text-primary font-semibold" }, children: "Mes commandes" }),
      user?.role === "restaurant" && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/restaurant", activeProps: { className: "text-primary font-semibold" }, children: "Mon resto" }),
      user?.role === "ambassadeur" && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/ambassadeur", activeProps: { className: "text-primary font-semibold" }, children: "Ambassadeur" }),
      user?.role === "livreur" && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/livreur", activeProps: { className: "text-primary font-semibold" }, children: "Livreur" }),
      user?.role === "admin" && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin", activeProps: { className: "text-primary font-semibold" }, children: "Admin" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: !user ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", children: "Connexion" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", children: "S'inscrire" }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      user.role === "admin" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", variant: "outline", className: "hidden sm:inline-flex", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4" }),
        " Admin"
      ] }) }),
      user.role === "restaurant" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", variant: "secondary", className: "hidden sm:inline-flex", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard/restaurant", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UtensilsCrossed, { className: "size-4" }),
        " Mon resto"
      ] }) }),
      user.role === "ambassadeur" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", variant: "secondary", className: "hidden sm:inline-flex", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard/ambassadeur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "size-4" }),
        " Ambassadeur"
      ] }) }),
      user.role === "livreur" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", variant: "secondary", className: "hidden sm:inline-flex", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard/livreur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bike, { className: "size-4" }),
        " Livreur"
      ] }) }),
      user.role === "client" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", variant: "secondary", className: "hidden sm:inline-flex", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/orders", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "size-4" }),
        " Commandes"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hidden md:inline text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "inline size-4 mr-1" }),
        user.name
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: () => {
        store.logout();
        navigate({ to: "/" });
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-4" }) })
    ] }) })
  ] }) });
}
function OfflineBanner() {
  const mounted = useMounted();
  const online = useOnlineStatus();
  if (!mounted || online) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-16 z-30 border-b bg-warning/95 text-warning-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 text-sm font-medium", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { className: "size-4" }),
    "Mode hors ligne — vous voyez les données déjà chargées."
  ] }) });
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page introuvable" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Cette page n'existe pas ou a été déplacée." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90", children: "Retour à l'accueil" }) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight", children: "Cette page n'a pas pu se charger" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Une erreur est survenue. Réessayez ou retournez à l'accueil." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        router2.invalidate();
        reset();
      }, className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90", children: "Réessayer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent", children: "Accueil" })
    ] })
  ] }) });
}
const Route$b = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "HaliMad — Repas livrés à Labé" },
      { name: "description", content: "Commandez vos repas auprès des restaurants partenaires à Labé. Livraison rapide, paiement cash ou Orange Money." },
      { name: "author", content: "HaliMad" },
      { property: "og:title", content: "HaliMad — Repas livrés à Labé" },
      { property: "og:description", content: "Commandez vos repas à Labé en quelques clics." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" }
    ],
    links: [{ rel: "stylesheet", href: appCss }]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "fr", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$b.useRouteContext();
  const year = 2026;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(OfflineBanner, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "border-t py-6 text-center text-xs text-muted-foreground", children: [
        "© ",
        year,
        " HaliMad — Labé, Guinée"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-center" })
  ] });
}
const $$splitComponentImporter$a = () => import("./register-BTU5dmpx.mjs");
const Route$a = createFileRoute("/register")({
  beforeLoad: () => {
    throw redirect({
      to: "/auth"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./orders-BhqJsr1A.mjs");
const Route$9 = createFileRoute("/orders")({
  head: () => ({
    meta: [{
      title: "Mes commandes — HaliMad"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./login-BTU5dmpx.mjs");
const Route$8 = createFileRoute("/login")({
  beforeLoad: () => {
    throw redirect({
      to: "/auth"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./auth-0GE3mN6G.mjs");
const Route$7 = createFileRoute("/auth")({
  head: () => ({
    meta: [{
      title: "Connexion — HaliMad"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./admin-DGSyq3x0.mjs");
const Route$6 = createFileRoute("/admin")({
  head: () => ({
    meta: [{
      title: "Admin — HaliMad"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./index-C3mUbHJZ.mjs");
const Route$5 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "HaliMad — Commandez votre repas à Labé"
    }, {
      name: "description",
      content: "Commandez vos repas auprès des restaurants partenaires à Labé. Livraison rapide par nos livreurs."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./restaurants.index-BIH4AgBu.mjs");
const Route$4 = createFileRoute("/restaurants/")({
  head: () => ({
    meta: [{
      title: "Restaurants à Labé — HaliMad"
    }]
  }),
  validateSearch: (s) => ({
    ref: typeof s.ref === "string" ? s.ref : void 0
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./restaurants._id-BoIwY1IT.mjs");
const Route$3 = createFileRoute("/restaurants/$id")({
  head: ({
    params
  }) => ({
    meta: [{
      title: `Menu — HaliMad`
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./dashboard.restaurant-DBYAaNdn.mjs");
const Route$2 = createFileRoute("/dashboard/restaurant")({
  head: () => ({
    meta: [{
      title: "Mon restaurant — HaliMad"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./dashboard.livreur-BLWBOkzd.mjs");
const Route$1 = createFileRoute("/dashboard/livreur")({
  head: () => ({
    meta: [{
      title: "Espace Livreur — HaliMad"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./dashboard.ambassadeur-Bmmpvivv.mjs");
const Route = createFileRoute("/dashboard/ambassadeur")({
  head: () => ({
    meta: [{
      title: "Espace Ambassadeur — HaliMad"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const RegisterRoute = Route$a.update({
  id: "/register",
  path: "/register",
  getParentRoute: () => Route$b
});
const OrdersRoute = Route$9.update({
  id: "/orders",
  path: "/orders",
  getParentRoute: () => Route$b
});
const LoginRoute = Route$8.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$b
});
const AuthRoute = Route$7.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$b
});
const AdminRoute = Route$6.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$b
});
const IndexRoute = Route$5.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$b
});
const RestaurantsIndexRoute = Route$4.update({
  id: "/restaurants/",
  path: "/restaurants/",
  getParentRoute: () => Route$b
});
const RestaurantsIdRoute = Route$3.update({
  id: "/restaurants/$id",
  path: "/restaurants/$id",
  getParentRoute: () => Route$b
});
const DashboardRestaurantRoute = Route$2.update({
  id: "/dashboard/restaurant",
  path: "/dashboard/restaurant",
  getParentRoute: () => Route$b
});
const DashboardLivreurRoute = Route$1.update({
  id: "/dashboard/livreur",
  path: "/dashboard/livreur",
  getParentRoute: () => Route$b
});
const DashboardAmbassadeurRoute = Route.update({
  id: "/dashboard/ambassadeur",
  path: "/dashboard/ambassadeur",
  getParentRoute: () => Route$b
});
const rootRouteChildren = {
  IndexRoute,
  AdminRoute,
  AuthRoute,
  LoginRoute,
  OrdersRoute,
  RegisterRoute,
  DashboardAmbassadeurRoute,
  DashboardLivreurRoute,
  DashboardRestaurantRoute,
  RestaurantsIdRoute,
  RestaurantsIndexRoute
};
const routeTree = Route$b._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Button as B,
  Route$3 as R,
  useOrders as a,
  useRestaurants as b,
  useUsers as c,
  useSettings as d,
  useDishes as e,
  formatGNF as f,
  cn as g,
  formatAutoMessage as h,
  generateCode as i,
  api as j,
  ambassadorShareLink as k,
  pickWhatsappTarget as p,
  router as r,
  store as s,
  useSession as u,
  whatsappUrl as w
};
