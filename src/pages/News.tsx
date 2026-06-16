import { Link } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { news } from "@/data/mock";

export default function News() {
  return (
    <PageShell>
      <div className="max-w-3xl mx-auto">
        <h1 className="headline text-3xl mb-1">Latest News</h1>
        <p className="text-muted-foreground text-sm mb-6">The latest stories, results and talking points from the tournament.</p>
        <div className="space-y-3">
          {news.map((n, i) => (
            <Link
              key={i}
              to={`/news/${i}`}
              className="card-surface card-hover block p-4 group"
            >
              <span className="inline-block eyebrow px-1.5 py-0.5 rounded bg-accent text-pitch">{n.tag}</span>
              <h2 className="mt-2 text-lg font-display font-bold leading-snug text-ink group-hover:text-pitch transition">{n.title}</h2>
              <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{n.body[0]}</p>
              <div className="text-[11px] text-muted-foreground mt-2">{n.source} · {n.time}</div>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
