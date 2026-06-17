import { Link, useNavigate } from "@tanstack/react-router";
import { store, useSession } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { LogOut, ShieldCheck, UtensilsCrossed, Bike, Megaphone, ShoppingBag, Store } from "lucide-react";

export function SiteHeader() {
  const user = useSession();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-bold">H</div>
          <div className="leading-tight">
            <div className="font-bold">HaliMad</div>
            <div className="text-xs text-muted-foreground -mt-0.5">Repas livrés à Labé</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-primary font-semibold" }}>Accueil</Link>
          <Link to="/restaurants" activeProps={{ className: "text-primary font-semibold" }}>Restaurants</Link>
          {user?.role === "client" && (
            <Link to="/orders" activeProps={{ className: "text-primary font-semibold" }}>Mes commandes</Link>
          )}
          {user?.role === "restaurant" && (
            <Link to="/dashboard/restaurant" activeProps={{ className: "text-primary font-semibold" }}>Mon resto</Link>
          )}
          {user?.role === "ambassadeur" && (
            <Link to="/dashboard/ambassadeur" activeProps={{ className: "text-primary font-semibold" }}>Ambassadeur</Link>
          )}
          {user?.role === "livreur" && (
            <Link to="/dashboard/livreur" activeProps={{ className: "text-primary font-semibold" }}>Livreur</Link>
          )}
          {user?.role === "admin" && (
            <Link to="/admin" activeProps={{ className: "text-primary font-semibold" }}>Admin</Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/auth">Connexion</Link></Button>
              <Button asChild size="sm"><Link to="/auth">S'inscrire</Link></Button>
            </>
          ) : (
            <>
              {user.role === "admin" && (
                <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
                  <Link to="/admin"><ShieldCheck className="size-4" /> Admin</Link>
                </Button>
              )}
              {user.role === "restaurant" && (
                <Button asChild size="sm" variant="secondary" className="hidden sm:inline-flex">
                  <Link to="/dashboard/restaurant"><UtensilsCrossed className="size-4" /> Mon resto</Link>
                </Button>
              )}
              {user.role === "ambassadeur" && (
                <Button asChild size="sm" variant="secondary" className="hidden sm:inline-flex">
                  <Link to="/dashboard/ambassadeur"><Megaphone className="size-4" /> Ambassadeur</Link>
                </Button>
              )}
              {user.role === "livreur" && (
                <Button asChild size="sm" variant="secondary" className="hidden sm:inline-flex">
                  <Link to="/dashboard/livreur"><Bike className="size-4" /> Livreur</Link>
                </Button>
              )}
              {user.role === "client" && (
                <Button asChild size="sm" variant="secondary" className="hidden sm:inline-flex">
                  <Link to="/orders"><ShoppingBag className="size-4" /> Commandes</Link>
                </Button>
              )}
              <span className="hidden md:inline text-sm text-muted-foreground">
                <Store className="inline size-4 mr-1" />{user.name}
              </span>
              <Button size="sm" variant="ghost" onClick={() => { store.logout(); navigate({ to: "/" }); }}>
                <LogOut className="size-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
