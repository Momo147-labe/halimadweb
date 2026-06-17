import { useRef, useState } from "react";
import { compressImage } from "@/lib/store";
import { Image as ImageIcon, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
}

export function ImageUploader({ images, onChange, max = 6 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  async function handleFiles(files: FileList | File[]) {
    const list = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (!list.length) return;
    const space = max - images.length;
    if (space <= 0) { toast.error(`Maximum ${max} photos`); return; }
    const accepted = list.slice(0, space);
    const next = [...images];
    for (let i = 0; i < accepted.length; i++) {
      try {
        const { dataUrl, size } = await compressImage(accepted[i], 800 * 1024, p =>
          setProgress(((i + p) / accepted.length) * 100)
        );
        next.push(dataUrl);
        toast.success(`Image ${i + 1} compressée (${Math.round(size / 1024)} KB)`);
      } catch {
        toast.error("Échec compression image");
      }
    }
    onChange(next);
    setProgress(null);
  }

  return (
    <div className="space-y-3">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition ${
          dragOver ? "border-primary bg-primary/5" : "border-input hover:bg-muted/50"
        }`}
      >
        <Upload className="size-6 text-muted-foreground" />
        <div className="mt-2 text-sm font-medium">Glissez-déposez ou cliquez</div>
        <div className="text-xs text-muted-foreground">
          Compression automatique &lt; 800 KB · {images.length}/{max} photos
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {progress !== null && (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3 animate-spin" /> Traitement… {Math.round(progress)}%
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border bg-muted">
              <img src={src} alt={`photo ${i + 1}`} className="h-full w-full object-cover" />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                  Principale
                </span>
              )}
              <button
                type="button"
                onClick={() => onChange(images.filter((_, j) => j !== i))}
                className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-background/90 text-destructive opacity-0 transition group-hover:opacity-100"
                aria-label="Supprimer"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
          {images.length === 0 && (
            <div className="col-span-full flex items-center gap-2 text-xs text-muted-foreground">
              <ImageIcon className="size-4" /> Aucune photo
            </div>
          )}
        </div>
      )}
    </div>
  );
}
