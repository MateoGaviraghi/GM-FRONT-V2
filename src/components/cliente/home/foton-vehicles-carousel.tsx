"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { SectionHeading } from "./gm/section-heading";
import { Reveal } from "./gm/reveal";
import { GmButton } from "./gm/gm-button";

const vehicles = [
  {
    name: "Tunland G7",
    category: "Pick Ups",
    image: "/images/FOTON/LOGOS VEHICULOS HOME/TUNLAND G7 LOGO HOME.png",
    route: "/foton/pick-ups/tunland-g7",
  },
  {
    name: "Tunland V9",
    category: "Pick Ups",
    image: "/images/FOTON/LOGOS VEHICULOS HOME/TUNLADN V9 LOGO HOME.png",
    route: "/foton/pick-ups/tunland-v9",
  },
  {
    name: "TM",
    category: "Ultralivianos",
    image: "/images/FOTON/LOGOS VEHICULOS HOME/LOGO-TM-HOME.png",
    route: "/foton/ultralivianos/tm",
  },
  {
    name: "Wonder",
    category: "Ultralivianos",
    image: "/images/FOTON/LOGOS VEHICULOS HOME/LOGO WONDER HOME.png",
    route: "/foton/ultralivianos/wonder",
  },
  {
    name: "Z Truck",
    category: "Ultralivianos",
    image: "/images/FOTON/LOGOS VEHICULOS HOME/LOGO-ZTRUCK-HOME.png",
    route: "/foton/ultralivianos/ztruck",
  },
  {
    name: "Aumark",
    category: "Livianos",
    image: "/images/FOTON/LOGOS VEHICULOS HOME/AUMARK LOGO HOME.png",
    route: "/foton/livianos/aumark",
  },
  {
    name: "Nuevo Aumark",
    category: "Livianos",
    image: "/images/FOTON/LOGOS VEHICULOS HOME/NUEVO AUMARK LOGO HOME.png",
    route: "/foton/livianos/nuevo-aumark-615",
  },
  {
    name: "Auman D",
    category: "Medianos",
    image: "/images/FOTON/LOGOS VEHICULOS HOME/AUMAN D LOGO HOME.png",
    route: "/foton/medianos/auman-d",
  },
  {
    name: "Auman R",
    category: "Pesados Ruta",
    image: "/images/FOTON/LOGOS VEHICULOS HOME/AUMAN R HOME LOGO.png",
    route: "/foton/pesados-ruta/auman-r",
  },
  {
    name: "Nuevo Auman R",
    category: "Pesados Ruta",
    image: "/images/FOTON/LOGOS VEHICULOS HOME/NUEVO AUMAN R LOGO HOME.png",
    route: "/foton/pesados-ruta/nuevo-auman-r",
  },
  {
    name: "Auman C",
    category: "Pesados Vocacionales",
    image: "/images/FOTON/LOGOS VEHICULOS HOME/AUMAN C LOGO HOME.png",
    route: "/foton/pesados-vocacionales/auman-c",
  },
  {
    name: "E-Aumark",
    category: "Eléctricos",
    image: "/images/FOTON/LOGOS VEHICULOS HOME/E AUAMRK LOGO HOME.png",
    route: "/foton/electricos/eaumark",
  },
];

export function FotonVehiclesCarousel() {
  return (
    <section className="relative overflow-hidden border-t border-line-dark bg-carbon-1 py-20 text-platinum sm:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          index="01"
          label="Gama FOTON"
          title="Sabemos de transporte"
          sub="Conocé la gama completa de vehículos Foton para hacer rendir tu negocio al máximo."
          theme="dark"
        />

        {/* Distribuidores — celdas técnicas con hairlines */}
        <Reveal
          variant="wipe"
          className="mt-12 grid grid-cols-3 border-y border-line-dark"
        >
          <div
            data-reveal
            className="flex items-center justify-center bg-paper-1 px-4 py-7 sm:py-9"
          >
            <Image
              src="/images/logos empresas/LOGO ZANELLA.webp"
              alt="ZANELLA"
              width={220}
              height={120}
              className="h-9 w-auto object-contain mix-blend-multiply sm:h-12 lg:h-16"
            />
          </div>
          <div
            data-reveal
            className="flex items-center justify-center border-x border-line-dark px-4 py-7 sm:py-9"
          >
            <Image
              src="/images/FOTON/LOGOS VEHICULOS HOME/NUEVO LOGO FOTON HOME.png"
              alt="FOTON"
              width={500}
              height={150}
              className="h-11 w-auto object-contain sm:h-16 lg:h-20"
            />
          </div>
          <div
            data-reveal
            className="flex items-center justify-center bg-paper-1 px-4 py-7 sm:py-9"
          >
            <Image
              src="/images/logos empresas/LOGO LTA MOTORS.png"
              alt="LTA MOTORS"
              width={220}
              height={120}
              className="h-9 w-auto object-contain mix-blend-multiply sm:h-12 lg:h-16"
            />
          </div>
        </Reveal>
      </div>

      {/* Marquee de la gama — full bleed */}
      <div className="relative mt-14 border-y border-line-dark sm:mt-16">
        <Marquee
          pauseOnHover
          repeat={3}
          className="p-0 [--duration:60s] [--gap:0px]"
        >
          {vehicles.map((vehicle, i) => (
            <Link
              key={vehicle.route}
              href={vehicle.route}
              className="group relative flex w-[270px] shrink-0 flex-col border-r border-line-dark bg-transparent px-7 pb-8 pt-7 transition-colors duration-500 hover:bg-carbon-2 sm:w-[320px]"
            >
              <div className="flex items-center justify-between">
                <span className="gm-label text-steel">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <ArrowUpRight
                  aria-hidden
                  strokeWidth={1.5}
                  className="size-4 text-petrol-bright opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                />
              </div>
              <div className="relative mx-auto mt-4 h-[190px] w-full sm:h-[220px]">
                <Image
                  src={vehicle.image}
                  alt={vehicle.name}
                  fill
                  sizes="320px"
                  className="object-contain transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                  draggable={false}
                />
              </div>
              <h3 className="gm-display mt-5 text-xl text-platinum">
                {vehicle.name}
              </h3>
              <p className="gm-label mt-2 text-petrol-bright">
                {vehicle.category}
              </p>
            </Link>
          ))}
        </Marquee>

        {/* Fades laterales cinematográficos */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-carbon-1 to-transparent sm:w-28"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-carbon-1 to-transparent sm:w-28"
        />
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-[1480px] justify-end px-5 sm:px-8 lg:px-12">
        <GmButton href="/foton" tone="outlineDark">
          Ver gama completa
        </GmButton>
      </div>
    </section>
  );
}
