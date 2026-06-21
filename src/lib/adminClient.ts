// Browser-side calls to /api/admin used only by the admin dashboard.
import type { Overrides } from "./overrides";

const TOKEN_KEY = "awc_admin_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY) || "";
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export async function login(user: string, pass: string): Promise<void> {
  const r = await fetch("/api/admin?action=login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ user, pass }),
  });
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Login failed");
  const { token } = await r.json();
  setToken(token);
}

export async function loadOverrides(): Promise<Overrides> {
  const r = await fetch("/api/admin?action=overrides", { cache: "no-store" });
  if (!r.ok) throw new Error("Could not load overrides");
  return r.json();
}

export async function uploadImage(file: File): Promise<string> {
  const r = await fetch(`/api/admin?action=upload&filename=${encodeURIComponent(file.name)}`, {
    method: "POST",
    headers: { authorization: `Bearer ${getToken()}`, "content-type": file.type || "application/octet-stream" },
    body: file,
  });
  if (r.status === 401) { clearToken(); throw new Error("Session expired — please log in again"); }
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Upload failed");
  return (await r.json()).url;
}

export async function saveOverrides(data: Overrides): Promise<void> {
  const r = await fetch("/api/admin?action=save", {
    method: "POST",
    headers: { authorization: `Bearer ${getToken()}`, "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  if (r.status === 401) { clearToken(); throw new Error("Session expired — please log in again"); }
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Save failed");
}
