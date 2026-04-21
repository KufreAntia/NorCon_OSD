// api/state.js
// ─────────────────────────────────────────────────────────────────────────────
// Vercel Serverless Function — shared project state via Vercel KV
//
// SETUP (one-time, ~2 minutes):
//   1. Go to vercel.com → your project → Storage tab
//   2. Click "Create Database" → choose "KV"
//   3. Click "Connect" to link it to your project
//   4. Redeploy — Vercel auto-injects KV_REST_API_URL and KV_REST_API_TOKEN
//
// This single file handles both GET (load) and POST (save).
// ─────────────────────────────────────────────────────────────────────────────

const KV_URL   = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const STATE_KEY = "nc_shared_state_v1";

// ── Helpers ───────────────────────────────────────────────────────────────────
async function kvGet(key) {
  const res = await fetch(`${KV_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.result ?? null; // returns null if key doesn't exist yet
}

async function kvSet(key, value) {
  const res = await fetch(`${KV_URL}/set/${key}`, {
    method:  "POST",
    headers: {
      Authorization:  `Bearer ${KV_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value }),
  });
  if (!res.ok) throw new Error(`KV write failed: ${res.status}`);
  return true;
}

// ── Main handler ──────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // Allow requests from any origin (your Vercel app domain)
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ── GET — load shared state ───────────────────────────────────────────────
  if (req.method === "GET") {
    try {
      const stored = await kvGet(STATE_KEY);
      if (!stored) {
        // No shared state saved yet — tell the client to use its local data
        return res.status(200).json({ exists: false });
      }
      const state = JSON.parse(stored);
      return res.status(200).json({ exists: true, ...state });
    } catch (err) {
      console.error("Load error:", err);
      return res.status(500).json({ error: "Failed to load state", detail: err.message });
    }
  }

  // ── POST — save shared state ──────────────────────────────────────────────
  if (req.method === "POST") {
    try {
      const { tasks, raci, lessons, savedBy, savedAt } = req.body;

      if (!tasks || !Array.isArray(tasks)) {
        return res.status(400).json({ error: "Invalid payload — tasks array required" });
      }

      const payload = JSON.stringify({
        tasks,
        raci:    raci    ?? {},
        lessons: lessons ?? [],
        savedBy: savedBy ?? "Unknown",
        savedAt: savedAt ?? new Date().toISOString(),
      });

      await kvSet(STATE_KEY, payload);

      return res.status(200).json({
        ok:      true,
        message: `State saved by ${savedBy} at ${savedAt}`,
        taskCount: tasks.length,
      });
    } catch (err) {
      console.error("Save error:", err);
      return res.status(500).json({ error: "Failed to save state", detail: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
