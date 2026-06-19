import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useSession, B as Button, s as store } from "./router-CbXqaiQQ.mjs";
import { c as createLovableAuth } from "../_libs/lovable.dev__cloud-auth-js.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import { I as Input } from "./input-C9xGZalr.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { e as User, P as Phone, f as Mail, g as Lock, h as LoaderCircle } from "../_libs/lucide-react.mjs";
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
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
function createSupabaseClient() {
  const SUPABASE_URL = "https://fldoyalgsmmidytwcsyu.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsZG95YWxnc21taWR5dHdjc3l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2Njg4ODEsImV4cCI6MjA5NjI0NDg4MX0.bGxMZmpBCscSugg8d_MngmbxIiCr0ffsHbSMvnFvzl0";
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : void 0,
      persistSession: true,
      autoRefreshToken: true
    }
  });
}
let _supabase;
const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  }
});
const lovableAuth = createLovableAuth();
const lovable = {
  auth: {
    signInWithOAuth: async (provider, opts) => {
      const result = await lovableAuth.signInWithOAuth(provider, {
        redirect_uri: opts?.redirect_uri,
        extraParams: {
          ...opts?.extraParams
        }
      });
      if (result.redirected) {
        return result;
      }
      if (result.error) {
        return result;
      }
      try {
        await supabase.auth.setSession(result.tokens);
      } catch (e) {
        return { error: e instanceof Error ? e : new Error(String(e)) };
      }
      return result;
    }
  }
};
function authMessage(err) {
  const authError = err;
  const code = authError?.code;
  const message = String(authError?.message ?? "");
  if (code === "email_not_confirmed" || message.includes("Email not confirmed")) {
    return "Email non confirmé : ouvrez le lien reçu par email avant de vous connecter.";
  }
  if (code === "invalid_credentials" || message.includes("Invalid login credentials")) {
    return "Email ou mot de passe incorrect.";
  }
  if (code === "over_email_send_rate_limit") {
    return "Patientez quelques secondes avant de redemander un code/email.";
  }
  if (code === "weak_password") {
    return "Mot de passe trop faible : utilisez un mot de passe plus difficile à deviner.";
  }
  return message || "Erreur de connexion";
}
function AuthPage() {
  const navigate = useNavigate();
  const session = useSession();
  const [mode, setMode] = reactExports.useState("login");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [whatsapp, setWhatsapp] = reactExports.useState("");
  const [role, setRole] = reactExports.useState("client");
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (session) navigate({
      to: "/"
    });
  }, [session, navigate]);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        if (!name.trim()) throw new Error("Nom requis");
        if (password.length < 6) throw new Error("Mot de passe : minimum 6 caractères");
        await store.signUp({
          email,
          password,
          name,
          whatsapp: whatsapp.replace(/\D/g, ""),
          role
        });
        toast.success("Compte créé. Confirmez votre email avant la connexion.");
      } else {
        await store.signIn(email, password);
        toast.success("Connecté");
      }
    } catch (err) {
      toast.error(authMessage(err));
    } finally {
      setBusy(false);
    }
  };
  const google = async () => {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin
      });
      if (result.error) throw result.error;
    } catch (err) {
      toast.error(authMessage(err));
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-4 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto grid h-14 w-14 place-items-center rounded-xl bg-primary text-primary-foreground text-2xl font-bold", children: "H" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 text-2xl font-bold", children: "HaliMad" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Repas livrés à Labé" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex gap-1 rounded-lg border bg-muted/30 p-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMode("login"), className: `flex-1 rounded-md py-2 text-sm font-medium transition ${mode === "login" ? "bg-background shadow-sm" : "text-muted-foreground"}`, children: "Connexion" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMode("signup"), className: `flex-1 rounded-md py-2 text-sm font-medium transition ${mode === "signup" ? "bg-background shadow-sm" : "text-muted-foreground"}`, children: "Créer un compte" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", onClick: google, disabled: busy, variant: "outline", className: "mt-4 w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 48 48", className: "size-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#FFC107", d: "M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#FF3D00", d: "M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#4CAF50", d: "M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.1 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#1976D2", d: "M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.2 5.2C40.5 35.7 44 30.4 44 24c0-1.3-.1-2.4-.4-3.5z" })
      ] }),
      "Continuer avec Google"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-4 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "ou par email" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
      mode === "signup" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { icon: User, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Nom complet", value: name, onChange: (e) => setName(e.target.value), required: true }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { icon: Phone, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "WhatsApp (ex 224620000000)", value: whatsapp, onChange: (e) => setWhatsapp(e.target.value) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: role, onChange: (e) => setRole(e.target.value), className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "client", children: "Client" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "restaurant", children: "Restaurant" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ambassadeur", children: "Ambassadeur" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "livreur", children: "Livreur" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { icon: Mail, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value), required: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { icon: Lock, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", placeholder: "Mot de passe", value: password, onChange: (e) => setPassword(e.target.value), required: true, minLength: 6 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: busy, className: "w-full", children: [
        busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : null,
        mode === "signup" ? "Créer mon compte" : "Se connecter"
      ] })
    ] }),
    mode === "signup" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-center text-xs text-muted-foreground", children: "Le premier compte créé devient automatiquement admin." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-center text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:underline", children: "← Retour à l'accueil" }) })
  ] });
}
function Field({
  icon: Icon,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "[&_input]:pl-9", children })
  ] });
}
export {
  AuthPage as component
};
