// Public contact-form endpoint for the Animals' WorldCup site.
//   POST { name, email, message } -> { ok: true }
// Stored as individual JSON blobs (one per submission) in the same Vercel Blob
// store the admin overrides use — no separate service to configure.
import { put } from "@vercel/blob";

const MAX = { name: 100, email: 150, message: 3000 };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return res.status(500).json({ error: "BLOB_READ_WRITE_TOKEN not set" });

  const body = typeof req.body === "object" && req.body ? req.body : {};
  const name = String(body.name || "").trim().slice(0, MAX.name);
  const email = String(body.email || "").trim().slice(0, MAX.email);
  const message = String(body.message || "").trim().slice(0, MAX.message);

  if (!name || !message) return res.status(400).json({ error: "name and message are required" });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "invalid email" });

  try {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await put(
      `awc/contact/${id}.json`,
      JSON.stringify({ name, email, message, at: Date.now() }),
      { access: "public", contentType: "application/json", addRandomSuffix: false, token: process.env.BLOB_READ_WRITE_TOKEN }
    );
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: "server error", detail: String(e) });
  }
}
