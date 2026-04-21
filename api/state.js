// api/state.js — NC Platform shared state via Upstash Redis
// Paste this file into GitHub at: api/state.js

const KV_URL   = process.env.SaveState_KV_REST_API_URL;
const KV_TOKEN = process.env.SaveState_KV_REST_API_TOKEN;
const STATE_KEY = "nc_shared_state_v1";

async function kvGet(key) {
  const res = await fetch(`${KV_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.result ?? null;
}

async function kvSet(key, value) {
  const res = await fetch(`${KV_URL}/set/${key}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([key, value]),
  });
  if (!res.ok) throw new Error(`Redis write failed: ${res.status}`);
  return true;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  // GET — load shared state
  if (req.method === "GET") {
    try {
      if (!KV_URL || !KV_TOKEN) {
        return res.status(200).json({ exists: false, reason: "Upstash not configured" });
      }
      const stored = await kvGet(STATE_KEY);
      if (!stored) return res.status(200).json({ exists: false });
      const state = JSON.parse(stored);
      return res.status(200).json({ exists: true, ...state });
    } catch (err) {
      console.error("Load error:", err);
      return res.status(500).json({ error: "Failed to load", detail: err.message });
    }
  }

  // POST — save shared state
  if (req.method === "POST") {
    try {
      if (!KV_URL || !KV_TOKEN) {
        return res.status(503).json({ error: "Upstash not configured" });
      }
      const { tasks, raci, savedBy, savedAt } = req.body;
      if (!tasks || !Array.isArray(tasks)) {
        return res.status(400).json({ error: "Invalid payload — tasks array required" });
      }
      const payload = JSON.stringify({
        tasks,
        raci: raci ?? {},
        savedBy: savedBy ?? "Committee Member",
        savedAt: savedAt ?? new Date().toISOString(),
      });
      await kvSet(STATE_KEY, payload);
      return res.status(200).json({ ok: true, taskCount: tasks.length, savedAt });
    } catch (err) {
      console.error("Save error:", err);
      return res.status(500).json({ error: "Failed to save", detail: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
