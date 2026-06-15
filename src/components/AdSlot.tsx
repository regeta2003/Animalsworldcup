export function AdSlot({ size = "300x250" }: { size?: "300x250" | "300x100" }) {
  const [w, h] = size.split("x").map(Number);
  return (
    <div
      className="w-full rounded-2xl border-2 border-dashed border-border bg-white grid place-items-center text-center"
      style={{ aspectRatio: `${w}/${h}` }}
    >
      <div>
        <div className="eyebrow text-muted-foreground">Advertisement</div>
        <div className="font-display font-bold text-ink/40 tabular-nums">{size}</div>
      </div>
    </div>
  );
}
