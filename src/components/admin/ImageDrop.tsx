import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/adminClient";

type Props = {
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  aspect?: string;   // e.g. "1 / 1", "300 / 250"
  onError?: (msg: string) => void;
};

/** Drag-and-drop / click-to-pick image uploader. Uploads to Vercel Blob and
 *  returns the public URL via onChange. */
export function ImageDrop({ value, onChange, label, aspect = "1 / 1", onError }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);

  const handle = async (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { onError?.("Please choose an image file"); return; }
    if (file.size > 4 * 1024 * 1024) { onError?.("Image is larger than 4 MB — please pick a smaller one"); return; }
    setBusy(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (e: any) {
      onError?.(e?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {label && <div className="text-[11px] font-display uppercase tracking-wider text-muted-foreground mb-1">{label}</div>}
      <div
        onClick={() => !busy && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); handle(e.dataTransfer.files?.[0]); }}
        className={`relative grid place-items-center rounded-xl border-2 border-dashed cursor-pointer overflow-hidden transition bg-soft ${
          over ? "border-pitch bg-accent/40" : "border-border hover:border-pitch/60"
        }`}
        style={{ aspectRatio: aspect }}
      >
        {value ? (
          <>
            <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(null); }}
              className="absolute top-1.5 right-1.5 h-7 w-7 grid place-items-center rounded-lg bg-black/60 text-white hover:bg-black/80"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="text-center px-2 text-muted-foreground">
            <Upload className="h-5 w-5 mx-auto mb-1" />
            <div className="text-[11px] leading-tight">Drop or click<br />to upload</div>
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-white/70">
            <Loader2 className="h-6 w-6 animate-spin text-pitch" />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { handle(e.target.files?.[0]); e.target.value = ""; }}
      />
    </div>
  );
}
