import { PageShell } from "@/components/PageShell";
import { HeroCarousel } from "@/components/HeroCarousel";
import { LiveMatches } from "@/components/LiveMatches";
import { Knockout } from "@/components/Knockout";
import { FeaturedTeams } from "@/components/FeaturedTeams";
import { BestPlayer } from "@/components/BestPlayer";
import { LatestNews } from "@/components/LatestNews";
import { AiVideo } from "@/components/AiVideo";
import { AdRegion } from "@/components/AdRegion";
import { EnergyDrinkAd, CustomAd } from "@/components/SiteAds";
import { useData } from "@/context/data";
import { useEdit } from "@/context/edit";
import { EditImage } from "@/components/admin/Editable";

/** A branded sidebar ad slot: shows the built-in ad until a custom image is set,
 *  and (in edit mode) exposes a click-through link field. */
function BrandedAd({ slot, ad, fallback }: { slot: "sidebarTop" | "sidebarBottom"; ad?: { img: string; link: string } | null; fallback: React.ReactNode }) {
  const { editing, onText } = useEdit();
  return (
    <div>
      <EditImage target={{ kind: "ad", slot }} className="block">
        {ad?.img ? <CustomAd ad={ad} /> : fallback}
      </EditImage>
      {editing && ad?.img && (
        <input value={ad.link} placeholder="Link (optional)"
          onChange={(e) => onText({ kind: "adLink", slot }, e.target.value)}
          className="mt-1.5 w-full text-xs rounded-lg border border-border px-2 py-1 bg-white" />
      )}
    </div>
  );
}

export default function Home() {
  const { overrides } = useData();
  const bottom = overrides.ads?.sidebarBottom;
  return (
    <PageShell>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_150px] gap-5">
        <div className="space-y-7 order-1 min-w-0">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-5">
            <aside className="space-y-5">
              <FeaturedTeams limit={1} />
            </aside>
            <div className="min-w-0">
              <HeroCarousel />
            </div>
          </div>
          <Knockout />
          <LiveMatches />
        </div>
        <aside className="space-y-5 order-2">
          <BestPlayer />
          <LatestNews />
          <AiVideo />
          <BrandedAd slot="sidebarBottom" ad={bottom} fallback={<EnergyDrinkAd />} />
          <AdRegion />
        </aside>
      </div>
    </PageShell>
  );
}
