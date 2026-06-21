import { useEffect, useMemo, useState } from "react";
import { Loader2, LogOut, Save, Plus, Trash2, ArrowUp, ArrowDown, ShieldCheck } from "lucide-react";
import { ImageDrop } from "@/components/admin/ImageDrop";
import { login, getToken, clearToken, loadOverrides, saveOverrides } from "@/lib/adminClient";
import { EMPTY_OVERRIDES, DEFAULT_HERO, DEFAULT_FEATURED, type Overrides, type HeroSlide, type FeaturedItem } from "@/lib/overrides";
import { COUNTRY_META, codeFor, flagUrl } from "@/lib/mascots";
import { fetchScorers } from "@/lib/client";
import { shapeScorers } from "@/lib/transforms";

const TABS = ["Players", "Teams", "Hero", "Featured", "Ads"] as const;
type Tab = (typeof TABS)[number];

// Immutably set/delete a string key on a record (delete when value is empty).
const withKey = (obj: Record<string, string>, key: string, val: string | null) => {
  const next = { ...obj };
  if (val) next[key] = val; else delete next[key];
  return next;
};

export default function Admin() {
  const [authed, setAuthed] = useState(!!getToken());
  if (!authed) return <Login onDone={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => { clearToken(); setAuthed(false); }} />;
}

