import { PageShell } from "@/components/PageShell";
import { TopScorers } from "@/components/TopScorers";
import { TeamAvatar } from "@/components/TeamAvatar";
import { useData } from "@/context/data";
import { EditImage } from "@/components/admin/Editable";
import type { Scorer } from "@/lib/types";

export default function Statistics() {
  const { scorers } = useData();
  const assists = [...scorers].sort((a, b) => b.assists - a.assists);
  const ratings = [...scorers].sort((a, b) => b.rating - a.rating);

  const Column = ({ title, rows, metric, label }: { title: string; rows: Scorer[]; metric: "assists" | "rating"; label: string }) => (
    <section className="card-surface p-4">
      <h3 className="headline text-lg mb-2">{title}</h3>
      <ul className="divide-y divide-border">
        {rows.length === 0 && <li className="py-4 text-sm text-muted-foreground">Available once matches begin.</li>}
        {rows.slice(0, 6).map((s, i) => (
          <li key={s.name} className="flex items-center gap-3 py-2.5">
            <span className="w-5 font-display font-extrabold text-ink/60 text-center">{i + 1}</span>
            <EditImage target={{ kind: "player", key: s.name }} round className="rounded-full">
              <TeamAvatar name={s.team} img={s.img} size={32} />
            </EditImage>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold truncate">{s.name}</div>
              <div className="text-[11px] text-muted-foreground truncate">{s.team}</div>
            </div>
            <div className="text-right">
              <div className="font-display font-extrabold tabular-nums">{metric === "rating" ? s.rating.toFixed(1) : s[metric]}</div>
              <div className="eyebrow text-muted-foreground">{label}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );

  return (
    <PageShell>
      <header className="mb-6">
        <span className="eyebrow text-pitch">Players</span>
        <h1 className="headline text-4xl sm:text-5xl mt-1">Statistics</h1>
      </header>
      <div className="space-y-6">
        <TopScorers />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Column title="Assist Leaders" rows={assists} metric="assists" label="Assists" />
          <Column title="Top Rated Players" rows={ratings} metric="rating" label="Rating" />
        </div>
      </div>
    </PageShell>
  );
}
