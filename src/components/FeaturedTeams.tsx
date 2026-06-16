import { featuredTeams } from "@/data/mock";
import { Flag } from "@/components/Flag";
import { codeFor } from "@/lib/mascots";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export function FeaturedTeams() {
  return (
    <section>
      <h3 className="headline text-lg mb-3">Featured Teams</h3>
      <div className="flex flex-col gap-2.5">
        {featuredTeams.map((t) => (
          <Link
            key={t.country}
            to="/teams"
            className="card-surface card-hover relative flex items-center gap-3 pl-4 pr-2 py-2.5 overflow-hidden group"
          >
            <span className="absolute left-0 inset-y-2 w-1 rounded-r-full" style={{ background: t.color }} />
            <div className="h-12 w-12 rounded-xl bg-soft overflow-hidden shrink-0">
              <img src={t.img} alt={t.animal} className="h-full w-full object-cover object-top" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-display font-extrabold uppercase tracking-wide text-[15px] leading-tight">{t.animal}</div>
              <div className="text-xs text-muted-foreground truncate flex items-center gap-1.5"><Flag code={codeFor(t.country)} className="h-3 w-4 shrink-0" /> {t.nick}</div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-pitch group-hover:translate-x-0.5 transition" />
          </Link>
        ))}
      </div>
    </section>
  );
}
