"use client";
import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    const res = await fetch("/api/kv", { cache: "no-store" });
    const json = await res.json();
    setResult(json);
    setLoading(false);
  }

  return (
    <main style={{ fontFamily: "system-ui", maxWidth: 680, margin: "40px auto", padding: "0 16px" }}>
      <h1>Vercel KV · Smoke Test</h1>
      <p>Escribe y lee una clave en Vercel KV.</p>
      <button onClick={run} disabled={loading} style={{ padding: "10px 16px", fontSize: 16 }}>
        {loading ? "Probando…" : "Probar KV ahora"}
      </button>
      {result && (
        <pre style={{ background: "#111", color: "#0f0", padding: 16, borderRadius: 8, marginTop: 16, overflow: "auto" }}>
{JSON.stringify(result, null, 2)}
        </pre>
      )}
      <p style={{ marginTop: 24, fontSize: 12, opacity: .7 }}>
        Espera que conectemos KV en Vercel en el siguiente paso.
      </p>
    </main>
  );
}

