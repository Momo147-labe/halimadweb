import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { store, useSession, type Role } from "@/lib/store";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail, Lock, User as UserIcon, Phone, Loader2 } from "lucide-react";

function authMessage(err: unknown) {
  const authError = err as { code?: string; message?: unknown };
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

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Connexion — HaliMad" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const session = useSession();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [role, setRole] = useState<Role>("client");
  const [busy, setBusy] = useState(false);

  // Redirect once authenticated
  useEffect(() => { if (session) navigate({ to: "/" }); }, [session, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        if (!name.trim()) throw new Error("Nom requis");
        if (password.length < 6) throw new Error("Mot de passe : minimum 6 caractères");
        await store.signUp({ email, password, name, whatsapp: whatsapp.replace(/\D/g, ""), role });
        toast.success("Compte créé. Confirmez votre email avant la connexion.");
      } else {
        await store.signIn(email, password);
        toast.success("Connecté");
      }
    } catch (err: unknown) {
      toast.error(authMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (result.error) throw result.error;
      // result.redirected → browser will navigate to Google
    } catch (err: unknown) {
      toast.error(authMessage(err));
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-primary text-primary-foreground text-2xl font-bold">H</div>
        <h1 className="mt-3 text-2xl font-bold">HaliMad</h1>
        <p className="text-sm text-muted-foreground">Repas livrés à Labé</p>
      </div>

      <div className="mt-6 flex gap-1 rounded-lg border bg-muted/30 p-1">
        <button onClick={() => setMode("login")}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition ${mode === "login" ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
          Connexion
        </button>
        <button onClick={() => setMode("signup")}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition ${mode === "signup" ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
          Créer un compte
        </button>
      </div>

      <Button type="button" onClick={google} disabled={busy} variant="outline" className="mt-4 w-full">
        <svg viewBox="0 0 48 48" className="size-4"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.1 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.2 5.2C40.5 35.7 44 30.4 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
        Continuer avec Google
      </Button>

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">ou par email</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={submit} className="space-y-3">
        {mode === "signup" && (
          <>
            <Field icon={UserIcon}><Input placeholder="Nom complet" value={name} onChange={e => setName(e.target.value)} required /></Field>
            <Field icon={Phone}><Input placeholder="WhatsApp (ex 224620000000)" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} /></Field>
            <div className="relative">
              <select
                value={role}
                onChange={e => setRole(e.target.value as Role)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="client">Client</option>
                <option value="restaurant">Restaurant</option>
                <option value="ambassadeur">Ambassadeur</option>
                <option value="livreur">Livreur</option>
              </select>
            </div>
          </>
        )}
        <Field icon={Mail}><Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required /></Field>
        <Field icon={Lock}><Input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} /></Field>

        <Button type="submit" disabled={busy} className="w-full">
          {busy ? <Loader2 className="size-4 animate-spin" /> : null}
          {mode === "signup" ? "Créer mon compte" : "Se connecter"}
        </Button>
      </form>

      {mode === "signup" && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Le premier compte créé devient automatiquement admin.
        </p>
      )}

      <p className="mt-6 text-center text-xs text-muted-foreground">
        <Link to="/" className="hover:underline">← Retour à l'accueil</Link>
      </p>
    </div>
  );
}

function Field({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
      <div className="[&_input]:pl-9">{children}</div>
    </div>
  );
}
