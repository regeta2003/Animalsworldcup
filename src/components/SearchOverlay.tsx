import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useData } from "@/context/data";
import { Flag } from "@/components/Flag";
import { news } from "@/data/mock";

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const { standings } = useData();
  const [q, setQ] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const teams = useMemo(() => {
    const seen = new Set<string>();
    const list: { country: string; animal: string; flag: string }[] = [];
    for (const rows of Object.values(standings)) {
      for (const r of rows) {
        if (!r.country || seen.has(r.country)) continue;
        seen.add(r.country);
        list.push({ country: r.country, animal: r.animal || "", flag: r.flag });
      }
    }
    return list;
  }, [standings]);

  const query = q.trim().toLowerCase();
  const teamResults = query
    ? teams.filter((t) => t.country.toLowerCase().includes(query) || t.animal.toLowerCase().includes(query)).slice(0, 6)
    : [];
  const newsResults = query
    ? news.map((n, i) => ({ n, i })).filter(({ n }) => n.title.toLowerCase().includes(query) || n.tag.toLowerCase().includes(query)).slice(0, 5)
    : [];

  const hasResults = teamResults.length > 0 || newsResults.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl card-surface overflow-hidden">
        <div className="flex items-center gap-3 px-4 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search teams or news…"
            className="flex-1 py-4 bg-transparent outline-none text-ink placeholder:text-muted-foreground text-[15px]"
          />
          <button onClick={onClose} aria-label="Close" className="h-8 w-8 grid place-items-center rounded-lg text-muted-foreground hover:bg-soft transition shrink-0">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[55vh] overflow-y-auto">
          {!query && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">Start typing to search teams and news.</div>
          )}
          {query && !hasResults && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">No results for “{q}”.</div>
          )}

          {teamResults.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-1 eyebrow text-muted-foreground">Teams</div>
              {teamResults.map((t) => (
                <Link key={t.country} to="/teams" onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-soft transition">
                  <Flag code={t.flag} className="h-4 w-6 shrink-0" />
                  <span className="font-semibold text-ink">{t.country}</span>
                  {t.animal && <span className="text-xs text-muted-foreground">{t.animal}</span>}
                </Link>
              ))}
            </div>
          )}

          {newsResults.length > 0 && (
            <div className="py-2 border-t border-border">
              <div className="px-4 py-1 eyebrow text-muted-foreground">News</div>
              {newsResults.map(({ n, i }) => (
                <Link key={i} to={`/news/${i}`} onClick={onClose}
                  className="block px-4 py-2.5 hover:bg-soft transition">
                  <span className="inline-block eyebrow px-1.5 py-0.5 rounded bg-accent text-pitch">{n.tag}</span>
                  <span className="block text-[13px] font-semibold text-ink mt-1 line-clamp-1">{n.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
