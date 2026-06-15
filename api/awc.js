// Vercel serverless function. Holds the API-Sports key server-side and caches
// (60s) so all visitors share one upstream call (free plan = 100 req/day).
const BASE = "https://v3.football.api-sports.io";
const cache = new Map();

export default async function handler(req, res) {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) return res.status(500).json({ error: "API_FOOTBALL_KEY not set" });

  const league = req.query.league || process.env.AWC_LEAGUE || "1";
  const season = req.query.season || process.env.AWC_SEASON || "2026";
  const type = req.query.type || "standings";

  const ck = `${type}:${league}:${season}`;
  const hit = cache.get(ck);
  if (hit && Date.now() - hit.t < 60_000) { res.setHeader("x-awc-cache", "hit"); return res.status(200).json(hit.data); }

  const get = (p) => fetch(BASE + p, { headers: { "x-apisports-key": key } }).then((r) => r.json());

  try {
    let data;
    if (type === "standings") data = await get(`/standings?league=${league}&season=${season}`);
    else if (type === "scorers") data = await get(`/players/topscorers?league=${league}&season=${season}`);
    else if (type === "status") data = await get(`/status`);
    else if (type === "fixtures") {
      data = await get(`/fixtures?league=${league}&season=${season}&live=all`);          // in-play
      if (!data?.response?.length) data = await get(`/fixtures?league=${league}&season=${season}&next=6`); // else upcoming
    } else return res.status(400).json({ error: "unknown type" });

    cache.set(ck, { t: Date.now(), data });
    res.setHeader("x-awc-cache", "miss");
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
    return res.status(200).json(data);
  } catch (e) {
    return res.status(502).json({ error: "upstream failed", detail: String(e) });
  }
}
