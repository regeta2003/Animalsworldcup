import { useData } from "@/context/data";
import { Link } from "react-router-dom";
import { EditImage } from "@/components/admin/Editable";
import { Flag } from "@/components/Flag";
import { flagColorFor, codeFor } from "@/lib/mascots";

const RANK_LABEL = ["1st", "2nd", "3rd"];
const RANK_RIBBON = ["bg-gold text-gold-foreground", "bg-[#C9CDD3] text-[#3a3d42]", "bg-[#D8954A] text-white"];

function PlayerPhoto({ name, team, img }: { name: string; team: string; img: string | null }) {
  const initials = name.slice(0, 2).toUpperCase();
  const flagCode = codeFor(team);
  return (
    <div className="relative h-24 w-24 sm:h-28 sm:w-28 mx-auto">
      <div className="absolute inset-0 rounded-full p-1.5 ring-4 ring-white shadow-md" style={{ background: flagColorFor(team) }}>
        <div className="h-full w-full rounded-full overflow-hidden bg-white grid place-items-center">
          {img ? (
            <img src={img} alt={name} className="h-full w-full object-cover object-top" />
          ) : (
            <span className="text-white font-display font-extrabold text-2xl">{initials}</span>
          )}
        </div>
      </div>
      {flagCode && (
        <span className="absolute bottom-0 right-0 h-6 w-6 rounded-full ring-2 ring-white overflow-hidden bg-white grid place-items-center">
          <Flag code={flagCode} className="h-full w-full object-cover" />
        </span>
      )}
    </div>
  );
}

export function TheBests() {
  const { scorers } = useData();
  const top3 = scorers.slice(0, 3);

  return (
    <section className="relative card-surface rounded-3xl overflow-hidden p-4 sm:p-6 border border-gold/30 bg-[#FFFBF0] flex flex-col h-full shadow-[0_2px_8px_rgba(17,22,31,0.05),0_20px_48px_-20px_rgba(17,22,31,0.18)]">
      <h3 className="headline text-lg mb-4 text-center text-[#8a6500]">The Bests</h3>
      <div className="flex-1 flex flex-col justify-center">
        {top3.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-6">
            Top players will appear once matches begin.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {top3.map((s, idx) => (
              <div key={s.name} className="relative rounded-2xl bg-white ring-1 ring-gold/40 pt-6 pb-3 px-1.5 flex flex-col items-center text-center shadow-sm">
                <span className={`absolute top-0 left-0 px-2.5 py-1 rounded-tl-2xl rounded-br-lg text-[10px] font-display font-extrabold ${RANK_RIBBON[idx]}`}>
                  {RANK_LABEL[idx]}
                </span>
                <EditImage target={{ kind: "player", key: s.name }} round className="block">
                  <PlayerPhoto name={s.name} team={s.team} img={s.img} />
                </EditImage>
                <div className="mt-2 text-xs sm:text-sm font-display font-bold uppercase leading-tight max-w-full break-words">{s.name}</div>
                <div className="flex items-center justify-center gap-2.5 mt-2 text-[11px] font-display font-extrabold tabular-nums">
                  <span className="flex flex-col items-center"><span>{s.goals}</span><span className="text-[8px] font-semibold text-muted-foreground normal-case">Goals</span></span>
                  <span className="flex flex-col items-center"><span>{s.assists}</span><span className="text-[8px] font-semibold text-muted-foreground normal-case">Assists</span></span>
                  <span className="flex flex-col items-center"><span>{s.rating.toFixed(1)}</span><span className="text-[8px] font-semibold text-muted-foreground normal-case">Rating</span></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Link to="/statistics" className="mt-4 w-full inline-flex items-center justify-center bg-gold text-gold-foreground py-2 rounded-xl font-display font-bold uppercase tracking-wider text-xs hover:brightness-95 transition">
        View All Players →
      </Link>
    </section>
  );
}
