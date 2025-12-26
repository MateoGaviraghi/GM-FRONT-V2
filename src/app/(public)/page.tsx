"use client";

import { HeroSection } from "@/components/cliente/home/hero-section";
import { FotonVehiclesCarousel } from "@/components/cliente/home/foton-vehicles-carousel";
import { RemolquesUsadosSection } from "@/components/cliente/home/remolques-usados-section";
import { NovedadesSection } from "@/components/cliente/home/novedades-section";
import { FotonCategories } from "@/components/cliente/home/foton-categories";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Sección FOTON - Carrusel de Vehículos */}
      <FotonVehiclesCarousel />

      {/* Sección de Categorías */}
      <FotonCategories />

      {/* Sección REMOLQUES Y USADOS */}
      <RemolquesUsadosSection />

      {/* Sección NOVEDADES */}
      <NovedadesSection />
    </div>
  );
}
