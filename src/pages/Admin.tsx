import { useEffect, useMemo, useState } from "react";
import { MemoryRouter } from "react-router-dom";
import { Loader2, LogOut, Save, ShieldCheck, ExternalLink, Type, ChevronUp, ChevronDown } from "lucide-react";
import App from "@/App";
import { DataContext, useData, type DataShape } from "@/context/data";
import { EditContext, type ImgTarget, type TextTarget } from "@/context/edit";
import { login, getToken, clearToken, loadOverrides, saveOverrides } from "@/lib/adminClient";
import {
  EMPTY_OVERRIDES, DEFAULT_HERO, DEFAULT_FEATURED, FONTS, applyFonts,
  type Overrides, type HeroSlide, type FeaturedItem,
} from "@/lib/overrides";

export default function Admin() {
  const [authed, setAuthed] = useState(!!getToken());
  if (!authed) return <Login onDone={() => setAuthed(true)} />;
  return <Editor onLogout={() => { clearToken(); setAuthed(false); }} />;
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
        <h1 className="headline text-2xl mb-4">Visual Editor Login</h1>
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

/* ----------------------------------------------------- override mutations -- */
const withKey = (obj: Record<string, string>, key: string, val: string | null) => {
  const next = { ...obj };
  if (val) next[key] = val; else delete next[key];
  return next;
};
const heroBase = (d: Overrides): HeroSlide[] => (d.hero ? d.hero.map((s) => ({ ...s })) : DEFAULT_HERO.map((s) => ({ ...s })));
const featBase = (d: Overrides): FeaturedItem[] => (d.featured ? d.featured.map((s) => ({ ...s })) : DEFAULT_FEATURED.map((s) => ({ ...s })));

function applyImage(d: Overrides, t: ImgTarget, url: string | null): Overrides {
  switch (t.kind) {
    case "player": return { ...d, players: withKey(d.players, t.key, url) };
    case "flag": return { ...d, flags: withKey(d.flags, t.key, url) };
    case "mascot": {
      const mascots = { ...d.mascots };
      for (const n of Array.isArray(t.key) ? t.key : [t.key]) { if (url) mascots[n] = url; else delete mascots[n]; }
      return { ...d, mascots };
    }
    case "hero": { const hero = heroBase(d); hero[t.index] = { ...hero[t.index], img: url || "" }; return { ...d, hero }; }
    case "featured": { const featured = featBase(d); featured[t.index] = { ...featured[t.index], img: url || "" }; return { ...d, featured }; }
    case "ad": {
      const cur = d.ads[t.slot] || { img: "", link: "" };
      const next = { img: url || "", link: cur.link };
      const ads = { ...d.ads };
      if (!next.img && !next.link) delete ads[t.slot]; else ads[t.slot] = next;
      return { ...d, ads };
    }
  }
}

function applyText(d: Overrides, t: TextTarget, value: string): Overrides {
  if (t.kind === "hero") { const hero = heroBase(d); hero[t.index] = { ...hero[t.index], [t.field]: value }; return { ...d, hero }; }
  const featured = featBase(d); featured[t.index] = { ...featured[t.index], [t.field]: value }; return { ...d, featured };
}

/* ----------------------------------------------------------------- editor -- */
function Editor({ onLogout }: { onLogout: () => void }) {
  const base = useData();                       // live API data (already running)
  const [draft, setDraft] = useState<Overrides>(EMPTY_OVERRIDES);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadOverrides().then((o) => setDraft({ ...EMPTY_OVERRIDES, ...o })).catch(() => {}).finally(() => setLoaded(true));
  }, []);

  useEffect(() => { applyFonts(draft.font); }, [draft.font]);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3500); };

  const onImage = (t: ImgTarget, url: string | null) => setDraft((d) => applyImage(d, t, url));
  const onText = (t: TextTarget, value: string) => setDraft((d) => applyText(d, t, value));

  const save = async () => {
    setSaving(true);
    try { await saveOverrides(draft); flash("Saved — live on the site within a minute."); }
    catch (e: any) { flash(e?.message || "Save failed"); if (/log in again/i.test(e?.message || "")) onLogout(); }
    finally { setSaving(false); }
  };

  // Live-preview data: real API data + draft overrides (player photos re-applied
  // so newly uploaded pictures show instantly in the preview).
  const data: DataShape = useMemo(() => ({
    ...base,
    overrides: draft,
    scorers: base.scorers.map((s) => ({ ...s, img: draft.players[s.name] || s.img })),
    bestPlayer: { ...base.bestPlayer, img: (base.bestPlayer.name && draft.players[base.bestPlayer.name]) || base.bestPlayer.img },
  }), [base, draft]);

  if (!loaded) return <div className="min-h-screen grid place-items-center bg-soft"><Loader2 className="h-7 w-7 animate-spin text-pitch" /></div>;

  return (
    <EditContext.Provider value={{ editing: true, onImage, onText, onError: flash }}>
      <DataContext.Provider value={data}>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
        <Toolbar draft={draft} setDraft={setDraft} saving={saving} save={save} onLogout={onLogout} msg={msg} />
      </DataContext.Provider>
    </EditContext.Provider>
  );
}

