import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export const runtime = "edge"; // usar KV desde funciones Edge

export async function GET() {
  const key = "kv:health";
  const now = Date.now();

  // 1) Escribir un valor con TTL 60s
  await kv.set(key, now, { ex: 60 });

  // 2) Leerlo de vuelta
  const readBack = await kv.get(key);

  // 3) Incrementar un contador para ver persistencia
  const counter = await kv.incr("kv:counter");

  return NextResponse.json({
    ok: true,
    wrote: now,
    readBack,
    counter
  });
}

