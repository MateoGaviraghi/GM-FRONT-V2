"use client";

import { Users, Settings, Gauge, Truck } from "lucide-react";
import {
  ModelTemplate,
  type ModelData,
} from "@/components/cliente/foton/model-template";

const data: ModelData = {
  category: { label: "Eléctricos", href: "/foton/electricos" },
  backLabel: "Volver a Eléctricos",
  name: "eAumark",
  shareName: "FOTON eAUMARK",
  url: "/foton/electricos/eaumark",
  headline: "Logística 100% eléctrica",
  description:
    "El eAumark L6 es el primer camión eléctrico urbano del país, formando parte del cambio de la logística hacia la neutralidad de emisiones. Alta tecnología, seguridad y eficiencia son los principales atributos de este gran camión",
  heroImage: "/images/FOTON/cateogries/Electricos/EAUMARK/HERO/HERO-E AUMARK.jpg",
  logo: { wordmark: "/images/FOTON/cateogries/Electricos/EAUMARK/LOGO/LOGO-E AUMARK-LETRAS.png", vehicle: "/images/FOTON/cateogries/Electricos/EAUMARK/LOGO/LOGO-E AUMARK-AUTO.png" },
  heroSpecs: [
    {
      icon: Users,
      label: "Cabina",
      value:
        "Cabina S1, con alta calidad de materiales, ergonómica y con capacidad para 3 pasajeros",
    },
    {
      icon: Settings,
      label: "Motor",
      value:
        "Motor ELÉCTRICO de reducción única síncrono de imán permanente tiene un peso propio muy bajo. Potencia máx 115 kw / 154 hp. Baterías CATL de 81kW. Autonomía aproximada de 200 km.",
    },
    { icon: Gauge, label: "Caja de cambios", value: "Variador de velocidad" },
    { icon: Truck, label: "Capacidad de carga", value: "PBT: 6.000 kg" },
  ],
  consultarHref:
    "https://wa.me/5493424216850?text=Hola!%20Estoy%20interesado%20en%20el%20FOTON%20eAumark.%20Me%20gustaría%20recibir%20más%20información.",
  pdfHref:
    "/images/FOTON/cateogries/Electricos/EAUMARK/FICHA-TECNICA/FT-Foton-eAumark.pdf",
  pdfLabel: "Ficha Técnica",
  galleries: [
    {
      id: "interior",
      label: "INTERIOR",
      images: [
        "/images/FOTON/cateogries/Electricos/EAUMARK/INTERIOR/INTERIOR-E AUMARK-1.png",
        "/images/FOTON/cateogries/Electricos/EAUMARK/INTERIOR/INTERIOR-E AUMARK-2.png",
        "/images/FOTON/cateogries/Electricos/EAUMARK/INTERIOR/INTERIOR-E AUMARK-3.png",
        "/images/FOTON/cateogries/Electricos/EAUMARK/INTERIOR/INTERIOR-E AUMARK-4.png",
        "/images/FOTON/cateogries/Electricos/EAUMARK/INTERIOR/INTERIOR-E AUMARK-5.jpg",
      ],
      headingLead: "Confort y",
      headingHighlight: "tecnología",
      description:
        "El eAumark L6 es un camión mediano con un diseño moderno y atractivo que lo diferencia de otros vehículos en su categoría. Su apariencia elegante y aerodinámica, combinada con detalles como faros LED y una parrilla distintiva, le dan un aspecto sofisticado y futurista.",
      bullets: [
        "Diseño moderno y atractivo",
        "Faros LED y parrilla distintiva",
        "Aspecto sofisticado y futurista",
      ],
    },
    {
      id: "exterior",
      label: "EXTERIOR",
      images: [
        "/images/FOTON/cateogries/Electricos/EAUMARK/EXTERIOR/EXTERIOR-E AUMARK-1.jpg",
        "/images/FOTON/cateogries/Electricos/EAUMARK/EXTERIOR/EXTERIOR-E AUMARK-2.jpg",
        "/images/FOTON/cateogries/Electricos/EAUMARK/EXTERIOR/EXTERIOR-E AUMARK-3.jpeg",
        "/images/FOTON/cateogries/Electricos/EAUMARK/EXTERIOR/EXTERIOR-E AUMARK-4.png",
        "/images/FOTON/cateogries/Electricos/EAUMARK/EXTERIOR/EXTERIOR-E AUMARK-5.jpg",
      ],
      headingLead: "Diseño",
      headingHighlight: "funcional",
      description:
        "La línea Aumark resulta óptima para viajes de media y larga distancia, con un completo panel de instrumentos con controles ergonómicos, butacas y tapizados interiores de gran calidad y cabinas amortiguadas. En su amplio interior, pueden acomodarse hasta tres pasajeros cómodamente sentados, con el máximo confort de marcha.",
    },
  ],
  components: [
    {
      label: "Motor",
      image:
        "/images/FOTON/cateogries/Electricos/EAUMARK/COMPONENTES/MOTOR-E AUMARK-.png",
    },
  ],
  versions: [
    {
      id: "eaumark-electrico",
      nombre: "eAumark Eléctrico",
      pdf: "/images/FOTON/cateogries/Electricos/EAUMARK/FICHA-TECNICA/FT-Foton-eAumark.pdf",
    },
  ],
  cta: {
    title: "¿Interesado en el FOTON eAumark?",
    description:
      "Contactanos hoy y descubre la nueva era de la logística eléctrica",
    label: "Contactar Ahora",
    href: "/contacto",
  },
};

export default function Page() {
  return <ModelTemplate data={data} />;
}
