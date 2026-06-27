async function call(type: string) {
  const r = await fetch(`/api/awc?type=${type}`);
  if (!r.ok) throw new Error(`${type} ${r.status}`);
  const j = await r.json();
  if (j?.errors && Object.keys(j.errors).length) throw new Error(`${type} api error`);
  return j;
}
export const fetchStandings = () => call("standings");
export const fetchFixtures = () => call("fixtures");
export const fetchKnockout = () => call("knockout");
export const fetchScorers = () => call("scorers");

export async function fetchOverrides() {
  const r = await fetch("/api/admin?action=overrides");
  if (!r.ok) throw new Error(`overrides ${r.status}`);
  return r.json();
}

export async function submitContact(data: { name: string; email: string; message: string }) {
  const r = await fetch("/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || `contact ${r.status}`);
  return r.json();
}
