import { useState } from "react";
import { TeamAvatar } from "./TeamAvatar";
import { useData } from "@/context/data";
import { Link } from "react-router-dom";
import type { Match } from "@/lib/types";

function MatchRow({ m }: { m: Match }) {
  const t = new Date(m.date);
  const dateLabel = t.toLocaleDateString([], { month: "short", day: "numeric" }).toUpperCase();
  const timeLabel = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="flex items-center gap-3 py-4 border-b border-border last:border-0">
      <div className="w-14 shrink-0 text-[11px] font-display font-bold text-muted-foreground leading-tight">
        <div>{dateLabel}</div>
        <div>{timeLabel}</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-sm font-display font-bold uppercase truncate">
          <TeamAvatar name={m.home} img={m.homeImg} size={26} />
          <span className="truncate">{m.home}</span>
          <span className="text-muted-foreground font-normal lowercase text-xs">vs</span>
          <TeamAvatar name={m.away} img={m.awayImg} size={26} />
          <span className="truncate">{m.away}</span>
          {m.status === "ft" && <span className="ml-1 text-muted-foreground tabular-nums">{m.hs}-{m.as}</span>}
        </div>
        <div className="text-[11px] text-muted-foreground truncate mt-0.5">{m.venue}</div>
      </div>
    </div>
  );
}

export function MatchesPanel() {
  const { matches } = useData();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const upcoming = matches.filter((m) => m.status !== "ft");
  const past = matches.filter((m) => m.status === "ft");
  const show = (tab === "upcoming" ? upcoming : past).slice(0, 3);

  return (
    <section className="relative card-surface rounded-3xl overflow-hidden p-4 sm:p-6 border border-gold/30 flex flex-col h-full shadow-[0_2px_8px_rgba(17,22,31,0.05),0_20px_48px_-20px_rgba(17,22,31,0.18)]">
      <h3 className="headline text-lg mb-4 text-center">Matches</h3>
      <div className="flex items-center justify-center gap-8 mb-2 border-b border-border">
        {(["upcoming", "past"] as const).map((k) => (
          <button key={k} onClick={() => setTab(k)}
            className={`relative pb-2.5 text-xs font-display font-bold uppercase tracking-wider transition ${
              tab === k ? "text-ink" : "text-muted-foreground"
            }`}>
            {k === "upcoming" ? "Upcoming" : "Past"}
            <span className={`absolute left-0 right-0 -bottom-px h-[2.5px] rounded-full bg-gold transition-opacity ${tab === k ? "opacity-100" : "opacity-0"}`} />
          </button>
        ))}
      </div>
      <div className="flex-1 flex flex-col justify-between">
        {show.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">No {tab} matches to show yet.</div>
        ) : (
          show.map((m, i) => <MatchRow key={i} m={m} />)
        )}
      </div>
      <Link to="/schedule" className="mt-4 w-full inline-flex items-center justify-center bg-gold text-gold-foreground py-2 rounded-xl font-display font-bold uppercase tracking-wider text-xs hover:brightness-95 transition">
        View Full Schedule →
      </Link>
    </section>
  );
}
