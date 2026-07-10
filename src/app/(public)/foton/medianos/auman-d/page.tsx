"use client";

import { Users, Settings, Gauge, Truck } from "lucide-react";
import {
  ModelTemplate,
  type ModelData,
} from "@/components/cliente/foton/model-template";

const data: ModelData = {
  category: { label: "Medianos", href: "/foton/medianos" },
  backLabel: "Volver a Medianos",
  name: "AUMAN D",
  shareName: "FOTON AUMAN D",
  url: "/foton/medianos/auman-d",
  headline: "Potencia y eficiencia para cargas medianas",
  description:
    "El AUMAN D es un camión de carga mediana diseñado para brindar potencia, durabilidad y eficiencia en el transporte de mercancías. Equipado con motor Cummins, transmisión Fast y tecnología de última generación, es ideal para operaciones de logística y distribución.",
  heroImage: "/images/FOTON/cateogries/medianos/AUMAN D/HERO/HERO-AUMAN D.jpg",
  logo: { wordmark: "/images/FOTON/cateogries/medianos/AUMAN D/LOGO/LOGO-LETRAS-AUMAN D.png", vehicle: "/images/FOTON/cateogries/medianos/AUMAN D/LOGO/LOGO-AUTO-AUMAN D.png" },
  heroSpecs: [
    {
      icon: Users,
      label: "Cabina",
      value:
        "Confort premium con asientos ergonómicos y amplio espacio interior",
    },
    {
      icon: Settings,
      label: "Motor",
      value:
        "Motor Cummins ISF de 4 cilindros, inyección electrónica common rail. Potencia de 170-210 HP.",
    },
    {
      icon: Gauge,
      label: "Caja de cambios",
      value: "Transmisión manual Fast Gear de 6 velocidades + reversa",
    },
    {
      icon: Truck,
      label: "Capacidad de carga",
      value: "Peso bruto vehicular: 16,000 kg",
    },
  ],
  consultarHref:
    "https://wa.me/5493424216850?text=Hola!%20Estoy%20interesado%20en%20el%20FOTON%20AUMAN%20D.%20Me%20gustaría%20recibir%20más%20información.",
  galleries: [
    {
      id: "interior",
      label: "INTERIOR",
      images: [
        "/images/FOTON/cateogries/medianos/AUMAN D/INTERIOR/interior-Auman D-1.jpg",
        "/images/FOTON/cateogries/medianos/AUMAN D/INTERIOR/interior-Auman D-2.png",
        "/images/FOTON/cateogries/medianos/AUMAN D/INTERIOR/interior-Auman D-3.png",
        "/images/FOTON/cateogries/medianos/AUMAN D/INTERIOR/interior-Auman D-4.jpg",
        "/images/FOTON/cateogries/medianos/AUMAN D/INTERIOR/interior-Auman D-1.jpg",
      ],
      headingLead: "Diseñado para el",
      headingHighlight: "conductor",
      description:
        "La cabina del AUMAN D ofrece un ambiente de trabajo cómodo y funcional. Con asientos ergonómicos, amplios espacios de almacenamiento y controles intuitivos, cada viaje es más placentero y productivo.",
      bullets: [
        "Asientos ergonómicos con ajuste neumático",
        "Panel de instrumentos digital",
        "Sistema de climatización eficiente",
        "Amplios compartimentos de almacenamiento",
        "Volante multifunción",
      ],
    },
    {
      id: "exterior",
      label: "EXTERIOR",
      images: [
        "/images/FOTON/cateogries/medianos/AUMAN D/EXTERIOR/exterior-Auman D-1.webp",
        "/images/FOTON/cateogries/medianos/AUMAN D/EXTERIOR/exterior-Auman D-2.jpg",
        "/images/FOTON/cateogries/medianos/AUMAN D/EXTERIOR/exterior-Auman D-3.jpg",
        "/images/FOTON/cateogries/medianos/AUMAN D/EXTERIOR/exterior-Auman D-4.webp",
        "/images/FOTON/cateogries/medianos/AUMAN D/EXTERIOR/exterior-Auman D-5.webp",
      ],
      headingLead: "Diseño robusto y",
      headingHighlight: "funcional",
      description:
        "El AUMAN D presenta un diseño exterior imponente y aerodinámico que combina estética con funcionalidad. Construido con materiales de alta resistencia para soportar las condiciones más exigentes.",
      bullets: [
        "Chasis reforzado de alta resistencia",
        "Faros LED de alto rendimiento",
        "Espejos retrovisores eléctricos",
        "Parachoques integrado con protección",
        "Diseño aerodinámico para menor consumo",
      ],
    },
  ],
  components: [
    {
      label: "Motor",
      image:
        "/images/FOTON/cateogries/medianos/AUMAN D/COMPONENTES/motor- Auman D.png",
    },
    {
      label: "Caja de cambios",
      image:
        "/images/FOTON/cateogries/medianos/AUMAN D/COMPONENTES/caja de cambios- auman d.png",
    },
  ],
  versions: [
    {
      id: "auman-d-1621",
      nombre: "AUMAN D 1621",
      imagen:
        "/images/FOTON/cateogries/medianos/AUMAN D/VERSIONES/Auman-D_1621/nuevo_Auman-D_1621.png",
      pdf: "/images/FOTON/cateogries/medianos/AUMAN D/VERSIONES/Auman-D_1621/FT-Foton-Auman-D-1621-4X2R.pdf",
    },
    {
      id: "auman-d-2027",
      nombre: "AUMAN D 2027",
      imagen:
        "/images/FOTON/cateogries/medianos/AUMAN D/VERSIONES/aumanD 2027/AumanD-2027.png",
      pdf: "/images/FOTON/cateogries/medianos/AUMAN D/VERSIONES/aumanD 2027/FT-Foton-Auman-D-2027-4X2R.pdf",
    },
  ],
  cta: {
    title: "¿Interesado en el FOTON AUMAN D?",
    description:
      "Contactanos para más información, cotizaciones y pruebas de manejo.",
    label: "Contactar Ahora",
    href: "/contacto",
  },
};

export default function Page() {
  return <ModelTemplate data={data} />;
}
