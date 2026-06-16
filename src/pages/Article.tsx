import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { news } from "@/data/mock";

export default function Article() {
  const { id } = useParams();
  const idx = Number(id);
  const article = Number.isInteger(idx) ? news[idx] : undefined;

  if (!article) {
    return (
      <PageShell>
        <div className="max-w-3xl mx-auto text-center py-16">
          <h1 className="headline text-2xl">Story not found</h1>
          <p className="text-muted-foreground mt-2">This article is no longer available.</p>
          <Link to="/news" className="inline-flex items-center gap-1.5 mt-4 text-pitch font-display font-bold uppercase tracking-wider text-xs hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to news
          </Link>
        </div>
      </PageShell>
    );
  }

  const more = news.map((n, i) => ({ n, i })).filter(({ i }) => i !== idx).slice(0, 3);

  return (
    <PageShell>
      <article className="max-w-3xl mx-auto">
        <Link to="/news" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-pitch transition text-xs font-display font-bold uppercase tracking-wider mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> All news
        </Link>
        <span className="inline-block eyebrow px-1.5 py-0.5 rounded bg-accent text-pitch">{article.tag}</span>
        <h1 className="headline text-3xl sm:text-4xl mt-3 leading-tight">{article.title}</h1>
        <div className="text-xs text-muted-foreground mt-2">{article.source} · {article.time}</div>
        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink/90">
          {article.body.map((para, i) => <p key={i}>{para}</p>)}
        </div>
      </article>

      {more.length > 0 && (
        <div className="max-w-3xl mx-auto mt-10">
          <h3 className="headline text-lg mb-3">More stories</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {more.map(({ n, i }) => (
              <Link key={i} to={`/news/${i}`} className="card-surface card-hover block p-3 group">
                <span className="inline-block eyebrow px-1.5 py-0.5 rounded bg-accent text-pitch">{n.tag}</span>
                <h4 className="mt-1.5 text-[13px] font-semibold leading-snug text-ink group-hover:text-pitch transition line-clamp-3">{n.title}</h4>
              </Link>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}
