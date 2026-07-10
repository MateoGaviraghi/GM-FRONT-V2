"use client";

import { Truck, Package, Zap } from "lucide-react";
import {
  CategoryTemplate,
  type CategoryData,
} from "@/components/cliente/foton/category-template";

const data: CategoryData = {
  chip: "Livianos",
  title: "Livianos FOTON",
  description:
    "Rendimiento superior y tecnología de vanguardia. La solución ideal para transporte urbano y logística de corta distancia.",
  heroImage:
    "/images/FOTON/cateogries/livianos/NUEVO AUMARK/HERO/hero-NuevoAumark.jpg",
  stats: [
    { value: "2", label: "Modelos" },
    { value: "Premium", label: "Calidad" },
    { value: "Eficiente", label: "Consumo" },
  ],
  models: [
    {
      id: "aumark",
      name: "AUMARK",
      subtitle: "El camión liviano más vendido del mundo",
      description:
        "Diseñado para la logística de corta distancia, es parte de la última evolución del camión liviano más vendido del mundo. Se caracteriza por su moderno diseño, alta calidad y tren motriz eficiente con motor Cummins, transmisión ZF, electrónica Bosch y frenos a disco en todas sus ruedas.",
      image:
        "/images/FOTON/cateogries/livianos/AUMARK/FOTOCARD/FOTOCARD-AUMARK.jpg",
      badge: "PREMIUM",
      specs: [
        { icon: Zap, label: "Cummins" },
        { icon: Truck, label: "6,000 kg" },
        { icon: Package, label: "2 Versiones" },
      ],
      href: "/foton/livianos/aumark",
    },
    {
      id: "nuevo-aumark-615",
      name: "Nuevo Aumark 615",
      subtitle: "El futuro del transporte urbano",
      description:
        "El Nuevo Aumark 615 representa la evolución del camión liviano. Con motor Cummins de última generación, transmisión ZF y un diseño moderno, es la solución perfecta para logística urbana y distribución eficiente.",
      image:
        "/images/FOTON/cateogries/livianos/NUEVO AUMARK/FOTOCARD/FOTOCARD-NuevoAumark.jpg",
      badge: "NUEVO",
      specs: [
        { icon: Zap, label: "Cummins" },
        { icon: Truck, label: "Eficiente" },
        { icon: Package, label: "Moderno" },
      ],
      href: "/foton/livianos/nuevo-aumark-615",
    },
  ],
  cta: {
    title: "¿Necesitás más información?",
    description:
      "Nuestro equipo está listo para ayudarte a encontrar el vehículo ideal para tu negocio.",
    label: "Contactar por WhatsApp",
    href: "https://wa.me/5493424216850?text=Hola!%20Estoy%20interesado%20en%20los%20veh%C3%ADculos%20livianos%20FOTON.%20Me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n.",
    external: true,
  },
};

export default function LivianosPage() {
  return <CategoryTemplate data={data} />;
}
