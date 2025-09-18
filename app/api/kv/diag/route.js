export const runtime = "edge";

function auth(bearer) {
  return { Authorization: `Bearer ${bearer}` };
}
function safeInfo(token) {
  if (!token) return { present: false };
  const len = token.length;
  const trimLen = token.trim().length;
  const hasQuotes = token.startsWith('"') || token.endsWith('"') || token.startsWith("'") || token.endsWith("'");
  return { present: true, len, trimLen, hasQuotes, hasTrailingSpace: len !== trimLen };
}

export async function GET() {
  const url   = process.env.KV_REST_API_URL || "";
  const token = process.env.KV_REST_API_TOKEN || "";
  const ro    = process.env.KV_REST_API_READ_ONLY_TOKEN || "";

  const info = {
    hasURL: !!url,
    host: url ? new URL(url).hostname : null,
    token: safeInfo(token),
    readOnlyToken: safeInfo(ro),
  };

  // Test 1: PING
  let ping = {};
  try {
    const r = await fetch(`${url}/ping`, { method: "POST", headers: auth(token) });
    ping = { ok: r.ok, status: r.status, text: await r.text() };
  } catch (e) {
    ping = { ok: false, error: String(e) };
  }

  // Test 2: SET/GET
  let write = {}, read = {};
  const key = `kv:diag:${Date.now()}`;
  try {
    const r1 = await fetch(`${url}/set/${encodeURIComponent(key)}/${Date.now()}?EX=60`, {
      method: "POST",
      headers: auth(token),
    });
    write = { ok: r1.ok, status: r1.status, text: await r1.text() };
    const r2 = await fetch(`${url}/get/${encodeURIComponent(key)}`, { headers: auth(token) });
    read = { ok: r2.ok, status: r2.status, text: await r2.text() };
  } catch (e) {
    write = { ok: false, error: String(e) };
  }

  return new Response(JSON.stringify({ info, ping, write, read }, null, 2), {
    headers: { "content-type": "application/json" },
  });
}

