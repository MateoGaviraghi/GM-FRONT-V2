import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { OptionsCacheProvider } from "@/contexts/OptionsCacheContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Guzman Motors - Concesionaria Oficial",
  description:
    "Concesionaria de camiones, utilitarios y remolques en Santa Fe. Venta de vehículos FOTON, remolques y usados.",
  openGraph: {
    title: "Guzman Motors - Concesionaria Oficial",
    description:
      "Concesionaria de camiones, utilitarios y remolques en Santa Fe. Venta de vehículos FOTON, remolques y usados.",
    images: ["/images/inicio/entrada neogcio gumzan motors.webp"],
    url: "https://www.guzmanmotors.com.ar",
    siteName: "Guzman Motors",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guzman Motors - Concesionaria Oficial",
    description:
      "Concesionaria de camiones, utilitarios y remolques en Santa Fe. Venta de vehículos FOTON, remolques y usados.",
    images: ["/images/inicio/entrada neogcio gumzan motors.webp"],
  },
  icons: {
    icon: "/images/logo/favicon-logo.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <OptionsCacheProvider>{children}</OptionsCacheProvider>
      </body>
    </html>
  );
}
