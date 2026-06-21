import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as mock from "@/data/mock";
import { fetchStandings, fetchFixtures, fetchScorers, fetchOverrides } from "@/lib/client";
import { shapeStandings, shapeMatches, shapeScorers, deriveBestPlayer, EMPTY_BEST } from "@/lib/transforms";
import { EMPTY_OVERRIDES, applyFonts, type Overrides } from "@/lib/overrides";
import type { Match, Standings, Scorer, BestPlayerT } from "@/lib/types";

export type DataShape = {
  matches: Match[];
  standings: Standings;
  scorers: Scorer[];
  bestPlayer: BestPlayerT;
  overrides: Overrides;
  live: boolean;
  ready: boolean;
};

const fallback: DataShape = {
  matches: mock.matches as Match[],
  standings: mock.standings as Standings,
  scorers: mock.scorers as Scorer[],
  bestPlayer: mock.bestPlayer as BestPlayerT,
  overrides: EMPTY_OVERRIDES,
  live: false,
  ready: false,
};

export const DataContext = createContext<DataShape>(fallback);
export const useData = () => useContext(DataContext);

// Apply player-picture overrides regardless of whether data is live or mock.
function applyPlayers(d: DataShape): DataShape {
  const ov = d.overrides;
  if (!ov || !Object.keys(ov.players || {}).length) return d;
  return {
    ...d,
    scorers: d.scorers.map((s) => ({ ...s, img: ov.players[s.name] || s.img })),
    bestPlayer: { ...d.bestPlayer, img: (d.bestPlayer.name && ov.players[d.bestPlayer.name]) || d.bestPlayer.img },
  };
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DataShape>(fallback);

  useEffect(() => {
    let on = true;
    const load = async () => {
      try {
        const [st, fx, sc, ovr] = await Promise.allSettled([
          fetchStandings(), fetchFixtures(), fetchScorers(), fetchOverrides(),
        ]);
        if (!on) return;
        const ov: Overrides =
          ovr.status === "fulfilled" ? { ...EMPTY_OVERRIDES, ...ovr.value } : EMPTY_OVERRIDES;
        const next: DataShape = { ...fallback, overrides: ov };
        let any = false;
        let teamGroup: Record<string, string> = {};

        if (st.status === "fulfilled") {
          const s = shapeStandings(st.value);
          if (Object.keys(s.standings).length) { next.standings = s.standings; teamGroup = s.teamGroup; any = true; }
        }
        if (fx.status === "fulfilled") {
          const m = shapeMatches(fx.value, teamGroup, ov);
          if (m.length) { next.matches = m as Match[]; any = true; }
        }
        if (sc.status === "fulfilled") {
          const s = shapeScorers(sc.value, ov);
          if (s.length) { next.scorers = s as Scorer[]; next.bestPlayer = deriveBestPlayer(sc.value, ov) as BestPlayerT; any = true; }
          else { next.scorers = []; next.bestPlayer = EMPTY_BEST as BestPlayerT; } // live but no goals yet
        }
        next.live = any;
        next.ready = true;
        setData(applyPlayers(next));
      } catch {
        // API unreachable: keep demo data, but clear the loading state so the
        // matches area shows the demo cards instead of skeletons forever.
        if (on) setData((d) => ({ ...d, ready: true }));
      }
    };
    load();
    const id = setInterval(load, 60_000);
    return () => { on = false; clearInterval(id); };
  }, []);

  // Apply the admin's site-wide font choice.
  useEffect(() => { applyFonts(data.overrides.font); }, [data.overrides.font]);

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}
