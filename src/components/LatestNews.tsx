import { news } from "@/data/mock";
import { Link } from "react-router-dom";

export function LatestNews() {
  return (
    <section className="card-surface p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="headline text-base">Latest News</h3>
        <Link to="/news" className="text-pitch font-display font-bold text-[11px] uppercase tracking-widest hover:underline">All →</Link>
      </div>
      <ul className="divide-y divide-border">
        {news.map((n, i) => (
          <li key={i} className="py-2.5 first:pt-0 last:pb-0">
            <Link to={`/news/${i}`} className="group block">
              <span className="inline-block eyebrow px-1.5 py-0.5 rounded bg-accent text-pitch">{n.tag}</span>
              <h4 className="mt-1.5 text-[13px] font-semibold leading-snug text-ink group-hover:text-pitch transition line-clamp-2">{n.title}</h4>
              <div className="text-[11px] text-muted-foreground mt-1">{n.source} · {n.time}</div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
