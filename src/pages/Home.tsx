import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { Knockout } from "@/components/Knockout";
import { TheBests } from "@/components/TheBests";
import { MatchesPanel } from "@/components/MatchesPanel";
import { FollowUs } from "@/components/FollowUs";
import { ContactForm } from "@/components/ContactForm";

export default function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash !== "#contact") return;
    const t = setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    return () => clearTimeout(t);
  }, [hash]);

  return (
    <PageShell>
      <div className="space-y-8">
        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 fill-mode-both">
          <Knockout />
        </div>
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
              <TheBests />
            </div>
            <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
              <MatchesPanel />
            </div>
            <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
              <FollowUs />
            </div>
            <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-[400ms] fill-mode-both">
              <ContactForm />
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
