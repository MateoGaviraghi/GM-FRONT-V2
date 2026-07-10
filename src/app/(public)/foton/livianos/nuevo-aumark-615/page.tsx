"use client";

import { Users, Zap, Gauge, Truck } from "lucide-react";
import {
  ModelTemplate,
  type ModelData,
} from "@/components/cliente/foton/model-template";

const data: ModelData = {
  category: { label: "Livianos", href: "/foton/livianos" },
  backLabel: "Volver a Livianos",
  name: "Nuevo Aumark 615",
  shareName: "FOTON NUEVO AUMARK 615",
  url: "/foton/livianos/nuevo-aumark-615",
  headline: "EL FUTURO DEL TRANSPORTE URBANO",
  description:
    "Diseñado para la logística de corta distancia, es parte de la última evolución del camión liviano más vendido del mundo. Se caracteriza por su moderno diseño, alta calidad y tren motriz eficiente. Equipado con un motor Cummins, transmisión ZF, electrónica Bosch, frenos a disco en todas sus ruedas, embrague Sachs, entre otros, que garantizan un gran rendimiento y disponibilidad.",
  heroImage:
    "/images/FOTON/cateogries/livianos/NUEVO AUMARK/HERO/hero-NuevoAumark.jpg",
  logo: { wordmark: "/images/FOTON/cateogries/livianos/NUEVO AUMARK/LOGO/logo-letras-nuevoAumark.png", vehicle: "/images/FOTON/cateogries/livianos/NUEVO AUMARK/LOGO/LOGO-NuevoAumarkAuto.png" },
  heroSpecs: [
    {
      icon: Users,
      label: "Cabina",
      value:
        "Nueva cabina, más espaciosa, con alta calidad de materiales, ergonómica y con capacidad para 3 pasajeros.",
    },
    {
      icon: Zap,
      label: "Motor",
      value:
        "Cummins ISF 2.8: performance, peso reducido, mínimos costos operativos, confiabilidad y durabilidad.",
    },
    {
      icon: Gauge,
      label: "Caja de cambios",
      value:
        "Transmisión ZF Ecolite 5S, con comando manual de 5 velocidades, liviana, larga vida útil y fácil mantenimiento.",
    },
    { icon: Truck, label: "Capacidad de carga", value: "PBT: 6.000 kg" },
  ],
  consultarHref:
    "https://wa.me/5493424216850?text=Hola!%20Estoy%20interesado%20en%20el%20Nuevo%20Aumark%20615.%20Me%20gustaría%20recibir%20más%20información.",
  pdfHref:
    "/images/FOTON/cateogries/livianos/NUEVO AUMARK/PDF-PRINCIPAL/615-NuevoAumark-.pdf",
  pdfLabel: "Ficha Técnica",
  galleries: [
    {
      id: "interior",
      label: "INTERIOR",
      images: [
        "/images/FOTON/cateogries/livianos/NUEVO AUMARK/INTERIOR/Interior-NuevoAumark-1.jpg",
        "/images/FOTON/cateogries/livianos/NUEVO AUMARK/INTERIOR/Interior-NuevoAumark-2.jpg",
        "/images/FOTON/cateogries/livianos/NUEVO AUMARK/INTERIOR/Interior-NuevoAumark-3.jpg",
        "/images/FOTON/cateogries/livianos/NUEVO AUMARK/INTERIOR/Interior-NuevoAumark-4.jpg",
        "/images/FOTON/cateogries/livianos/NUEVO AUMARK/INTERIOR/Interior-NuevoAumark-5.jpg",
      ],
      headingLead: "Confort de",
      headingHighlight: "cabina",
      description:
        "El interior del Nuevo Aumark 615 fue completamente renovado, con mayor capacidad para 3 personas y diseño de estilo automotriz. Incluye butacas más cómodas con logo Aumark y función cama, volante multifunción, tablero con computadora de a bordo, display táctil HD con cámara de retroceso, múltiples portaobjetos y puertos USB y 12V. La cabina ofrece excelente aislación térmica y acústica gracias a sus burletes dobles.",
      bullets: [
        "Diseño de estilo automotriz",
        "Display táctil HD con cámara",
        "Excelente aislación térmica y acústica",
      ],
    },
    {
      id: "exterior",
      label: "EXTERIOR",
      images: [
        "/images/FOTON/cateogries/livianos/NUEVO AUMARK/EXTERIOR/Exterior-NuevoAumark-1.png",
        "/images/FOTON/cateogries/livianos/NUEVO AUMARK/EXTERIOR/Exterior-NuevoAumark-2.jpg",
        "/images/FOTON/cateogries/livianos/NUEVO AUMARK/EXTERIOR/Exterior-NuevoAumark-3.jpg",
        "/images/FOTON/cateogries/livianos/NUEVO AUMARK/EXTERIOR/Exterior-NuevoAumark-4.png",
        "/images/FOTON/cateogries/livianos/NUEVO AUMARK/EXTERIOR/Exterior-NuevoAumark-5.jpg",
      ],
      headingLead: "Diseño",
      headingHighlight: "funcional",
      description:
        "El exterior del Nuevo Aumark presenta un diseño más moderno y aerodinámico. Incorpora nueva parrilla con efecto diamante, retrovisores eléctricos y calefaccionados, faros con DRL con fondo negro, y reubicación de componentes para permitir más espacio lateral para el carrozado.",
      bullets: [
        "Parrilla con efecto diamante",
        "Retrovisores eléctricos y calefaccionados",
        "Diseño aerodinámico moderno",
      ],
    },
  ],
  components: [
    {
      label: "Motor",
      image:
        "/images/FOTON/cateogries/livianos/NUEVO AUMARK/COMPONENTES/Motor-NuevoAumark-.png",
    },
    {
      label: "Caja de cambios",
      image:
        "/images/FOTON/cateogries/livianos/NUEVO AUMARK/COMPONENTES/CajaCambios-NuevoAumark-.png",
    },
  ],
  versions: [],
  cta: {
    title: "¿Interesado en el FOTON NUEVO AUMARK 615?",
    description:
      "Contactanos para más información, cotizaciones y pruebas de manejo.",
    label: "Contactar Ahora",
    href: "/contacto",
  },
};

export default function NuevoAumark615Page() {
  return <ModelTemplate data={data} />;
}
