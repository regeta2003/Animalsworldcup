import { TeamAvatar } from "./TeamAvatar";
import { Radio } from "lucide-react";
import { useData } from "@/context/data";
import type { Match } from "@/lib/types";

function StatusBadge({ m, onDark = false }: { m: Match; onDark?: boolean }) {
  if (m.status === "live")
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-display font-bold tracking-wider ${onDark ? "bg-white/20 text-white" : "bg-live/10 text-live"}`}>
        <span className={onDark ? "inline-block h-2 w-2 rounded-full bg-white animate-pulse" : "live-dot"} /> {m.clock}
      </span>
    );
  if (m.status === "ht")
    return <span className={`px-2 py-0.5 rounded-md text-[11px] font-display font-bold tracking-wider ${onDark ? "bg-white/20 text-white" : "bg-gold/15 text-[#8a6500]"}`}>HT</span>;
  if (m.status === "ft")
    return <span className="px-2 py-0.5 rounded-md bg-soft text-muted-foreground text-[11px] font-display font-bold tracking-wider">FT</span>;
  const t = new Date(m.date);
  return (
    <span className="px-2 py-0.5 rounded-md bg-soft text-ink text-[11px] font-display font-bold tracking-wider">
      {t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </span>
  );
}

export function MatchCard({ m }: { m: Match }) {
  const isLive = m.status === "live" || m.status === "ht";
  return (
    <div className={`${isLive ? "card-live" : "card-surface card-hover"} p-4 flex flex-col gap-3`}>
      <div className="flex items-center justify-between">
        <span className={`eyebrow ${isLive ? "text-white/80" : "text-muted-foreground"}`}>Group {m.group}</span>
        <StatusBadge m={m} onDark={isLive} />
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <TeamAvatar name={m.home} img={m.homeImg} size={36} />
          <span className="font-display font-bold uppercase text-[15px] truncate">{m.home}</span>
        </div>
        <div className="text-center font-display font-extrabold text-3xl tracking-tight tabular-nums">
          {m.status === "ns" ? <span className={`text-xl ${isLive ? "text-white/70" : "text-muted-foreground"}`}>vs</span> : `${m.hs} - ${m.as}`}
        </div>
        <div className="flex items-center gap-2 justify-end min-w-0">
          <span className="font-display font-bold uppercase text-[15px] truncate text-right">{m.away}</span>
          <TeamAvatar name={m.away} img={m.awayImg} size={36} />
        </div>
      </div>
      <div className={`text-[11px] truncate ${isLive ? "text-white/70" : "text-muted-foreground"}`}>{m.venue}</div>
    </div>
  );
}

export function LiveMatches() {
  const { matches } = useData();
  const live = matches.filter((m) => m.status === "live" || m.status === "ht");
  const rest = matches.filter((m) => m.status !== "live" && m.status !== "ht");
  const show = [...live, ...rest].slice(0, 6);
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="headline text-xl flex items-center gap-2">
          <Radio className="h-5 w-5 text-live" />
          Live Matches <span className="live-dot ml-1" />
        </h3>
        <a href="#" className="text-pitch font-display font-bold text-xs uppercase tracking-widest hover:underline">View All Live →</a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {show.map((m, i) => <MatchCard key={i} m={m} />)}
      </div>
    </section>
  );
}
