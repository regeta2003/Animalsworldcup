import { PageShell } from "@/components/PageShell";
import { HeroCarousel } from "@/components/HeroCarousel";
import { LiveMatches } from "@/components/LiveMatches";
import { GroupStandings } from "@/components/GroupStandings";
import { TopScorers } from "@/components/TopScorers";
import { Highlights } from "@/components/Highlights";
import { FeaturedTeams } from "@/components/FeaturedTeams";
import { FollowUs } from "@/components/FollowUs";
import { BestPlayer } from "@/components/BestPlayer";
import { LatestNews } from "@/components/LatestNews";
import { AiVideo } from "@/components/AiVideo";
import { AdSlot } from "@/components/AdSlot";
import { AiServicesAd, EnergyDrinkAd } from "@/components/SiteAds";

export default function Home() {
  return (
    <PageShell>
      <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_300px] gap-5">
        <aside className="space-y-5 order-2 lg:order-1">
          <FeaturedTeams />
          <FollowUs />
          <div className="hidden lg:block"><AiServicesAd /></div>
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
          <EnergyDrinkAd />
          <AdSlot size="300x100" />
        </aside>
      </div>
    </PageShell>
  );
}
