import { useEffect, useState } from "react";
import { fetchKnockout } from "@/lib/client";
import { mascotFor, codeFor, metaFor, flagColorFor } from "@/lib/mascots";
import { teamImg } from "@/lib/transforms";
import { useData } from "@/context/data";
import { useEdit } from "@/context/edit";
import { EditImage } from "@/components/admin/Editable";
import { Flag } from "@/components/Flag";
import type { KnockoutTeam } from "@/lib/overrides";
import { Loader2, X, Upload } from "lucide-react";

const DEFAULT_TROPHY = "/mascots/cup-nobg.png";
// Transparent-background mascot art — the flag-coloured circle shows through
// around the cutout until the admin uploads a real per-team photo.
const PLACEHOLDER_IMGS = [
  "/mascots/no%20bg/germany-removebg-preview.png",
  "/mascots/no%20bg/ivory-removebg-preview.png",
  "/mascots/no%20bg/ecuador-removebg-preview.png",
  "/mascots/no%20bg/curacao-removebg-.png",
  "/mascots/no%20bg/Turkeylost-removebg-preview.png",
];
const placeholderImg = (i: number) => PLACEHOLDER_IMGS[i % PLACEHOLDER_IMGS.length];
// Random real nations (with their animal nickname + flag) to fill empty bracket
// slots before fixtures exist — purely cosmetic, admin overrides replace them.
const PLACEHOLDER_TEAMS = [
  "Argentina", "Brazil", "Germany", "France", "England", "Spain", "Netherlands", "Portugal",
  "Belgium", "Croatia", "Morocco", "Japan", "USA", "Mexico", "Uruguay", "Colombia",
];
const placeholderTeam = (i: number) => {
  const country = PLACEHOLDER_TEAMS[i % PLACEHOLDER_TEAMS.length];
  return { name: metaFor(country)?.animal || country, flag: codeFor(country), country };
};

type KMatch = {
  home: string; away: string; homeReal: string; awayReal: string;
  homeFlag: string; awayFlag: string; hs: number; as: number; played: boolean;
  homeImg: string | null; awayImg: string | null;
  homeKey: string; awayKey: string;
};

const STAGES = ["Round of 32", "Round of 16", "Quarter-finals", "Semi-finals", "Final"] as const;
const STAGE_SLOTS: Record<typeof STAGES[number], number> = {
  "Round of 32": 16, "Round of 16": 8, "Quarter-finals": 4, "Semi-finals": 2, "Final": 1,
};
const STAGE_LABEL: Record<typeof STAGES[number], string> = {
  "Round of 32": "Round of 32", "Round of 16": "Round of 16", "Quarter-finals": "Quarter Finals",
  "Semi-finals": "Semi Finals", "Final": "Final",
};
const EMPTY_MATCH: Omit<KMatch, "homeKey" | "awayKey"> = {
  home: "", away: "", homeReal: "", awayReal: "", homeFlag: "", awayFlag: "",
  hs: 0, as: 0, played: false, homeImg: null, awayImg: null,
};

function stageOf(round = ""): typeof STAGES[number] | null {
  if (/round of 32/i.test(round)) return "Round of 32";
  if (/round of 16/i.test(round)) return "Round of 16";
  if (/quarter/i.test(round)) return "Quarter-finals";
  if (/semi/i.test(round)) return "Semi-finals";
  if (/^final$/i.test(round.trim())) return "Final";
  return null;
}

/** One animal headshot card — white gold-ringed circular photo, flag + name pill
 *  below; dimmed grey with a red X once eliminated. In edit mode, exposes a single
 *  image replace + a name field; the admin swaps the photo's expression themselves
 *  as the result becomes known. */
