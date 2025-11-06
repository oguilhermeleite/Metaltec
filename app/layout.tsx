import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Metaltec Estoque | Controle",
  description: "Sistema de Controle de Estoque - Metaltec Ferragens",
  manifest: "/manifest.json",
  themeColor: "#1e3a8a",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Metaltec Estoque",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-gray-50">
        {children}
      </body>
    </html>
  );
}
