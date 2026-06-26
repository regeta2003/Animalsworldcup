import { mascotFor, colorFor, metaFor, codeFor, flagUrl } from "./mascots";
import { EMPTY_OVERRIDES, type Overrides } from "./overrides";

// Admin mascot/flag override for a real nation name. Order: uploaded mascot ->
// bundled mascot art -> uploaded flag -> flagcdn flag -> null.
export const teamImg = (ov: Overrides, real?: string | null, bundled?: string | null): string | null => {
  const code = codeFor(real);
  return (real && ov.mascots[real]) || bundled || (code && ov.flags[code]) || flagUrl(code) || null;
};

const roundGroup = (round = ""): string =>
  (round.match(/Group\s+([A-L])\b/i)?.[1]?.toUpperCase() || "");

export function shapeStandings(json: any) {
  const groups = json?.response?.[0]?.league?.standings || [];
  const standings: Record<string, any[]> = {};
  const teamGroup: Record<string, string> = {};
  for (const rows of groups) {
    if (!rows?.length) continue;
    const gm = (rows[0].group || "").match(/^Group\s+([A-Z])$/i);
    if (!gm) continue; // skip "Ranking of third-placed teams"
    const g = gm[1].toUpperCase();
    standings[g] = rows.map((r: any) => {
      const real = r.team?.name || "";
      const m = mascotFor(real);
      const meta = metaFor(real);
      if (real) teamGroup[real] = g;
      return {
        name: real,
        country: real,
        flag: codeFor(real),
        animal: meta?.animal ?? m?.animal ?? "",
        color: m ? m.color : colorFor(real),
        played: r.all?.played ?? 0,
        gd: r.goalsDiff ?? 0,
        pts: r.points ?? 0,
      };
    });
  }
  return { standings, teamGroup };
}

export function shapeMatches(json: any, teamGroup: Record<string, string> = {}, ov: Overrides = EMPTY_OVERRIDES) {
  const arr = json?.response || [];
  return arr.slice(0, 12).map((f: any) => {
    const short = f.fixture?.status?.short;
    const status =
      short === "HT" ? "ht"
      : ["1H", "2H", "ET", "BT", "P", "LIVE"].includes(short) ? "live"
      : short === "NS" ? "ns" : "ft";
    const homeReal = f.teams?.home?.name, awayReal = f.teams?.away?.name;
    const hm = mascotFor(homeReal), am = mascotFor(awayReal);
    return {
      group: roundGroup(f.league?.round) || teamGroup[homeReal] || teamGroup[awayReal] || "",
      home: hm ? hm.animal : homeReal,
      away: am ? am.animal : awayReal,
      hs: f.goals?.home ?? 0,
      as: f.goals?.away ?? 0,
      venue: f.fixture?.venue?.name || "",
      date: f.fixture?.date,
      status,
      clock: (f.fixture?.status?.elapsed ?? 0) + "'",
      homeImg: teamImg(ov, homeReal, hm?.img),
      awayImg: teamImg(ov, awayReal, am?.img),
    };
  });
}

export function shapeScorers(json: any, ov: Overrides = EMPTY_OVERRIDES) {
  const arr = json?.response || [];
  return arr.slice(0, 10).map((p: any, i: number) => {
    const st = p.statistics?.[0] || {};
    const real = st.team?.name;
    const m = mascotFor(real);
    const name = p.player?.name;
    return {
      rank: i + 1,
      name,
      team: m ? m.animal : real,
      goals: st.goals?.total ?? 0,
      assists: st.goals?.assists ?? 0,
      rating: st.games?.rating ? Number(st.games.rating) : 0,
      img: (name && ov.players[name]) || m?.img || (flagUrl(codeFor(real)) || null),
    };
  });
}

const EMPTY_BEST = { name: "", team: "", animal: "", flag: "", goals: 0, assists: 0, rating: 0, img: null };

export function deriveBestPlayer(json: any, ov: Overrides = EMPTY_OVERRIDES) {
  const p = json?.response?.[0];
  if (!p) return EMPTY_BEST;
  const st = p.statistics?.[0] || {};
  const real = st.team?.name;
  const m = mascotFor(real);
  const meta = metaFor(real);
  const name = p.player?.name ?? "";
  return {
    name,
    team: real ?? "",
    animal: meta?.animal ?? m?.animal ?? "",
    flag: codeFor(real),
    goals: st.goals?.total ?? 0,
    assists: st.goals?.assists ?? 0,
    rating: st.games?.rating ? Number(st.games.rating) : 0,
    img: (name && ov.players[name]) || m?.img || null,
  };
}
export { EMPTY_BEST };
