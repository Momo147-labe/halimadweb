import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { store, useSession } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { LogOut, ShieldCheck, UtensilsCrossed, Bike, Megaphone, ShoppingBag, Store, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader, SheetClose } from "@/components/ui/sheet";

export function SiteHeader() {
  const user = useSession();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="size-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px]">
              <SheetHeader className="mb-4">
                <SheetTitle className="text-left font-bold">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 text-sm">
                <Link to="/" onClick={() => setOpen(false)} activeOptions={{ exact: true }} activeProps={{ className: "text-primary font-semibold" }}>Accueil</Link>
                <Link to="/restaurants" onClick={() => setOpen(false)} activeProps={{ className: "text-primary font-semibold" }}>Restaurants</Link>
                {user?.role === "client" && (
                  <Link to="/orders" onClick={() => setOpen(false)} activeProps={{ className: "text-primary font-semibold" }}>Mes commandes</Link>
                )}
                {user?.role === "restaurant" && (
                  <Link to="/dashboard/restaurant" onClick={() => setOpen(false)} activeProps={{ className: "text-primary font-semibold" }}>Mon resto</Link>
                )}
                {user?.role === "ambassadeur" && (
                  <Link to="/dashboard/ambassadeur" onClick={() => setOpen(false)} activeProps={{ className: "text-primary font-semibold" }}>Ambassadeur</Link>
                )}
                {user?.role === "livreur" && (
                  <Link to="/dashboard/livreur" onClick={() => setOpen(false)} activeProps={{ className: "text-primary font-semibold" }}>Livreur</Link>
                )}
                {user?.role === "admin" && (
                  <Link to="/admin" onClick={() => setOpen(false)} activeProps={{ className: "text-primary font-semibold" }}>Admin</Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-bold">H</div>
          <div className="leading-tight">
            <div className="font-bold">HaliMad</div>
            <div className="text-xs text-muted-foreground -mt-0.5 hidden sm:block">Repas livrés à Labé</div>
          </div>
        </Link>
        </div>

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
