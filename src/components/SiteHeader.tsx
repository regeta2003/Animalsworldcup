import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";
import wordmark from "@/assets/wordmark.png";
import { SearchOverlay } from "./SearchOverlay";

const NAV: Array<{ to: string; label: string; exact?: boolean }> = [
  { to: "/", label: "Home", exact: true },
  { to: "/statistics", label: "The Bests" },
  { to: "/schedule", label: "Schedules" },
  { to: "/news", label: "Content" },
  { to: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  const goToContact = (e: React.MouseEvent) => {
    if (pathname !== "/") return; // let the Link navigate home, hash scroll happens there
    e.preventDefault();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="sticky top-0 z-40 bg-gold border-b border-black/10">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-6 h-20 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src={logo} alt="Animals World Cup" className="h-14 w-14 rounded-full object-contain" />
          <img src={wordmark} alt="Animals' World Cup" className="h-10 w-auto hidden sm:block" />
          <span className="font-display font-extrabold text-sm px-2 py-1 rounded-md bg-black text-gold leading-none">2026</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-2.5 ml-6">
          {NAV.map((item, idx) => {
            const active = item.exact ? pathname === item.to : item.to.startsWith("/#") ? false : pathname.startsWith(item.to);
            const cls = `relative px-1 py-2 text-[15px] font-display font-bold uppercase tracking-wider transition-colors text-black/80 hover:text-black ${
              active ? "text-black" : ""
            }`;
            return (
              <span key={item.to} className="flex items-center gap-2.5">
                {idx > 0 && <span className="text-black/50" aria-hidden>•</span>}
                <Link to={item.to} onClick={item.label === "Contact" ? goToContact : undefined} className={cls}>
                  {item.label}
                </Link>
              </span>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <button onClick={() => setSearchOpen(true)} aria-label="Search" className="h-9 w-9 grid place-items-center rounded-full border border-black/30 text-black hover:bg-black/10 transition">
            <Search className="h-[18px] w-[18px]" />
          </button>
          <button onClick={() => setOpen(!open)} aria-label="Menu" className="lg:hidden h-9 w-9 grid place-items-center rounded-lg text-black hover:bg-black/10 transition">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-black/10 bg-gold">
          <nav className="px-4 py-2 flex flex-col">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.to : item.to.startsWith("/#") ? false : pathname.startsWith(item.to);
              return (
                <Link key={item.to} to={item.to} onClick={item.label === "Contact" ? goToContact : undefined}
                  className={`py-3 px-2 rounded-lg font-display font-semibold uppercase tracking-wider text-sm flex items-center gap-2 ${
                    active ? "text-black bg-black/10" : "text-black/80"
                  }`}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </header>
  );
}
