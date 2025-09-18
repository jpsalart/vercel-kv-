export const runtime = "nodejs";

// ===== Helpers =====
function authHeader(bearer) {
  return { Authorization: `Bearer ${bearer}` };
}
function safeInfo(token) {
  if (!token) return { present: false };
  const len = token.length;
  const trimLen = token.trim().length;
  const hasQuotes =
    token.startsWith('"') ||
    token.endsWith('"') ||
    token.startsWith("'") ||
    token.endsWith("'");
  return {
    present: true,
    len,
    trimLen,
    hasQuotes,
    hasTrailingSpace: len !== trimLen,
  };
}

export async function GET() {
  const url = process.env.KV_REST_API_URL || "";
  const token = process.env.KV_REST_API_TOKEN || "";
  const ro = process.env.KV_REST_API_READ_ONLY_TOKEN || "";

  const info = {
    hasURL: !!url,
    host: url ? new URL(url).hostname : null,
    token: safeInfo(token),
    readOnlyToken: safeInfo(ro),
  };

  // ========== Test 1A: PING con header Authorization ==========
  let ping = {};
  try {
    const r = await fetch(`${url}/ping`, {
      method: "POST",
      headers: authHeader(token),
    });
    ping = { mode: "header", ok: r.ok, status: r.status, text: await r.text() };
  } catch (e) {
    ping = { mode: "header", ok: false, error: String(e) };
  }

  // ========== Test 1B: PING con query param _token ==========
  let pingQuery = {};
  try {
    const r = await fetch(`${url}/ping?_token=${encodeURIComponent(token)}`, {
      method: "POST",
    });
    pingQuery = { mode: "query", ok: r.ok, status: r.status, text: await r.text() };
  } catch (e) {
    pingQuery = { mode: "query", ok: false, error: String(e) };
  }

  // ========== Test 2A: SET/GET con header Authorization ==========
  let write = {}, read = {};
  const k1 = `kv:diag:${Date.now()}`;
  try {
    const r1 = await fetch(
      `${url}/set/${encodeURIComponent(k1)}/${Date.now()}?EX=60`,
      { method: "POST", headers: authHeader(token) }
    );
    write = { mode: "header", ok: r1.ok, status: r1.status, text: await r1.text() };

    const r2 = await fetch(
      `${url}/get/${encodeURIComponent(k1)}`,
      { headers: authHeader(token) }
    );
    read = { mode: "header", ok: r2.ok, status: r2.status, text: await r2.text() };
  } catch (e) {
    write = { mode: "header", ok: false, error: String(e) };
  }

  // ========== Test 2B: SET/GET con query param _token ==========
  let writeQuery = {}, readQuery = {};
  const k2 = `kv:diag:q:${Date.now()}`;
  try {
    const r1 = await fetch(
      `${url}/set/${encodeURIComponent(k2)}/${Date.now()}?EX=60&_token=${encodeURIComponent(token)}`,
      { method: "POST" }
    );
    writeQuery = { mode: "query", ok: r1.ok, status: r1.status, text: await r1.text() };

    const r2 = await fetch(
      `${url}/get/${encodeURIComponent(k2)}?_token=${encodeURIComponent(token)}`
    );
    readQuery = { mode: "query", ok: r2.ok, status: r2.status, text: await r2.text() };
  } catch (e) {
    writeQuery = { mode: "query", ok: false, error: String(e) };
  }

  return new Response(
    JSON.stringify(
      { info, ping, pingQuery, write, read, writeQuery, readQuery },
      null,
      2
    ),
    { headers: { "content-type": "application/json" } }
  );
}
