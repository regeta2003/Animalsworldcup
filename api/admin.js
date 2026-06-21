// Admin backend for the Animals' WorldCup site.
//   action=login      POST  {user,pass}            -> { token }
//   action=overrides  GET                           -> overrides JSON (public)
//   action=upload     POST  raw image bytes (auth)  -> { url }
//   action=save       POST  overrides JSON  (auth)  -> { ok }
//
// Storage is Vercel Blob. Auth is a signed token (HMAC) issued from the
// ADMIN_USER / ADMIN_PASS env vars. The football API (api/awc.js) is untouched;
// these overrides are merged on top of its data on the client.
import crypto from "node:crypto";
import { put, list } from "@vercel/blob";

const OVERRIDES_PATH = "awc/overrides.json";
const EMPTY = { flags: {}, mascots: {}, players: {}, hero: null, featured: null, ads: {} };

let cache = null; // { t, data } in-memory cache for public reads

const b64u = (buf) => Buffer.from(buf).toString("base64url");
const sign = (msg, secret) => b64u(crypto.createHmac("sha256", secret).update(msg).digest());

function makeToken(secret) {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const payload = String(exp);
  return `${b64u(payload)}.${sign(payload, secret)}`;
}

function verifyToken(token, secret) {
  if (!token || !secret) return false;
  const [p, sig] = String(token).split(".");
  if (!p || !sig) return false;
  let payload;
  try { payload = Buffer.from(p, "base64url").toString(); } catch { return false; }
  const expected = sign(payload, secret);
  if (expected.length !== sig.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return false;
  return Number(payload) > Date.now();
}

const bearer = (req) => (req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();

function readRawBody(req) {
  // Some runtimes pre-buffer the body onto req.body for non-JSON content types.
  if (Buffer.isBuffer(req.body)) return Promise.resolve(req.body);
  if (typeof req.body === "string") return Promise.resolve(Buffer.from(req.body));
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function readOverrides() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return { ...EMPTY };
  const { blobs } = await list({ prefix: OVERRIDES_PATH, token });
  const hit = blobs.find((x) => x.pathname === OVERRIDES_PATH);
  if (!hit) return { ...EMPTY };
  const data = await fetch(hit.url, { cache: "no-store" }).then((r) => r.json());
  return { ...EMPTY, ...data };
}

export default async function handler(req, res) {
  const action = req.query.action || "overrides";
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASS || "";

  try {
    // ---- public: current overrides -------------------------------------
    if (action === "overrides") {
      if (cache && Date.now() - cache.t < 30_000) {
        res.setHeader("x-awc-cache", "hit");
        return res.status(200).json(cache.data);
      }
      const data = await readOverrides().catch(() => ({ ...EMPTY }));
      cache = { t: Date.now(), data };
      res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=120");
      return res.status(200).json(data);
    }

    // ---- login ----------------------------------------------------------
    if (action === "login") {
      if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
      const user = process.env.ADMIN_USER, pass = process.env.ADMIN_PASS;
      if (!user || !pass || !secret) return res.status(500).json({ error: "admin not configured" });
      const body = typeof req.body === "object" && req.body ? req.body : {};
      if (body.user !== user || body.pass !== pass) return res.status(401).json({ error: "invalid credentials" });
      return res.status(200).json({ token: makeToken(secret) });
    }

    // ---- everything below requires a valid token ------------------------
    if (!verifyToken(bearer(req), secret)) return res.status(401).json({ error: "unauthorized" });

    if (action === "upload") {
      if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
      if (!process.env.BLOB_READ_WRITE_TOKEN) return res.status(500).json({ error: "BLOB_READ_WRITE_TOKEN not set" });
      const name = (req.query.filename || "upload").toString().replace(/[^\w.\-]/g, "_");
      const contentType = req.headers["content-type"] || "application/octet-stream";
      const bytes = await readRawBody(req);
      if (!bytes.length) return res.status(400).json({ error: "empty body" });
      const blob = await put(`awc/uploads/${Date.now()}-${name}`, bytes, {
        access: "public",
        contentType,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      return res.status(200).json({ url: blob.url });
    }

    if (action === "save") {
      if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
      if (!process.env.BLOB_READ_WRITE_TOKEN) return res.status(500).json({ error: "BLOB_READ_WRITE_TOKEN not set" });
      const body = typeof req.body === "object" && req.body ? req.body : {};
      const data = { ...EMPTY, ...body, updatedAt: Date.now() };
      await put(OVERRIDES_PATH, JSON.stringify(data), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      cache = { t: Date.now(), data };
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: "unknown action" });
  } catch (e) {
    return res.status(500).json({ error: "server error", detail: String(e) });
  }
}
