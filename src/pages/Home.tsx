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
        <Knockout />
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TheBests />
            <MatchesPanel />
            <FollowUs />
            <ContactForm />
          </div>
        </section>
      </div>
    </PageShell>
  );
}
