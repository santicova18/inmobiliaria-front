import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Terranova Inmobiliaria - Tu lote ideal",
  description:
    "Plataforma inmobiliaria para la compra y gestion de lotes. Encuentra tu terreno ideal con nosotros.",
};

export const viewport: Viewport = {
  themeColor: "#8B6F47",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-background text-foreground min-h-screen`}>
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-24 sm:px-6">
          {children}
        </div>
      </body>
    </html>
  );
}