/* ------------------------------------------------------- floating toolbar -- */
function Toolbar({
  draft, setDraft, saving, save, onLogout, msg,
}: { draft: Overrides; setDraft: React.Dispatch<React.SetStateAction<Overrides>>; saving: boolean; save: () => void; onLogout: () => void; msg: string }) {
  const [open, setOpen] = useState(true);
  const setFont = (which: "heading" | "body", id: string) =>
    setDraft((d) => ({ ...d, font: { ...d.font, [which]: id || undefined } }));

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] w-[min(720px,calc(100vw-1.5rem))]">
      {msg && <div className="mb-2 mx-auto w-fit rounded-lg bg-pitch text-white px-4 py-2 text-sm shadow-lg">{msg}</div>}
      <div className="rounded-2xl bg-[#1a1a1a] text-white shadow-2xl ring-1 ring-white/10">
        <div className="flex items-center gap-3 px-4 py-2.5">
          <span className="inline-flex items-center gap-1.5 text-gold font-display font-extrabold uppercase tracking-wider text-sm">
            <ShieldCheck className="h-4 w-4" /> Editing
          </span>
          <span className="hidden sm:inline text-white/50 text-xs">Hover any picture to replace · click headings to edit · use the site menu to switch pages</span>
          <button onClick={() => setOpen((v) => !v)} className="ml-auto h-8 w-8 grid place-items-center rounded-lg text-white/60 hover:bg-white/10" aria-label="Toggle panel">
            {open ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        </div>
        {open && (
          <div className="border-t border-white/10 px-4 py-3 flex flex-wrap items-end gap-3">
            <FontSelect label="Heading font" value={draft.font?.heading || ""} onChange={(v) => setFont("heading", v)} />
            <FontSelect label="Body font" value={draft.font?.body || ""} onChange={(v) => setFont("body", v)} />
            <div className="ml-auto flex items-center gap-2">
              <a href="/" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-white/70 hover:bg-white/10 text-xs"><ExternalLink className="h-4 w-4" /> Live site</a>
              <button onClick={onLogout} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-white/70 hover:bg-white/10 text-xs"><LogOut className="h-4 w-4" /> Logout</button>
              <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 bg-pitch px-5 py-2 rounded-lg font-display font-bold uppercase tracking-wider text-xs disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FontSelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[10px] font-display uppercase tracking-wider text-white/50 flex items-center gap-1"><Type className="h-3 w-3" /> {label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 rounded-lg bg-white/10 border border-white/15 text-white text-sm px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-gold">
        <option value="" className="text-ink">Default</option>
        {Object.entries(FONTS).map(([id, f]) => <option key={id} value={id} className="text-ink">{f.label}</option>)}
      </select>
    </label>
  );
}
