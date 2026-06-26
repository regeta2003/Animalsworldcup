import { useEffect, useState } from "react";
import { fetchKnockout } from "@/lib/client";
import { mascotFor, codeFor } from "@/lib/mascots";
import { teamImg } from "@/lib/transforms";
import { useData } from "@/context/data";
import { useEdit } from "@/context/edit";
import { EditImage } from "@/components/admin/Editable";
import { Flag } from "@/components/Flag";
import type { KnockoutTeam } from "@/lib/overrides";
import { Loader2, X, Upload } from "lucide-react";

const DEFAULT_TROPHY = "/mascots/cup-nobg.png";
const DEFAULT_BG = "/mascots/background.png";

/** The big glowing trophy that sits above the bracket — the real FIFA-style gold
 *  cup-with-flame art, replaceable by the admin via the same upload pattern. */
function TrophyHero({ img }: { img?: string | null }) {
  return (
    <div className="relative flex items-center justify-center h-60 sm:h-80 mb-1">
      <div className="absolute h-44 w-44 sm:h-56 sm:w-56 rounded-full bg-gold/30 blur-2xl" aria-hidden />
      <EditImage target={{ kind: "trophy" }} className="relative block">
        <img
          src={img || DEFAULT_TROPHY}
          alt="World Cup trophy"
          className="h-60 sm:h-80 w-auto object-contain drop-shadow-[0_0_32px_rgba(245,179,21,0.7)]"
        />
      </EditImage>
    </div>
  );
}

type KMatch = {
  home: string; away: string; homeReal: string; awayReal: string;
  homeFlag: string; awayFlag: string; hs: number; as: number; played: boolean;
  homeImg: string | null; awayImg: string | null;
  homeKey: string; awayKey: string;
};

const STAGES = ["Round of 16", "Quarter-finals", "Semi-finals", "Final"] as const;
const STAGE_SLOTS: Record<typeof STAGES[number], number> = {
  "Round of 16": 8, "Quarter-finals": 4, "Semi-finals": 2, "Final": 1,
};
const EMPTY_MATCH: Omit<KMatch, "homeKey" | "awayKey"> = {
  home: "", away: "", homeReal: "", awayReal: "", homeFlag: "", awayFlag: "",
  hs: 0, as: 0, played: false, homeImg: null, awayImg: null,
};

function stageOf(round = ""): typeof STAGES[number] | null {
  if (/round of 16/i.test(round)) return "Round of 16";
  if (/quarter/i.test(round)) return "Quarter-finals";
  if (/semi/i.test(round)) return "Semi-finals";
  if (/^final$/i.test(round.trim())) return "Final";
  return null;
}

/** One animal headshot card — rounded-square navy badge, gold-ringed circular
 *  photo on top, flag + name pill below; dimmed with a red X once eliminated.
 *  In edit mode, exposes a single image replace + a name field; the admin swaps
 *  the photo's expression themselves as the result becomes known. */
