import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { OptionsCacheProvider } from "@/contexts/OptionsCacheContext";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.guzmanmotors.com.ar"),
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
        className={`${archivo.variable} ${instrumentSans.variable} ${plexMono.variable} font-sans antialiased`}
      >
        <OptionsCacheProvider>{children}</OptionsCacheProvider>
      </body>
    </html>
  );
}
