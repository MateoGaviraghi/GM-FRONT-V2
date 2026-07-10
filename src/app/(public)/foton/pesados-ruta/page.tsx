"use client";

import { Truck, Mountain, Gauge } from "lucide-react";
import {
  CategoryTemplate,
  type CategoryData,
} from "@/components/cliente/foton/category-template";

const data: CategoryData = {
  chip: "Pesados Ruta",
  title: "Pesados Ruta FOTON",
  description:
    "Potencia y confiabilidad para largas distancias. Los vehículos pesados de ruta FOTON están diseñados para el máximo rendimiento.",
  heroImage:
    "/images/FOTON/cateogries/PesadosRuta/Foto-Cateogries-Foton-PesadosRuta2.webp",
  stats: [
    { value: "2", label: "Modelos" },
    { value: "430-560", label: "CV" },
    { value: "Ruta", label: "Aplicación" },
  ],
  models: [
    {
      id: "nuevo-auman-r",
      name: "NUEVO AUMAN R",
      subtitle: "Tecnología y eficiencia de ruta",
      description:
        "La nueva línea AUMAN R representa un avance excepcional, cumpliendo con los más altos estándares europeos. Fruto de la alianza entre FOTON y Daimler, este camión destaca por su eficiencia en largas distancias. Motor Cummins ISGe5 de 430-460 HP, caja ZF TraXon AMT de 12 marchas.",
      image:
        "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/FOTOCARD/FOTOCARD-AUMAN R-.jpg",
      badge: "ALTA TECNOLOGÍA",
      specs: [
        { icon: Gauge, label: "430-460 HP" },
        { icon: Truck, label: "55.000 kg" },
        { icon: Mountain, label: "6x2" },
      ],
      href: "/foton/pesados-ruta/nuevo-auman-r",
    },
    {
      id: "auman-r",
      name: "AUMAN R",
      subtitle: "Máxima potencia para largas distancias",
      description:
        "La línea AUMAN R es un exitoso desarrollo con los estándares europeos más exigentes. Fruto de la alianza entre FOTON y Daimler, este potente camión cuenta con altos estándares de eficiencia. Motor Cummins ISG12 y X13 de 430 a 560 CV, caja ZF TraXon AMT de 12 marchas.",
      image:
        "/images/FOTON/cateogries/PesadosRuta/AUMAN R/FOTOCARD/FOTO-CARD-AUMAN R.jpg",
      badge: "MÁXIMA POTENCIA",
      specs: [
        { icon: Gauge, label: "430-560 CV" },
        { icon: Truck, label: "45.000-75.000 kg" },
        { icon: Mountain, label: "Larga distancia" },
      ],
      href: "/foton/pesados-ruta/auman-r",
    },
  ],
  featuresLead: "¿Por qué elegir",
  featuresHighlight: "Pesados Ruta FOTON?",
  features: [
    {
      icon: Gauge,
      title: "Alta Potencia",
      description: "Motores Cummins de hasta 460 CV para máximo rendimiento",
    },
    {
      icon: Truck,
      title: "Gran Capacidad",
      description:
        "Diseñados para transportar grandes cargas en largas distancias",
    },
    {
      icon: Mountain,
      title: "Confort",
      description: "Cabinas espaciosas para viajes de larga duración",
    },
  ],
};

export default function PesadosRutaPage() {
  return <CategoryTemplate data={data} />;
}
