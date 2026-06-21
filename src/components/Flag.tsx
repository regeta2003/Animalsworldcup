import { flagUrl } from "@/lib/mascots";
import { useData } from "@/context/data";

/** Real flag image (flagcdn), or an admin-uploaded flag when one exists for this
 *  code. Used instead of emoji flags, which don't render on Windows. */
export function Flag({ code, className = "h-3.5 w-5" }: { code?: string; className?: string }) {
  const { overrides } = useData();
  if (!code) return <span className={`inline-block ${className}`} aria-hidden="true" />;
  const src = overrides.flags?.[code] || flagUrl(code);
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      className={`inline-block object-cover rounded-[2px] ring-1 ring-black/10 ${className}`}
    />
  );
}
