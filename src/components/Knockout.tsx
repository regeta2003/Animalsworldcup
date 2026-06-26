import { useEffect, useState } from "react";
import { fetchKnockout } from "@/lib/client";
import { mascotFor, codeFor } from "@/lib/mascots";
import { teamImg } from "@/lib/transforms";
import { useData } from "@/context/data";
import { useEdit } from "@/context/edit";
import { EditImage } from "@/components/admin/Editable";
import { Flag } from "@/components/Flag";
import type { KnockoutTeam } from "@/lib/overrides";
import { Loader2, Trophy, X, Upload } from "lucide-react";

type KMatch = {
  home: string; away: string; homeReal: string; awayReal: string;
  homeFlag: string; awayFlag: string; hs: number; as: number; played: boolean;
  homeImg: string | null; awayImg: string | null;
};

const STAGES = ["Round of 16", "Quarter-finals", "Semi-finals", "Final"] as const;
const STAGE_SLOTS: Record<typeof STAGES[number], number> = {
  "Round of 16": 8, "Quarter-finals": 4, "Semi-finals": 2, "Final": 1,
};
const EMPTY_MATCH: KMatch = {
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

/** Tiny labeled upload square used inside the editor to set a team's happy/sad art. */
function MoodUpload({ label, teamKey, mood, img }: { label: string; teamKey: string; mood: "happy" | "sad"; img?: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <EditImage target={{ kind: "knockoutTeam", key: teamKey, mood }} className="h-7 w-7 rounded-lg bg-white/10 overflow-hidden grid place-items-center block">
        {img ? <img src={img} alt="" className="h-full w-full object-cover" /> : <Upload className="h-3 w-3 text-white/50" />}
      </EditImage>
      <span className="text-[7px] uppercase tracking-wide text-white/50">{label}</span>
    </div>
  );
}

/** One animal headshot card — rounded-square navy badge, gold-ringed circular
 *  photo on top, flag + name pill below; dimmed with a red X once eliminated.
 *  In edit mode, exposes per-team happy/sad image uploads and a name field. */
function Slot({
  teamKey, fallbackName, flag, defaultImg, result, overrideTeam,
}: { teamKey: string; fallbackName: string; flag: string; defaultImg: string | null; result: "win" | "lose" | "pending"; overrideTeam?: KnockoutTeam }) {
  const { editing, onText } = useEdit();
  const eliminated = result === "lose";
  const name = overrideTeam?.name || fallbackName;
  const img = result === "win" ? (overrideTeam?.happy || defaultImg) : result === "lose" ? (overrideTeam?.sad || defaultImg) : defaultImg;

  if (editing && teamKey) {
    return (
      <div className="flex flex-col items-center gap-1.5 w-20 sm:w-24 shrink-0 rounded-2xl bg-gradient-to-b from-white/10 to-white/[0.03] ring-1 ring-gold/50 p-2">
        <input
          value={overrideTeam?.name ?? ""}
          placeholder={fallbackName || "Name"}
          onChange={(e) => onText({ kind: "knockoutTeamName", key: teamKey }, e.target.value)}
          className="w-full text-[9px] text-center bg-black/30 rounded px-1 py-0.5 text-white placeholder:text-white/40 outline-none focus:ring-1 focus:ring-gold"
        />
        <div className="flex gap-1.5">
          <MoodUpload label="Happy" teamKey={teamKey} mood="happy" img={overrideTeam?.happy} />
          <MoodUpload label="Sad" teamKey={teamKey} mood="sad" img={overrideTeam?.sad} />
        </div>
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
      <Slot teamKey={m.homeReal} fallbackName={m.home} flag={m.homeFlag} defaultImg={m.homeImg} result={homeResult} overrideTeam={knockoutTeams[m.homeReal]} />
      <Slot teamKey={m.awayReal} fallbackName={m.away} flag={m.awayFlag} defaultImg={m.awayImg} result={awayResult} overrideTeam={knockoutTeams[m.awayReal]} />
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
  const bgStyle: React.CSSProperties = bg?.img
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(11,16,28,0.7), rgba(11,16,28,0.92)), url(${bg.img})`,
        backgroundSize: `${bg.zoom || 100}%`,
        backgroundPosition: `${bg.x ?? 50}% ${bg.y ?? 50}%`,
        backgroundRepeat: "no-repeat",
      }
    : { background: "radial-gradient(circle at 50% 0%, #182238, #0B101C 70%)" };

  // Always show the full bracket shape; empty slots stay TBD until the API
  // reports a real fixture for that stage.
  const slotsFor = (stage: typeof STAGES[number]): KMatch[] => {
    const real = byStage[stage] || [];
    const total = STAGE_SLOTS[stage];
    return Array.from({ length: total }, (_, i) => real[i] || EMPTY_MATCH);
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
          <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs font-display font-semibold uppercase tracking-widest text-white/60 mb-6">
            <span>Round of 16</span><span className="text-gold">•</span><span>Quarter-Finals</span><span className="text-gold">•</span><span>Semi-Finals</span>
          </div>
          {loading ? (
            <div className="grid place-items-center py-10 text-white/70"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex items-center justify-center gap-1 sm:gap-3 min-w-[640px] sm:min-w-0">
                <BracketColumn matches={r16L} mirror={false} knockoutTeams={knockoutTeams} />
                <BracketColumn matches={qfL} mirror={false} knockoutTeams={knockoutTeams} />
                <BracketColumn matches={sfL} mirror={false} knockoutTeams={knockoutTeams} />

                <div className="flex flex-col items-center gap-3 px-2 sm:px-4 shrink-0">
                  <span className="eyebrow text-gold">Final</span>
                  <Slot teamKey={final.homeReal} fallbackName={final.home} flag={final.homeFlag} defaultImg={final.homeImg} result={finalHomeResult} overrideTeam={knockoutTeams[final.homeReal]} />
                  <EditImage target={{ kind: "trophy" }} className="block rounded-full" round>
                    {overrides.trophy ? (
                      <img src={overrides.trophy} alt="World Cup trophy" className="h-12 w-12 sm:h-16 sm:w-16 object-contain drop-shadow-[0_0_12px_rgba(245,179,21,0.55)]" />
                    ) : (
                      <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-gold" />
                    )}
                  </EditImage>
                  <Slot teamKey={final.awayReal} fallbackName={final.away} flag={final.awayFlag} defaultImg={final.awayImg} result={finalAwayResult} overrideTeam={knockoutTeams[final.awayReal]} />
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
