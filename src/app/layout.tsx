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
  description: "Concesionaria de camiones, utilitarios y remolques en Santa Fe",
  icons: {
    icon: [
      { url: "/images/logo/logoGM-Photoroom.png" },
      {
        url: "/images/logo/logoGM-Photoroom.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: "/images/logo/logoGM-Photoroom.png",
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
