import {
  BreakdownRow,
  PrendarioCalculation,
  LeasingCalculation,
  Product,
} from "@/types/cotizador";
import {
  QUOTER_CONFIG,
  VAT_INTEREST,
  VAT_VEHICLE,
  FIXED_COSTS,
} from "@/data/cotizador-data";

/**
 * Calcula la cotización para un producto financiero PRENDARIO
 * Utiliza el sistema francés de amortización con IVA decreciente sobre intereses
 */
export function calculatePrendario(
  selectedProduct: Product,
  selectedType: { name: string; price: number },
  dollarRate: number,
): PrendarioCalculation {
  const rateAnnual = QUOTER_CONFIG.PRENDARIO_TNA;
  const months = QUOTER_CONFIG.PRENDARIO_TERM;

  // 1. Determinar valores base
  const fixedCostUSD = FIXED_COSTS[selectedProduct.costCategory];
  const totalUSD = selectedType.price + fixedCostUSD;
  const totalARS = totalUSD * dollarRate; // Precio Final con IVA

  const montoFinanciar = totalARS;

  // 2. Tasa Mensual
  const i = rateAnnual / 100 / 12;

  // 3. Cuota Pura (Sistema Francés)
  const pureQuota = (montoFinanciar * i) / (1 - Math.pow(1 + i, -months));

  // 4. Iterar para obtener el desglose completo
  let saldo = montoFinanciar;
  const breakdown: BreakdownRow[] = [];

  for (let mes = 1; mes <= months; mes++) {
    const interes = saldo * i;
    const amortización = pureQuota - interes;
    const ivaInteres = interes * VAT_INTEREST;
    const cuotaFinal = pureQuota + ivaInteres;

    breakdown.push({
      mes,
      capital: amortización,
      interes: interes,
      iva: ivaInteres,
      cuota: cuotaFinal,
      saldo: saldo - amortización,
    });

    saldo -= amortización;
  }

  return {
    totalUSD,
    totalARS,
    montoFinanciar,
    rateAnnual,
    months,
    pureQuota,
    breakdown,
  };
}

/**
 * Calcula la cotización para un producto financiero LEASING
 * Incluye gastos iniciales, cánones mensuales y opción de compra
 */
export function calculateLeasing(
  selectedProduct: Product,
  selectedType: { name: string; price: number },
  dollarRate: number,
): LeasingCalculation {
  const rateAnnual = QUOTER_CONFIG.LEASING_TNA;
  const months = QUOTER_CONFIG.LEASING_TERM;
  const percentToFinance = QUOTER_CONFIG.LEASING_PERCENT;

  // 1. Valores del Vehículo
  const fixedCostUSD = FIXED_COSTS[selectedProduct.costCategory];
  const totalUSD = selectedType.price + fixedCostUSD;
  const totalARS = totalUSD * dollarRate;

  // Valor Neto (Sin IVA) - Usamos 10.5% para utilitarios
  const valorNeto = totalARS / (1 + VAT_VEHICLE);

  // Monto sobre el cual se calcula el canon (Neto * Porcentaje)
  const montoFinanciar = valorNeto * percentToFinance;

  // 2. Tasa Mensual
  const i = rateAnnual / 100 / 12;

  // 3. Cálculo de Entrada (Lo que pone el cliente para retirar)
  const canonInicialPct = 0.15; // 15%
  const comisionPct = 0.025; // 2.5%
  const patentamientoPct = 0.06; // 6%

  const montoCanonInicial = valorNeto * canonInicialPct;
  const montoComision = valorNeto * comisionPct;
  const montoPatentamiento = valorNeto * patentamientoPct;

  const totalEntrada = montoCanonInicial + montoComision + montoPatentamiento;

  // 4. Cálculo de Cánones (Cuotas Mensuales) - Sistema Francés con IVA
  const canonPuro = (montoFinanciar * i) / (1 - Math.pow(1 + i, -months));

  // Iteramos para hallar el desglose completo
  let saldo = montoFinanciar;
  const breakdown: BreakdownRow[] = [];

  for (let mes = 1; mes <= months; mes++) {
    const interes = saldo * i;
    const amortizacion = canonPuro - interes;
    const ivaInteres = interes * VAT_INTEREST; // IVA 21% sobre intereses
    const canonFinal = canonPuro + ivaInteres;

    breakdown.push({
      mes,
      capital: amortizacion,
      interes: interes,
      iva: ivaInteres,
      cuota: canonFinal,
      saldo: saldo - amortizacion,
    });

    saldo -= amortizacion;
  }

  // 5. Opción de Compra (Salida)
  const opcionCompraPct = 0.04; // 4%
  const montoOpcionCompra = valorNeto * opcionCompraPct;

  return {
    totalUSD,
    totalARS,
    valorNeto,
    montoFinanciar,
    percentToFinance,
    rateAnnual,
    months,
    breakdown,
    totalEntrada,
    desgloseEntrada: {
      canon: montoCanonInicial,
      comision: montoComision,
      pat: montoPatentamiento,
    },
    montoOpcionCompra,
    pureQuota: canonPuro,
  };
}

/**
 * Formatea un número como moneda argentina
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString("es-AR", { maximumFractionDigits: 0 });
}
