"use client";

import { Users, Settings, Gauge, Truck } from "lucide-react";
import {
  ModelTemplate,
  type ModelData,
} from "@/components/cliente/foton/model-template";

const data: ModelData = {
  category: { label: "Pesados Ruta", href: "/foton/pesados-ruta" },
  backLabel: "Volver a Pesados Ruta",
  name: "Auman R",
  shareName: "FOTON AUMAN R",
  url: "/foton/pesados-ruta/auman-r",
  headline: "Máxima potencia para largas distancias",
  description:
    "La línea AUMAN R es un exitoso desarrollo con los estándares europeos más exigentes y fue logrado gracias a la estrecha alianza de FOTON y Daimler, dando como resultado un potente camión con altos estándares de eficiencia para aplicaciones de larga distancia.",
  heroImage: "/images/FOTON/cateogries/PesadosRuta/AUMAN R/HERO/HERO-AUMAN-R.webp",
  logo: { wordmark: "/images/FOTON/cateogries/PesadosRuta/AUMAN R/LOGO/LOGO-AUMAN-R.png", vehicle: "/images/FOTON/cateogries/PesadosRuta/AUMAN R/LOGO/LOGO-AUMAN R-AUTO.png" },
  heroSpecs: [
    {
      icon: Users,
      label: "Cabina",
      value: "Cabina EST-A, piso plano y techo alto. Doble litera. Volteo eléctrico",
    },
    {
      icon: Settings,
      label: "Motor",
      value:
        "Motor Cummins ISG12 y X13, con potencias desde 430 a 560 cv: performance, peso reducido, mínimos costos operativos",
    },
    {
      icon: Gauge,
      label: "Caja de cambios",
      value:
        "Transmisiones ZF TraXon AMT (automatizadas) de 12 marchas hacia adelante. Opción de retardador hidráulico",
    },
    { icon: Truck, label: "Capacidad de carga", value: "PBTC: de 45.000 a 75.000 kg" },
  ],
  consultarHref:
    "https://wa.me/5493424216850?text=Hola!%20Estoy%20interesado%20en%20el%20FOTON%20AUMAN%20R.%20Me%20gustaría%20recibir%20más%20información.",
  galleries: [
    {
      id: "interior",
      label: "INTERIOR",
      images: [
        "/images/FOTON/cateogries/PesadosRuta/AUMAN R/INTERIOR/INTERIOR-AUMAN R-1.png",
        "/images/FOTON/cateogries/PesadosRuta/AUMAN R/INTERIOR/INTERIOR-AUMAN R-2.webp",
        "/images/FOTON/cateogries/PesadosRuta/AUMAN R/INTERIOR/INTERIOR-AUMAN R-3.webp",
        "/images/FOTON/cateogries/PesadosRuta/AUMAN R/INTERIOR/INTERIOR-AUMAN R-4.webp",
        "/images/FOTON/cateogries/PesadosRuta/AUMAN R/INTERIOR/INTERIOR-AUMAN R-5.jpg",
      ],
      headingLead: "Confort de",
      headingHighlight: "cabina",
      description:
        "Los camiones Foton Auman R son 100% tecnología y confort, cuentan con asiento con suspensión neumática ajustable y memoria que se adaptan perfectamente a las distintas necesidades de los conductores. Cómoda posición de manejo que reduce la fatiga, interior moderno y de alta calidad con equipamiento completo.",
    },
    {
      id: "exterior",
      label: "EXTERIOR",
      images: [
        "/images/FOTON/cateogries/PesadosRuta/AUMAN R/EXTERIOR/EXTERIOR-AUMAN R-1.jpg",
        "/images/FOTON/cateogries/PesadosRuta/AUMAN R/EXTERIOR/EXTERIOR-AUMAN R-2.jpg",
        "/images/FOTON/cateogries/PesadosRuta/AUMAN R/EXTERIOR/EXTERIOR-AUMAN R-3.jpg",
        "/images/FOTON/cateogries/PesadosRuta/AUMAN R/EXTERIOR/EXTERIOR-AUMAN R-4.jpg",
        "/images/FOTON/cateogries/PesadosRuta/AUMAN R/EXTERIOR/EXTERIOR-AUMAN R-5.jpg",
      ],
      headingLead: "Diseño y configuración para",
      headingHighlight: "máximo rendimiento",
      description:
        "Tren motriz eficiente, baja tara y componentes de primera calidad aseguran un rendimiento excepcional. Los Camiones Auman R cuentan con un exterior moderno, sistemas de seguridad avanzados y un interior confortable para los trabajos de larga distancia.",
    },
  ],
  components: [
    {
      label: "Motor",
      image: "/images/FOTON/cateogries/PesadosRuta/AUMAN R/COMPONENTES/MOTOR-AUMAN R-.png",
    },
    {
      label: "Caja de cambios",
      image:
        "/images/FOTON/cateogries/PesadosRuta/AUMAN R/COMPONENTES/CAJA CAMBIOS-AUMAN R-.png",
    },
  ],
  versions: [
    {
      id: "1843",
      nombre: "AUMAN R 1843",
      imagen: "/images/FOTON/cateogries/PesadosRuta/AUMAN R/VERSIONES/1843/1843.png",
      pdf: "/images/FOTON/cateogries/PesadosRuta/AUMAN R/VERSIONES/1843/1843.pdf",
    },
    {
      id: "2556",
      nombre: "AUMAN R 2556",
      imagen: "/images/FOTON/cateogries/PesadosRuta/AUMAN R/VERSIONES/2556/2556.png",
      pdf: "/images/FOTON/cateogries/PesadosRuta/AUMAN R/VERSIONES/2556/2556.pdf",
    },
    {
      id: "2656",
      nombre: "AUMAN R 2656",
      imagen: "/images/FOTON/cateogries/PesadosRuta/AUMAN R/VERSIONES/2656/2656.png",
      pdf: "/images/FOTON/cateogries/PesadosRuta/AUMAN R/VERSIONES/2656/2656.pdf",
    },
  ],
  cta: {
    title: "¿Interesado en el FOTON AUMAN R?",
    description: "Contactanos para más información, cotizaciones y pruebas de manejo.",
    label: "Contactar Ahora",
    href: "/contacto",
  },
};

export default function AumanRPage() {
  return <ModelTemplate data={data} />;
}
