"use client";

import { Truck, Package, Zap } from "lucide-react";
import {
  CategoryTemplate,
  type CategoryData,
} from "@/components/cliente/foton/category-template";

const data: CategoryData = {
  chip: "Medianos",
  title: "Medianos FOTON",
  description:
    "Potencia y capacidad de carga para operaciones logísticas de alto rendimiento. La mejor opción para transporte de cargas medianas con máxima eficiencia.",
  heroImage: "/images/FOTON/cateogries/medianos/AUMAN D/HERO/HERO-AUMAN D.jpg",
  stats: [
    { value: "1", label: "Modelo" },
    { value: "Premium", label: "Calidad" },
    { value: "Eficiente", label: "Consumo" },
  ],
  models: [
    {
      id: "auman-d",
      name: "AUMAN D",
      subtitle: "Potencia y eficiencia para cargas medianas",
      description:
        "El AUMAN D es un camión de carga mediana diseñado para brindar potencia, durabilidad y eficiencia en el transporte de mercancías. Equipado con motor Cummins, transmisión Fast y tecnología de última generación, es ideal para operaciones de logística y distribución.",
      image:
        "/images/FOTON/cateogries/medianos/AUMAN D/FOTOCARD/FOTOCARD-AUMAN D.webp",
      badge: "PREMIUM",
      specs: [
        { icon: Zap, label: "Cummins" },
        { icon: Truck, label: "16,000 kg" },
        { icon: Package, label: "2 Versiones" },
      ],
      href: "/foton/medianos/auman-d",
    },
  ],
  featuresLead: "¿Por qué elegir",
  featuresHighlight: "FOTON Medianos?",
  featuresIntro:
    "Los camiones medianos FOTON ofrecen la combinación perfecta de potencia, capacidad de carga y eficiencia operativa para tu negocio.",
  features: [
    {
      icon: Zap,
      title: "Motor Cummins",
      description:
        "Potencia y durabilidad garantizada con motores de clase mundial.",
    },
    {
      icon: Truck,
      title: "Alta Capacidad",
      description:
        "Diseñados para transportar cargas de hasta 16,000 kg con seguridad.",
    },
    {
      icon: Package,
      title: "Eficiencia",
      description: "Bajo consumo de combustible y costos operativos reducidos.",
    },
  ],
};

export default function MedianosPage() {
  return <CategoryTemplate data={data} />;
}
