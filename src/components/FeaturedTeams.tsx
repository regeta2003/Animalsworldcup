import { featuredTeams as defaultFeatured } from "@/data/mock";
import { Flag } from "@/components/Flag";
import { codeFor } from "@/lib/mascots";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useData } from "@/context/data";
import { useEdit } from "@/context/edit";
import { EditImage, EditText } from "@/components/admin/Editable";

export function FeaturedTeams() {
  const { overrides } = useData();
  const { editing } = useEdit();
  const featuredTeams = overrides.featured && overrides.featured.length ? overrides.featured : defaultFeatured;
  return (
    <section>
      <h3 className="headline text-lg mb-3">Featured Teams</h3>
      <div className="flex flex-col gap-2.5">
        {featuredTeams.map((t, idx) => {
          const inner = (
            <>
              <span className="absolute left-0 inset-y-2 w-1 rounded-r-full" style={{ background: t.color }} />
              <EditImage target={{ kind: "featured", index: idx }} className="h-12 w-12 rounded-xl bg-soft overflow-hidden shrink-0 block">
                <img src={t.img} alt={t.animal} className="h-full w-full object-cover object-top" />
              </EditImage>
              <div className="min-w-0 flex-1">
                <EditText as="div" target={{ kind: "featured", index: idx, field: "animal" }} value={t.animal}
                  className="font-display font-extrabold uppercase tracking-wide text-[15px] leading-tight" />
                <div className="text-xs text-muted-foreground truncate flex items-center gap-1.5">
                  <Flag code={codeFor(t.country)} className="h-3 w-4 shrink-0" />{" "}
                  <EditText target={{ kind: "featured", index: idx, field: "nick" }} value={t.nick} />
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-pitch group-hover:translate-x-0.5 transition" />
            </>
          );
          const cls = "card-surface card-hover relative flex items-center gap-3 pl-4 pr-2 py-2.5 overflow-hidden group";
          return editing ? (
            <div key={idx} className={cls}>{inner}</div>
          ) : (
            <Link key={t.country} to="/teams" className={cls}>{inner}</Link>
          );
        })}
      </div>
    </section>
  );
}
