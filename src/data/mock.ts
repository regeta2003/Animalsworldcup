// Fallback / demo data. DataProvider overrides matches/standings/scorers/bestPlayer
// with live API data at runtime; the rest renders as-is.
import eagle from "@/assets/germany.png";
import elephant from "@/assets/ivory.png";
import condor from "@/assets/ecuador.png";
import parrot from "@/assets/curacao.png";

export const images = {
  eagle,
  elephant,
  condor,
  parrot,
};

export const featuredTeams = [
  { animal: "Eagle",    nick: "Die Adler",       country: "Germany",      flag: "🇩🇪", color: "#1A1A1A", img: images.eagle },
  { animal: "Elephant", nick: "Les Éléphants",   country: "Ivory Coast",  flag: "🇨🇮", color: "#F77F00", img: images.elephant },
  { animal: "Condor",   nick: "La Tri",          country: "Ecuador",      flag: "🇪🇨", color: "#FFD100", img: images.condor },
  { animal: "Parrot",   nick: "Los Azulinos",    country: "Curaçao",      flag: "🇨🇼", color: "#0B6BCB", img: images.parrot },
];

// (helper removed — inline literals used below)


export const standings = {
  A: [
    { name: "Lions",    color: "#C49B2F", played: 3, gd: 6, pts: 9 },
    { name: "Sharks",   color: "#1E6FBA", played: 3, gd: 2, pts: 6 },
    { name: "Wolves",   color: "#6B7280", played: 3, gd: -1, pts: 3 },
    { name: "Foxes",    color: "#D55D27", played: 3, gd: -7, pts: 0 },
  ],
  B: [
    { name: "Stallions", color: "#0EA5E9", played: 3, gd: 5, pts: 7 },
    { name: "Bears",     color: "#7C3E16", played: 3, gd: 3, pts: 7 },
    { name: "Hawks",     color: "#0F766E", played: 3, gd: 0, pts: 3 },
    { name: "Rams",      color: "#9A3412", played: 3, gd: -8, pts: 0 },
  ],
  C: [
    { name: "Panthers",  color: "#111827", played: 3, gd: 4, pts: 9 },
    { name: "Bulls",     color: "#B91C1C", played: 3, gd: 1, pts: 4 },
    { name: "Jaguars",   color: "#F59E0B", played: 3, gd: 0, pts: 4 },
    { name: "Crocs",     color: "#15803D", played: 3, gd: -5, pts: 0 },
  ],
  D: [
    { name: "Falcons",   color: "#1E40AF", played: 3, gd: 7, pts: 9 },
    { name: "Tigers",    color: "#F97316", played: 3, gd: 2, pts: 6 },
    { name: "Cheetahs",  color: "#CA8A04", played: 3, gd: -2, pts: 3 },
    { name: "Owls",      color: "#374151", played: 3, gd: -7, pts: 0 },
  ],
  E: [
    { name: "Eagle",     color: "#111827", played: 3, gd: 5, pts: 7 },
    { name: "Elephant",  color: "#F77F00", played: 3, gd: 3, pts: 6 },
    { name: "Condor",    color: "#EAB308", played: 3, gd: 1, pts: 4 },
    { name: "Parrot",    color: "#0B6BCB", played: 3, gd: -9, pts: 0 },
  ],
  F: [
    { name: "Pumas",     color: "#0F172A", played: 3, gd: 4, pts: 9 },
    { name: "Stags",     color: "#7C2D12", played: 3, gd: 2, pts: 6 },
    { name: "Cobras",    color: "#16A34A", played: 3, gd: -1, pts: 3 },
    { name: "Bisons",    color: "#52525B", played: 3, gd: -5, pts: 0 },
  ],
  G: [
    { name: "Dragons",   color: "#B91C1C", played: 3, gd: 6, pts: 9 },
    { name: "Lynx",      color: "#6D28D9", played: 3, gd: 1, pts: 4 },
    { name: "Boars",     color: "#92400E", played: 3, gd: 0, pts: 4 },
    { name: "Doves",     color: "#94A3B8", played: 3, gd: -7, pts: 0 },
  ],
  H: [
    { name: "Bulls",     color: "#B91C1C", played: 3, gd: 5, pts: 7 },
    { name: "Whales",    color: "#0369A1", played: 3, gd: 2, pts: 7 },
    { name: "Geckos",    color: "#16A34A", played: 3, gd: -2, pts: 3 },
    { name: "Storks",    color: "#475569", played: 3, gd: -5, pts: 0 },
  ],
  I: [
    { name: "Cougars",   color: "#7C2D12", played: 3, gd: 3, pts: 9 },
    { name: "Penguins",  color: "#0F172A", played: 3, gd: 1, pts: 6 },
    { name: "Otters",    color: "#0E7490", played: 3, gd: 0, pts: 3 },
    { name: "Toucans",   color: "#EA580C", played: 3, gd: -4, pts: 0 },
  ],
  J: [
    { name: "Rhinos",    color: "#374151", played: 3, gd: 4, pts: 9 },
    { name: "Hyenas",    color: "#A16207", played: 3, gd: 2, pts: 6 },
    { name: "Mantas",    color: "#0891B2", played: 3, gd: -1, pts: 3 },
    { name: "Vultures",  color: "#4B5563", played: 3, gd: -5, pts: 0 },
  ],
  K: [
    { name: "Leopards",  color: "#F59E0B", played: 3, gd: 5, pts: 7 },
    { name: "Orcas",     color: "#0F172A", played: 3, gd: 2, pts: 7 },
    { name: "Camels",    color: "#A8773F", played: 3, gd: -1, pts: 3 },
    { name: "Sparrows",  color: "#94A3B8", played: 3, gd: -6, pts: 0 },
  ],
  L: [
    { name: "Gorillas",  color: "#111827", played: 3, gd: 6, pts: 9 },
    { name: "Crows",     color: "#1F2937", played: 3, gd: 1, pts: 4 },
    { name: "Iguanas",   color: "#15803D", played: 3, gd: 0, pts: 4 },
    { name: "Seals",     color: "#64748B", played: 3, gd: -7, pts: 0 },
  ],
};

