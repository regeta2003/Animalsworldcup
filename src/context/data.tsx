import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as mock from "@/data/mock";
import { fetchStandings, fetchFixtures, fetchScorers } from "@/lib/client";
import { shapeStandings, shapeMatches, shapeScorers, deriveBestPlayer, EMPTY_BEST } from "@/lib/transforms";
import type { Match, Standings, Scorer, BestPlayerT } from "@/lib/types";

type DataShape = {
  matches: Match[];
  standings: Standings;
  scorers: Scorer[];
  bestPlayer: BestPlayerT;
  live: boolean;
  ready: boolean;
};

const fallback: DataShape = {
  matches: mock.matches as Match[],
  standings: mock.standings as Standings,
  scorers: mock.scorers as Scorer[],
  bestPlayer: mock.bestPlayer as BestPlayerT,
  live: false,
  ready: false,
};

const DataContext = createContext<DataShape>(fallback);
export const useData = () => useContext(DataContext);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DataShape>(fallback);

  useEffect(() => {
    let on = true;
    const load = async () => {
      try {
        const [st, fx, sc] = await Promise.allSettled([fetchStandings(), fetchFixtures(), fetchScorers()]);
        if (!on) return;
        const next: DataShape = { ...fallback };
        let any = false;
        let teamGroup: Record<string, string> = {};

        if (st.status === "fulfilled") {
          const s = shapeStandings(st.value);
          if (Object.keys(s.standings).length) { next.standings = s.standings; teamGroup = s.teamGroup; any = true; }
        }
        if (fx.status === "fulfilled") {
          const m = shapeMatches(fx.value, teamGroup);
          if (m.length) { next.matches = m as Match[]; any = true; }
        }
        if (sc.status === "fulfilled") {
          const s = shapeScorers(sc.value);
          if (s.length) { next.scorers = s as Scorer[]; next.bestPlayer = deriveBestPlayer(sc.value) as BestPlayerT; any = true; }
          else { next.scorers = []; next.bestPlayer = EMPTY_BEST as BestPlayerT; } // live but no goals yet
        }
        next.live = any;
        next.ready = true;
        setData(next);
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

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}
