import { Star, ArrowRight } from "lucide-react";
import { useData } from "@/context/data";
import { Flag } from "@/components/Flag";
import { Link } from "react-router-dom";
import { EditImage } from "@/components/admin/Editable";

export function BestPlayer() {
  const { bestPlayer } = useData();
  const hasData = bestPlayer && bestPlayer.rating > 0;
  return (
    <section className="card-surface overflow-hidden">
      <div className="relative bg-gradient-to-br from-pitch via-pitch to-primary-deep px-4 pt-4 pb-3 text-white text-center">
        <div className="absolute inset-0 opacity-25" style={{ background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.4), transparent 60%)" }} />
        <div className="relative">
          <span className="eyebrow opacity-80 block">Best Player of the Day</span>
          <h3 className="headline text-lg mt-1">Today's MVP</h3>
        </div>
      </div>

      {hasData && (bestPlayer.img || bestPlayer.flag) && (
        <div className="flex justify-center -mt-7 relative">
          {bestPlayer.img ? (
            <EditImage target={{ kind: "player", key: bestPlayer.name }} className="h-16 w-16 rounded-full overflow-hidden ring-4 ring-white shadow-xl bg-soft block">
              <img src={bestPlayer.img} alt={bestPlayer.name} className="h-full w-full object-cover object-top" />
            </EditImage>
          ) : (
            <div className="h-16 w-16 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
              <Flag code={bestPlayer.flag} className="h-full w-full" />
            </div>
          )}
        </div>
      )}

      {hasData ? (
        <div className="p-4 pt-2 text-center">
          <div className="font-display font-extrabold text-base text-ink flex items-center justify-center gap-1.5 truncate">
            {bestPlayer.name}
            <Star className="h-3.5 w-3.5 text-gold shrink-0" fill="currentColor" />
          </div>
          <div className="text-xs text-muted-foreground mt-0.5 flex items-center justify-center gap-1.5 truncate">
            <Flag code={bestPlayer.flag} className="h-3 w-4 shrink-0" />
            <span className="truncate">{bestPlayer.team}{bestPlayer.animal ? ` · ${bestPlayer.animal}` : ""}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 mt-3">
            {[
              { l: "Goals", v: bestPlayer.goals },
              { l: "Assists", v: bestPlayer.assists },
              { l: "Rating", v: bestPlayer.rating.toFixed(1) },
            ].map((s) => (
              <div key={s.l} className="text-center bg-soft rounded-xl py-1.5 px-1">
                <div className="font-display font-extrabold text-sm tabular-nums">{s.v}</div>
                <div className="eyebrow text-muted-foreground text-[9px]">{s.l}</div>
              </div>
            ))}
          </div>
          <Link to="/statistics" className="mt-3 w-full inline-flex items-center justify-center gap-1.5 bg-pitch text-white py-2 rounded-xl font-display font-bold uppercase tracking-wider text-xs hover:bg-primary-deep transition">
            View Profile <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="p-6 text-center">
          <div className="font-display font-bold text-ink">Awarded after kickoff</div>
          <div className="text-xs text-muted-foreground mt-1">Check back once today's matches begin.</div>
        </div>
      )}
    </section>
  );
}
