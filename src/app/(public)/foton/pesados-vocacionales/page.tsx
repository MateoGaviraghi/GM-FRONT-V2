"use client";

import { Truck, Package, Zap } from "lucide-react";
import {
  CategoryTemplate,
  type CategoryData,
} from "@/components/cliente/foton/category-template";

const data: CategoryData = {
  chip: "Pesados Vocacionales",
  title: "Pesados Vocacionales FOTON",
  description:
    "Soluciones robustas para trabajos severos. Construcción, minería y aplicaciones de alta exigencia.",
  heroImage:
    "/images/FOTON/cateogries/PesadosVocacionales/Foto-Cateogries-Foton-PesadosVocacionales2.webp",
  stats: [
    { value: "1", label: "Modelo" },
    { value: "Pesado", label: "Categoría" },
    { value: "Robusto", label: "Durabilidad" },
  ],
  models: [
    {
      id: "auman-c",
      name: "AUMAN C",
      subtitle: "Para altas exigencias",
      description:
        "La línea AUMAN C es ideal para los trabajos más severos de Construcción y Minería, donde la robustez, disponibilidad y eficiencia son claves para la actividad.",
      image:
        "/images/FOTON/cateogries/PesadosVocacionales/AUMAN C/FOTOCARD/FOTOCARD-AUMAN C.jpg",
      badge: "CONSTRUCCIÓN",
      specs: [
        { icon: Zap, label: "400-460 CV" },
        { icon: Package, label: "35-50 Ton" },
        { icon: Truck, label: "Pesado" },
      ],
      href: "/foton/pesados-vocacionales/auman-c",
    },
  ],
  comingSoon: {
    title: "Más modelos próximamente",
    text: "Estamos trabajando para traerte más opciones en la categoría de pesados vocacionales",
  },
  featuresLead: "¿Por qué elegir un",
  featuresHighlight: "Pesado Vocacional FOTON?",
  features: [
    {
      icon: Package,
      title: "Alta Capacidad",
      description: "Capacidad de 35 a 50 toneladas para trabajos exigentes",
    },
    {
      icon: Zap,
      title: "Potencia Cummins",
      description: "Motores de 400 a 460 CV para máximo rendimiento",
    },
    {
      icon: Truck,
      title: "Durabilidad",
      description: "Diseñado para construcción, minería y trabajos severos",
    },
  ],
  cta: {
    title: "¿Necesitas un camión para trabajos pesados?",
    description:
      "Los camiones pesados vocacionales FOTON están diseñados para las condiciones más exigentes. Contáctanos para encontrar la solución perfecta para tu operación.",
    label: "Contactar Ahora",
    href: "/contacto",
  },
};

export default function PesadosVocacionalesPage() {
  return <CategoryTemplate data={data} />;
}
