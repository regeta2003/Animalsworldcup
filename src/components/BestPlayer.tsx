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
      <div className="relative h-32 bg-gradient-to-br from-pitch via-pitch to-primary-deep">
        <div className="absolute inset-0 opacity-25" style={{ background: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4), transparent 60%)" }} />
        <div className="relative p-4 text-white">
          <span className="eyebrow opacity-80">Best Player of the Day</span>
          <h3 className="headline text-xl mt-1">Today's MVP</h3>
        </div>
        {hasData && bestPlayer.img ? (
          <EditImage target={{ kind: "player", key: bestPlayer.name }} className="absolute -bottom-2 right-0 h-40">
            <img src={bestPlayer.img} alt={bestPlayer.name} className="h-40 object-contain object-bottom-right" />
          </EditImage>
        ) : hasData && bestPlayer.flag ? (
          <div className="absolute -bottom-3 right-5 h-24 w-24 rounded-full overflow-hidden ring-4 ring-white/40 shadow-xl">
            <Flag code={bestPlayer.flag} className="h-full w-full" />
          </div>
        ) : null}
      </div>

      {hasData ? (
        <div className="p-4 -mt-4 relative">
          <div className="font-display font-extrabold text-xl text-ink flex items-center gap-1.5">
            {bestPlayer.name}
            <Star className="h-4 w-4 text-gold" fill="currentColor" />
          </div>
          <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <Flag code={bestPlayer.flag} className="h-3 w-4 shrink-0" />
            <span>{bestPlayer.team}{bestPlayer.animal ? ` · ${bestPlayer.animal}` : ""}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { l: "Goals", v: bestPlayer.goals },
              { l: "Assists", v: bestPlayer.assists },
              { l: "Rating", v: bestPlayer.rating.toFixed(1) },
            ].map((s) => (
              <div key={s.l} className="text-center bg-soft rounded-xl py-2">
                <div className="font-display font-extrabold text-lg tabular-nums">{s.v}</div>
                <div className="eyebrow text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
          <Link to="/statistics" className="mt-4 w-full inline-flex items-center justify-center gap-1.5 bg-pitch text-white py-2.5 rounded-xl font-display font-bold uppercase tracking-wider text-xs hover:bg-primary-deep transition">
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
