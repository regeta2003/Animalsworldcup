import germany from "@/assets/germany.png";
import ivory from "@/assets/ivory.png";
import ecuador from "@/assets/ecuador.png";
import curacao from "@/assets/curacao.png";

export type Mascot = { animal: string; nick: string; flag: string; color: string; img: string };

// api-football returns REAL nations; this is the cosmetic animal layer.
export const NATION_MASCOT: Record<string, Mascot> = {
  "Germany":        { animal: "Eagle",    nick: "Die Adler",     flag: "🇩🇪", color: "#1A1A1A", img: germany },
  "Ivory Coast":    { animal: "Elephant", nick: "Les Éléphants", flag: "🇨🇮", color: "#F77F00", img: ivory },
  "Côte d'Ivoire":  { animal: "Elephant", nick: "Les Éléphants", flag: "🇨🇮", color: "#F77F00", img: ivory },
  "Ecuador":        { animal: "Condor",   nick: "La Tri",        flag: "🇪🇨", color: "#1138A0", img: ecuador },
  "Curacao":        { animal: "Parrot",   nick: "Los Azulinos",  flag: "🇨🇼", color: "#0B6BCB", img: curacao },
  "Curaçao":        { animal: "Parrot",   nick: "Los Azulinos",  flag: "🇨🇼", color: "#0B6BCB", img: curacao },
};

export const mascotFor = (name?: string | null): Mascot | undefined =>
  name ? NATION_MASCOT[name.trim()] : undefined;

const PALETTE = ["#C49B2F","#1E6FBA","#6B7280","#D55D27","#0EA5E9","#7C3E16","#0F766E","#9A3412","#111827","#B91C1C","#F59E0B","#15803D","#1E40AF","#F97316","#CA8A04","#374151","#0F172A","#7C2D12","#16A34A","#52525B"];
export const colorFor = (name = ""): string => {
  let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
};

