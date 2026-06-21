// Admin overrides merged on top of live API data. Empty by default, so the site
// behaves exactly as before until the admin uploads something.

export type AdItem = { img: string; link: string };
export type HeroSlide = { tag: string; title: string; sub: string; img: string; color: string };
export type FeaturedItem = { animal: string; nick: string; country: string; color: string; img: string };
export type FontPick = { heading?: string; body?: string };

export type Overrides = {
  flags: Record<string, string>;     // flagcdn code  -> image url
  mascots: Record<string, string>;   // country name  -> image url
  players: Record<string, string>;   // player name   -> image url
  hero: HeroSlide[] | null;          // null -> use built-in default
  featured: FeaturedItem[] | null;   // null -> use built-in default
  ads: { sidebarTop?: AdItem | null; sidebarBottom?: AdItem | null; extra?: AdItem[] };
  font?: FontPick;                   // site-wide font choice (heading / body)
};

export const EMPTY_OVERRIDES: Overrides = {
  flags: {}, mascots: {}, players: {}, hero: null, featured: null, ads: {}, font: {},
};

// Curated font choices for the admin picker. `google` (if present) is the
// fonts.googleapis.com family spec to lazy-load.
export const FONTS: Record<string, { label: string; stack: string; google?: string }> = {
  barlow: { label: "Barlow Condensed", stack: '"Barlow Condensed", system-ui, sans-serif', google: "Barlow+Condensed:wght@500;600;700;800;900" },
  inter: { label: "Inter", stack: '"Inter", system-ui, sans-serif', google: "Inter:wght@400;500;600;700;800" },
  oswald: { label: "Oswald", stack: '"Oswald", system-ui, sans-serif', google: "Oswald:wght@400;500;600;700" },
  poppins: { label: "Poppins", stack: '"Poppins", system-ui, sans-serif', google: "Poppins:wght@400;500;600;700;800" },
  montserrat: { label: "Montserrat", stack: '"Montserrat", system-ui, sans-serif', google: "Montserrat:wght@400;500;600;700;800" },
  roboto: { label: "Roboto", stack: '"Roboto", system-ui, sans-serif', google: "Roboto:wght@400;500;700;900" },
  playfair: { label: "Playfair Display", stack: '"Playfair Display", Georgia, serif', google: "Playfair+Display:wght@500;600;700;800" },
  system: { label: "System", stack: "system-ui, -apple-system, sans-serif" },
  georgia: { label: "Georgia (serif)", stack: 'Georgia, "Times New Roman", serif' },
};

function loadGoogleFont(id: string, doc: Document) {
  const f = FONTS[id];
  if (!f?.google) return;
  const linkId = `awc-font-${id}`;
  if (doc.getElementById(linkId)) return;
  const link = doc.createElement("link");
  link.id = linkId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${f.google}&display=swap`;
  doc.head.appendChild(link);
}

// Apply a font choice to a document by setting the CSS variables the site uses.
export function applyFonts(font?: FontPick, doc: Document = document) {
  const root = doc.documentElement;
  if (font?.heading && FONTS[font.heading]) { loadGoogleFont(font.heading, doc); root.style.setProperty("--font-display", FONTS[font.heading].stack); }
  if (font?.body && FONTS[font.body]) { loadGoogleFont(font.body, doc); root.style.setProperty("--font-sans", FONTS[font.body].stack); }
}

// Stable public URLs (copied into /public/mascots) so admin-seeded defaults
// survive redeploys — unlike hashed bundle asset URLs.
export const DEFAULT_HERO: HeroSlide[] = [
  { tag: "TOP STORY", title: "Eagle take flight: Germany's mascots top Group E", sub: "Two goals in eight minutes set up a statement win in Mexico City.", img: "/mascots/germany.png", color: "#0B8A3D" },
  { tag: "TOP STORY", title: "Turkish wolves are sad", sub: "Turkey lost its first match.", img: "/mascots/Turkeylost.png", color: "#F77F00" },
  { tag: "TOP STORY", title: "Condor circles a historic last-16 spot", sub: "Ecuador's mascots show the world what altitude really means.", img: "/mascots/ecuador.png", color: "#EAB308" },
  { tag: "TOP STORY", title: "Parrot's late show electrifies the group", sub: "Curaçao's debutants steal the night with a stoppage-time strike.", img: "/mascots/curacao.png", color: "#0B6BCB" },
];

export const DEFAULT_FEATURED: FeaturedItem[] = [
  { animal: "Eagle", nick: "Die Adler", country: "Germany", color: "#1A1A1A", img: "/mascots/germany.png" },
  { animal: "Elephant", nick: "Les Éléphants", country: "Ivory Coast", color: "#F77F00", img: "/mascots/ivory.png" },
  { animal: "Condor", nick: "La Tri", country: "Ecuador", color: "#FFD100", img: "/mascots/ecuador.png" },
  { animal: "Parrot", nick: "Los Azulinos", country: "Curaçao", color: "#0B6BCB", img: "/mascots/curacao.png" },
];

export const playerImg = (ov: Overrides, name?: string | null, fallback: string | null = null): string | null =>
  (name && ov.players[name]) || fallback;

export const mascotImg = (ov: Overrides, country?: string | null, fallback: string | null = null): string | null =>
  (country && ov.mascots[country]) || fallback;

export const flagImgFor = (ov: Overrides, code?: string | null): string | null =>
  (code && ov.flags[code]) || null;
