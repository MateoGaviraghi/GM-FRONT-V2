import dynamic from "next/dynamic";
import { HeroSection } from "@/components/cliente/home/hero-section";
import {
  getHomeRemolques,
  getHomeUsados,
  getHomeNovedades,
} from "@/lib/home-data";

/* Bajo el fold: code-splitting para aligerar la hidratación inicial.
   El HTML sigue llegando completo (SSR); solo se difiere el JS. */
const FotonVehiclesCarousel = dynamic(
  () =>
    import("@/components/cliente/home/foton-vehicles-carousel").then((m) => ({
      default: m.FotonVehiclesCarousel,
    }))
);
const FotonCategories = dynamic(
  () =>
    import("@/components/cliente/home/foton-categories").then((m) => ({
      default: m.FotonCategories,
    }))
);
const RemolquesUsadosSection = dynamic(
  () =>
    import("@/components/cliente/home/remolques-usados-section").then((m) => ({
      default: m.RemolquesUsadosSection,
    }))
);
const NovedadesSection = dynamic(
  () =>
    import("@/components/cliente/home/novedades-section").then((m) => ({
      default: m.NovedadesSection,
    }))
);

/* ISR: el stock público se refresca cada 60s sin rebuild */
export const revalidate = 60;

export default async function HomePage() {
  const [remolques, usados, novedades] = await Promise.all([
    getHomeRemolques(),
    getHomeUsados(),
    getHomeNovedades(),
  ]);

  return (
    <div className="min-h-screen bg-carbon-0">
      {/* Hero Section */}
      <HeroSection />

      {/* Sección FOTON - Carrusel de Vehículos */}
      <FotonVehiclesCarousel />

      {/* Sección de Categorías */}
      <FotonCategories />

      {/* Sección REMOLQUES Y USADOS */}
      <RemolquesUsadosSection
        initialRemolques={remolques}
        initialUsados={usados}
      />

      {/* Sección NOVEDADES */}
      <NovedadesSection initialNovedades={novedades} />
    </div>
  );
}
