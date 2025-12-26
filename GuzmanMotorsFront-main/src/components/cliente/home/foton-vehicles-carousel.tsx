"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function FotonVehiclesCarousel() {
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

  // Triplicar el array para efecto infinito suave y sin cortes
  const duplicatedVehicles = [...vehicles, ...vehicles, ...vehicles];
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const speedRef = useRef(0.5); // Velocidad base
  const requestRef = useRef<number>(0);
  const positionRef = useRef(0);
  
  // Configuración
  const itemWidth = 320;
  const totalItems = vehicles.length;
  const singleSetWidth = itemWidth * totalItems;

  useEffect(() => {
    // Inicializar en el medio (segundo set)
    positionRef.current = -singleSetWidth;
    setTranslateX(-singleSetWidth);

    const animate = () => {
      positionRef.current -= speedRef.current;

      // Lógica de bucle infinito
      // Si nos movemos demasiado a la izquierda (más allá del segundo set)
      if (positionRef.current <= -(singleSetWidth * 2)) {
        positionRef.current += singleSetWidth;
      }
      // Si nos movemos demasiado a la derecha (antes del primer set)
      else if (positionRef.current >= 0) {
        positionRef.current -= singleSetWidth;
      }

      setTranslateX(positionRef.current);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(requestRef.current);
  }, [singleSetWidth]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const { left, width } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const percentage = x / width;

    // Zonas de velocidad
    if (percentage < 0.15) {
      // Zona izquierda: ir hacia la izquierda (velocidad negativa invertida = positiva)
      // Queremos que los items se muevan a la derecha, así que position aumenta
      speedRef.current = -4; 
    } else if (percentage > 0.85) {
      // Zona derecha: ir hacia la derecha más rápido
      speedRef.current = 4;
    } else {
      // Zona central: velocidad normal
      speedRef.current = 0.5;
    }
  };

  const handleMouseLeave = () => {
    speedRef.current = 0.5; // Volver a velocidad base
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header de la sección */}
      <div className="text-center mb-12">
        {/* Logos FOTON con Zanella y LTA Motors - Responsive */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-12 lg:gap-16 mb-6 px-4">
          {/* Logo Zanella - lado izquierdo */}
          <div className="flex items-center justify-center transition-transform duration-300 hover:scale-110 w-16 h-12 sm:w-24 sm:h-16 md:w-32 md:h-20 lg:w-[220px] lg:h-[120px]">
            <Image
              src="/images/logos empresas/LOGO ZANELLA.webp"
              alt="ZANELLA"
              width={220}
              height={120}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Logo FOTON - principal y centrado */}
          <div className="flex items-center justify-center mx-1 sm:mx-2 md:mx-4">
            <Image
              src="/images/FOTON/LOGOS VEHICULOS HOME/NUEVO LOGO FOTON HOME.png"
              alt="FOTON"
              width={500}
              height={150}
              className="h-16 sm:h-20 md:h-28 lg:h-40 w-auto"
              priority
            />
          </div>

          {/* Logo LTA Motors - lado derecho */}
          <div className="flex items-center justify-center transition-transform duration-300 hover:scale-110 w-16 h-12 sm:w-24 sm:h-16 md:w-32 md:h-20 lg:w-[220px] lg:h-[120px]">
            <Image
              src="/images/logos empresas/LOGO LTA MOTORS.png"
              alt="LTA MOTORS"
              width={220}
              height={120}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Sabemos de transporte
        </h2>

        {/* Subtítulo */}
        <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto mb-6">
          Conocé la gama completa de vehículos Foton para hacer rendir tu
          negocio al máximo.
        </p>

        {/* Línea decorativa */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-cyan-400"></div>
          <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full"></div>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-cyan-400"></div>
        </div>
      </div>

      {/* Carrusel infinito horizontal - FULL WIDTH SIN GRADIENTES */}
      <div 
        className="relative overflow-hidden py-12 cursor-grab active:cursor-grabbing"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Contenedor con animación JS */}
        <div 
          className="flex gap-0 will-change-transform"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {duplicatedVehicles.map((vehicle, index) => (
            <Link
              key={`${vehicle.name}-${index}`}
              href={vehicle.route}
              className="group flex-shrink-0"
              style={{ width: "320px", minWidth: "320px", maxWidth: "320px" }}
              draggable={false}
            >
              <div className="flex flex-col items-center w-full">
                {/* Imagen del vehículo - MÁS GRANDE */}
                <div
                  className="relative mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{ width: "320px", height: "300px" }}
                >
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    className="object-contain"
                    priority={index < 12}
                    draggable={false}
                  />
                </div>

                {/* Nombre del vehículo - TAMAÑO FIJO */}
                <h3
                  className="text-white font-bold text-2xl text-center mb-2 group-hover:text-cyan-400 transition-colors w-full px-4 line-clamp-2"
                  style={{ minHeight: "60px" }}
                >
                  {vehicle.name}
                </h3>

                {/* Categoría - TAMAÑO FIJO */}
                <p
                  className="text-slate-300 text-lg text-center group-hover:text-cyan-300 transition-colors w-full px-4"
                  style={{ minHeight: "28px" }}
                >
                  {vehicle.category}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