// Flag + animal for every nation, keyed to api-football's exact names.
// Animal names per Farhad's official list (June 15).
export type CountryMeta = { flag: string; animal: string };
export const COUNTRY_META: Record<string, CountryMeta> = {
  // Group A
  "Mexico": { flag: "🇲🇽", animal: "Golden Eagle" },
  "South Korea": { flag: "🇰🇷", animal: "Siberian Tiger" },
  "Czech Republic": { flag: "🇨🇿", animal: "Lion" },
  "Czechia": { flag: "🇨🇿", animal: "Lion" },
  "South Africa": { flag: "🇿🇦", animal: "Springbok" },
  // Group B
  "Canada": { flag: "🇨🇦", animal: "Beaver" },
  "Bosnia & Herzegovina": { flag: "🇧🇦", animal: "Brown Bear" },
  "Qatar": { flag: "🇶🇦", animal: "Arabian Oryx" },
  "Switzerland": { flag: "🇨🇭", animal: "Ibex" },
  // Group C
  "Brazil": { flag: "🇧🇷", animal: "Jaguar" },
  "Morocco": { flag: "🇲🇦", animal: "Barbary Lion" },
  "Haiti": { flag: "🇭🇹", animal: "Hispaniolan Trogon" },
  "Scotland": { flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", animal: "Unicorn" },
  // Group D
  "USA": { flag: "🇺🇸", animal: "Bald Eagle" },
  "Paraguay": { flag: "🇵🇾", animal: "Pampas Fox" },
  "Australia": { flag: "🇦🇺", animal: "Kangaroo" },
  "Türkiye": { flag: "🇹🇷", animal: "Grey Wolf" },
  "Turkey": { flag: "🇹🇷", animal: "Grey Wolf" },
  // Group E
  "Germany": { flag: "🇩🇪", animal: "Black Eagle" },
  "Curaçao": { flag: "🇨🇼", animal: "Parakeet (Prikichi)" },
  "Curacao": { flag: "🇨🇼", animal: "Parakeet (Prikichi)" },
  "Ivory Coast": { flag: "🇨🇮", animal: "Elephant" },
  "Côte d'Ivoire": { flag: "🇨🇮", animal: "Elephant" },
  "Ecuador": { flag: "🇪🇨", animal: "Andean Condor" },
  // Group F
  "Netherlands": { flag: "🇳🇱", animal: "Lion" },
  "Japan": { flag: "🇯🇵", animal: "Green Pheasant" },
  "Sweden": { flag: "🇸🇪", animal: "Elk" },
  "Tunisia": { flag: "🇹🇳", animal: "Arabian Horse" },
  // Group G
  "Belgium": { flag: "🇧🇪", animal: "Lion" },
  "Egypt": { flag: "🇪🇬", animal: "Steppe Eagle" },
  "Iran": { flag: "🇮🇷", animal: "Asiatic Cheetah" },
  "New Zealand": { flag: "🇳🇿", animal: "Kiwi" },
  // Group H
  "Spain": { flag: "🇪🇸", animal: "Lynx" },
  "Cape Verde Islands": { flag: "🇨🇻", animal: "Frigatebird" },
  "Cape Verde": { flag: "🇨🇻", animal: "Frigatebird" },
  "Saudi Arabia": { flag: "🇸🇦", animal: "Arabian Camel" },
  "Uruguay": { flag: "🇺🇾", animal: "Southern Lapwing" },
  // Group I
  "France": { flag: "🇫🇷", animal: "Gallic Rooster" },
  "Senegal": { flag: "🇸🇳", animal: "Lion" },
  "Iraq": { flag: "🇮🇶", animal: "Chukar Partridge" },
  "Norway": { flag: "🇳🇴", animal: "White-throated Dipper" },
  // Group J
  "Argentina": { flag: "🇦🇷", animal: "Puma" },
  "Algeria": { flag: "🇩🇿", animal: "Fennec Fox" },
  "Austria": { flag: "🇦🇹", animal: "Black Eagle" },
  "Jordan": { flag: "🇯🇴", animal: "Arabian Sand Cat" },
  // Group K
  "Portugal": { flag: "🇵🇹", animal: "Iberian Wolf" },
  "Congo DR": { flag: "🇨🇩", animal: "Okapi" },
  "DR Congo": { flag: "🇨🇩", animal: "Okapi" },
  "Uzbekistan": { flag: "🇺🇿", animal: "Snow Leopard" },
  "Colombia": { flag: "🇨🇴", animal: "Andean Cock-of-the-rock" },
  // Group L
  "England": { flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", animal: "Fox" },
  "Croatia": { flag: "🇭🇷", animal: "Marten" },
  "Ghana": { flag: "🇬🇭", animal: "African Grey Parrot" },
  "Panama": { flag: "🇵🇦", animal: "Leatherback Turtle" },
};

export const metaFor = (name?: string | null): CountryMeta | undefined =>
  name ? COUNTRY_META[name.trim()] : undefined;

// ISO codes for real flag images (flagcdn). Emoji flags do NOT render on Windows,
// so every flag is drawn as an <img> instead. Keyed to api-football's exact names.
export const FLAG_CODE: Record<string, string> = {
  "Mexico": "mx", "South Korea": "kr", "Czechia": "cz", "Czech Republic": "cz", "South Africa": "za",
  "Canada": "ca", "Bosnia & Herzegovina": "ba", "Qatar": "qa", "Switzerland": "ch",
  "Brazil": "br", "Morocco": "ma", "Haiti": "ht", "Scotland": "gb-sct",
  "USA": "us", "Paraguay": "py", "Australia": "au", "Türkiye": "tr", "Turkey": "tr",
  "Germany": "de", "Curaçao": "cw", "Curacao": "cw", "Ivory Coast": "ci", "Côte d'Ivoire": "ci", "Ecuador": "ec",
  "Netherlands": "nl", "Japan": "jp", "Sweden": "se", "Tunisia": "tn",
  "Belgium": "be", "Egypt": "eg", "Iran": "ir", "New Zealand": "nz",
  "Spain": "es", "Cape Verde Islands": "cv", "Cape Verde": "cv", "Saudi Arabia": "sa", "Uruguay": "uy",
  "France": "fr", "Senegal": "sn", "Iraq": "iq", "Norway": "no",
  "Argentina": "ar", "Algeria": "dz", "Austria": "at", "Jordan": "jo",
  "Portugal": "pt", "Congo DR": "cd", "DR Congo": "cd", "Uzbekistan": "uz", "Colombia": "co",
  "England": "gb-eng", "Croatia": "hr", "Ghana": "gh", "Panama": "pa",
};

export const codeFor = (name?: string | null): string =>
  name ? (FLAG_CODE[name.trim()] ?? "") : "";

export const flagUrl = (code?: string): string =>
  code ? `https://flagcdn.com/${code}.svg` : "";

// Primary flag colour per nation — used as the backdrop behind team art so the
// bracket/leaderboard cards read as "that team's colour" at a glance.
export const FLAG_COLOR: Record<string, string> = {
  "Mexico": "#006341", "South Korea": "#CD2E3A", "Czechia": "#11457E", "Czech Republic": "#11457E", "South Africa": "#007749",
  "Canada": "#FF0000", "Bosnia & Herzegovina": "#002395", "Qatar": "#8D1B3D", "Switzerland": "#FF0000",
  "Brazil": "#009C3B", "Morocco": "#C1272D", "Haiti": "#00209F", "Scotland": "#0065BD",
  "USA": "#3C3B6E", "Paraguay": "#0038A8", "Australia": "#00008B", "Türkiye": "#E30A17", "Turkey": "#E30A17",
  "Germany": "#1A1A1A", "Curaçao": "#0B6BCB", "Curacao": "#0B6BCB", "Ivory Coast": "#F77F00", "Côte d'Ivoire": "#F77F00", "Ecuador": "#FFD100",
  "Netherlands": "#FF6C00", "Japan": "#BC002D", "Sweden": "#006AA7", "Tunisia": "#E70013",
  "Belgium": "#ED2939", "Egypt": "#CE1126", "Iran": "#239F40", "New Zealand": "#00247D",
  "Spain": "#AA151B", "Cape Verde Islands": "#003893", "Cape Verde": "#003893", "Saudi Arabia": "#006C35", "Uruguay": "#5C88DA",
  "France": "#0055A4", "Senegal": "#00853F", "Iraq": "#CE1126", "Norway": "#BA0C2F",
  "Argentina": "#75AADB", "Algeria": "#006233", "Austria": "#ED2939", "Jordan": "#007A3D",
  "Portugal": "#006600", "Congo DR": "#007FFF", "DR Congo": "#007FFF", "Uzbekistan": "#0099B5", "Colombia": "#FCD116",
  "England": "#CE1124", "Croatia": "#FF0000", "Ghana": "#006B3F", "Panama": "#DA121A",
};

export const flagColorFor = (name?: string | null): string =>
  (name && FLAG_COLOR[name.trim()]) || colorFor(name || "");
