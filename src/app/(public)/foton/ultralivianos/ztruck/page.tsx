"use client";

import { Users, Zap, Gauge, Truck } from "lucide-react";
import {
  ModelTemplate,
  type ModelData,
} from "@/components/cliente/foton/model-template";

const data: ModelData = {
  category: { label: "Ultralivianos", href: "/foton/ultralivianos" },
  backLabel: "Volver a Ultralivianos",
  name: "Z-Truck",
  shareName: "FOTON ZTRUCK",
  url: "/foton/ultralivianos/ztruck",
  headline: "Siempre llegás a tiempo",
  description:
    "El Z-Truck de Zanella destaca como el compañero perfecto para labores urbanas. Su ligereza optimiza la carga, su maniobrabilidad es insuperable, ofrece comodidad y diversas configuraciones para adaptarse a cada necesidad.",
  heroImage:
    "/images/FOTON/cateogries/ultralivianos/WONDER/ZTruck/HERO/HERO-ZTRUC-FOTON.webp",
  logo: { wordmark: "/images/FOTON/cateogries/ultralivianos/WONDER/ZTruck/LOGO/LOGO-NOMBRE-ZTRUCK.png", vehicle: "/images/FOTON/cateogries/ultralivianos/WONDER/ZTruck/LOGO/LOGO-AUTO-ZTRUCK-Photoroom.png" },
  heroSpecs: [
    {
      icon: Users,
      label: "Cabina",
      value: 'Cabina "Flat Head" con opciones simple o doble',
    },
    {
      icon: Zap,
      label: "Motor",
      value: "LJ469, 4 cilindros en línea, 16 V, Euro V, Inyección Multipunto",
    },
    {
      icon: Gauge,
      label: "Caja de cambios",
      value: "Transmisión manual de 5 velocidades + Reversa",
    },
    { icon: Truck, label: "Capacidad de carga", value: "690 kg" },
  ],
  consultarHref:
    "https://wa.me/5493424216850?text=Hola!%20Estoy%20interesado%20en%20el%20Z-Truck.%20Me%20gustaría%20recibir%20más%20información.",
  galleries: [
    {
      id: "interior",
      label: "INTERIOR",
      images: [
        "/images/FOTON/cateogries/ultralivianos/WONDER/ZTruck/INTERIOR/interior-Ztruck-1.jpg",
        "/images/FOTON/cateogries/ultralivianos/WONDER/ZTruck/INTERIOR/interior-Ztruck-2.png",
        "/images/FOTON/cateogries/ultralivianos/WONDER/ZTruck/INTERIOR/interior-Ztruck-3.png",
        "/images/FOTON/cateogries/ultralivianos/WONDER/ZTruck/INTERIOR/interior-Ztruck-4.png",
        "/images/FOTON/cateogries/ultralivianos/WONDER/ZTruck/INTERIOR/interior-Ztruck-5.png",
      ],
      headingLead: "Confort de",
      headingHighlight: "cabina",
      description:
        "El Ztruck ofrece en todas sus configuraciones un interior espacioso y confortable, con las mismas características de un auto. En su versión de doble cabina el espacio trasero es amplio y cómodo.",
      bullets: [
        "Interior espacioso y confortable",
        "Características de un auto",
        "Doble cabina amplia y cómoda",
      ],
    },
    {
      id: "exterior",
      label: "EXTERIOR",
      images: [
        "/images/FOTON/cateogries/ultralivianos/WONDER/ZTruck/EXTERIOR/exterior-Ztruck-1.jpeg",
        "/images/FOTON/cateogries/ultralivianos/WONDER/ZTruck/EXTERIOR/exterior-Ztruck-2.png",
        "/images/FOTON/cateogries/ultralivianos/WONDER/ZTruck/EXTERIOR/exterior-Ztruck-3.png",
        "/images/FOTON/cateogries/ultralivianos/WONDER/ZTruck/EXTERIOR/exterior-Ztruck-4.png",
        "/images/FOTON/cateogries/ultralivianos/WONDER/ZTruck/EXTERIOR/exterior-Ztruck-5.png",
      ],
      headingLead: "Diseño",
      headingHighlight: "funcional",
      description:
        "El Ztruck es un camión ultraliviano con un diseño moderno y atractivo que lo diferencia de otros vehículos en su categoría. Con gran capacidad de carga y variedad en sus configuraciones se convierte en el mejor aliado para el trabajo.",
      bullets: [
        "Diseño moderno y atractivo",
        "Gran capacidad de carga",
        "Variedad de configuraciones",
      ],
    },
  ],
  versions: [
    {
      id: "cabina-simple",
      nombre: "Cabina Simple",
      imagen:
        "/images/FOTON/cateogries/ultralivianos/WONDER/ZTruck/VERSIONES/ztruck cabina simple/ztruck cabina simple.png",
      pdf: "/images/FOTON/cateogries/ultralivianos/WONDER/ZTruck/VERSIONES/ztruck cabina simple/ztruck cabina simple.pdf",
    },
    {
      id: "cabina-doble",
      nombre: "Cabina Doble",
      imagen:
        "/images/FOTON/cateogries/ultralivianos/WONDER/ZTruck/VERSIONES/ztruck cabina doble/ztruck cabina doble.png",
      pdf: "/images/FOTON/cateogries/ultralivianos/WONDER/ZTruck/VERSIONES/ztruck cabina doble/ztruck cabina doble.pdf",
    },
  ],
  cta: {
    title: "¿Interesado en el FOTON Z-TRUCK?",
    description:
      "Contactanos para más información, cotizaciones y pruebas de manejo.",
    label: "Contactar Ahora",
    href: "/contacto",
  },
};

export default function ZtruckPage() {
  return <ModelTemplate data={data} />;
}
