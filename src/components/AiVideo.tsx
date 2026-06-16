import { Play, Sparkles } from "lucide-react";
import { highlights } from "@/data/mock";

export function AiVideo() {
  const v = highlights[0];
  return (
    <section className="card-surface overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4">
        <h3 className="headline text-base flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-pitch" /> AI Generated Video</h3>
        <span className="eyebrow px-1.5 py-0.5 rounded bg-gold text-gold-foreground">NEW</span>
      </div>
      <a href="https://www.youtube.com/@animalsworldcup-z4u" target="_blank" rel="noopener noreferrer" className="relative block mt-3 h-[150px] mx-3 mb-3 rounded-xl overflow-hidden bg-soft group cursor-pointer">
        <img src={v.img} alt="" className="absolute inset-0 h-full w-full object-cover object-top group-hover:scale-105 transition duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute inset-0 grid place-items-center">
          <span className="grid place-items-center h-12 w-12 rounded-full bg-white/95 text-pitch shadow-lg group-hover:scale-110 transition">
            <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
          </span>
        </div>
        <div className="absolute bottom-2 left-3 right-3 text-white font-semibold text-sm leading-snug line-clamp-2">{v.title}</div>
      </a>
    </section>
  );
}
