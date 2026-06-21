import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { mascotFor } from "@/lib/mascots";
import { Flag } from "@/components/Flag";
import { useData } from "@/context/data";
import { X } from "lucide-react";
import type { Standings } from "@/lib/types";
import type { Overrides } from "@/lib/overrides";

type TeamCard = { country: string; animal: string; flag: string; color: string; img?: string; nick?: string; group: string };

function buildTeams(standings: Standings, ov: Overrides): TeamCard[] {
  const out: TeamCard[] = [];
  for (const [group, rows] of Object.entries(standings)) {
    for (const r of rows) {
      const m = mascotFor(r.country);
      out.push({ country: r.country, animal: r.animal, flag: r.flag, color: r.color, img: ov.mascots?.[r.country] || m?.img, nick: m?.nick, group });
    }
  }
  return out;
}

export default function Teams() {
  const { standings, overrides } = useData();
  const teams = buildTeams(standings, overrides);
  const [selected, setSelected] = useState<TeamCard | null>(null);

  return (
    <PageShell>
      <header className="mb-6">
        <span className="eyebrow text-pitch">Tournament</span>
        <h1 className="headline text-4xl sm:text-5xl mt-1">All Teams</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">Every nation and its mascot. Click any card for a quick team profile. Full standings live on the Table page.</p>
      </header>

      <section>
        <h2 className="headline text-xl mb-3">Mascot Squad</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {teams.map((t) => (
            <button
              key={`${t.group}-${t.country}`}
              onClick={() => setSelected(t)}
              className="card-surface card-hover p-3 text-left group"
            >
              <div className="aspect-square rounded-xl bg-soft overflow-hidden grid place-items-center relative">
                {t.img ? (
                  <img src={t.img} alt={t.country} className="h-full w-full object-cover object-top group-hover:scale-105 transition duration-500" />
                ) : t.flag ? (
                  <div className="h-full w-full grid place-items-center bg-soft">
                    <Flag code={t.flag} className="h-14 w-20 rounded-md shadow-sm group-hover:scale-105 transition duration-500" />
                  </div>
                ) : (
                  <span className="font-display font-extrabold text-white text-4xl" style={{
                    backgroundColor: t.color, width: "100%", height: "100%", display: "grid", placeItems: "center",
                  }}>{t.country.slice(0, 2).toUpperCase()}</span>
                )}
                <span className="absolute top-2 left-2 eyebrow px-1.5 py-0.5 rounded bg-white/90">Grp {t.group}</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <Flag code={t.flag} className="h-3.5 w-5 shrink-0" />
                <span className="font-display font-extrabold uppercase tracking-wide text-sm truncate">{t.country}</span>
              </div>
              <div className="text-[11px] text-muted-foreground truncate">{t.animal || t.nick || "—"}</div>
            </button>
          ))}
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm grid place-items-center p-4" onClick={() => setSelected(null)}>
          <div className="card-surface max-w-md w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-3 right-3 h-8 w-8 grid place-items-center rounded-lg hover:bg-soft"><X className="h-4 w-4" /></button>
            <div className="aspect-square rounded-2xl bg-soft overflow-hidden mb-4">
              {selected.img ? (
                <img src={selected.img} alt="" className="h-full w-full object-cover object-top" />
              ) : selected.flag ? (
                <div className="h-full w-full grid place-items-center bg-soft">
                  <Flag code={selected.flag} className="h-28 w-44 rounded-lg shadow" />
                </div>
              ) : (
                <div className="h-full w-full grid place-items-center text-white font-display font-extrabold text-7xl" style={{ background: selected.color }}>
                  {selected.country.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <span className="eyebrow text-pitch">Group {selected.group}</span>
            <h3 className="headline text-3xl mt-1 flex items-center gap-2"><Flag code={selected.flag} className="h-6 w-9" /> {selected.country}</h3>
            <div className="text-muted-foreground">{selected.animal || selected.nick || "Mascot national side"}</div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
