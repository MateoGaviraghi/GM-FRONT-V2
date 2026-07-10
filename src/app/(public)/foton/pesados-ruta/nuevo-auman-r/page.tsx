"use client";

import { Users, Settings, Gauge, Truck } from "lucide-react";
import {
  ModelTemplate,
  type ModelData,
} from "@/components/cliente/foton/model-template";

const data: ModelData = {
  category: { label: "Pesados Ruta", href: "/foton/pesados-ruta" },
  backLabel: "Volver a Pesados Ruta",
  name: "Nuevo Auman R",
  shareName: "FOTON NUEVO AUMAN R",
  url: "/foton/pesados-ruta/nuevo-auman-r",
  headline: "Alto rendimiento para largas distancias",
  description:
    "La nueva línea AUMAN R representa un avance excepcional, cumpliendo con los más altos estándares europeos y las más avanzadas tecnologías. Fruto de la alianza estratégica entre FOTON y Daimler, este camión de alto rendimiento destaca por su eficiencia en recorridos de larga distancia.",
  heroImage:
    "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/HERO/HERO-AUMAN R.webp",
  logo: { wordmark: "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/LOGO/LOGO-AUMAN R-LETRA-Photoroom.png", vehicle: "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/LOGO/LOGO-AUMAN R-AUTO.png" },
  heroSpecs: [
    {
      icon: Users,
      label: "Cabina",
      value:
        "Cabina dormitorio techo alto, piso plano o estándar. Con deflectores laterales y de techo",
    },
    {
      icon: Settings,
      label: "Motor",
      value:
        "Motor Cummins ISGe5, 12 litros.\nPotencias 430 hp / 2200 Nm - 460 hp / 2300 Nm",
    },
    {
      icon: Gauge,
      label: "Caja de cambios",
      value: "Caja de cambios ZF TraXon AMT, 12 marchas",
    },
    {
      icon: Truck,
      label: "Capacidad de carga",
      value: "CMT: 55.000 kg",
    },
  ],
  consultarHref:
    "https://wa.me/5493424216850?text=Hola!%20Estoy%20interesado%20en%20el%20FOTON%20NUEVO%20AUMAN%20R.%20Me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n.",
  galleries: [
    {
      id: "interior",
      label: "INTERIOR Y CONFORT",
      images: [
        "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/INTERIOR Y CONFORT/INTERIOR-Y-CONFORT-AUMAN R-1.jpg",
        "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/INTERIOR Y CONFORT/INTERIOR-Y-CONFORT-AUMAN R-2.jpg",
        "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/INTERIOR Y CONFORT/INTERIOR-Y-CONFORT-AUMAN R-3.jpg",
        "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/INTERIOR Y CONFORT/INTERIOR-Y-CONFORT-AUMAN R-4.jpg",
        "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/INTERIOR Y CONFORT/INTERIOR-Y-CONFORT-AUMAN R-5.jpg",
      ],
      headingLead: "Diseño moderno y",
      headingHighlight: "ergonómico",
      description:
        'El nuevo Auman R cuenta con un interior moderno diseñado para otorgar la mayor experiencia de conducción. Equipado con butaca de conductor con suspensión neumática ajustable y comandos estratégicamente posicionados, se logra una excelente ergonomía que reduce la fatiga en largos trayectos. Con una pantalla digital full LCD de 12,3" y un display secundario táctil de 10", el conductor cuenta con toda la información necesaria a su alcance. Para los momentos de descanso, cuenta con una confortable cama (opción de segunda litera).',
    },
    {
      id: "seguridad",
      label: "SEGURIDAD",
      images: [
        "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/SEGURIDAD/SEGURIDAD-AUMAN R-1.jpg",
        "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/SEGURIDAD/SEGURIDAD-AUMAN R-2.jpg",
        "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/SEGURIDAD/SEGURIDAD-AUMAN R-3.jpg",
        "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/SEGURIDAD/SEGURIDAD-AUMAN R-4.jpg",
        "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/SEGURIDAD/SEGURIDAD-AUMAN R-5.jpg",
      ],
      headingLead: "Sistemas de seguridad",
      headingHighlight: "avanzados",
      description:
        "El nuevo Auman R presenta sistemas de seguridad avanzados tales como:",
      bullets: [
        "TPMS (sensor de presión y temperatura de neumáticos)",
        "LDWS (sistema de advertencia de cambio de carril)",
        "FCW (advertencia de colisión frontal)",
        "AEB (frenado de emergencia)",
        "Cámaras 360°",
        "Sensor de fatiga",
      ],
    },
    {
      id: "tren-motriz",
      label: "TREN MOTRIZ",
      images: [
        "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/TREN MOTRIZ/TREN-MOTRIZ-AUMAN R-1.jpg",
        "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/TREN MOTRIZ/TREN-MOTRIZ-AUMAN R-2.jpg",
        "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/TREN MOTRIZ/TREN-MOTRIZ-AUMAN R-3.jpg",
        "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/TREN MOTRIZ/TREN-MOTRIZ-AUMAN R-4.jpg",
        "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/TREN MOTRIZ/TREN-MOTRIZ-AUMAN R-5.jpg",
      ],
      headingLead: "Tecnología de",
      headingHighlight: "alto rendimiento",
      description:
        "El nuevo Auman R cuenta con un motor Cummins ISGe5 de 12 litros con potencias de 430 a 460 hp. Con 12 marchas automatizadas de avance, caja ZF Traxon AMT, permite una conducción suave y eficiente adaptándose a las demandas del terreno.",
      bullets: [
        "Motor Cummins ISGe5 de 12 litros",
        "430 HP / 2200 Nm - 460 HP / 2300 Nm",
        "Caja ZF TraXon AMT de 12 marchas",
      ],
    },
    {
      id: "dimensiones",
      label: "DIMENSIONES Y CAPACIDAD DE CARGA",
      images: [
        "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/DIMENSIONES Y CAPACIDADES DE CARGA/DIMENSIONES-Y-CAPACIDAD-DE-CARGA-AUMAN R-1.png",
        "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/DIMENSIONES Y CAPACIDADES DE CARGA/DIMENSIONES-Y-CAPACIDAD-DE-CARGA-AUMAN R-2.png",
        "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/DIMENSIONES Y CAPACIDADES DE CARGA/DIMENSIONES-Y-CAPACIDAD-DE-CARGA-AUMAN R-3.png",
        "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/DIMENSIONES Y CAPACIDADES DE CARGA/DIMENSIONES-Y-CAPACIDAD-DE-CARGA-AUMAN R-4.png",
        "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/DIMENSIONES Y CAPACIDADES DE CARGA/DIMENSIONES-Y-CAPACIDAD-DE-CARGA-AUMAN R-5.jpg",
      ],
      headingLead: "Diseñado para",
      headingHighlight: "máxima eficiencia",
      description:
        "El nuevo Auman R presenta una capacidad máxima de tracción (CMT) de 55.000 kg. Con su distancia entre ejes de 3.300 mm, su configuración de ejes 6×2 Tractor y suspensión neumática de 4 fuelles por eje, el nuevo Auman R es ideal para escalabilidad.",
      bullets: [
        "CMT: 55.000 kg",
        "Distancia entre ejes: 3.300 mm",
        "Configuración: 6×2 Tractor",
        "Suspensión neumática 4 fuelles por eje",
      ],
    },
  ],
  versions: [
    {
      id: "r2443",
      nombre: "AUMAN R 2443",
      imagen:
        "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/VERSIONES/R2443/R2443.png",
      pdf: "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/VERSIONES/R2443/FT-Foton-Auman-R-2443-CP.pdf",
    },
    {
      id: "r2546",
      nombre: "AUMAN R 2546",
      imagen:
        "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/VERSIONES/R2546/R2546.png",
      pdf: "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/VERSIONES/R2546/FT-Foton-Auman-R-2546.pdf",
    },
  ],
  cta: {
    title: "¿Interesado en el NUEVO AUMAN R?",
    description:
      "Contactanos para más información, cotizaciones y pruebas de manejo.",
    label: "Contactar Ahora",
    href: "/contacto",
  },
};

export default function NuevoAumanRPage() {
  return <ModelTemplate data={data} />;
}