function Slot({
  teamKey, fallbackName, flag, defaultImg, result, overrideTeam, colorSeed,
}: { teamKey: string; fallbackName: string; flag: string; defaultImg: string | null; result: "win" | "lose" | "pending"; overrideTeam?: KnockoutTeam; colorSeed?: string }) {
  const { editing, onText } = useEdit();
  const eliminated = result === "lose";
  const name = overrideTeam?.name || fallbackName;
  const img = overrideTeam?.img || defaultImg;
  const bg = flagColorFor(colorSeed || fallbackName);

  if (editing) {
    return (
      <div className="flex flex-col items-center gap-1.5 w-16 sm:w-20 shrink-0 rounded-2xl bg-white ring-1 ring-gold/60 p-1.5 shadow-sm">
        <input
          value={overrideTeam?.name ?? ""}
          placeholder={fallbackName || "Name"}
          onChange={(e) => onText({ kind: "knockoutTeamName", key: teamKey }, e.target.value)}
          className="w-full text-[9px] text-center bg-soft rounded px-1 py-0.5 text-ink placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-gold"
        />
        <EditImage target={{ kind: "knockoutTeam", key: teamKey }} className="h-11 w-11 sm:h-14 sm:w-14 rounded-full bg-soft overflow-hidden grid place-items-center block ring-2 ring-gold/60">
          {img ? <img src={img} alt="" className="h-full w-full object-cover object-top" /> : <Upload className="h-3.5 w-3.5 text-gold" />}
        </EditImage>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-1.5 w-16 sm:w-20 shrink-0 transition-transform duration-200 hover:-translate-y-0.5 hover:scale-110 ${eliminated ? "opacity-70" : ""}`}>
      <div className="relative">
        <div
          className={`relative h-11 w-11 sm:h-14 sm:w-14 rounded-full overflow-hidden ring-[2.5px] grid place-items-center ${eliminated ? "ring-border grayscale" : "ring-gold shadow-[0_4px_14px_-2px_rgba(245,179,21,0.55)]"} shadow-sm`}
          style={{ background: bg }}
        >
          {img ? <img src={img} alt="" className="h-full w-full object-contain p-1" /> : <span className="text-white text-xs">?</span>}
        </div>
        {eliminated ? (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-live grid place-items-center ring-2 ring-white">
            <X className="h-2.5 w-2.5 text-white" strokeWidth={3} />
          </span>
        ) : flag && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 sm:h-5 sm:w-5 rounded-full overflow-hidden ring-2 ring-white bg-white grid place-items-center">
            <Flag code={flag} className="h-full w-full object-cover" />
          </span>
        )}
      </div>
      <div className="flex items-center gap-1 max-w-full bg-white shadow-sm rounded-full px-1.5 py-0.5">
        {flag && <Flag code={flag} className="h-2 w-3 shrink-0" />}
        <span className="text-[8px] sm:text-[9px] font-display font-bold uppercase tracking-wide text-ink truncate">{name || "TBD"}</span>
      </div>
    </div>
  );
}

/** A round-of-N match: two slots stacked with a short connector line toward the next round. */
function SlotPair({ m, mirror, knockoutTeams }: { m: KMatch; mirror: boolean; knockoutTeams: Record<string, KnockoutTeam> }) {
  const homeResult: "win" | "lose" | "pending" = !m.played ? "pending" : m.hs > m.as ? "win" : "lose";
  const awayResult: "win" | "lose" | "pending" = !m.played ? "pending" : m.as > m.hs ? "win" : "lose";
  return (
    <div className={`relative flex flex-col gap-2.5 py-1 ${mirror ? "pr-3 sm:pr-4" : "pl-3 sm:pl-4"}`}>
      <Slot teamKey={m.homeKey} fallbackName={m.home} flag={m.homeFlag} defaultImg={m.homeImg} result={homeResult} overrideTeam={knockoutTeams[m.homeKey]} colorSeed={m.homeReal || m.home} />
      <Slot teamKey={m.awayKey} fallbackName={m.away} flag={m.awayFlag} defaultImg={m.awayImg} result={awayResult} overrideTeam={knockoutTeams[m.awayKey]} colorSeed={m.awayReal || m.away} />
      <span
        aria-hidden
        className={`absolute top-1/2 ${mirror ? "right-0" : "left-0"} h-[calc(100%-1.25rem)] w-3 sm:w-4 border-gold/50 -translate-y-1/2 ${mirror ? "border-r-2 border-t-2 border-b-2 rounded-r-md" : "border-l-2 border-t-2 border-b-2 rounded-l-md"}`}
      />
    </div>
  );
}

function BracketColumn({ matches, mirror, knockoutTeams }: { matches: KMatch[]; mirror: boolean; knockoutTeams: Record<string, KnockoutTeam> }) {
  return (
    <div className="flex flex-col justify-around h-full gap-3">
      {matches.map((m, i) => <SlotPair key={i} m={m} mirror={mirror} knockoutTeams={knockoutTeams} />)}
    </div>
  );
}

function ColumnHeader({ label }: { label: string }) {
  return (
    <div className="text-center mb-3 flex justify-center">
      <span className="inline-block px-2.5 sm:px-3 py-1 rounded-full border-2 border-gold/60 bg-gold/10 text-[9px] sm:text-[11px] font-display font-extrabold uppercase tracking-wider text-[#8a6500] whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}

export function Knockout() {
  const { overrides } = useData();
  const { editing } = useEdit();
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

  const knockoutTeams = overrides.knockoutTeams || {};

  // Always show the full bracket shape; empty slots stay TBD until the API
  // reports a real fixture for that stage, but get a random team name, flag,
  // and a transparent-cutout mascot photo (flag-coloured circle shows through)
  // so the bracket looks populated rather than a wall of "?" placeholders.
  let phIdx = 0;
  const slotsFor = (stage: typeof STAGES[number]): KMatch[] => {
    const real = byStage[stage] || [];
    const total = STAGE_SLOTS[stage];
    return Array.from({ length: total }, (_, i) => {
      const r = real[i];
      if (r) return { ...r, homeKey: `${stage}#${i}#home`, awayKey: `${stage}#${i}#away` };
      const home = placeholderTeam(phIdx++);
      const away = placeholderTeam(phIdx++);
      return {
        ...EMPTY_MATCH,
        home: home.name, away: away.name,
        homeReal: home.country, awayReal: away.country,
        homeFlag: home.flag, awayFlag: away.flag,
        homeImg: placeholderImg(phIdx - 2),
        awayImg: placeholderImg(phIdx - 1),
        homeKey: `${stage}#${i}#home`,
        awayKey: `${stage}#${i}#away`,
      };
    });
  };
  const half = (list: KMatch[]) => [list.slice(0, list.length / 2), list.slice(list.length / 2)];

  const [r32L, r32R] = half(slotsFor("Round of 32"));
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
      <div className="relative rounded-3xl border border-gold/30 bg-card overflow-hidden p-4 sm:p-7 shadow-[0_2px_8px_rgba(17,22,31,0.05),0_20px_48px_-20px_rgba(17,22,31,0.18)]">
        {loading ? (
          <div className="grid place-items-center py-10 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[920px] w-full">
              <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto_1fr_1fr_1fr_1fr] gap-1 sm:gap-3 mb-1">
                <ColumnHeader label={STAGE_LABEL["Round of 32"]} />
                <ColumnHeader label={STAGE_LABEL["Round of 16"]} />
                <ColumnHeader label={STAGE_LABEL["Quarter-finals"]} />
                <ColumnHeader label={STAGE_LABEL["Semi-finals"]} />
                <ColumnHeader label={STAGE_LABEL["Final"]} />
                <ColumnHeader label={STAGE_LABEL["Semi-finals"]} />
                <ColumnHeader label={STAGE_LABEL["Quarter-finals"]} />
                <ColumnHeader label={STAGE_LABEL["Round of 16"]} />
                <ColumnHeader label={STAGE_LABEL["Round of 32"]} />
              </div>
              <div className="flex items-center justify-between gap-1 sm:gap-3 w-full mt-24 sm:mt-28">
                <BracketColumn matches={r32L} mirror={false} knockoutTeams={knockoutTeams} />
                <BracketColumn matches={r16L} mirror={false} knockoutTeams={knockoutTeams} />
                <BracketColumn matches={qfL} mirror={false} knockoutTeams={knockoutTeams} />
                <BracketColumn matches={sfL} mirror={false} knockoutTeams={knockoutTeams} />

                <div className="relative flex flex-col items-center gap-3 px-2 sm:px-4 shrink-0">
                  <div className="absolute -top-40 sm:-top-64 inset-x-0 flex justify-center">
                    <span aria-hidden className="absolute left-1/2 top-1/2 h-28 w-28 sm:h-32 sm:w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-t from-orange-400 via-gold to-yellow-200 opacity-70 blur-xl animate-pulse" />
                    <EditImage target={{ kind: "trophy" }} className="relative block">
                      <img
                        src={overrides.trophy || DEFAULT_TROPHY}
                        alt="World Cup trophy"
                        className="relative h-20 sm:h-30 w-auto object-contain drop-shadow-[0_0_18px_rgba(245,179,21,0.85)] animate-float"
                      />
                    </EditImage>
                  </div>
                  <Slot teamKey={final.homeKey} fallbackName={final.home} flag={final.homeFlag} defaultImg={final.homeImg} result={finalHomeResult} overrideTeam={knockoutTeams[final.homeKey]} colorSeed={final.homeReal || final.home} />
                  <span aria-hidden className="h-4 w-px bg-gold/50" />
                  <Slot teamKey={final.awayKey} fallbackName={final.away} flag={final.awayFlag} defaultImg={final.awayImg} result={finalAwayResult} overrideTeam={knockoutTeams[final.awayKey]} colorSeed={final.awayReal || final.away} />
                </div>

                <BracketColumn matches={sfR} mirror knockoutTeams={knockoutTeams} />
                <BracketColumn matches={qfR} mirror knockoutTeams={knockoutTeams} />
                <BracketColumn matches={r16R} mirror knockoutTeams={knockoutTeams} />
                <BracketColumn matches={r32R} mirror knockoutTeams={knockoutTeams} />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
