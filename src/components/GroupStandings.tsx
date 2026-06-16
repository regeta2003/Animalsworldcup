import { useData } from "@/context/data";
import { Link } from "react-router-dom";
import { Flag } from "@/components/Flag";
import type { StandingRow } from "@/lib/types";

function GroupTable({ letter, rows }: { letter: string; rows: StandingRow[] }) {
  return (
    <div className="card-surface card-hover p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center h-7 w-7 rounded-lg bg-pitch text-white font-display font-extrabold text-sm">
            {letter}
          </span>
          <span className="eyebrow text-muted-foreground">Group {letter}</span>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted-foreground text-[11px] font-display uppercase tracking-wider">
            <th className="text-left pb-2 w-6">#</th>
            <th className="text-left pb-2">Team</th>
            <th className="pb-2 w-7 text-center">P</th>
            <th className="pb-2 w-9 text-center">GD</th>
            <th className="pb-2 w-9 text-right">PTS</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.name} className={`border-t border-border/70 ${i < 2 ? "bg-accent/40" : ""}`}>
              <td className="py-2 font-display font-bold text-ink">{i + 1}</td>
              <td className="py-2">
                <span className="flex items-center gap-2">
                  <Flag code={r.flag} className="h-3.5 w-5 shrink-0" />
                  <span className="min-w-0">
                    <span className="font-semibold block leading-tight truncate">{r.country}</span>
                    {r.animal && <span className="text-[11px] text-muted-foreground block leading-tight truncate">{r.animal}</span>}
                  </span>
                </span>
              </td>
              <td className="py-2 text-center tabular-nums text-muted-foreground">{r.played}</td>
              <td className="py-2 text-center tabular-nums">{r.gd > 0 ? `+${r.gd}` : r.gd}</td>
              <td className="py-2 text-right tabular-nums font-display font-extrabold text-ink">{r.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function GroupStandings({ limit }: { limit?: number }) {
  const { standings } = useData();
  const letters = Object.keys(standings);
  const show = limit ? letters.slice(0, limit) : letters;
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="headline text-xl">Group Standings</h3>
        {limit && (
          <Link to="/table" className="text-pitch font-display font-bold text-xs uppercase tracking-widest hover:underline">All Groups →</Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {show.map((l) => <GroupTable key={l} letter={l} rows={standings[l]} />)}
      </div>
    </section>
  );
}
