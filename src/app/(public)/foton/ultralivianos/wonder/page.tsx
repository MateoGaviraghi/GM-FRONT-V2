"use client";

import { Users, Zap, Gauge, Truck } from "lucide-react";
import {
  ModelTemplate,
  type ModelData,
} from "@/components/cliente/foton/model-template";

const data: ModelData = {
  category: { label: "Ultralivianos", href: "/foton/ultralivianos" },
  backLabel: "Volver a Ultralivianos",
  name: "Wonder",
  shareName: "FOTON WONDER",
  url: "/foton/ultralivianos/wonder",
  headline: "Habla de vos",
  description:
    "El Foton Wonder es un camión ultraliviano que combina fuerza, eficiencia y versatilidad, ideal para los desafíos de la ciudad. Su diseño italiano, colores innovadores y versatilidad incomparable lo convierten en una herramienta clave para potenciar tu negocio. Disponible en versiones de cabina simple, doble y simple carrozado (cargo box).",
  heroImage: "/images/FOTON/cateogries/ultralivianos/WONDER/HERO/WONDER-HERO.jpg",
  logo: { wordmark: "/images/FOTON/cateogries/ultralivianos/WONDER/LOGO/wonder-LOGO-LETRAS.png", vehicle: "/images/FOTON/cateogries/ultralivianos/WONDER/LOGO/WONDER-LOGO-AUTO.png" },
  heroSpecs: [
    {
      icon: Users,
      label: "Cabina",
      value: "Cabina con opciones simple (2 pasajeros) o doble (5 pasajeros)",
    },
    {
      icon: Zap,
      label: "Motor",
      value:
        "DAM16NS, 4 Cilindros en Línea, 16 Válvulas (inyección electrónica multipunto), 1,6L Euro 5. Potencia de 120hp.",
    },
    {
      icon: Gauge,
      label: "Caja de cambios",
      value: "Transmisión manual de 5 velocidades + Reversa",
    },
    { icon: Truck, label: "Capacidad de carga", value: "PBT: 2.550 kg" },
  ],
  consultarHref:
    "https://wa.me/5493424216850?text=Hola!%20Estoy%20interesado%20en%20el%20FOTON%20WONDER.%20Me%20gustaría%20recibir%20más%20información.",
  galleries: [
    {
      id: "interior",
      label: "INTERIOR",
      images: [
        "/images/FOTON/cateogries/ultralivianos/WONDER/INTERIOR/interior-WONDER-1.jpg",
        "/images/FOTON/cateogries/ultralivianos/WONDER/INTERIOR/interior-WONDER-2.jpg",
        "/images/FOTON/cateogries/ultralivianos/WONDER/INTERIOR/interior-WONDER-3.jpg",
        "/images/FOTON/cateogries/ultralivianos/WONDER/INTERIOR/interior-WONDER-4.jpg",
        "/images/FOTON/cateogries/ultralivianos/WONDER/INTERIOR/interior-WONDER-5.jpg",
        "/images/FOTON/cateogries/ultralivianos/WONDER/INTERIOR/interior-WONDER-6.jpg",
      ],
      headingLead: "Confort de",
      headingHighlight: "cabina",
      description:
        "El Wonder ofrece un interior moderno y tecnológico, generando un equilibrio entre funcionalidad y diseño.",
      bullets: [
        "Interior moderno y funcional",
        "Asientos cómodos para largas jornadas",
        "Diseño ergonómico",
      ],
    },
    {
      id: "exterior",
      label: "EXTERIOR",
      images: [
        "/images/FOTON/cateogries/ultralivianos/WONDER/EXTERIOR/exterior-WONDER-1.webp",
        "/images/FOTON/cateogries/ultralivianos/WONDER/EXTERIOR/exterior-WONDER-2.jpg",
        "/images/FOTON/cateogries/ultralivianos/WONDER/EXTERIOR/exterior-WONDER-3.webp",
        "/images/FOTON/cateogries/ultralivianos/WONDER/EXTERIOR/exterior-WONDER-4.jpg",
        "/images/FOTON/cateogries/ultralivianos/WONDER/EXTERIOR/exterior-WONDER-5.webp",
      ],
      headingLead: "Diseño",
      headingHighlight: "Europeo",
      description:
        "Diseñado por el estudio italiano ICONA, este vehículo logra un equilibrio perfecto entre simplicidad, funcionalidad y estilo. Sus líneas geométricas suaves le aportan dinamismo y emoción, realzadas por una paleta de colores pasteles que refuerzan su carácter distintivo.",
      bullets: [
        "Diseño italiano ICONA",
        "Líneas geométricas suaves",
        "Colores innovadores",
      ],
    },
    {
      id: "componentes",
      label: "COMPONENTES",
      images: [
        "/images/FOTON/cateogries/ultralivianos/WONDER/COMPONENTES/componentes-WONDER-Motor.png",
        "/images/FOTON/cateogries/ultralivianos/WONDER/COMPONENTES/componentes-WONDER-CajaDeCambios.png",
      ],
      headingLead: "Motor y",
      headingHighlight: "caja de cambios",
      description:
        "Los motores DAM a Gasolina de 1,6L, son motores muy eficientes de 4 tiempos con 16 valvulas y sistema DOHC. Tienen un bajo consumo de combustible, gracias a su curva de motor mejoradas y son de peso ligero. La Caja de Cambio del Wonder es una caja DAT 18R manual de 5 Velocidades adelante y una de retroceso. Una caja sincronizada, suave y de poco esfuerzo para las largas jornadas de trabajo en la ciudad o en el campo.",
      bullets: ["Potencia de 120hp", "Torque de 158Nm"],
    },
  ],
  components: [
    {
      label: "Motor",
      image:
        "/images/FOTON/cateogries/ultralivianos/WONDER/COMPONENTES/componentes-WONDER-Motor.png",
    },
    {
      label: "Caja de cambios",
      image:
        "/images/FOTON/cateogries/ultralivianos/WONDER/COMPONENTES/componentes-WONDER-CajaDeCambios.png",
    },
  ],
  versionsIntro: "Encuentra la configuración perfecta para tu negocio",
  versions: [
    {
      id: "cabina-simple-flatbed",
      nombre: "Cabina Simple Flatbed",
      imagen:
        "/images/FOTON/cateogries/ultralivianos/WONDER/VERSIONES/Wonder-Cabina Simple Flatbed/Wonder-Cabina Simple Flatbed.png",
      pdf: "/images/FOTON/cateogries/ultralivianos/WONDER/VERSIONES/Wonder-Cabina Simple Flatbed/Wonder-Cabina Simple Flatbed.pdf",
    },
    {
      id: "cabina-doble-flatbed",
      nombre: "Cabina Doble Flatbed",
      imagen:
        "/images/FOTON/cateogries/ultralivianos/WONDER/VERSIONES/Wonder-Cabina doble Flatbed/Wonder-Cabina doble Flatbed.png",
      pdf: "/images/FOTON/cateogries/ultralivianos/WONDER/VERSIONES/Wonder-Cabina doble Flatbed/Wonder-Cabina doble Flatbed.pdf",
    },
    {
      id: "cabina-simple-box",
      nombre: "Cabina Simple Box",
      imagen:
        "/images/FOTON/cateogries/ultralivianos/WONDER/VERSIONES/Cabina Simple Box WONDER/Cabina Simple Box WONDER.png",
      pdf: "/images/FOTON/cateogries/ultralivianos/WONDER/VERSIONES/Cabina Simple Box WONDER/Cabina Simple Box WONDER.pdf",
    },
  ],
  cta: {
    title: "¿Interesado en la FOTON WONDER?",
    description:
      "Contactanos para más información, cotizaciones y pruebas de manejo.",
    label: "Contactar Ahora",
    href: "/contacto",
  },
};

export default function WonderPage() {
  return <ModelTemplate data={data} />;
}
