"use client";

import { Users, Settings, Gauge, Truck } from "lucide-react";
import {
  ModelTemplate,
  type ModelData,
} from "@/components/cliente/foton/model-template";

const data: ModelData = {
  category: { label: "Pesados Vocacionales", href: "/foton/pesados-vocacionales" },
  backLabel: "Volver a Pesados Vocacionales",
  name: "Auman C",
  shareName: "FOTON AUMAN C",
  url: "/foton/pesados-vocacionales/auman-c",
  headline: "Para altas exigencias",
  description:
    "La línea AUMAN C es ideal para los trabajos más severos de Construcción y Minería, donde la robustez, disponibilidad y eficiencia son claves para la actividad.",
  heroImage:
    "/images/FOTON/cateogries/PesadosVocacionales/AUMAN C/HERO/HERO-AUMAN-C-.webp",
  logo: { wordmark: "/images/FOTON/cateogries/PesadosVocacionales/AUMAN C/LOGO/LOGO-AUMAN C-LETRA.png", vehicle: "/images/FOTON/cateogries/PesadosVocacionales/AUMAN C/LOGO/LOGO-AUMAN C-AUTO.png" },
  heroSpecs: [
    { icon: Users, label: "Cabina", value: "Cabina EST extendida (con litera de descanso)" },
    {
      icon: Settings,
      label: "Motor",
      value:
        "Cummins ISG12, con potencias de 400 o 460 cv: performance, peso reducido, mínimos costos operativos, y toda la confiabilidad y durabilidad",
    },
    {
      icon: Gauge,
      label: "Caja de cambios",
      value:
        "Transmisiones ZF AMT de 12 marchas (AMT) o 16 marchas (MT). Opción de retardador hidráulico y tomas de fuerza continuas o estacionarias",
    },
    { icon: Truck, label: "Capacidad de carga", value: "PBT (Técnico): de 35.000 a 50.000 kg" },
  ],
  consultarHref:
    "https://wa.me/5493424216850?text=Hola!%20Estoy%20interesado%20en%20el%20FOTON%20AUMAN%20C.%20Me%20gustaría%20recibir%20más%20información.",
  galleries: [
    {
      id: "interior",
      label: "INTERIOR",
      images: [
        "/images/FOTON/cateogries/PesadosVocacionales/AUMAN C/INTERIOR/INTERIOR-AUMAN-C-1.jpg",
        "/images/FOTON/cateogries/PesadosVocacionales/AUMAN C/INTERIOR/INTERIOR-AUMAN-C-2.jpg",
        "/images/FOTON/cateogries/PesadosVocacionales/AUMAN C/INTERIOR/INTERIOR-AUMAN-C-3.jpg",
        "/images/FOTON/cateogries/PesadosVocacionales/AUMAN C/INTERIOR/INTERIOR-AUMAN-C-4.png",
      ],
      headingLead: "Confort de",
      headingHighlight: "cabina",
      description:
        "La línea Auman resulta óptima para viajes de media y larga distancia, con un completo panel de instrumentos con controles ergonómicos, butacas y tapizados interiores de gran calidad y cabinas amortiguadas. En su amplio interior, pueden acomodarse hasta tres pasajeros cómodamente sentados, con el máximo confort de marcha.",
    },
    {
      id: "exterior",
      label: "EXTERIOR",
      images: [
        "/images/FOTON/cateogries/PesadosVocacionales/AUMAN C/EXTERIOR/EXTERIOR-AUMAN-C-1.webp",
        "/images/FOTON/cateogries/PesadosVocacionales/AUMAN C/EXTERIOR/EXTERIOR-AUMAN-C-2.jpg",
        "/images/FOTON/cateogries/PesadosVocacionales/AUMAN C/EXTERIOR/EXTERIOR-AUMAN-C-3.jpg",
        "/images/FOTON/cateogries/PesadosVocacionales/AUMAN C/EXTERIOR/EXTERIOR-AUMAN-C-4.jpg",
        "/images/FOTON/cateogries/PesadosVocacionales/AUMAN C/EXTERIOR/EXTERIOR-AUMAN-C-5.jpg",
      ],
      headingLead: "Diseño",
      headingHighlight: "robusto",
      description:
        "Auman C es el camión pesado de Foton, su diseño y configuración es específico para un uso de trabajo pesado, se encarga fácilmente de los trabajos duros y especializados.",
    },
  ],
  components: [
    {
      label: "Motor",
      image:
        "/images/FOTON/cateogries/PesadosVocacionales/AUMAN C/COMPONENTES/MOTOR-AUMAN-C-.png",
    },
    {
      label: "Caja de cambios",
      image:
        "/images/FOTON/cateogries/PesadosVocacionales/AUMAN C/COMPONENTES/CAJA DE CAMBIOS-AUMAN-C-.png",
    },
  ],
  versions: [
    {
      id: "auman-c-3535",
      nombre: "AUMAN C 3535",
      imagen:
        "/images/FOTON/cateogries/PesadosVocacionales/AUMAN C/VERSIONES/Auman C 3535/Auman_C_3535.png",
      pdf: "/images/FOTON/cateogries/PesadosVocacionales/AUMAN C/VERSIONES/Auman C 3535/Auman-C-3535.pdf",
    },
    {
      id: "auman-c-4146",
      nombre: "AUMAN C 4146",
      imagen:
        "/images/FOTON/cateogries/PesadosVocacionales/AUMAN C/VERSIONES/AUMAN C 4146/Auman_C_4146.png",
      pdf: "/images/FOTON/cateogries/PesadosVocacionales/AUMAN C/VERSIONES/AUMAN C 4146/AUMAN-C-4146.pdf",
    },
    {
      id: "auman-c-4440",
      nombre: "AUMAN C 4440",
      imagen:
        "/images/FOTON/cateogries/PesadosVocacionales/AUMAN C/VERSIONES/Auman C 4440/Auman_C_4440.png",
      pdf: "/images/FOTON/cateogries/PesadosVocacionales/AUMAN C/VERSIONES/Auman C 4440/Auman-C-4440.pdf",
    },
    {
      id: "auman-c-5046",
      nombre: "AUMAN C 5046",
      imagen:
        "/images/FOTON/cateogries/PesadosVocacionales/AUMAN C/VERSIONES/Auman C 5046/Auman_C_5046.png",
      pdf: "/images/FOTON/cateogries/PesadosVocacionales/AUMAN C/VERSIONES/Auman C 5046/Auman-C-5046.pdf",
    },
  ],
  cta: {
    title: "¿Interesado en el FOTON AUMAN C?",
    description:
      "Contactanos para más información, cotizaciones y pruebas de manejo.",
    label: "Contactar Ahora",
    href: "/contacto",
  },
};

export default function AumanCPage() {
  return <ModelTemplate data={data} />;
}
