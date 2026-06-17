import { WifiOff } from "lucide-react";
import { useMounted, useOnlineStatus } from "@/lib/store";

export function OfflineBanner() {
  const mounted = useMounted();
  const online = useOnlineStatus();
  if (!mounted || online) return null;
  return (
    <div className="sticky top-16 z-30 border-b bg-warning/95 text-warning-foreground">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 text-sm font-medium">
        <WifiOff className="size-4" />
        Mode hors ligne — vous voyez les données déjà chargées.
      </div>
    </div>
  );
}
