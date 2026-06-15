import { PageShell } from "@/components/PageShell";
import { MatchCard } from "@/components/LiveMatches";
import { useData } from "@/context/data";
import type { Match } from "@/lib/types";

export default function Live() {
  const { matches } = useData();
  const live = matches.filter((m) => m.status === "live" || m.status === "ht");
  const recent = matches.filter((m) => m.status === "ft");
  const upcoming = matches.filter((m) => m.status === "ns");

  const Block = ({ title, list }: { title: string; list: Match[] }) =>
    list.length ? (
      <section>
        <h2 className="headline text-xl mb-3">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {list.map((m, i) => <MatchCard key={i} m={m} />)}
        </div>
      </section>
    ) : null;

  return (
    <PageShell>
      <header className="mb-6 flex items-center gap-3">
        <span className="live-dot" />
        <h1 className="headline text-4xl sm:text-5xl">Live Centre</h1>
      </header>
      <div className="space-y-8">
        <Block title="Live Now" list={live} />
        <Block title="Recently Finished" list={recent} />
        <Block title="Upcoming" list={upcoming} />
        {live.length === 0 && recent.length === 0 && upcoming.length === 0 && (
          <p className="text-muted-foreground">No matches to show yet. Fixtures appear here as the tournament gets underway.</p>
        )}
      </div>
    </PageShell>
  );
}
