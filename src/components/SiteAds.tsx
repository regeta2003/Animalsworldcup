import type { AdItem } from "@/lib/overrides";

const IG = "https://www.instagram.com/animalsworldcup";

/** Admin-uploaded custom ad (image + optional link). Renders in the 300x250 slot. */
export function CustomAd({ ad }: { ad: AdItem }) {
  const img = (
    <img
      src={ad.img}
      alt="Advertisement"
      style={{ width: "100%", maxWidth: 300, height: 250, objectFit: "cover", borderRadius: 12, margin: "0 auto", display: "block" }}
    />
  );
  return ad.link ? (
    <a href={ad.link} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>{img}</a>
  ) : img;
}

/** Farhad's "Powered by AI" self-promo ad. Contact -> Instagram. 300x250. */
export function AiServicesAd() {
  return (
    <div
      style={{
        width: "100%", maxWidth: 300, height: 250, margin: "0 auto",
        borderRadius: 12, overflow: "hidden", position: "relative",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: 16, boxSizing: "border-box",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        className="awc-shine-sweep"
        style={{ position: "absolute", top: 0, left: "-150%", width: "60%", height: "100%", background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.35), transparent)", transform: "skewX(-20deg)" }}
      />
      <div style={{ position: "absolute", top: 10, left: 10, color: "#FAC775", fontSize: 18 }}>✦</div>
      <div style={{ position: "absolute", bottom: 14, right: 14, color: "#FAC775", fontSize: 14 }}>✦</div>
      <div style={{ position: "absolute", top: 16, right: 24, color: "#5DCAA5", fontSize: 12 }}>✦</div>
      <div style={{ fontSize: 13, letterSpacing: 1, color: "#9FE1CB", fontWeight: 500, marginBottom: 4 }}>POWERED BY AI</div>
      <div style={{ fontSize: 26, fontWeight: 500, color: "#ffffff", lineHeight: 1.2, marginBottom: 6 }}>
        Need an AI app<br />or content like this?
      </div>
      <div style={{ fontSize: 13, color: "#B5D4F4", marginBottom: 12, maxWidth: 240 }}>
        We built AWC2026 with AI. We can build yours too.
      </div>
      <a
        href={IG} target="_blank" rel="noopener noreferrer"
        className="awc-pulse-glow"
        style={{ textDecoration: "none", background: "#EF9F27", color: "#412402", borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 600, display: "inline-block" }}
      >
        Contact us &#8594;
      </a>
    </div>
  );
}

/** Fake energy-drink ad in the site's green/gold palette, to make the page feel monetized. */
export function EnergyDrinkAd() {
  return (
    <div
      style={{
        width: "100%", maxWidth: 300, height: 250, margin: "0 auto",
        borderRadius: 12, overflow: "hidden", position: "relative",
        background: "linear-gradient(140deg, #0B8A3D 0%, #075C29 70%, #053f1d 100%)",
        boxSizing: "border-box", padding: 18,
        fontFamily: "var(--font-display, 'Barlow Condensed'), system-ui, sans-serif",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
      }}
    >
      <div className="awc-shine-sweep" style={{ position: "absolute", top: 0, left: "-150%", width: "55%", height: "100%", background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.18), transparent)", transform: "skewX(-20deg)" }} />

      {/* faux can */}
      <div style={{ position: "absolute", right: -6, bottom: -10, width: 92, height: 200, borderRadius: 18, background: "linear-gradient(180deg,#10331f,#0a2417)", border: "2px solid rgba(245,179,21,0.55)", transform: "rotate(8deg)", boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}>
        <div style={{ position: "absolute", top: 64, left: 0, right: 0, height: 34, background: "#F5B315" }} />
        <div style={{ position: "absolute", top: 70, left: 0, right: 0, textAlign: "center", color: "#0B5C29", fontWeight: 800, fontSize: 13, letterSpacing: 1 }}>ROAR</div>
        <div className="awc-bolt" style={{ position: "absolute", top: 18, left: 0, right: 0, textAlign: "center", color: "#F5B315", fontSize: 30 }}>⚡</div>
      </div>

      <div style={{ position: "relative" }}>
        <span style={{ display: "inline-block", fontSize: 11, letterSpacing: 2, fontWeight: 700, textTransform: "uppercase", color: "#0B5C29", background: "#F5B315", padding: "3px 8px", borderRadius: 5 }}>
          Official Energy Partner
        </span>
        <div style={{ marginTop: 14, color: "#fff", fontWeight: 800, lineHeight: 0.95, textTransform: "uppercase" }}>
          <div style={{ fontSize: 40, letterSpacing: 0.5 }}>ROAR</div>
          <div style={{ fontSize: 22, color: "#F5B315", letterSpacing: 3 }}>ENERGY</div>
        </div>
        <div style={{ marginTop: 8, color: "rgba(255,255,255,0.85)", fontSize: 14, maxWidth: 175, fontFamily: "system-ui, sans-serif" }}>
          Unleash your wild side. Fuel every match.
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <span style={{ display: "inline-block", background: "#F5B315", color: "#0B5C29", fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: 1, padding: "8px 16px", borderRadius: 8 }}>
          Game Fuel ⚡
        </span>
      </div>
    </div>
  );
}
