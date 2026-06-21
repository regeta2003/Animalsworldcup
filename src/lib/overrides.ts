// Admin overrides merged on top of live API data. Empty by default, so the site
// behaves exactly as before until the admin uploads something.

export type AdItem = { img: string; link: string };
export type HeroSlide = { tag: string; title: string; sub: string; img: string; color: string };
export type FeaturedItem = { animal: string; nick: string; country: string; color: string; img: string };

export type Overrides = {
  flags: Record<string, string>;     // flagcdn code  -> image url
  mascots: Record<string, string>;   // country name  -> image url
  players: Record<string, string>;   // player name   -> image url
  hero: HeroSlide[] | null;          // null -> use built-in default
  featured: FeaturedItem[] | null;   // null -> use built-in default
  ads: { sidebarTop?: AdItem | null; sidebarBottom?: AdItem | null };
};

export const EMPTY_OVERRIDES: Overrides = {
  flags: {}, mascots: {}, players: {}, hero: null, featured: null, ads: {},
};

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
