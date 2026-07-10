"use client";

import { Truck, Zap, Leaf, Settings, Gauge } from "lucide-react";
import {
  CategoryTemplate,
  type CategoryData,
} from "@/components/cliente/foton/category-template";

const data: CategoryData = {
  chip: "Eléctricos",
  title: "Eléctricos FOTON",
  description:
    "Movilidad sustentable para el futuro. Los vehículos eléctricos FOTON combinan tecnología de punta con cero emisiones.",
  heroImage:
    "/images/FOTON/cateogries/Electricos/Foto-Cateogries-Foton-Electricos1.jpg",
  stats: [
    { value: "1", label: "Modelo" },
    { value: "115 kW", label: "Potencia" },
    { value: "~200 km", label: "Autonomía" },
  ],
  models: [
    {
      id: "eaumark",
      name: "eAumark",
      subtitle: "Logística 100% eléctrica",
      description:
        "El eAumark L6 es el primer camión eléctrico urbano del país, formando parte del cambio de la logística hacia la neutralidad de emisiones. Alta tecnología, seguridad y eficiencia son los principales atributos de este gran camión",
      image:
        "/images/FOTON/cateogries/Electricos/EAUMARK/FOTOCARD/FOTOCARD-E AUMARK.jpg",
      badge: "100% ELÉCTRICO",
      specs: [
        { icon: Settings, label: "115 kW / 154 HP" },
        { icon: Truck, label: "6.000 kg" },
        { icon: Gauge, label: "~200 km autonomía" },
      ],
      href: "/foton/electricos/eaumark",
    },
  ],
  featuresLead: "¿Por qué elegir",
  featuresHighlight: "Eléctricos FOTON?",
  features: [
    {
      icon: Zap,
      title: "100% Eléctrico",
      description: "Tecnología de punta sin emisiones contaminantes",
    },
    {
      icon: Leaf,
      title: "Sustentable",
      description: "Contribuye al cuidado del medio ambiente",
    },
    {
      icon: Truck,
      title: "Eficiencia",
      description: "Menores costos operativos y mantenimiento reducido",
    },
  ],
};

export default function ElectricosPage() {
  return <CategoryTemplate data={data} />;
}
