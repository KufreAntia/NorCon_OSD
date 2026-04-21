// api/state.js — NC Platform · Upstash Redis · ES Module syntax

const STATE_KEY = "nc_shared_state_v1";

const KV_URL   = process.env.SaveState_KV_REST_API_URL   || process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.SaveState_KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN;

async function kvGet(key) {
  const res = await fetch(`${KV_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
  if (!res.ok) throw new Error(`kvGet failed: ${res.status}`);
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
  if (!res.ok) throw new Error(`kvSet failed: ${res.status}`);
  return true;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  // Debug: if env vars missing, return helpful info instead of crashing
  if (!KV_URL || !KV_TOKEN) {
    return res.status(200).json({
      exists: false,
      debug: "env vars missing",
      found: Object.keys(process.env).filter(k =>
        k.includes("SaveState") || k.includes("KV") || k.includes("UPSTASH")
      ),
    });
  }

  // GET — load state
  if (req.method === "GET") {
    try {
      const stored = await kvGet(STATE_KEY);
      if (!stored) return res.status(200).json({ exists: false });
      const state = JSON.parse(stored);
      return res.status(200).json({ exists: true, ...state });
    } catch (err) {
      console.error("GET error:", err.message);
      return res.status(500).json({ error: "Failed to load", detail: err.message });
    }
  }

  // POST — save state
  if (req.method === "POST") {
    try {
      const body = req.body;
      if (!body?.tasks || !Array.isArray(body.tasks)) {
        return res.status(400).json({ error: "tasks array required" });
      }
      const payload = JSON.stringify({
        tasks:   body.tasks,
        raci:    body.raci    ?? {},
        savedBy: body.savedBy ?? "Committee Member",
        savedAt: body.savedAt ?? new Date().toISOString(),
      });
      await kvSet(STATE_KEY, payload);
      return res.status(200).json({ ok: true, taskCount: body.tasks.length });
    } catch (err) {
      console.error("POST error:", err.message);
      return res.status(500).json({ error: "Failed to save", detail: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
