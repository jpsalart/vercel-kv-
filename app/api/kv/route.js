import { kv } from "@vercel/kv";

export const runtime = "edge";

export async function GET() {
  try {
    const hasUrl = !!process.env.KV_REST_API_URL;
    const hasTok = !!process.env.KV_REST_API_TOKEN;

    if (!hasUrl || !hasTok) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Missing KV env vars",
          env: { KV_REST_API_URL: hasUrl, KV_REST_API_TOKEN: hasTok }
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }

    const key = "kv:health";
    const now = Date.now();
    await kv.set(key, now, { ex: 60 });
    const readBack = await kv.get(key);
    const counter = await kv.incr("kv:counter");

    return new Response(JSON.stringify({ ok: true, wrote: now, readBack, counter }), {
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: String(e) }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  }
}
