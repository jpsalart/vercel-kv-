export const metadata = {
  title: "Vercel KV · Smoke Test",
  description: "Prueba mínima de lectura/escritura con Vercel KV",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}

