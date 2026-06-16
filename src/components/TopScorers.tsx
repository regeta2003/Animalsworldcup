import { TeamAvatar } from "./TeamAvatar";
import { useData } from "@/context/data";
import { Link } from "react-router-dom";

export function TopScorers() {
  const { scorers } = useData();
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="headline text-xl">Top Scorers</h3>
        <Link to="/statistics" className="text-pitch font-display font-bold text-xs uppercase tracking-widest hover:underline">Full List →</Link>
      </div>
      <div className="card-surface p-2 sm:p-3 grid grid-cols-1 md:grid-cols-2 gap-1.5">
        {scorers.length === 0 && (
          <div className="col-span-full px-3 py-4 text-sm text-muted-foreground">Top scorers will appear once matches begin.</div>
        )}
        {scorers.map((s) => (
          <div key={s.rank} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-soft transition">
            <span className="w-6 font-display font-extrabold text-ink/60 text-center">{s.rank}</span>
            <TeamAvatar name={s.team} img={s.img} size={36} />
            <div className="min-w-0 flex-1">
              <div className="font-semibold truncate">{s.name}</div>
              <div className="text-xs text-muted-foreground truncate">{s.team}</div>
            </div>
            <div className="text-right">
              <div className="font-display font-extrabold text-xl tabular-nums">{s.goals}</div>
              <div className="eyebrow text-muted-foreground">Goals</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
