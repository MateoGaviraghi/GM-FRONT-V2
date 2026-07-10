"use client";

import { Mountain, Zap, Gauge, Shield, Truck, Settings } from "lucide-react";
import {
  ModelTemplate,
  type ModelData,
} from "@/components/cliente/foton/model-template";

const data: ModelData = {
  category: { label: "Pick Ups", href: "/foton/pick-ups" },
  backLabel: "Volver a Pick Ups",
  name: "Tunland G7",
  shareName: "FOTON TUNLAND G7",
  url: "/foton/pick-ups/tunland-g7",
  headline: "Capacidad de carga útil",
  description:
    "Te presentamos la nueva Foton Tunland G7. Con la resistencia y durabilidad que solo Foton puede ofrecer, la Tunland G7 es la aliada perfecta para cualquier reto. Ya sea para trabajos pesados o para aventuras off-road, esta pick-up te llevará más allá.",
  heroImage: "/images/FOTON/TUNDLAND.G7/HERO/heroTunlandG7.jpg",
  logo: { wordmark: "/images/FOTON/TUNDLAND.G7/LOGO/logoTunlandg7.png", vehicle: "/images/FOTON/TUNDLAND.G7/LOGO/NuevoLogotundlandG7-Photoroom.png" },
  heroSpecs: [
    { icon: Mountain, label: "Tracción", value: "4x4" },
    {
      icon: Zap,
      label: "Motor",
      value:
        "Aucan 4F20TC - 2.0 litros - Diesel\nPotencia 161 hp - Torque 390 Nm",
    },
    { icon: Gauge, label: "Caja de cambios", value: "ZF AT 8 Velocidades" },
    {
      icon: Shield,
      label: "Seguridad",
      value:
        "6 airbags / Sensor ángulo ciego / FCW / AEB / Sensores y cámaras de estacionamiento",
    },
    { icon: Truck, label: "Capacidad de carga", value: "1.000 kg" },
  ],
  consultarHref:
    "https://wa.me/5493424216850?text=Hola!%20Estoy%20interesado%20en%20la%20FOTON%20TUNLAND%20G7.%20Me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n.",
  pdfHref:
    "/images/FOTON/TUNDLAND.G7/PDF-MAS-INFO/FT-Foton-Tunland-G7-4x4-AT-Ultimate-1.pdf",
  pdfLabel: "Ficha Técnica",
  galleries: [
    {
      id: "interior",
      label: "INTERIOR",
      images: [
        "/images/FOTON/TUNDLAND.G7/INTERIOR/INTERIOR-G7-1.jpg",
        "/images/FOTON/TUNDLAND.G7/INTERIOR/INTERIOR-G7-2.jpg",
        "/images/FOTON/TUNDLAND.G7/INTERIOR/INTERIOR-G7-3.jpg",
        "/images/FOTON/TUNDLAND.G7/INTERIOR/INTERIOR-G7-4.jpg",
        "/images/FOTON/TUNDLAND.G7/INTERIOR/INTERIOR-G7-5.jpg",
      ],
      headingLead: "Confort y",
      headingHighlight: "tecnología",
      description:
        'En su interior ofrece asientos de Eco cuero con regulación eléctrica para el asiento del conductor, un tablero principal con pantalla LCD de 7″ + pantalla secundaria táctil de 10" integrado con sensores de estacionamiento y cámara 360°.',
      bullets: [
        "Asientos de Eco cuero con regulación eléctrica",
        'Pantalla LCD de 7″ + pantalla táctil de 10"',
        "Cámara 360° integrada",
      ],
    },
    {
      id: "exterior",
      label: "EXTERIOR",
      images: [
        "/images/FOTON/TUNDLAND.G7/EXTERIOR/exteriorTunlandg7-1.jpg",
        "/images/FOTON/TUNDLAND.G7/EXTERIOR/exteriorTunlandg7-2.jpg",
        "/images/FOTON/TUNDLAND.G7/EXTERIOR/exteriorTunlandg7-3.jpg",
        "/images/FOTON/TUNDLAND.G7/EXTERIOR/exteriorTunlandg7-4.jpg",
        "/images/FOTON/TUNDLAND.G7/EXTERIOR/exteriorTunlandg7-5.jpg",
      ],
      headingLead: "Diseño",
      headingHighlight: "robusto",
      description:
        'La FOTON TUNLAND G7 combina elegancia y robustez en diseño exterior, con una parrilla delantera gris, faros halógenos y llantas de aleación de 18" con neumáticos 265/60R18.',
      bullets: [
        "Parrilla delantera gris distintiva",
        "Faros halógenos de alto rendimiento",
        'Llantas de aleación 18" - Neumáticos 265/60R18',
      ],
    },
    {
      id: "tren-motriz",
      label: "TREN MOTRIZ",
      images: [
        "/images/FOTON/TUNDLAND.G7/TRENMOTRIZ/TrenMotriz1.jpg",
        "/images/FOTON/TUNDLAND.G7/TRENMOTRIZ/TrenMotriz2.jpg",
        "/images/FOTON/TUNDLAND.G7/TRENMOTRIZ/TrenMotriz3.jpg",
        "/images/FOTON/TUNDLAND.G7/TRENMOTRIZ/TrenMotriz4.jpg",
        "/images/FOTON/TUNDLAND.G7/TRENMOTRIZ/TrenMotriz5.jpg",
      ],
      headingLead: "Potencia y",
      headingHighlight: "confiabilidad",
      description:
        "La Foton Tunland G7 combina la fuerza de su motor Aucan turbodiésel de 2 litros con 161 HP y 390 Nm de torque con la excelente caja de transmision ZF AT de 8 marchas, brindándote confiabilidad que necesitas. Con un comando sencillo se puede seleccionar el modo de conducción y el tipo de tracción necesaria para cada ocasión.",
      specCards: [
        { label: "Potencia máxima", value: "161 HP" },
        { label: "Torque", value: "390 Nm" },
        { label: "Motor Diesel", value: "2.0 L" },
        { label: "Transmisión ZF", value: "8 AT" },
      ],
    },
    {
      id: "seguridad",
      label: "SEGURIDAD Y CONFORT",
      images: [
        "/images/FOTON/TUNDLAND.G7/SEGURIDADYCONFORT/seguridadTunlandg7-1.jpg",
        "/images/FOTON/TUNDLAND.G7/SEGURIDADYCONFORT/seguridadTunlandg7-2.jpg",
        "/images/FOTON/TUNDLAND.G7/SEGURIDADYCONFORT/seguridadTunlandg7-3.jpg",
        "/images/FOTON/TUNDLAND.G7/SEGURIDADYCONFORT/seguridadTunlandg7-4.jpg",
        "/images/FOTON/TUNDLAND.G7/SEGURIDADYCONFORT/seguridadTunlandg7-5.jpg",
      ],
      headingLead: "Protección",
      headingHighlight: "total",
      description:
        "En cuanto a la seguridad, la FOTON TUNLAND G7 cuenta con 6 airbags, sensor de ángulo ciego, FCW y AEB (frenado de emergencia), frenos a discos ventilados en las 4 ruedas con sistema de frenado ABS, EBD y ESC. Además, cuenta con sensores de estacionamiento con cámara 360°.",
      specCards: [
        { icon: Shield, label: "6 Airbags", sublabel: "Protección total" },
        { icon: Settings, label: "FCW + AEB", sublabel: "Frenado emergencia" },
        { icon: Settings, label: "Cámara 360°", sublabel: "Visión completa" },
        { icon: Settings, label: "ABS + ESC", sublabel: "Control total" },
      ],
    },
    {
      id: "dimensiones",
      label: "DIMENSIONES Y CAPACIDADES",
      images: [
        "/images/FOTON/TUNDLAND.G7/DIMENSIONESYCAPACIDADES/DIMENSIONES-Y-CAPACIDADES-G7-1.jpg",
        "/images/FOTON/TUNDLAND.G7/DIMENSIONESYCAPACIDADES/DIMENSIONES-Y-CAPACIDADES-G7-2.jpg",
        "/images/FOTON/TUNDLAND.G7/DIMENSIONESYCAPACIDADES/DIMENSIONES-Y-CAPACIDADES-G7-3.jpg",
        "/images/FOTON/TUNDLAND.G7/DIMENSIONESYCAPACIDADES/DIMENSIONES-Y-CAPACIDADES-G7-4.jpg",
        "/images/FOTON/TUNDLAND.G7/DIMENSIONESYCAPACIDADES/DIMENSIONES-Y-CAPACIDADES-G7-5.jpg",
      ],
      headingLead: "Espacio y",
      headingHighlight: "capacidad",
      description:
        "La Tunland G7 es ideal para transportar cargas ya que cuenta con una dimension de 5.340 x 1.940 x 1.870 mm y una distancia entre sus ejes de 3.110 mm, además de con una capacidad de carga considerable de 1.000 kg.",
      specCards: [
        { value: "5.340 mm", label: "Largo total" },
        { value: "1.940 mm", label: "Ancho total" },
        { value: "1.870 mm", label: "Alto total" },
        { value: "3.110 mm", label: "Distancia ejes" },
      ],
      featured: { value: "1.000 kg", label: "Capacidad de carga útil" },
    },
  ],
  versions: [
    {
      id: "4x4-at-ultimate",
      nombre: "4x4 AT Ultimate",
      pdf: "/images/FOTON/TUNDLAND.G7/PDF-MAS-INFO/FT-Foton-Tunland-G7-4x4-AT-Ultimate-1.pdf",
    },
  ],
  cta: {
    title: "¿Interesado en la FOTON TUNLAND G7?",
    description:
      "Contactanos para más información, cotizaciones y pruebas de manejo.",
    label: "Contactar Ahora",
    href: "/contacto",
  },
};

export default function TunlandG7Page() {
  return <ModelTemplate data={data} />;
}
