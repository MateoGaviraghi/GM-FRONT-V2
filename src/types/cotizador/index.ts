// ============================================
// TIPOS PARA EL COTIZADOR
// ============================================

export interface ProductType {
  [typeName: string]: number; // nombre del tipo -> precio USD
}

export interface Product {
  id: number;
  name: string;
  image: string;
  costCategory: number; // 1-4 para mapear a fixedCosts
  provider: "LTA" | "DIRECTA";
  types: ProductType;
}

export interface QuoterConfig {
  PRENDARIO_TNA: number;
  PRENDARIO_TERM: number;
  LEASING_TNA: number;
  LEASING_TERM: number;
  LEASING_PERCENT: number;
}

export interface BreakdownRow {
  mes: number;
  capital: number;
  interes: number;
  iva: number;
  cuota: number;
  saldo: number;
}

export interface PrendarioCalculation {
  totalUSD: number;
  totalARS: number;
  montoFinanciar: number;
  rateAnnual: number;
  months: number;
  pureQuota: number;
  breakdown: BreakdownRow[];
}

export interface LeasingCalculation {
  totalUSD: number;
  totalARS: number;
  valorNeto: number;
  montoFinanciar: number;
  percentToFinance: number;
  rateAnnual: number;
  months: number;
  breakdown: BreakdownRow[];
  totalEntrada: number;
  desgloseEntrada: {
    canon: number;
    comision: number;
    pat: number;
  };
  montoOpcionCompra: number;
  pureQuota: number;
}

export interface CotizacionState {
  selectedProvider: "LTA" | "DIRECTA" | null;
  selectedProduct: Product | null;
  selectedType: {
    name: string;
    price: number;
  } | null;
  dollarRate: number;
  selectedFinancingProduct: "Prendario" | "Leasing" | null;
}
