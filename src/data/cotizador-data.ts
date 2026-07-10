import { Product, QuoterConfig } from "@/types/cotizador";

// ============================================
// CONFIGURACIÓN POR DEFECTO
// ============================================
export const QUOTER_CONFIG: QuoterConfig = {
  PRENDARIO_TNA: 40,
  PRENDARIO_TERM: 24,
  LEASING_TNA: 42,
  LEASING_TERM: 36,
  LEASING_PERCENT: 1.0,
};

// ============================================
// TASAS DE IVA
// ============================================
export const VAT_INTEREST = 0.21; // IVA sobre intereses (21%)
export const VAT_VEHICLE = 0.105; // IVA sobre utilitarios (10.5%)

// ============================================
// COSTOS FIJOS (Flete + Formularios) - USD
// ============================================
export const FIXED_COSTS: Record<number, number> = {
  1: 690, // USD - ZT, TM, TUNDLAND
  2: 900, // USD - AUMARK
  3: 1175, // USD - AUMAN D
  4: 1520, // USD - AUMAN R
};

// ============================================
// PRODUCTOS
// ============================================
export const PRODUCTS: Product[] = [
  // ========== FACTURACIÓN LTA ==========
  {
    id: 1,
    name: "Z-TRUCK NACIONAL",
    image: "/images/FOTON/ztruck.png",
    costCategory: 1,
    provider: "LTA",
    types: {
      "C. SIMPLE": 19997,
      "C. DOBLE": 22960,
    },
  },
  {
    id: 2,
    name: "TM1 NACIONAL",
    image: "/images/FOTON/tm1.png",
    costCategory: 1,
    provider: "LTA",
    types: {
      "C. SIMPLE": 25700,
      "C. DOBLE": 26750,
    },
  },
  {
    id: 3,
    name: "TM1 IMPORTADO",
    image: "/images/FOTON/tm1.png",
    costCategory: 1,
    provider: "LTA",
    types: {
      "BOX CARGO": 30650,
      "BOX REFRIGERADO": 38650,
    },
  },
  {
    id: 4,
    name: "TM 2",
    image: "/images/FOTON/tm1.png",
    costCategory: 1,
    provider: "LTA",
    types: {
      "C. SIMPLE": 28485,
      "C. DOBLE": 29810,
    },
  },
  {
    id: 5,
    name: "TUNDLAND G7 AT",
    image: "/images/FOTON/g7.png",
    costCategory: 1,
    provider: "LTA",
    types: {
      "4X4": 37900,
    },
  },
  {
    id: 6,
    name: "TUNDLAND V9 AT",
    image: "/images/FOTON/v9.png",
    costCategory: 1,
    provider: "LTA",
    types: {
      "4X4": 52800,
    },
  },
  {
    id: 7,
    name: "WONDER",
    image: "/images/FOTON/wonder.png",
    costCategory: 1,
    provider: "LTA",
    types: {
      "C. SIMPLE": 26750,
      "C. DOBLE": 28100,
      "CS BOX": 32050,
    },
  },
  {
    id: 8,
    name: "AUMARK 615",
    image: "/images/FOTON/aumark.png",
    costCategory: 2,
    provider: "LTA",
    types: {
      "CHASIS NACIONAL": 49900,
      FLATBED: 53500,
    },
  },
  {
    id: 9,
    name: "AUMARK 916",
    image: "/images/FOTON/aumark.png",
    costCategory: 2,
    provider: "LTA",
    types: {
      "CHASIS NACIONAL": 56420,
      FLATBED: 58780,
    },
  },
  {
    id: 10,
    name: "AUMARK 1016",
    image: "/images/FOTON/aumark.png",
    costCategory: 2,
    provider: "LTA",
    types: {
      "CHASIS NACIONAL": 65030,
    },
  },
  {
    id: 11,
    name: "E-AUMARK",
    image: "/images/FOTON/eaumark.webp",
    costCategory: 2,
    provider: "LTA",
    types: {
      ESTÁNDAR: 63420,
    },
  },
  {
    id: 12,
    name: "AUMAN 615",
    image: "/images/FOTON/auman-c.png",
    costCategory: 3,
    provider: "LTA",
    types: {
      CHASIS: 80350,
    },
  },
  {
    id: 13,
    name: "AUMAN D 2027",
    image: "/images/FOTON/auman-d.png",
    costCategory: 3,
    provider: "LTA",
    types: {
      CHASIS: 91750,
      TRACTOR: 96550,
    },
  },

  // ========== FACTURACIÓN DIRECTA ==========
  {
    id: 14,
    name: "AUMAN D 1621",
    image: "/images/FOTON/auman-d.png",
    costCategory: 3,
    provider: "DIRECTA",
    types: {
      CHASIS: 69500,
    },
  },
  {
    id: 15,
    name: "AUMAN D 2027 (#)",
    image: "/images/FOTON/auman-d.png",
    costCategory: 3,
    provider: "DIRECTA",
    types: {
      CHASIS: 78500,
      TRACTOR: 84000,
    },
  },
  {
    id: 16,
    name: "AUMAN R 1843",
    image: "/images/FOTON/auman-r.png",
    costCategory: 4,
    provider: "DIRECTA",
    types: {
      "TRACTOR 4X2": 128500,
    },
  },
  {
    id: 17,
    name: "AUMAN R 2443 TA",
    image: "/images/FOTON/nuevo-auman-r.png",
    costCategory: 4,
    provider: "DIRECTA",
    types: {
      "TRACTOR 6X2 TA": 138600,
    },
  },
  {
    id: 18,
    name: "AUMAN R 2443 TB",
    image: "/images/FOTON/nuevo-auman-r.png",
    costCategory: 4,
    provider: "DIRECTA",
    types: {
      "TRACTOR 6X2 TB": 133500,
    },
  },
  {
    id: 19,
    name: "AUMAN R 2546",
    image: "/images/FOTON/nuevo-auman-r.png",
    costCategory: 4,
    provider: "DIRECTA",
    types: {
      "TRACTOR 6X2 T": 141900,
    },
  },
  {
    id: 20,
    name: "AUMAN C 4440",
    image: "/images/FOTON/auman-c.png",
    costCategory: 4,
    provider: "DIRECTA",
    types: {
      "MIXER 8X4": 192000,
    },
  },
  {
    id: 21,
    name: "AUMAN C 3535",
    image: "/images/FOTON/auman-c.png",
    costCategory: 4,
    provider: "DIRECTA",
    types: {
      "MIXER 6X4": 162000,
    },
  },
  {
    id: 22,
    name: "AUMAN C 5046",
    image: "/images/FOTON/auman-c.png",
    costCategory: 4,
    provider: "DIRECTA",
    types: {
      "VOLCADOR 8X4": 206500,
    },
  },
  {
    id: 23,
    name: "AUMAN C 4146",
    image: "/images/FOTON/auman-c.png",
    costCategory: 4,
    provider: "DIRECTA",
    types: {
      "VOLCADOR 6X4": 188500,
    },
  },
  {
    id: 24,
    name: "AUMAN R 2556",
    image: "/images/FOTON/auman-r.png",
    costCategory: 4,
    provider: "DIRECTA",
    types: {
      "TRACTOR 6X4": 166500,
    },
  },
  {
    id: 25,
    name: "AUMAN R 2656",
    image: "/images/FOTON/nuevo-auman-r.png",
    costCategory: 4,
    provider: "DIRECTA",
    types: {
      "TRACTOR 6X4 BITREN": 168900,
    },
  },
];
