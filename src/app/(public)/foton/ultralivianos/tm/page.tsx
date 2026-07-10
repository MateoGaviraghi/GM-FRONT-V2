"use client";

import { Users, Settings, Gauge, Truck } from "lucide-react";
import {
  ModelTemplate,
  type ModelData,
} from "@/components/cliente/foton/model-template";

const data: ModelData = {
  category: { label: "Ultralivianos", href: "/foton/ultralivianos" },
  backLabel: "Volver a Ultralivianos",
  name: "TM",
  shareName: "FOTON TM",
  url: "/foton/ultralivianos/tm",
  headline: "Versatilidad para tu negocio",
  description:
    "El TM es el vehículo comercial ideal para los trabajos en ciudad. Baja tara que permite maximizar la carga, radio de giro mínimo, confort y distintas opciones de configuración permiten encontrar el vehículo ideal para cada aplicación de última milla.",
  heroImage: "/images/FOTON/TM/hero/tm1hero -grande.png",
  logo: { wordmark: "/images/FOTON/TM/hero/tmLogo-Photoroom.png", vehicle: "/images/FOTON/TM/hero/tm1-hero.chico.png" },
  heroSpecs: [
    {
      icon: Users,
      label: "Cabina",
      value:
        'Cabina "Flat Head" con opciones simple (2 pasajeros) o doble (5 pasajeros)',
    },
    {
      icon: Settings,
      label: "Motor",
      value:
        "DAM16KL, 4 Cilindros en Línea, 16 Válvulas (inyección electrónica multipunto), 1,6L Euro 6. Potencia de 114 cv.",
    },
    {
      icon: Gauge,
      label: "Caja de cambios",
      value: "Transmisión manual de 5 velocidades + Reversa",
    },
    {
      icon: Truck,
      label: "Capacidad de carga",
      value: "PBT: 2.850 a 3.500 kg",
    },
  ],
  consultarHref:
    "https://wa.me/5493424216850?text=Hola!%20Estoy%20interesado%20en%20el%20FOTON%20TM.%20Me%20gustaría%20recibir%20más%20información.",
  galleries: [
    {
      id: "interior",
      label: "INTERIOR",
      images: [
        "/images/FOTON/TM/interior/interior1-TM.jpg",
        "/images/FOTON/TM/interior/interior2-TM.jpg",
        "/images/FOTON/TM/interior/interior3-TM.jpg",
        "/images/FOTON/TM/interior/interior4-TM.jpg",
        "/images/FOTON/TM/interior/interior5-TM.jpg",
      ],
      headingLead: "Confort de",
      headingHighlight: "cabina",
      description:
        "El TM ofrece en todas sus configuraciones un interior espacioso y confortable, con las mismas características de un auto. En su versión de doble cabina el espacio trasero es amplio cómodo.",
    },
    {
      id: "exterior",
      label: "EXTERIOR",
      images: [
        "/images/FOTON/TM/exterior/exterior1-TM.webp",
        "/images/FOTON/TM/exterior/exterior2-TM.webp",
        "/images/FOTON/TM/exterior/exterior3-TM.jpg",
        "/images/FOTON/TM/exterior/exterior4-TM.jpg",
        "/images/FOTON/TM/exterior/exterior5-TM.png",
      ],
      headingLead: "Diseño",
      headingHighlight: "funcional",
      description:
        "El TM es un camión ultraliviano con un diseño moderno y atractivo que lo diferencia de otros vehículos en su categoría. Con gran capacidad de carga y variedad en sus configuraciones TM mejorá la propuesta de otros utilitarios convirtiendose en el mejor aliado para el trabajo.",
    },
  ],
  components: [
    {
      label: "Motor",
      image: "/images/FOTON/TM/componentes/motor-TM.png",
    },
    {
      label: "Caja de cambios",
      image: "/images/FOTON/TM/componentes/CajaCambios-TM.png",
    },
  ],
  versions: [
    {
      id: "cabina-simple",
      nombre: "Cabina simple",
      imagen:
        "/images/FOTON/TM/versiones/tm1CabinaSimple/TM1-cabina-simple.png",
      pdf: "/images/FOTON/TM/versiones/tm1CabinaSimple/FT-Foton-TM1-CS-1.pdf",
    },
    {
      id: "cabina-doble",
      nombre: "Cabina doble",
      imagen:
        "/images/FOTON/TM/versiones/tm1.Cabina.Doble/TM1-CABINA-DOBLE.png",
      pdf: "/images/FOTON/TM/versiones/tm1.Cabina.Doble/FT-Foton-TM1-CD-1.pdf",
    },
    {
      id: "box",
      nombre: "Box",
      imagen: "/images/FOTON/TM/versiones/tm1.box/TM1-BOX.png",
      pdf: "/images/FOTON/TM/versiones/tm1.box/FT-Foton-TM1-Box.pdf",
    },
    {
      id: "box-refrigerado",
      nombre: "Box refrigerado",
      imagen:
        "/images/FOTON/TM/versiones/tm1.box.refrigerado/TM1-BOX-REFRIGERADO.png",
      pdf: "/images/FOTON/TM/versiones/tm1.box.refrigerado/FT-Foton-TM1-Box-Refrigerado.pdf",
    },
    {
      id: "hd-cabina-simple",
      nombre: "HD Cabina simple",
      imagen:
        "/images/FOTON/TM/versiones/tm2.hd.cabina.simple/TM2-HD-CABINA-SIMPLE.png",
      pdf: "/images/FOTON/TM/versiones/tm2.hd.cabina.simple/FT-Foton-TM1-HD-CS.pdf",
    },
    {
      id: "hd-cabina-doble",
      nombre: "HD Cabina Doble",
      imagen:
        "/images/FOTON/TM/versiones/tm2.hd.cabina.doble/TM2-HD-CABINA-DOBLE.png",
      pdf: "/images/FOTON/TM/versiones/tm2.hd.cabina.doble/FT-Foton-TM1-HD-CD.pdf",
    },
  ],
  cta: {
    title: "¿Interesado en el FOTON TM?",
    description:
      "Contactanos para más información, cotizaciones y pruebas de manejo.",
    label: "Contactar Ahora",
    href: "/contacto",
  },
};

export default function TmPage() {
  return <ModelTemplate data={data} />;
}