// UTC times. UI converts to selected zone.
export const matches = [
  { group: "E", home: "Eagle",    away: "Elephant", hs: 2, as: 1, venue: "Estadio Azteca, Mexico City",     status: "live", clock: "67'", date: "2026-06-15T18:00:00Z", homeImg: images.eagle,    awayImg: images.elephant },
  { group: "E", home: "Condor",   away: "Parrot",   hs: 1, as: 1, venue: "MetLife Stadium, New Jersey",      status: "ht",   clock: "HT",  date: "2026-06-15T20:30:00Z", homeImg: images.condor,   awayImg: images.parrot },
  { group: "A", home: "Lions",    away: "Sharks",   hs: 3, as: 0, venue: "SoFi Stadium, Los Angeles",        status: "live", clock: "82'", date: "2026-06-15T22:00:00Z", homeImg: null, awayImg: null },
  { group: "C", home: "Panthers", away: "Bulls",    hs: 0, as: 0, venue: "BC Place, Vancouver",               status: "live", clock: "31'", date: "2026-06-16T00:00:00Z", homeImg: null, awayImg: null },

  { group: "B", home: "Stallions", away: "Bears",   hs: 2, as: 2, venue: "AT&T Stadium, Dallas",              status: "ft", clock: "FT", date: "2026-06-14T20:00:00Z", homeImg: null, awayImg: null },
  { group: "D", home: "Falcons",   away: "Tigers",  hs: 1, as: 0, venue: "Lumen Field, Seattle",              status: "ft", clock: "FT", date: "2026-06-14T22:30:00Z", homeImg: null, awayImg: null },
  { group: "F", home: "Pumas",     away: "Stags",   hs: 0, as: 0, venue: "Gillette Stadium, Boston",          status: "ns", clock: "—",  date: "2026-06-17T18:00:00Z", homeImg: null, awayImg: null },
  { group: "G", home: "Dragons",   away: "Lynx",    hs: 0, as: 0, venue: "Hard Rock Stadium, Miami",          status: "ns", clock: "—",  date: "2026-06-17T20:30:00Z", homeImg: null, awayImg: null },
  { group: "H", home: "Bulls",     away: "Whales",  hs: 0, as: 0, venue: "Arrowhead Stadium, Kansas City",    status: "ns", clock: "—",  date: "2026-06-18T18:00:00Z", homeImg: null, awayImg: null },
  { group: "I", home: "Cougars",   away: "Penguins",hs: 0, as: 0, venue: "Mercedes-Benz Stadium, Atlanta",    status: "ns", clock: "—",  date: "2026-06-18T20:30:00Z", homeImg: null, awayImg: null },
  { group: "J", home: "Rhinos",    away: "Hyenas",  hs: 0, as: 0, venue: "NRG Stadium, Houston",              status: "ns", clock: "—",  date: "2026-06-19T18:00:00Z", homeImg: null, awayImg: null },
  { group: "K", home: "Leopards",  away: "Orcas",   hs: 0, as: 0, venue: "Levi's Stadium, San Francisco",     status: "ns", clock: "—",  date: "2026-06-19T20:30:00Z", homeImg: null, awayImg: null },
  { group: "L", home: "Gorillas",  away: "Crows",   hs: 0, as: 0, venue: "Lincoln Financial Field, Philly",   status: "ns", clock: "—",  date: "2026-06-20T18:00:00Z", homeImg: null, awayImg: null },
];

