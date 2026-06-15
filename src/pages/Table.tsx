import { PageShell } from "@/components/PageShell";
import { GroupStandings } from "@/components/GroupStandings";

export default function Table() {
  return (
    <PageShell>
      <header className="mb-6">
        <span className="eyebrow text-pitch">Standings</span>
        <h1 className="headline text-4xl sm:text-5xl mt-1">Group Tables</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">The top two from each group advance to the knockout stage.</p>
      </header>
      <GroupStandings />
    </PageShell>
  );
}
