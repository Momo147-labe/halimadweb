// Composant d'upload d'image vers le backend Supabase storage.
// Affiche un aperçu et gère les états de chargement/erreur.

import { useRef, useState } from "react";
import { api } from "@/lib/api";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;          // URL courante
  onChange: (url: string) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className = "" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation basique côté client
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image (JPG, PNG, WebP…)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5 Mo");
      return;
    }

    setUploading(true);
    try {
      const { url } = await api.storage.upload(file);
      onChange(url);
      toast.success("Image uploadée avec succès");
    } catch (err: any) {
      toast.error(err?.message ?? "Erreur lors de l'upload");
    } finally {
      setUploading(false);
      // Reset input so the same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleClear = () => {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Aperçu de l'image */}
      <div
        className="relative w-full h-36 rounded-lg border-2 border-dashed border-muted-foreground/30 overflow-hidden bg-muted cursor-pointer hover:border-primary/60 transition-colors group"
        onClick={() => !uploading && inputRef.current?.click()}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="Aperçu"
              className="w-full h-full object-cover"
            />
            {/* Overlay au survol */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="size-6 text-white" />
              <span className="text-white text-sm ml-2">Changer</span>
            </div>
            {/* Bouton supprimer */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleClear(); }}
              className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
              title="Supprimer l'image"
            >
              <X className="size-3.5" />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            {uploading ? (
              <>
                <Loader2 className="size-6 animate-spin" />
                <span className="text-sm">Upload en cours…</span>
              </>
            ) : (
              <>
                <ImageIcon className="size-8" />
                <span className="text-sm">Cliquez pour ajouter une image</span>
                <span className="text-xs opacity-60">JPG, PNG, WebP — max 5 Mo</span>
              </>
            )}
          </div>
        )}
        {/* Spinner overlay pendant upload si image déjà définie */}
        {uploading && value && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="size-6 animate-spin text-white" />
          </div>
        )}
      </div>

      {/* Input fichier caché */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
        disabled={uploading}
      />
    </div>
  );
}