export const scorers = [
  { rank: 1, name: "Adler Wirtz",   team: "Eagle",     goals: 6, assists: 2, rating: 8.9, img: images.eagle },
  { rank: 2, name: "Diallo Touré",  team: "Elephant",  goals: 5, assists: 3, rating: 8.7, img: images.elephant },
  { rank: 3, name: "Caicedo Andes", team: "Condor",    goals: 4, assists: 4, rating: 8.5, img: images.condor },
  { rank: 4, name: "Roar Mbeki",    team: "Lions",     goals: 4, assists: 1, rating: 8.3, img: null },
  { rank: 5, name: "Finn Carter",   team: "Sharks",    goals: 3, assists: 2, rating: 8.1, img: null },
  { rank: 6, name: "Bacuna Vela",   team: "Parrot",    goals: 3, assists: 2, rating: 8.0, img: images.parrot },
  { rank: 7, name: "Hawke Müller",  team: "Falcons",   goals: 3, assists: 1, rating: 7.9, img: null },
  { rank: 8, name: "Onyx Black",    team: "Panthers",  goals: 2, assists: 4, rating: 7.8, img: null },
];

export const bestPlayer = {
  name: "Adler Wirtz",
  team: "Germany",
  animal: "Eagle",
  flag: "🇩🇪",
  goals: 2,
  assists: 1,
  rating: 9.4,
  img: images.eagle,
};

export const news = [
  { tag: "MATCH",    title: "Eagle soars past Elephant in a five-goal thriller in Mexico City", source: "AW News",  time: "12m ago" },
  { tag: "TRANSFER", title: "Condor's young midfield maestro linked with European giants",       source: "Reuters",  time: "1h ago" },
  { tag: "TACTICS",  title: "Why the Parrot's high press could shape the knockout rounds",       source: "The Pitch", time: "2h ago" },
  { tag: "INJURY",   title: "Lions captain ruled out of next fixture with hamstring strain",     source: "AW News",  time: "3h ago" },
  { tag: "OPINION",  title: "Five mascots who have lit up the group stage so far",               source: "Editor",   time: "5h ago" },
];

export const highlights = [
  { title: "Eagle 2 - 1 Elephant — All Goals & Highlights", matchday: "Matchday 3", duration: "4:21", img: images.eagle },
  { title: "Condor's stunning free-kick from 30 yards",     matchday: "Matchday 3", duration: "1:08", img: images.condor },
  { title: "Parrot's late equaliser sparks wild scenes",    matchday: "Matchday 3", duration: "2:14", img: images.parrot },
  { title: "Top 10 saves of the group stage",               matchday: "Recap",      duration: "6:02", img: images.elephant },
  { title: "Inside the Eagle camp — behind the scenes",     matchday: "Feature",    duration: "5:45", img: images.eagle },
  { title: "Goal of the week — voted by fans",              matchday: "Matchday 3", duration: "0:48", img: images.condor },
];

export const topStories = [
  { tag: "TOP STORY", title: "Eagle take flight: Germany's mascots top Group E",   sub: "Two goals in eight minutes set up a statement win in Mexico City.", img: images.eagle,    color: "#0B8A3D" },
  { tag: "TOP STORY", title: "Elephants charge into the knockouts",                 sub: "Ivory Coast's mascots clinch second place with grit and goals.",   img: images.elephant, color: "#F77F00" },
  { tag: "TOP STORY", title: "Condor circles a historic last-16 spot",              sub: "Ecuador's mascots show the world what altitude really means.",     img: images.condor,   color: "#EAB308" },
  { tag: "TOP STORY", title: "Parrot's late show electrifies the group",            sub: "Curaçao's debutants steal the night with a stoppage-time strike.", img: images.parrot,   color: "#0B6BCB" },
];
