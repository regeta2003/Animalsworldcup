type Props = {
  name: string;
  img?: string | null;
  color?: string;
  size?: number;
  className?: string;
};

export function TeamAvatar({ name, img, color = "#0B8A3D", size = 40, className = "" }: Props) {
  const initials = name.slice(0, 2).toUpperCase();
  const style = { width: size, height: size };
  if (img) {
    return (
      <div
        className={`relative rounded-full overflow-hidden bg-soft ring-1 ring-border ${className}`}
        style={style}
      >
        <img src={img} alt={name} className="absolute inset-0 h-full w-full object-cover object-top" />
      </div>
    );
  }
  return (
    <div
      className={`rounded-full grid place-items-center font-display font-bold text-white ring-1 ring-border/60 ${className}`}
      style={{ ...style, background: color, fontSize: size * 0.36 }}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
