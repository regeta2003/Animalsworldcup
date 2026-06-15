import { Link, useLocation } from "react-router-dom";
import { Search, Globe, Maximize2, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";
import wordmark from "@/assets/wordmark.png";

const NAV: Array<{ to: string; label: string; exact?: boolean; live?: boolean }> = [
  { to: "/", label: "Home", exact: true },
  { to: "/teams", label: "Teams" },
  { to: "/table", label: "Table" },
  { to: "/schedule", label: "Schedule" },
  { to: "/statistics", label: "Statistics" },
  { to: "/live", label: "Live", live: true },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("EN");
  const pathname = useLocation().pathname;

  useEffect(() => setOpen(false), [pathname]);

  const toggleFullscreen = () => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#1a1a1a] border-b border-white/10">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-6 h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src={logo} alt="Animals World Cup" className="h-10 w-10 rounded-full object-contain" />
          <img src={wordmark} alt="Animals' World Cup" className="h-8 w-auto hidden sm:block" />
          <span className="font-display font-extrabold text-[11px] px-1.5 py-0.5 rounded-md bg-gold text-gold-foreground leading-none">2026</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-6">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative px-3 py-2 text-sm font-display font-semibold uppercase tracking-wider transition-colors ${
                  active ? "text-white" : "text-white/55 hover:text-white"
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  {item.label}
                  {item.live && <span className="live-dot" />}
                </span>
                <span
                  className={`absolute left-3 right-3 -bottom-px h-[3px] rounded-full bg-gold transition-all ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <button aria-label="Search" className="h-9 w-9 grid place-items-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition">
            <Search className="h-[18px] w-[18px]" />
          </button>
          <button
            onClick={() => setLang(lang === "EN" ? "ES" : lang === "ES" ? "DE" : "EN")}
            className="h-9 px-2.5 inline-flex items-center gap-1 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition text-xs font-display font-semibold"
            aria-label="Language"
          >
            <Globe className="h-4 w-4" />
            {lang}
          </button>
          <button onClick={toggleFullscreen} aria-label="Fullscreen" className="hidden sm:grid h-9 w-9 place-items-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition">
            <Maximize2 className="h-[18px] w-[18px]" />
          </button>
          <button onClick={() => setOpen(!open)} aria-label="Menu" className="lg:hidden h-9 w-9 grid place-items-center rounded-lg text-white/70 hover:bg-white/10 transition">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/10 bg-[#1a1a1a]">
          <nav className="px-4 py-2 flex flex-col">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`py-3 px-2 rounded-lg font-display font-semibold uppercase tracking-wider text-sm flex items-center gap-2 ${
                    active ? "text-gold bg-white/10" : "text-white/80"
                  }`}
                >
                  {item.label}
                  {item.live && <span className="live-dot" />}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
