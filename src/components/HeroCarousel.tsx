import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { topStories } from "@/data/mock";

export function HeroCarousel() {
  const [i, setI] = useState(0);
  const paused = useRef(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) setI((p) => (p + 1) % topStories.length);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  const go = (n: number) => setI((n + topStories.length) % topStories.length);

  return (
    <section
      className="relative card-surface overflow-hidden"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      <div className="relative h-[360px] sm:h-[400px] lg:h-[440px]">
        {topStories.map((s, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            aria-hidden={idx !== i}
          >
            <div className="absolute inset-0" style={{ background: `linear-gradient(110deg, #ffffff 0%, #ffffff 48%, ${s.color}18 70%, ${s.color}28 100%)` }} />
            <div className="absolute -right-10 -bottom-10 w-[70%] h-[120%] opacity-[0.06]" style={{ background: `radial-gradient(closest-side, ${s.color}, transparent)` }} />

            <div className="relative h-full grid grid-cols-1 md:grid-cols-2 items-center px-6 sm:px-10">
              <div className="z-10 max-w-xl fade-in">
                <span className="eyebrow inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gold text-gold-foreground">
                  ★ {s.tag}
                </span>
                <h2 className="headline hero-legible mt-4 text-[34px] sm:text-[44px] lg:text-[52px] text-ink">
                  {s.title}
                </h2>
                <p className="hero-legible mt-3 text-muted-foreground text-[15px] max-w-md">{s.sub}</p>
              </div>
              <div className="absolute right-0 inset-y-0 w-1/2 hidden md:block">
                <img src={s.img} alt="" className="h-full w-full object-contain object-bottom-right scale-110" />
              </div>
              <div className="md:hidden absolute right-0 bottom-0 w-2/3 h-3/4 opacity-90">
                <img src={s.img} alt="" className="h-full w-full object-contain object-bottom-right" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => go(i - 1)} aria-label="Previous" className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center rounded-full bg-white/90 hover:bg-white border border-border shadow-[var(--shadow-card)] transition">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={() => go(i + 1)} aria-label="Next" className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center rounded-full bg-white/90 hover:bg-white border border-border shadow-[var(--shadow-card)] transition">
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {topStories.map((_, idx) => (
          <button key={idx} aria-label={`Slide ${idx + 1}`} onClick={() => go(idx)}
            className={`h-2 rounded-full transition-all ${idx === i ? "w-8 bg-pitch" : "w-2 bg-ink/20 hover:bg-ink/40"}`} />
        ))}
      </div>
    </section>
  );
}
