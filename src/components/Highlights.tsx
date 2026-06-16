import { useRef } from "react";
import { highlights } from "@/data/mock";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

export function Highlights() {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="headline text-xl">Highlights</h3>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll(-1)} className="h-8 w-8 grid place-items-center rounded-lg border border-border bg-white hover:bg-soft transition" aria-label="Previous"><ChevronLeft className="h-4 w-4" /></button>
          <button onClick={() => scroll(1)} className="h-8 w-8 grid place-items-center rounded-lg border border-border bg-white hover:bg-soft transition" aria-label="Next"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
      <div ref={ref} className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 scrollbar-hide">
        {highlights.map((h, i) => (
          <a key={i} href="https://www.youtube.com/@animalsworldcup-z4u" target="_blank" rel="noopener noreferrer" className="snap-start shrink-0 w-[280px] sm:w-[300px] card-surface card-hover overflow-hidden group block">
            <div className="relative h-[160px] bg-soft overflow-hidden">
              <img src={h.img} alt="" className="absolute inset-0 h-full w-full object-cover object-top group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/70 text-white text-[11px] font-display font-bold tabular-nums">{h.duration}</span>
              <div className="absolute inset-0 grid place-items-center">
                <span className="grid place-items-center h-12 w-12 rounded-full bg-white/95 text-pitch shadow-lg group-hover:scale-110 transition">
                  <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
                </span>
              </div>
            </div>
            <div className="p-3">
              <span className="eyebrow text-pitch">{h.matchday}</span>
              <h4 className="mt-1 font-semibold text-[14px] leading-snug line-clamp-2">{h.title}</h4>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
