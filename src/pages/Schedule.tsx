import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { TeamAvatar } from "@/components/TeamAvatar";
import { useData } from "@/context/data";
import type { Match } from "@/lib/types";

const ZONES = {
  EU: { tz: "Europe/Berlin",    label: "EU · Berlin" },
  US: { tz: "America/New_York", label: "US · New York" },
  AS: { tz: "Asia/Tokyo",       label: "Asia · Tokyo" },
} as const;
type ZoneKey = keyof typeof ZONES;

function fmt(date: string, tz: string) {
  const d = new Date(date);
  const day = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: tz });
  const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: tz });
  return { day, time };
}

export default function Schedule() {
  const { matches } = useData();
  const [zone, setZone] = useState<ZoneKey>("EU");
  const tz = ZONES[zone].tz;

  const byDay = useMemo(() => {
    const groups: Record<string, Match[]> = {};
    for (const m of [...matches].sort((a, b) => +new Date(a.date) - +new Date(b.date))) {
      const key = fmt(m.date, tz).day;
      (groups[key] ||= []).push(m);
    }
    return groups;
  }, [tz, matches]);

  return (
    <PageShell>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow text-pitch">Fixtures</span>
          <h1 className="headline text-4xl sm:text-5xl mt-1">Match Schedule</h1>
          <p className="text-muted-foreground mt-2">Kickoffs shown in <span className="font-semibold text-ink">{ZONES[zone].label}</span> time.</p>
        </div>
        <div className="inline-flex p-1 bg-white border border-border rounded-xl shadow-[var(--shadow-card)]">
          {(Object.keys(ZONES) as ZoneKey[]).map((z) => (
            <button
              key={z}
              onClick={() => setZone(z)}
              className={`px-4 py-2 rounded-lg font-display font-bold uppercase tracking-wider text-xs transition ${
                zone === z ? "bg-pitch text-white shadow-[var(--shadow-glow-pitch)]" : "text-ink/70 hover:text-ink"
              }`}
            >
              {z === "EU" ? "Europe" : z === "US" ? "Americas" : "Asia"}
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-8">
        {Object.entries(byDay).map(([day, list]) => (
          <section key={day}>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px flex-1 bg-border" />
              <h2 className="headline text-lg text-ink">{day}</h2>
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="card-surface divide-y divide-border">
              {list.map((m, i) => {
                const { time } = fmt(m.date, tz);
                return (
                  <div key={i} className="grid grid-cols-[60px_1fr_auto_1fr_60px] sm:grid-cols-[80px_1fr_auto_1fr_120px] items-center gap-3 px-4 py-3 hover:bg-soft transition">
                    <div className="text-center">
                      <div className="font-display font-extrabold text-lg tabular-nums leading-none">{time}</div>
                      <div className="eyebrow text-muted-foreground mt-1">Grp {m.group}</div>
                    </div>
                    <div className="flex items-center gap-2 justify-end min-w-0">
                      <span className="font-display font-bold uppercase truncate text-sm sm:text-base text-right">{m.home}</span>
                      <TeamAvatar name={m.home} img={m.homeImg} size={32} />
                    </div>
                    <div className="font-display font-extrabold tabular-nums text-center min-w-[60px]">
                      {m.status === "ns" ? <span className="text-muted-foreground">vs</span> : `${m.hs} - ${m.as}`}
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <TeamAvatar name={m.away} img={m.awayImg} size={32} />
                      <span className="font-display font-bold uppercase truncate text-sm sm:text-base">{m.away}</span>
                    </div>
                    <div className="hidden sm:block text-[11px] text-muted-foreground truncate text-right">{m.venue}</div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
