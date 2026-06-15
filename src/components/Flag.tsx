import { flagUrl } from "@/lib/mascots";

/** Real flag image (flagcdn). Used instead of emoji flags, which don't render on Windows. */
export function Flag({ code, className = "h-3.5 w-5" }: { code?: string; className?: string }) {
  if (!code) return <span className={`inline-block ${className}`} aria-hidden="true" />;
  return (
    <img
      src={flagUrl(code)}
      alt=""
      loading="lazy"
      className={`inline-block object-cover rounded-[2px] ring-1 ring-black/10 ${className}`}
    />
  );
}
