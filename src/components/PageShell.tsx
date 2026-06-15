import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-soft text-ink">
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] px-4 lg:px-6 py-5 lg:py-7">{children}</main>
      <footer className="mx-auto max-w-[1400px] px-4 lg:px-6 py-8 text-xs text-muted-foreground flex flex-wrap items-center gap-2 justify-between">
        <div>© 2026 Animals' WorldCup · Mascot tournament hub</div>
        <div className="font-display uppercase tracking-widest">Bright. Bold. Beastly.</div>
      </footer>
    </div>
  );
}
