export const runtime = "nodejs";
import { Redis } from "@upstash/redis";

// Usa las mismas variables que ya tienes (KV_REST_API_URL/TOKEN)
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export async function GET() {
  try {
    const now = Date.now();
    const k = `kv:upstash:${now}`;
    await redis.set(k, now, { ex: 60 });
    const v = await redis.get(k);
    const c = await redis.incr("kv:upstash:counter");

    return new Response(JSON.stringify({ ok: true, set: now, get: v, counter: c }, null, 2), {
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, step: "upstash-client", error: String(e) }, null, 2),
      { headers: { "content-type": "application/json" } }
    );
  }
}