function Slot({
  teamKey, fallbackName, flag, defaultImg, result, overrideTeam,
}: { teamKey: string; fallbackName: string; flag: string; defaultImg: string | null; result: "win" | "lose" | "pending"; overrideTeam?: KnockoutTeam }) {
  const { editing, onText } = useEdit();
  const eliminated = result === "lose";
  const name = overrideTeam?.name || fallbackName;
  const img = overrideTeam?.img || defaultImg;

  if (editing) {
    return (
      <div className="flex flex-col items-center gap-1.5 w-16 sm:w-20 shrink-0 rounded-2xl bg-gradient-to-b from-white/10 to-white/[0.03] ring-1 ring-gold/50 p-2">
        <input
          value={overrideTeam?.name ?? ""}
          placeholder={fallbackName || "Name"}
          onChange={(e) => onText({ kind: "knockoutTeamName", key: teamKey }, e.target.value)}
          className="w-full text-[9px] text-center bg-black/30 rounded px-1 py-0.5 text-white placeholder:text-white/40 outline-none focus:ring-1 focus:ring-gold"
        />
        <EditImage target={{ kind: "knockoutTeam", key: teamKey }} className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/10 overflow-hidden grid place-items-center block ring-2 ring-gold/60">
          {img ? <img src={img} alt="" className="h-full w-full object-cover object-top" /> : <Upload className="h-3.5 w-3.5 text-gold" />}
        </EditImage>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-1.5 w-16 sm:w-20 shrink-0 rounded-2xl bg-gradient-to-b from-white/10 to-white/[0.03] ring-1 ring-white/10 p-2 ${eliminated ? "opacity-50" : ""}`}>
      <div className={`relative h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden ring-2 ${eliminated ? "ring-white/20 grayscale" : "ring-gold"} bg-white/10 grid place-items-center`}>
        {img ? <img src={img} alt="" className="h-full w-full object-cover object-top" /> : <span className="text-white/40 text-xs">?</span>}
        {eliminated && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-live grid place-items-center ring-2 ring-[#0B101C]">
            <X className="h-2.5 w-2.5 text-white" strokeWidth={3} />
          </span>
        )}
      </div>
      <div className="flex items-center gap-1 max-w-full bg-black/30 rounded-full px-1.5 py-0.5">
        {flag && <Flag code={flag} className="h-2.5 w-3.5 shrink-0" />}
        <span className="text-[9px] sm:text-[10px] font-display font-bold uppercase tracking-wide text-white truncate">{name || "TBD"}</span>
      </div>
    </div>
  );
}

/** A round-of-N match: two slots stacked with a short connector line toward the next round. */
function SlotPair({ m, mirror, knockoutTeams }: { m: KMatch; mirror: boolean; knockoutTeams: Record<string, KnockoutTeam> }) {
  const homeResult: "win" | "lose" | "pending" = !m.played ? "pending" : m.hs > m.as ? "win" : "lose";
  const awayResult: "win" | "lose" | "pending" = !m.played ? "pending" : m.as > m.hs ? "win" : "lose";
  return (
    <div className={`relative flex flex-col gap-3 py-1 ${mirror ? "pr-3 sm:pr-4" : "pl-3 sm:pl-4"}`}>
      <Slot teamKey={m.homeKey} fallbackName={m.home} flag={m.homeFlag} defaultImg={m.homeImg} result={homeResult} overrideTeam={knockoutTeams[m.homeKey]} />
      <Slot teamKey={m.awayKey} fallbackName={m.away} flag={m.awayFlag} defaultImg={m.awayImg} result={awayResult} overrideTeam={knockoutTeams[m.awayKey]} />
      <span
        aria-hidden
        className={`absolute top-1/2 ${mirror ? "right-0" : "left-0"} h-[calc(100%-1.5rem)] w-3 sm:w-4 border-gold/40 -translate-y-1/2 ${mirror ? "border-r-2 border-t-2 border-b-2 rounded-r-md" : "border-l-2 border-t-2 border-b-2 rounded-l-md"}`}
      />
    </div>
  );
}

function BracketColumn({ matches, mirror, knockoutTeams }: { matches: KMatch[]; mirror: boolean; knockoutTeams: Record<string, KnockoutTeam> }) {
  return (
    <div className="flex flex-col justify-around h-full gap-4">
      {matches.map((m, i) => <SlotPair key={i} m={m} mirror={mirror} knockoutTeams={knockoutTeams} />)}
    </div>
  );
}

export function Knockout() {
  const { overrides } = useData();
  const { editing, onImage, onText } = useEdit();
  const [byStage, setByStage] = useState<Record<string, KMatch[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let on = true;
    fetchKnockout()
      .then((j: any) => {
        if (!on) return;
        const arr = j?.response || [];
        const grouped: Record<string, KMatch[]> = {};
        for (const f of arr) {
          const stage = stageOf(f.league?.round);
          if (!stage) continue;
          const homeReal = f.teams?.home?.name, awayReal = f.teams?.away?.name;
          const hm = mascotFor(homeReal), am = mascotFor(awayReal);
          const short = f.fixture?.status?.short;
          (grouped[stage] ||= []).push({
            home: hm ? hm.animal : homeReal,
            away: am ? am.animal : awayReal,
            homeReal: homeReal || "",
            awayReal: awayReal || "",
            homeFlag: codeFor(homeReal),
            awayFlag: codeFor(awayReal),
            hs: f.goals?.home ?? 0,
            as: f.goals?.away ?? 0,
            played: !["NS", "TBD", "PST"].includes(short),
            homeImg: teamImg(overrides, homeReal, hm?.img),
            awayImg: teamImg(overrides, awayReal, am?.img),
          });
        }
        setByStage(grouped);
      })
      .catch(() => {})
      .finally(() => on && setLoading(false));
    return () => { on = false; };
  }, [overrides]);

  const bg = overrides.knockout;
  const knockoutTeams = overrides.knockoutTeams || {};
  // Dim the photo heavily — it's ambience behind the cards, not something that
  // should compete with the team art for attention.
  const bgStyle: React.CSSProperties = bg?.img
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(8,12,22,0.82), rgba(8,12,22,0.93)), url(${bg.img})`,
        backgroundSize: `${bg.zoom || 100}%`,
        backgroundPosition: `${bg.x ?? 50}% ${bg.y ?? 50}%`,
        backgroundRepeat: "no-repeat",
      }
    : {
        backgroundImage: `linear-gradient(180deg, rgba(8,12,22,0.82), rgba(8,12,22,0.93)), url(${DEFAULT_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "50% 35%",
        backgroundRepeat: "no-repeat",
      };

  // Always show the full bracket shape; empty slots stay TBD until the API
  // reports a real fixture for that stage.
  const slotsFor = (stage: typeof STAGES[number]): KMatch[] => {
    const real = byStage[stage] || [];
    const total = STAGE_SLOTS[stage];
    return Array.from({ length: total }, (_, i) => ({
      ...(real[i] || EMPTY_MATCH),
      homeKey: `${stage}#${i}#home`,
      awayKey: `${stage}#${i}#away`,
    }));
  };
  const half = (list: KMatch[]) => [list.slice(0, list.length / 2), list.slice(list.length / 2)];

  const [r16L, r16R] = half(slotsFor("Round of 16"));
  const [qfL, qfR] = half(slotsFor("Quarter-finals"));
  const [sfL, sfR] = half(slotsFor("Semi-finals"));
  const final = slotsFor("Final")[0];
  const finalHomeResult: "win" | "lose" | "pending" = !final.played ? "pending" : final.hs > final.as ? "win" : "lose";
  const finalAwayResult: "win" | "lose" | "pending" = !final.played ? "pending" : final.as > final.hs ? "win" : "lose";

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="headline text-xl">Knockout Stage</h3>
        {editing && <span className="text-[11px] text-muted-foreground">Hover a team's picture to set its happy / sad art &amp; name</span>}
      </div>
      <div className="relative rounded-2xl overflow-hidden p-4 sm:p-7" style={bgStyle}>
        <EditImage target={{ kind: "knockout" }} className="absolute inset-0 block">
          <span className="absolute inset-0" />
        </EditImage>
        <div className="relative">
          <div className="text-center mb-2">
            <span className="headline text-xl sm:text-3xl text-gold tracking-wide">Animals World Cup 2026</span>
          </div>
          <TrophyHero img={overrides.trophy} />
          <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs font-display font-semibold uppercase tracking-widest text-white/60 mb-6">
            <span>Round of 16</span><span className="text-gold">•</span><span>Quarter-Finals</span><span className="text-gold">•</span><span>Semi-Finals</span>
          </div>
          {loading ? (
            <div className="grid place-items-center py-10 text-white/70"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex items-center justify-between gap-1 sm:gap-3 min-w-[640px] w-full">
                <BracketColumn matches={r16L} mirror={false} knockoutTeams={knockoutTeams} />
                <BracketColumn matches={qfL} mirror={false} knockoutTeams={knockoutTeams} />
                <BracketColumn matches={sfL} mirror={false} knockoutTeams={knockoutTeams} />

                <div className="flex flex-col items-center gap-3 px-2 sm:px-4 shrink-0">
                  <span className="eyebrow text-gold">Final</span>
                  <Slot teamKey={final.homeKey} fallbackName={final.home} flag={final.homeFlag} defaultImg={final.homeImg} result={finalHomeResult} overrideTeam={knockoutTeams[final.homeKey]} />
                  <span aria-hidden className="h-6 w-px bg-gold/40" />
                  <Slot teamKey={final.awayKey} fallbackName={final.away} flag={final.awayFlag} defaultImg={final.awayImg} result={finalAwayResult} overrideTeam={knockoutTeams[final.awayKey]} />
                </div>

                <BracketColumn matches={sfR} mirror knockoutTeams={knockoutTeams} />
                <BracketColumn matches={qfR} mirror knockoutTeams={knockoutTeams} />
                <BracketColumn matches={r16R} mirror knockoutTeams={knockoutTeams} />
              </div>
            </div>
          )}
        </div>
      </div>
      {editing && bg?.img && (
        <div className="mt-2 card-surface p-3 flex flex-wrap gap-4 text-xs">
          <label className="flex items-center gap-2">Pan X
            <input type="range" min={0} max={100} value={bg.x ?? 50}
              onChange={(e) => onText({ kind: "knockoutAdjust", field: "x" }, e.target.value)} />
          </label>
          <label className="flex items-center gap-2">Pan Y
            <input type="range" min={0} max={100} value={bg.y ?? 50}
              onChange={(e) => onText({ kind: "knockoutAdjust", field: "y" }, e.target.value)} />
          </label>
          <label className="flex items-center gap-2">Zoom
            <input type="range" min={100} max={300} value={bg.zoom ?? 100}
              onChange={(e) => onText({ kind: "knockoutAdjust", field: "zoom" }, e.target.value)} />
          </label>
          <button onClick={() => onImage({ kind: "knockout" }, null)} className="text-live font-semibold">Remove image</button>
        </div>
      )}
    </section>
  );
}
