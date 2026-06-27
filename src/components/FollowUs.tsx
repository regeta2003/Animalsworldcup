import { Instagram } from "lucide-react";
import germany from "@/assets/germany.png";
import ivory from "@/assets/ivory.png";
import ecuador from "@/assets/ecuador.png";
import curacao from "@/assets/curacao.png";
import Turkeylost from "@/assets/Turkeylost.png";

const IG = "https://www.instagram.com/animalsworldcup";

// Temporary placeholder thumbnails until the admin connects real Instagram posts.
const THUMBS = [germany, ivory, ecuador, curacao, Turkeylost, germany, ivory, ecuador];

export function FollowUs() {
  return (
    <section className="relative card-surface rounded-3xl overflow-hidden p-4 sm:p-5 border border-gold/40 bg-[#0B101C] text-white flex flex-col h-full shadow-[0_4px_16px_rgba(0,0,0,0.25),0_24px_56px_-20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="headline text-lg flex items-center gap-2">
          <Instagram className="h-5 w-5 text-gold" /> Instagram
        </h3>
        <a href={IG} target="_blank" rel="noopener noreferrer" className="text-[11px] text-white/60 hover:text-white">@animalsworldcup</a>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-4 gap-1.5">
          {THUMBS.map((src, i) => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden bg-white/10">
              <img src={src} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
      <a href={IG} target="_blank" rel="noopener noreferrer"
        className="mt-3 w-full inline-flex items-center justify-center gap-1.5 bg-gold text-gold-foreground py-2 rounded-xl font-display font-bold uppercase tracking-wider text-xs hover:brightness-95 transition">
        <Instagram className="h-3.5 w-3.5" /> Follow Us
      </a>
    </section>
  );
}