/* ------------------------------------------------------------------ login -- */
function Login({ onDone }: { onDone: () => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr("");
    try { await login(user, pass); onDone(); }
    catch (e: any) { setErr(e?.message || "Login failed"); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-soft grid place-items-center p-4">
      <form onSubmit={submit} className="card-surface w-full max-w-sm p-6">
        <div className="flex items-center gap-2 mb-1 text-pitch"><ShieldCheck className="h-5 w-5" /><span className="eyebrow">Admin</span></div>
        <h1 className="headline text-2xl mb-4">Dashboard Login</h1>
        <label className="block text-sm font-semibold mb-1">Username</label>
        <input value={user} onChange={(e) => setUser(e.target.value)} autoComplete="username"
          className="w-full mb-3 rounded-lg border border-border px-3 py-2 bg-white" />
        <label className="block text-sm font-semibold mb-1">Password</label>
        <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="current-password"
          className="w-full mb-4 rounded-lg border border-border px-3 py-2 bg-white" />
        {err && <div className="mb-3 text-sm text-live">{err}</div>}
        <button disabled={busy} className="w-full inline-flex items-center justify-center gap-2 bg-pitch text-white py-2.5 rounded-xl font-display font-bold uppercase tracking-wider text-sm disabled:opacity-60">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Sign in
        </button>
      </form>
    </div>
  );
}

/* -------------------------------------------------------------- dashboard -- */
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [ov, setOv] = useState<Overrides>(EMPTY_OVERRIDES);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<Tab>("Players");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadOverrides()
      .then((o) => setOv({ ...EMPTY_OVERRIDES, ...o }))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const save = async () => {
    setSaving(true);
    try { await saveOverrides(ov); flash("Saved. Changes appear on the site within a minute."); }
    catch (e: any) {
      flash(e?.message || "Save failed");
      if (/log in again/i.test(e?.message || "")) onLogout();
    } finally { setSaving(false); }
  };

  if (!loaded) return <div className="min-h-screen grid place-items-center bg-soft"><Loader2 className="h-7 w-7 animate-spin text-pitch" /></div>;

  return (
    <div className="min-h-screen bg-soft text-ink">
      <header className="sticky top-0 z-20 bg-[#1a1a1a] text-white">
        <div className="mx-auto max-w-[1100px] px-4 h-16 flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-gold" />
          <span className="font-display font-extrabold uppercase tracking-wider">AWC Admin</span>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={save} disabled={saving}
              className="inline-flex items-center gap-2 bg-pitch px-4 py-2 rounded-lg font-display font-bold uppercase tracking-wider text-xs disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
            </button>
            <button onClick={onLogout} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-white/70 hover:bg-white/10 text-xs">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
        <nav className="mx-auto max-w-[1100px] px-4 flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-2.5 text-sm font-display font-bold uppercase tracking-wider border-b-2 transition ${
                tab === t ? "border-gold text-white" : "border-transparent text-white/55 hover:text-white"}`}>
              {t}
            </button>
          ))}
        </nav>
      </header>

      {msg && <div className="mx-auto max-w-[1100px] px-4 pt-3"><div className="rounded-lg bg-accent text-pitch px-4 py-2 text-sm">{msg}</div></div>}

      <main className="mx-auto max-w-[1100px] px-4 py-6">
        {tab === "Players" && <PlayersTab ov={ov} setOv={setOv} onError={flash} />}
        {tab === "Teams" && <TeamsTab ov={ov} setOv={setOv} onError={flash} />}
        {tab === "Hero" && <HeroTab ov={ov} setOv={setOv} onError={flash} />}
        {tab === "Featured" && <FeaturedTab ov={ov} setOv={setOv} onError={flash} />}
        {tab === "Ads" && <AdsTab ov={ov} setOv={setOv} onError={flash} />}
      </main>
    </div>
  );
}

type TabProps = { ov: Overrides; setOv: React.Dispatch<React.SetStateAction<Overrides>>; onError: (m: string) => void };

/* ---------------------------------------------------------------- players -- */
function PlayersTab({ ov, setOv, onError }: TabProps) {
  const [players, setPlayers] = useState<{ name: string; base: string | null }[]>([]);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetchScorers()
      .then((j) => setPlayers(shapeScorers(j).map((s: any) => ({ name: s.name, base: s.img }))))
      .catch(() => setPlayers([]));
  }, []);

  const set = (name: string, url: string | null) =>
    setOv((o) => ({ ...o, players: withKey(o.players, name, url) }));

  const rows = useMemo(() => {
    const seen = new Set(players.map((p) => p.name));
    const extra = Object.keys(ov.players).filter((n) => !seen.has(n)).map((n) => ({ name: n, base: null }));
    return [...players, ...extra];
  }, [players, ov.players]);

  const add = () => {
    const n = newName.trim();
    if (n && !rows.some((r) => r.name === n)) setOv((o) => ({ ...o, players: { ...o.players, [n]: o.players[n] || "" } }));
    setNewName("");
  };

  return (
    <div>
      <SectionIntro title="Player pictures"
        text="Replace the picture shown for any player in the scorers list and Best Player card. Live stats stay from the football API — only the picture changes. Match the player name exactly as it appears on the site." />
      <div className="flex gap-2 mb-4">
        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Add a player by name…"
          className="flex-1 rounded-lg border border-border px-3 py-2 bg-white" />
        <button onClick={add} className="inline-flex items-center gap-1.5 bg-pitch text-white px-3 rounded-lg text-sm font-bold"><Plus className="h-4 w-4" /> Add</button>
      </div>
      {rows.length === 0 && <Empty text="No players loaded yet (the API may have no scorers pre-tournament). Add one by name above." />}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {rows.map((p) => (
          <div key={p.name} className="card-surface p-3">
            <ImageDrop value={ov.players[p.name] || p.base || null}
              onChange={(url) => set(p.name, url)} onError={onError} />
            <div className="mt-2 text-sm font-semibold truncate" title={p.name}>{p.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ teams -- */
function TeamsTab({ ov, setOv, onError }: TabProps) {
  // One row per nation (deduped by flag code), but mascot is saved under every
  // alias the football API might return for that nation.
  const groups = useMemo(() => {
    const g: Record<string, { code: string; names: string[] }> = {};
    for (const name of Object.keys(COUNTRY_META)) {
      const code = codeFor(name);
      if (!code) continue;
      (g[code] ||= { code, names: [] }).names.push(name);
    }
    return Object.values(g).sort((a, b) => a.names[0].localeCompare(b.names[0]));
  }, []);

  const setFlag = (code: string, url: string | null) =>
    setOv((o) => ({ ...o, flags: withKey(o.flags, code, url) }));

  const setMascot = (names: string[], url: string | null) =>
    setOv((o) => {
      const mascots = { ...o.mascots };
      for (const n of names) { if (url) mascots[n] = url; else delete mascots[n]; }
      return { ...o, mascots };
    });

  return (
    <div>
      <SectionIntro title="Team flags & mascots"
        text="Upload a custom flag (shown across tables, match cards and team cards) or a mascot picture (shown on the Teams page and match cards) for any nation. Leave blank to keep the built-in flag/art." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((grp) => {
          const name = grp.names[0];
          return (
            <div key={grp.code} className="card-surface p-3">
              <div className="flex items-center gap-2 mb-2">
                <img src={flagUrl(grp.code)} alt="" className="h-4 w-6 rounded-sm ring-1 ring-black/10" />
                <span className="font-display font-bold uppercase tracking-wide text-sm truncate">{name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <ImageDrop label="Flag" aspect="3 / 2" value={ov.flags[grp.code] || null}
                  onChange={(url) => setFlag(grp.code, url)} onError={onError} />
                <ImageDrop label="Mascot" aspect="1 / 1" value={grp.names.map((n) => ov.mascots[n]).find(Boolean) || null}
                  onChange={(url) => setMascot(grp.names, url)} onError={onError} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- hero -- */
function HeroTab({ ov, setOv, onError }: TabProps) {
  const slides = ov.hero;
  const setSlides = (next: HeroSlide[] | null) => setOv((o) => ({ ...o, hero: next }));
  const update = (i: number, patch: Partial<HeroSlide>) =>
    setSlides(slides!.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const move = (i: number, dir: number) => {
    if (!slides) return;
    const j = i + dir; if (j < 0 || j >= slides.length) return;
    const next = [...slides]; [next[i], next[j]] = [next[j], next[i]]; setSlides(next);
  };

  if (!slides) return (
    <EditorEmpty title="Hero carousel"
      text="The homepage currently shows the built-in hero slides. Load them here to start editing, add, remove or reorder."
      onLoad={() => setSlides(DEFAULT_HERO.map((s) => ({ ...s })))} />
  );

  return (
    <div>
      <SectionIntro title="Hero carousel" text="Edit the big rotating banner on the homepage. Drag images in, edit the text, reorder or add slides." />
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => setSlides([...slides, { tag: "TOP STORY", title: "", sub: "", img: "", color: "#0B8A3D" }])}
          className="inline-flex items-center gap-1.5 bg-pitch text-white px-3 py-2 rounded-lg text-sm font-bold"><Plus className="h-4 w-4" /> Add slide</button>
        <button onClick={() => setSlides(null)} className="text-sm text-muted-foreground hover:text-live">Reset to built-in</button>
      </div>
      <div className="space-y-4">
        {slides.map((s, i) => (
          <div key={i} className="card-surface p-4 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
            <ImageDrop aspect="16 / 9" value={s.img || null} onChange={(url) => update(i, { img: url || "" })} onError={onError} />
            <div className="space-y-2">
              <Field label="Tag" value={s.tag} onChange={(v) => update(i, { tag: v })} />
              <Field label="Title" value={s.title} onChange={(v) => update(i, { title: v })} />
              <Field label="Subtitle" value={s.sub} onChange={(v) => update(i, { sub: v })} />
              <ColorField label="Accent colour" value={s.color} onChange={(v) => update(i, { color: v })} />
              <RowActions onUp={() => move(i, -1)} onDown={() => move(i, 1)} onRemove={() => setSlides(slides.filter((_, idx) => idx !== i))} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- featured -- */
function FeaturedTab({ ov, setOv, onError }: TabProps) {
  const items = ov.featured;
  const setItems = (next: FeaturedItem[] | null) => setOv((o) => ({ ...o, featured: next }));
  const update = (i: number, patch: Partial<FeaturedItem>) =>
    setItems(items!.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const move = (i: number, dir: number) => {
    if (!items) return;
    const j = i + dir; if (j < 0 || j >= items.length) return;
    const next = [...items]; [next[i], next[j]] = [next[j], next[i]]; setItems(next);
  };

  if (!items) return (
    <EditorEmpty title="Featured teams"
      text="The homepage sidebar shows the built-in featured teams. Load them here to start editing."
      onLoad={() => setItems(DEFAULT_FEATURED.map((it) => ({ ...it })))} />
  );

  return (
    <div>
      <SectionIntro title="Featured teams" text="Edit the 'Featured Teams' list in the homepage sidebar." />
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => setItems([...items, { animal: "", nick: "", country: "", color: "#0B8A3D", img: "" }])}
          className="inline-flex items-center gap-1.5 bg-pitch text-white px-3 py-2 rounded-lg text-sm font-bold"><Plus className="h-4 w-4" /> Add team</button>
        <button onClick={() => setItems(null)} className="text-sm text-muted-foreground hover:text-live">Reset to built-in</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((it, i) => (
          <div key={i} className="card-surface p-4 grid grid-cols-[120px_1fr] gap-4">
            <ImageDrop aspect="1 / 1" value={it.img || null} onChange={(url) => update(i, { img: url || "" })} onError={onError} />
            <div className="space-y-2">
              <Field label="Animal" value={it.animal} onChange={(v) => update(i, { animal: v })} />
              <Field label="Nickname" value={it.nick} onChange={(v) => update(i, { nick: v })} />
              <Field label="Country" value={it.country} onChange={(v) => update(i, { country: v })} />
              <ColorField label="Accent colour" value={it.color} onChange={(v) => update(i, { color: v })} />
              <RowActions onUp={() => move(i, -1)} onDown={() => move(i, 1)} onRemove={() => setItems(items.filter((_, idx) => idx !== i))} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- ads -- */
function AdsTab({ ov, setOv, onError }: TabProps) {
  const slots: { key: "sidebarTop" | "sidebarBottom"; label: string; note: string }[] = [
    { key: "sidebarTop", label: "Left sidebar ad", note: "Replaces the 'Powered by AI' box." },
    { key: "sidebarBottom", label: "Right sidebar ad", note: "Replaces the 'Roar Energy' box." },
  ];
  const setAd = (key: "sidebarTop" | "sidebarBottom", patch: { img?: string | null; link?: string }) =>
    setOv((o) => {
      const cur = o.ads[key] || { img: "", link: "" };
      const next = { img: patch.img !== undefined ? (patch.img || "") : cur.img, link: patch.link !== undefined ? patch.link : cur.link };
      const ads = { ...o.ads };
      if (!next.img && !next.link) delete ads[key]; else ads[key] = next;
      return { ...o, ads };
    });

  return (
    <div>
      <SectionIntro title="Ads" text="Upload a 300×250 ad image and an optional click-through link for each sidebar slot. Clear the image to restore the built-in ad." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {slots.map((s) => {
          const ad = ov.ads[s.key];
          return (
            <div key={s.key} className="card-surface p-4">
              <div className="font-display font-bold uppercase tracking-wide text-sm">{s.label}</div>
              <div className="text-xs text-muted-foreground mb-3">{s.note}</div>
              <div className="max-w-[300px]">
                <ImageDrop aspect="300 / 250" value={ad?.img || null} onChange={(url) => setAd(s.key, { img: url })} onError={onError} />
              </div>
              <div className="mt-2">
                <Field label="Link (optional)" value={ad?.link || ""} onChange={(v) => setAd(s.key, { link: v })} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- helpers --- */
function SectionIntro({ title, text }: { title: string; text: string }) {
  return (
    <div className="mb-5">
      <h2 className="headline text-2xl">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{text}</p>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] font-display uppercase tracking-wider text-muted-foreground">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full mt-0.5 rounded-lg border border-border px-3 py-1.5 bg-white text-sm" />
    </label>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] font-display uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2 mt-0.5">
        <input type="color" value={value || "#0B8A3D"} onChange={(e) => onChange(e.target.value)} className="h-9 w-12 rounded border border-border bg-white" />
        <input value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 rounded-lg border border-border px-3 py-1.5 bg-white text-sm" />
      </div>
    </label>
  );
}

function RowActions({ onUp, onDown, onRemove }: { onUp: () => void; onDown: () => void; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-1 pt-1">
      <button onClick={onUp} className="h-8 w-8 grid place-items-center rounded-lg border border-border hover:bg-soft" aria-label="Move up"><ArrowUp className="h-4 w-4" /></button>
      <button onClick={onDown} className="h-8 w-8 grid place-items-center rounded-lg border border-border hover:bg-soft" aria-label="Move down"><ArrowDown className="h-4 w-4" /></button>
      <button onClick={onRemove} className="h-8 w-8 grid place-items-center rounded-lg border border-border text-live hover:bg-live/10 ml-auto" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="card-surface p-6 text-center text-sm text-muted-foreground">{text}</div>;
}

function EditorEmpty({ title, text, onLoad }: { title: string; text: string; onLoad: () => void }) {
  return (
    <div>
      <SectionIntro title={title} text={text} />
      <button onClick={onLoad} className="inline-flex items-center gap-2 bg-pitch text-white px-4 py-2.5 rounded-xl font-display font-bold uppercase tracking-wider text-sm">
        <Plus className="h-4 w-4" /> Load &amp; edit
      </button>
    </div>
  );
}
