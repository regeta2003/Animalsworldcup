import { PageShell } from "@/components/PageShell";
import { HeroCarousel } from "@/components/HeroCarousel";
import { LiveMatches } from "@/components/LiveMatches";
import { GroupStandings } from "@/components/GroupStandings";
import { TopScorers } from "@/components/TopScorers";
import { Highlights } from "@/components/Highlights";
import { FeaturedTeams } from "@/components/FeaturedTeams";
import { BestPlayer } from "@/components/BestPlayer";
import { LatestNews } from "@/components/LatestNews";
import { AiVideo } from "@/components/AiVideo";
import { AdSlot } from "@/components/AdSlot";
import { AiServicesAd, EnergyDrinkAd, CustomAd } from "@/components/SiteAds";
import { useData } from "@/context/data";
import { EditImage } from "@/components/admin/Editable";

export default function Home() {
  const { overrides } = useData();
  const top = overrides.ads?.sidebarTop;
  const bottom = overrides.ads?.sidebarBottom;
  return (
    <PageShell>
      <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_300px] gap-5">
        <aside className="space-y-5 order-2 lg:order-1">
          <FeaturedTeams />
          <div className="hidden lg:block">
            <EditImage target={{ kind: "ad", slot: "sidebarTop" }} className="block">
              {top?.img ? <CustomAd ad={top} /> : <AiServicesAd />}
            </EditImage>
          </div>
        </aside>
        <div className="space-y-7 order-1 lg:order-2 min-w-0">
          <HeroCarousel />
          <LiveMatches />
          <GroupStandings limit={6} />
          <TopScorers />
          <Highlights />
        </div>
        <aside className="space-y-5 order-3">
          <BestPlayer />
          <LatestNews />
          <AiVideo />
          <EditImage target={{ kind: "ad", slot: "sidebarBottom" }} className="block">
            {bottom?.img ? <CustomAd ad={bottom} /> : <EnergyDrinkAd />}
          </EditImage>
          <AdSlot size="300x100" />
        </aside>
      </div>
    </PageShell>
  );
}
