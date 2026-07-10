"use client";

import { Settings, Gauge, Shield, Truck } from "lucide-react";
import {
  ModelTemplate,
  type ModelData,
} from "@/components/cliente/foton/model-template";

const data: ModelData = {
  category: { label: "Livianos", href: "/foton/livianos" },
  backLabel: "Volver a Livianos",
  name: "Aumark",
  shareName: "FOTON AUMARK",
  url: "/foton/livianos/aumark",
  headline: "El camión liviano más vendido del mundo",
  description:
    "El FOTON AUMARK es un camión liviano diseñado para la logística de corta distancia. Se caracteriza por su moderno diseño, alta calidad y tren motriz eficiente con motor Cummins, transmisión ZF, electrónica Bosch y frenos a disco en todas sus ruedas. Disponible en dos versiones: 916 y 1016 King Cab.",
  heroImage:
    "/images/FOTON/cateogries/livianos/AUMARK/HERO/HERO-FOTON-AUMARK.webp",
  logo: { wordmark: "/images/FOTON/cateogries/livianos/AUMARK/LOGO/LOGO-AUMARK-LETRAS.png", vehicle: "/images/FOTON/cateogries/livianos/AUMARK/LOGO/LOGO-AUTO-AUMARK-Photoroom.png" },
  heroSpecs: [
    {
      icon: Settings,
      label: "Motor",
      value: "Cummins ISF 2.8L / 3.8L Diesel\nPotencia: 130-156 HP",
    },
    {
      icon: Gauge,
      label: "Transmisión",
      value: "ZF Manual 6 velocidades + Reversa",
    },
    {
      icon: Shield,
      label: "Seguridad",
      value: "Frenos a disco en 4 ruedas / ABS / Electrónica Bosch",
    },
    {
      icon: Truck,
      label: "Capacidad de carga",
      value: "PBT: 6.000 - 7.500 kg\nCarga útil: hasta 4.200 kg",
    },
    {
      icon: Truck,
      label: "Versiones",
      value: "916 / 1016 King Cab",
    },
  ],
  consultarHref: "/contacto",
  galleries: [
    {
      id: "interior",
      label: "INTERIOR",
      images: [
        "/images/FOTON/cateogries/livianos/AUMARK/INTERIOR/interior-AUMARK-1.jpg",
        "/images/FOTON/cateogries/livianos/AUMARK/INTERIOR/interior-AUMARK-2.jpg",
        "/images/FOTON/cateogries/livianos/AUMARK/INTERIOR/interior-AUMARK-3.jpg",
        "/images/FOTON/cateogries/livianos/AUMARK/INTERIOR/interior-AUMARK-4.jpg",
        "/images/FOTON/cateogries/livianos/AUMARK/INTERIOR/interior-AUMARK-5.jpg",
      ],
      headingLead: "Confort y",
      headingHighlight: "ergonomía",
      description:
        "El interior del FOTON AUMARK ha sido diseñado pensando en la comodidad del conductor y acompañantes. Cuenta con un tablero moderno e intuitivo, asientos ergonómicos y múltiples espacios de almacenamiento para facilitar las largas jornadas de trabajo.",
      bullets: [
        "Tablero moderno con instrumentación clara",
        "Asientos ergonómicos con regulación",
        "Múltiples espacios de almacenamiento",
        "Sistema de climatización eficiente",
      ],
    },
    {
      id: "exterior",
      label: "EXTERIOR",
      images: [
        "/images/FOTON/cateogries/livianos/AUMARK/EXTERIOR/EXTERIOR-AUMARK-1.jpg",
        "/images/FOTON/cateogries/livianos/AUMARK/EXTERIOR/EXTERIOR-AUMARK-2.jpg",
        "/images/FOTON/cateogries/livianos/AUMARK/EXTERIOR/EXTERIOR-AUMARK-3.jpg",
        "/images/FOTON/cateogries/livianos/AUMARK/EXTERIOR/EXTERIOR-AUMARK-4.png",
        "/images/FOTON/cateogries/livianos/AUMARK/EXTERIOR/EXTERIOR-AUMARK-5.jpg",
      ],
      headingLead: "Diseño",
      headingHighlight: "robusto",
      description:
        "El FOTON AUMARK presenta un diseño exterior moderno y funcional. Su construcción robusta garantiza durabilidad y resistencia, mientras que su estética contemporánea lo distingue en las calles. Ideal para operaciones urbanas y logística de distribución.",
      bullets: [
        "Diseño aerodinámico para eficiencia",
        "Estructura reforzada de alta resistencia",
        "Faros de alto rendimiento",
        "Espejos retrovisores de gran tamaño",
      ],
    },
  ],
  components: [
    {
      label: "Motor",
      image:
        "/images/FOTON/cateogries/livianos/AUMARK/COMPONENTES/MOTOR-AUMARK-.png",
    },
    {
      label: "Caja de cambios",
      image:
        "/images/FOTON/cateogries/livianos/AUMARK/COMPONENTES/CAJADECAMBIOS-AUMARK-.png",
    },
  ],
  versions: [
    {
      id: "aumark-916",
      nombre: "AUMARK 916",
      imagen:
        "/images/FOTON/cateogries/livianos/AUMARK/VERSIONES/916/Aumark-916-1024x757.png",
      pdf: "/images/FOTON/cateogries/livianos/AUMARK/VERSIONES/916/FT-Foton-Aumark-916-1.pdf",
    },
    {
      id: "aumark-1016-king-cab",
      nombre: "AUMARK 1016 King Cab",
      imagen:
        "/images/FOTON/cateogries/livianos/AUMARK/VERSIONES/1016 King Cab/aumark-1016.png",
      pdf: "/images/FOTON/cateogries/livianos/AUMARK/VERSIONES/1016 King Cab/FTN-005-Ficha-Productos-AUMARK-1016-v5.pdf",
    },
  ],
  cta: {
    title: "¿Interesado en el FOTON AUMARK?",
    description:
      "Contactanos para más información, cotizaciones y pruebas de manejo.",
    label: "Contactar Ahora",
    href: "/contacto",
  },
};

export default function Page() {
  return <ModelTemplate data={data} />;
}
