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

async function kvDel(key) {
  const res = await fetch(`${KV_URL}/del/${key}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
  if (!res.ok) throw new Error(`kvDel failed: ${res.status}`);
  return true;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (!KV_URL || !KV_TOKEN) {
    return res.status(200).json({
      exists: false,
      debug: "env vars missing",
      found: Object.keys(process.env).filter(k =>
        k.includes("SaveState") || k.includes("KV") || k.includes("UPSTASH")
      ),
    });
  }

  // DELETE — clear saved state (visit /api/state with DELETE or add ?clear=1)
  if (req.method === "DELETE" || req.query?.clear === "1") {
    try {
      await kvDel(STATE_KEY);
      return res.status(200).json({ ok: true, message: "State cleared — app will use default data" });
    } catch (err) {
      return res.status(500).json({ error: "Failed to clear", detail: err.message });
    }
  }

  // GET — load shared state
  if (req.method === "GET") {
    try {
      const stored = await kvGet(STATE_KEY);
      if (!stored) return res.status(200).json({ exists: false });
      const state = JSON.parse(stored);
      // Validate before returning
      if (!Array.isArray(state.tasks) || state.tasks.length === 0) {
        await kvDel(STATE_KEY); // auto-clear bad data
        return res.status(200).json({ exists: false });
      }
      return res.status(200).json({ exists: true, ...state });
    } catch (err) {
      console.error("GET error:", err.message);
      return res.status(500).json({ error: "Failed to load", detail: err.message });
    }
  }

  // POST — save shared state
  if (req.method === "POST") {
    try {
      const body = req.body;
      if (!body?.tasks || !Array.isArray(body.tasks) || body.tasks.length === 0) {
        return res.status(400).json({ error: "Valid tasks array required" });
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
