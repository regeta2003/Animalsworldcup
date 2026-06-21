import { useRef, useState, type ReactNode } from "react";
import { Upload, Loader2, Pencil } from "lucide-react";
import { useEdit, type ImgTarget, type TextTarget } from "@/context/edit";
import { uploadImage } from "@/lib/adminClient";

/** Wraps an existing image element. When edit mode is on, hovering shows a
 *  drag-drop / click-to-replace overlay; otherwise renders children untouched. */
export function EditImage({
  target, children, className = "", round = false,
}: { target: ImgTarget; children: ReactNode; className?: string; round?: boolean }) {
  const { editing, onImage, onError } = useEdit();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);

  if (!editing) return <>{children}</>;

  const handle = async (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { onError("Please choose an image file"); return; }
    if (file.size > 4 * 1024 * 1024) { onError("Image is larger than 4 MB"); return; }
    setBusy(true);
    try { onImage(target, await uploadImage(file)); }
    catch (e: any) { onError(e?.message || "Upload failed"); }
    finally { setBusy(false); }
  };

  const stop = (e: any) => { e.preventDefault(); e.stopPropagation(); };

  return (
    <span
      className={`relative inline-block group/edit cursor-pointer ${className}`}
      onClick={(e) => { stop(e); inputRef.current?.click(); }}
      onDragOver={(e) => { stop(e); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { stop(e); setOver(false); handle(e.dataTransfer.files?.[0]); }}
    >
      {children}
      <span
        className={`absolute inset-0 grid place-items-center text-white text-[10px] font-display font-bold uppercase tracking-wider transition ${round ? "rounded-full" : "rounded-md"} ${
          over ? "bg-pitch/80 ring-2 ring-gold" : "bg-black/45 opacity-0 group-hover/edit:opacity-100"
        }`}
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : (<span className="flex flex-col items-center gap-0.5"><Upload className="h-4 w-4" />replace</span>)}
      </span>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => { handle(e.target.files?.[0]); e.target.value = ""; }} />
    </span>
  );
}

/** Inline-editable text. Edit mode -> contentEditable with a subtle outline. */
export function EditText({
  target, value, as = "span", className = "",
}: { target: TextTarget; value: string; as?: keyof JSX.IntrinsicElements; className?: string }) {
  const { editing, onText } = useEdit();
  const Tag = as as any;
  if (!editing) return <Tag className={className}>{value}</Tag>;
  return (
    <Tag
      className={`${className} outline-dashed outline-1 outline-gold/70 hover:outline-gold focus:outline-2 focus:outline-pitch rounded-sm px-0.5 cursor-text`}
      contentEditable
      suppressContentEditableWarning
      title="Click to edit"
      onClick={(e: any) => { e.preventDefault(); e.stopPropagation(); }}
      onBlur={(e: any) => onText(target, e.currentTarget.textContent || "")}
    >
      {value}
    </Tag>
  );
}

/** Small badge marking that a region is editable (used where there's no image). */
export function EditHint({ label }: { label: string }) {
  const { editing } = useEdit();
  if (!editing) return null;
  return (
    <span className="absolute top-1 left-1 z-10 inline-flex items-center gap-1 rounded bg-gold text-gold-foreground px-1.5 py-0.5 text-[10px] font-display font-bold uppercase tracking-wider pointer-events-none">
      <Pencil className="h-3 w-3" /> {label}
    </span>
  );
}
