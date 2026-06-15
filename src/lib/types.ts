export type Match = {
  group: string; home: string; away: string; hs: number; as: number;
  venue: string; date: string; status: "live" | "ht" | "ns" | "ft";
  clock: string; homeImg: string | null; awayImg: string | null;
};
export type StandingRow = { name: string; country: string; flag: string; animal: string; color: string; played: number; gd: number; pts: number };
export type Standings = Record<string, StandingRow[]>;
export type Scorer = { rank: number; name: string; team: string; goals: number; assists: number; rating: number; img: string | null };
export type BestPlayerT = { name: string; team: string; animal: string; flag: string; goals: number; assists: number; rating: number; img: string | null };
