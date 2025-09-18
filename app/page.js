"use client";
import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function run(url = "/api/kv") {
    setLoading(true);
    try {
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      setResult(json);
    } catch (e) {
      setResult({ ok: false, error: String(e) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ fontFamily: "system-ui", maxWidth: 680, margin: "40px auto", padding: "0 16px" }}>
      <h1>Vercel KV · Smoke Test</h1>
      <p>Escribe y lee una clave en Vercel KV.</p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => run("/api/kv")} disabled={loading} style={{ padding: "10px 16px", fontSize: 16 }}>
          {loading ? "Probando…" : "Probar /api/kv"}
        </button>
        <button onClick={() => run("/api/kv/diag")} disabled={loading} style={{ padding: "10px 16px", fontSize: 16 }}>
          {loading ? "Probando…" : "Diagnóstico /api/kv/diag"}
        </button>
        <button onClick={() => run("/api/kv/upstash")} disabled={loading} style={{ padding: "10px 16px", fontSize: 16 }}>
          {loading ? "Probando…" : "Cliente oficial /api/kv/upstash"}
        </button>
      </div>

      {result && (
        <pre style={{ background: "#111", color: "#0f0", padding: 16, borderRadius: 8, marginTop: 16, overflow: "auto" }}>
{JSON.stringify(result, null, 2)}
        </pre>
      )}

      <p style={{ marginTop: 24, fontSize: 12, opacity: .7 }}>
        Asegúrate de tener <code>KV_REST_API_URL</code> y <code>KV_REST_API_TOKEN</code> en Vercel (Production).
      </p>
    </main>
  );
}
