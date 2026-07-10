"use client";

import { Truck, Mountain, Gauge } from "lucide-react";
import {
  CategoryTemplate,
  type CategoryData,
} from "@/components/cliente/foton/category-template";

const data: CategoryData = {
  chip: "Pick Ups",
  title: "Pick Ups FOTON",
  description:
    "Potencia, versatilidad y capacidad para trabajo y aventura. Las pick-ups FOTON combinan rendimiento off-road con tecnología avanzada.",
  heroImage:
    "/images/FOTON/cateogries/pickups/Foto-Cateogries-Foton-PickUps2.webp",
  stats: [
    { value: "2", label: "Modelos" },
    { value: "4x4", label: "Tracción" },
    { value: "161-175", label: "HP" },
  ],
  models: [
    {
      id: "tunland-g7",
      name: "TUNLAND G7",
      subtitle: "Potencia y capacidad de carga",
      description:
        "La Tunland G7 combina resistencia y durabilidad. Con motor diesel de 161 HP, transmisión ZF de 8 velocidades y tracción 4x4, es perfecta para trabajos pesados y aventuras off-road. Capacidad de carga de 1.000 kg.",
      image: "/images/FOTON/TUNDLAND.G7/FOTO-PARA-CARD/FOTO-CARD-TUNDLAND.webp",
      badge: "4X4 OFF-ROAD",
      specs: [
        { icon: Gauge, label: "161 HP" },
        { icon: Mountain, label: "4x4" },
        { icon: Truck, label: "1.000 kg" },
      ],
      href: "/foton/pick-ups/tunland-g7",
    },
    {
      id: "tunland-v9",
      name: "TUNLAND V9",
      subtitle: "Tecnología mild-hybrid",
      description:
        "La nueva V9 híbrida combina un motor diesel Aucan 2.0L con sistema mild-hybrid de 48V (175 HP), transmisión ZF de 8 marchas y tracción 4x4. Mayor eficiencia, menor consumo y amigable con el medio ambiente. Capacidad: 720 kg.",
      image: "/images/FOTON/TUNDLAND.V9/FOTOCARD/FotoCarfTunlandV9.jpeg",
      badge: "HÍBRIDA",
      specs: [
        { icon: Gauge, label: "175 HP" },
        { icon: Mountain, label: "4x4" },
        { icon: Truck, label: "720 kg" },
      ],
      href: "/foton/pick-ups/tunland-v9",
    },
  ],
  featuresLead: "¿Por qué elegir una",
  featuresHighlight: "Pick Up FOTON?",
  features: [
    {
      icon: Mountain,
      title: "Todo Terreno",
      description:
        "Tracción 4x4 y alta capacidad off-road para cualquier desafío",
    },
    {
      icon: Gauge,
      title: "Potencia",
      description: "Motores diesel de alto rendimiento y eficiencia",
    },
    {
      icon: Truck,
      title: "Carga",
      description: "Capacidad de hasta 1.000 kg para trabajos pesados",
    },
  ],
};

export default function PickUpsPage() {
  return <CategoryTemplate data={data} />;
}
