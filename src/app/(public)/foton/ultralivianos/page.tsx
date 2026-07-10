"use client";

import { Truck, Package, Zap } from "lucide-react";
import {
  CategoryTemplate,
  type CategoryData,
} from "@/components/cliente/foton/category-template";

const data: CategoryData = {
  chip: "Ultralivianos",
  title: "Ultralivianos FOTON",
  description:
    "Eficiencia urbana y capacidad de carga óptima. Soluciones comerciales para la última milla y distribución en ciudad.",
  heroImage:
    "/images/FOTON/cateogries/ultralivianos/Foto-Cateogries-Foton-Ultralivianos2.jpg",
  stats: [
    { value: "3", label: "Modelos" },
    { value: "Urbano", label: "Aplicación" },
    { value: "Eficiente", label: "Consumo" },
  ],
  models: [
    {
      id: "tm",
      name: "TM",
      subtitle: "Versatilidad para tu negocio",
      description:
        "El TM es el vehículo comercial ideal para los trabajos en ciudad. Baja tara que permite maximizar la carga, radio de giro mínimo, confort y distintas opciones de configuración permiten encontrar el vehículo ideal para cada aplicación de última milla.",
      image: "/images/FOTON/TM/hero/tm1hero -grande.png",
      badge: "URBANO",
      specs: [
        { icon: Zap, label: "Eficiente" },
        { icon: Package, label: "Alta Carga" },
        { icon: Truck, label: "Urbano" },
      ],
      href: "/foton/ultralivianos/tm",
    },
    {
      id: "wonder",
      name: "WONDER",
      subtitle: "Habla de vos",
      description:
        "El Foton Wonder es un camión ultraliviano que combina fuerza, eficiencia y versatilidad, ideal para los desafíos de la ciudad. Su diseño italiano, colores innovadores y versatilidad incomparable lo convierten en una herramienta clave para potenciar tu negocio.",
      image:
        "/images/FOTON/cateogries/ultralivianos/WONDER/FOTOCARD/FOTON CARD-WONDER.webp",
      badge: "URBANO",
      specs: [
        { icon: Zap, label: "120 HP" },
        { icon: Truck, label: "Urbano" },
        { icon: Package, label: "Eficiente" },
      ],
      href: "/foton/ultralivianos/wonder",
    },
    {
      id: "ztruck",
      name: "Z-Truck",
      subtitle: "Siempre llegás a tiempo",
      description:
        "El Z-Truck de Zanella destaca como el compañero perfecto para labores urbanas. Su ligereza optimiza la carga, su maniobrabilidad es insuperable, ofrece comodidad y diversas configuraciones para adaptarse a cada necesidad.",
      image:
        "/images/FOTON/cateogries/ultralivianos/WONDER/ZTruck/FOTOCARD/FOTOCARD-ZTRUCK.jpeg",
      badge: "URBANO",
      specs: [
        { icon: Truck, label: "690 kg" },
        { icon: Zap, label: "Urbano" },
        { icon: Package, label: "Compacto" },
      ],
      href: "/foton/ultralivianos/ztruck",
    },
  ],
  comingSoon: {
    title: "Más modelos próximamente",
    text: "Estamos trabajando para traerte más opciones en la categoría de ultralivianos",
  },
  featuresLead: "¿Por qué elegir un",
  featuresHighlight: "Ultraliviano FOTON?",
  features: [
    {
      icon: Package,
      title: "Alta Capacidad",
      description: "Baja tara para maximizar la carga útil en tus operaciones",
    },
    {
      icon: Zap,
      title: "Eficiencia",
      description: "Consumo optimizado para reducir costos operativos",
    },
    {
      icon: Truck,
      title: "Versatilidad",
      description: "Múltiples configuraciones para cada tipo de negocio",
    },
  ],
};

export default function UltralivianosPage() {
  return <CategoryTemplate data={data} />;
}
