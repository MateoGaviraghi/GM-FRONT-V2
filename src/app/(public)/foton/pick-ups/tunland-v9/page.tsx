"use client";

import { Mountain, Leaf, Gauge, Shield, Truck, Settings } from "lucide-react";
import {
  ModelTemplate,
  type ModelData,
} from "@/components/cliente/foton/model-template";

const data: ModelData = {
  category: { label: "Pick Ups", href: "/foton/pick-ups" },
  backLabel: "Volver a Pick Ups",
  name: "Tunland V9",
  shareName: "FOTON TUNLAND V9",
  url: "/foton/pick-ups/tunland-v9",
  headline: "Capacidad de carga útil",
  description:
    "La Nueva Foton Tunland V9 híbrida lleva el rendimiento y la eficiencia energética a un nuevo nivel. Con tecnología mild-hybrid, combina lo mejor de los motores eléctricos y de combustión, ofreciendo una mayor autonomía y reduciendo el consumo de combustible. Ideal para quienes buscan una pick-up potente, versátil y amigable con el medio ambiente.",
  heroImage: "/images/FOTON/TUNDLAND.V9/HERO/foton-tunland-v9-Hero.jpg",
  logo: { wordmark: "/images/FOTON/TUNDLAND.V9/LOGO/LogoNombreTunlandV9.png", vehicle: "/images/FOTON/TUNDLAND.V9/LOGO/LogoCamionetaTundlandV9-Photoroom.png" },
  heroSpecs: [
    { icon: Mountain, label: "Tracción", value: "4x4" },
    {
      icon: Leaf,
      label: "Motor Híbrido",
      value:
        "Diesel Mild-hybrid Aucan 2.0L + 48V\nPotencia 175 hp - Torque 451 Nm",
    },
    { icon: Gauge, label: "Caja de cambios", value: "ZF AT 8 marchas" },
    {
      icon: Shield,
      label: "Seguridad",
      value:
        "6 airbags / Sensor ángulo ciego / LDW / LCC / FCW / AEB / ABS / EBD / ESC",
    },
    { icon: Truck, label: "Capacidad de carga", value: "720 kg" },
  ],
  consultarHref:
    "https://wa.me/5493424216850?text=Hola!%20Estoy%20interesado%20en%20la%20FOTON%20TUNLAND%20V9.%20Me%20gustaría%20recibir%20más%20información.",
  pdfHref:
    "/images/FOTON/TUNDLAND.V9/pdf+info/FT-Foton-Tunland-V9-4x4-AT-Ultimate-1.pdf",
  pdfLabel: "Ficha Técnica",
  galleries: [
    {
      id: "interior",
      label: "INTERIOR",
      images: [
        "/images/FOTON/TUNDLAND.V9/INTERIOR/InteriorTundlandV9-1.jpg",
        "/images/FOTON/TUNDLAND.V9/INTERIOR/InteriorTundlandV9-2.jpg",
        "/images/FOTON/TUNDLAND.V9/INTERIOR/InteriorTundlandV9-3.jpg",
        "/images/FOTON/TUNDLAND.V9/INTERIOR/InteriorTundlandV9-4.jpg",
        "/images/FOTON/TUNDLAND.V9/INTERIOR/InteriorTundlandV9-5.jpg",
      ],
      headingLead: "Confort y",
      headingHighlight: "tecnología",
      description:
        'En su interior cuenta con confortables asientos en eco cuero con regulaciones eléctricas, tablero principal digital de 14,6", display secundario táctil de 12,3" con cámara de retroceso, carga inalámbrica para teléfono y conexión Apple Carplay/Android Auto.',
      bullets: [
        "Asientos en eco cuero con regulación eléctrica",
        'Tablero digital 14,6" + Display táctil 12,3"',
        "Carga inalámbrica y Apple Carplay/Android Auto",
      ],
    },
    {
      id: "exterior",
      label: "EXTERIOR",
      images: [
        "/images/FOTON/TUNDLAND.V9/EXTERIOR/ExteriorTundlandV9-1.jpg",
        "/images/FOTON/TUNDLAND.V9/EXTERIOR/ExteriorTundlandV9-2.jpg",
        "/images/FOTON/TUNDLAND.V9/EXTERIOR/ExteriorTundlandV9-3.jpg",
        "/images/FOTON/TUNDLAND.V9/EXTERIOR/ExteriorTundlandV9-4.jpg",
        "/images/FOTON/TUNDLAND.V9/EXTERIOR/ExteriorTundlandV9-5.jpg",
      ],
      headingLead: "Diseño",
      headingHighlight: "imponente",
      description:
        'La Pick Up Foton V9 ofrece un exterior imponente, con una parrilla moderna, faros LED y llantas de aleación de 18" con neumáticos 265/70R18. Todo lo necesario para un estilo agresivo y de lujo.',
      bullets: [
        "Parrilla moderna con faros LED",
        'Llantas de aleación 18"',
        "Neumáticos 265/70R18",
      ],
    },
    {
      id: "tren-motriz",
      label: "TREN MOTRIZ",
      images: [
        "/images/FOTON/TUNDLAND.V9/TRENMOTRIZ/TREN-MOTRIZ-V9-1.jpg",
        "/images/FOTON/TUNDLAND.V9/TRENMOTRIZ/TREN-MOTRIZ-V9-2.jpg",
        "/images/FOTON/TUNDLAND.V9/TRENMOTRIZ/TREN-MOTRIZ-V9-3.jpg",
        "/images/FOTON/TUNDLAND.V9/TRENMOTRIZ/TREN-MOTRIZ-V9-4.jpg",
        "/images/FOTON/TUNDLAND.V9/TRENMOTRIZ/TREN-MOTRIZ-V9-5.jpg",
      ],
      headingLead: "Tecnología",
      headingHighlight: "Mild-Hybrid",
      description:
        "La Foton Tunland V9 Híbrida marca un nuevo camino en la innovación con su potente motor Diesel Aucan 2.0 litros combinado con un sistema hibrido de 48 V que alcanza una potencia de 175 hp. Equipada con una caja de cambios ZF AT de 8 marchas y una selectora que permite variar el modo de conducción y la tracción, la V9 está preparada para encarar todos los desafíos.",
      specCards: [
        { value: "175", label: "Potencia (HP)" },
        { value: "451", label: "Torque (Nm)" },
        { value: "2.0", label: "Cilindrada (litros)" },
        { value: "8 AT", label: "Transmisión ZF" },
      ],
    },
    {
      id: "seguridad",
      label: "SEGURIDAD Y CONFORT",
      images: [
        "/images/FOTON/TUNDLAND.V9/SEGURIDADYCONFORT/SeguridadTundlandV9-1.jpg",
        "/images/FOTON/TUNDLAND.V9/SEGURIDADYCONFORT/SeguridadTundlandV9-2.jpg",
        "/images/FOTON/TUNDLAND.V9/SEGURIDADYCONFORT/SeguridadTundlandV9-3.jpg",
        "/images/FOTON/TUNDLAND.V9/SEGURIDADYCONFORT/SeguridadTundlandV9-4.jpg",
        "/images/FOTON/TUNDLAND.V9/SEGURIDADYCONFORT/SeguridadTundlandV9-5.jpg",
      ],
      headingLead: "Máxima",
      headingHighlight: "protección",
      description:
        "La Tunland V9 ofrece máxima seguridad con sus 6 airbags, frenos a discos con ABS, EBD y ESC, sensor de ángulo ciego, FCW y AEB (frenado de emergencia). También te permite máxima visibilidad con cámara 360° y sensores de retroceso.",
      specCards: [
        {
          icon: Shield,
          label: "6 Airbags",
          sublabel: "Protección completa para conductor y pasajeros",
        },
        {
          icon: Settings,
          label: "FCW + AEB",
          sublabel: "Frenado de emergencia automático",
        },
        {
          icon: Shield,
          label: "Cámara 360°",
          sublabel: "Visibilidad total de tu entorno",
        },
        {
          icon: Settings,
          label: "ABS + ESC",
          sublabel: "Control total en cualquier situación",
        },
      ],
    },
    {
      id: "dimensiones",
      label: "DIMENSIONES Y CAPACIDADES",
      images: [
        "/images/FOTON/TUNDLAND.V9/DIMENSIONESYCAPACIDADES/DIMENSIONES-Y-CAPACIDADES-V9-1.jpg",
        "/images/FOTON/TUNDLAND.V9/DIMENSIONESYCAPACIDADES/DIMENSIONES-Y-CAPACIDADES-V9-2.jpg",
        "/images/FOTON/TUNDLAND.V9/DIMENSIONESYCAPACIDADES/DIMENSIONES-Y-CAPACIDADES-V9-3.jpg",
        "/images/FOTON/TUNDLAND.V9/DIMENSIONESYCAPACIDADES/DIMENSIONES-Y-CAPACIDADES-V9-4.jpg",
        "/images/FOTON/TUNDLAND.V9/DIMENSIONESYCAPACIDADES/DIMENSIONES-Y-CAPACIDADES-V9-5.jpg",
      ],
      headingLead: "Espacio y",
      headingHighlight: "capacidad",
      description:
        "En cuanto a sus dimensiones, la Foton Tunland V9 Hibrida cuenta con un tamaño de 5.617 x 2.030 x 1.905 mm, con una distancia entre ejes de 3.355 mm y una capacidad de carga de 720 kg.",
      specCards: [
        { value: "5.617", label: "Largo (mm)" },
        { value: "2.030", label: "Ancho (mm)" },
        { value: "1.905", label: "Alto (mm)" },
        { value: "3.355", label: "Distancia entre ejes (mm)" },
        { value: '18"', label: "Llantas de aleación" },
      ],
      featured: { value: "720 kg", label: "Capacidad de carga (kg)" },
    },
  ],
  versions: [
    {
      id: "4x4-at-ultimate",
      nombre: "4x4 AT Ultimate",
      pdf: "/images/FOTON/TUNDLAND.V9/pdf+info/FT-Foton-Tunland-V9-4x4-AT-Ultimate-1.pdf",
    },
  ],
  cta: {
    title: "¿Listo para experimentar la nueva era híbrida?",
    description:
      "Contactanos hoy y descubrí todo lo que la Tunland V9 puede hacer por vos.",
    label: "Contactar Ahora",
    href: "/contacto",
  },
};

export default function TunlandV9Page() {
  return <ModelTemplate data={data} />;
}
