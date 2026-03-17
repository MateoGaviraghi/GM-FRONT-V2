"use client";

import { LeasingCalculation, Product } from "@/types/cotizador";
import { formatCurrency } from "@/lib/cotizador-calculations";

interface LeasingResultProps {
  data: LeasingCalculation;
  selectedProduct: Product;
  selectedType: { name: string; price: number };
}

export function LeasingResult({
  data,
  selectedProduct,
  selectedType,
}: LeasingResultProps) {
  const firstCanon = data.breakdown[0].cuota;
  const lastCanon = data.breakdown[data.breakdown.length - 1].cuota;

  return (
    <div className="font-body bg-white text-gray-900 text-sm leading-relaxed w-full p-5">
      <div className="border-b-2 border-slate-900 mb-5 pb-2.5">
        <h2 className="text-slate-900 font-heading uppercase text-xl font-bold">
          Cotización Leasing
        </h2>
        <p className="text-lg font-semibold">
          Vehículo: {selectedProduct.name} - {selectedType.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-slate-900">
          <p className="text-sm text-slate-500">Valor Unidad (c/IVA):</p>
          <p className="text-xl font-bold text-slate-900">
            ${formatCurrency(data.totalARS)}
          </p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-red-600">
          <p className="text-sm text-slate-500">Valor Neto (Sin IVA):</p>
          <p className="text-xl font-bold text-red-600">
            ${formatCurrency(data.valorNeto)}
          </p>
        </div>
      </div>

      <div className="bg-slate-100 p-5 rounded-xl mb-5">
        <h4 className="text-slate-900 mb-4 font-heading uppercase text-sm border-b border-slate-300 pb-2">
          1. PARA RETIRAR (GASTOS INICIALES)
        </h4>
        <table className="w-full text-sm bg-transparent">
          <tbody>
            <tr className="bg-transparent">
              <td className="py-1 border-none text-slate-700">
                Canon Inicial (15%):
              </td>
              <td className="text-right py-1 border-none font-semibold">
                ${formatCurrency(data.desgloseEntrada.canon)}
              </td>
            </tr>
            <tr className="bg-transparent">
              <td className="py-1 border-none text-slate-700">
                Comisión (2.5%):
              </td>
              <td className="text-right py-1 border-none font-semibold">
                ${formatCurrency(data.desgloseEntrada.comision)}
              </td>
            </tr>
            <tr className="bg-transparent">
              <td className="py-1 border-none text-slate-700">
                Patentamiento (6% Est):
              </td>
              <td className="text-right py-1 border-none font-semibold">
                ${formatCurrency(data.desgloseEntrada.pat)}
              </td>
            </tr>
            <tr className="bg-transparent border-t-2 border-slate-900">
              <td className="pt-2.5 border-none font-bold text-slate-900">
                TOTAL INICIAL:
              </td>
              <td className="text-right pt-2.5 border-none text-red-600 text-xl font-extrabold">
                ${formatCurrency(data.totalEntrada)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-5 rounded-xl mb-5 shadow-md">
        <h4 className="mb-4 border-b border-slate-700 pb-2.5 font-heading uppercase text-sm">
          2. PLAN DE CÁNONES ({data.months} MESES)
        </h4>
        <table className="w-full text-white border-collapse bg-transparent">
          <tbody>
            <tr className="bg-transparent">
              <td className="py-1 border-none">
                <strong>Porcentaje Financiado:</strong>
              </td>
              <td className="text-right border-none">
                {data.percentToFinance * 100}%
              </td>
            </tr>
            <tr className="bg-transparent">
              <td className="py-1 border-none">
                <strong>TNA Aplicada:</strong>
              </td>
              <td className="text-right border-none">{data.rateAnnual}%</td>
            </tr>
            <tr className="border-t border-slate-700 bg-transparent">
              <td className="pt-4 pb-1 border-none">
                <span className="bg-white/10 px-2 py-1 rounded">
                  1º Canon (Máximo):
                </span>
              </td>
              <td className="text-right pt-4 pb-1 text-2xl text-red-400 font-extrabold border-none">
                ${formatCurrency(firstCanon)}
              </td>
            </tr>
            <tr className="bg-transparent">
              <td className="py-1 pb-4 border-none">
                <span className="bg-white/10 px-2 py-1 rounded">
                  Último Canon (Min):
                </span>
              </td>
              <td className="text-right py-1 pb-4 text-xl text-slate-400 border-none">
                ${formatCurrency(lastCanon)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-orange-50 border border-orange-200 p-5 rounded-lg mb-5">
        <h4 className="text-orange-900 mb-2.5 font-heading font-semibold">
          🔍 LÓGICA DESARROLLADA (LEASING)
        </h4>
        <div className="text-xs text-orange-950 leading-normal space-y-2">
          <p>
            <strong>1. Valor Neto:</strong> Al tratarse de un utilitario, se
            segrega el IVA (10.5%) del precio total para obtener el{" "}
            <strong>Valor Neto</strong> (${formatCurrency(data.valorNeto)}),
            sobre el cual se calcula el contrato.
          </p>
          <p>
            <strong>2. Gastos Iniciales:</strong> Se calculan sobre el Valor
            Neto: Canon inicial (15%), Comisión Bancaria (2.5%) y Patentamiento
            estimado (6%).
          </p>
          <p>
            <strong>3. Sistema Francés:</strong> Se amortiza el monto financiado
            (${formatCurrency(data.montoFinanciar)}) usando la fórmula francesa.
            El <strong>Canon Puro</strong> es de $
            {formatCurrency(data.pureQuota)}.
          </p>
          <p>
            <strong>4. IVA Decreciente:</strong> Se aplica el 21% de IVA sobre
            los intereses mensuales. Al bajar la deuda, baja el interés y por
            ende el IVA, resultando en <strong>Cánones decrecientes</strong>.
          </p>
        </div>
      </div>

      <div className="bg-sky-50 border border-sky-200 p-4 rounded-lg mb-6 text-center">
        <h4 className="text-sky-900 font-heading mb-1 font-semibold">
          🏁 OPCIÓN DE COMPRA
        </h4>
        <p className="text-sm text-sky-950">
          Al finalizar el mes {data.months}, el cliente puede adquirir el bien
          por el 4% del valor neto:
        </p>
        <p className="text-2xl font-extrabold text-sky-900 mt-1">
          ${formatCurrency(data.montoOpcionCompra)}
        </p>
      </div>

      <div className="mt-5">
        <h4 className="mb-4 text-slate-900 font-heading font-semibold">
          📋 DESGLOSE DETALLADO DE CÁNONES
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs text-right">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-2.5 text-center">Mes</th>
                <th className="p-2.5">Capital</th>
                <th className="p-2.5">Interés</th>
                <th className="p-2.5">IVA (21%)</th>
                <th className="p-2.5 border-l border-white/20">CANON TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {data.breakdown.map((m) => (
                <tr
                  key={m.mes}
                  className={`border-b border-slate-200 ${
                    m.mes % 2 === 0 ? "bg-slate-50" : ""
                  }`}
                >
                  <td className="p-2 text-center font-bold text-slate-900">
                    {m.mes}
                  </td>
                  <td className="p-2">${formatCurrency(m.capital)}</td>
                  <td className="p-2">${formatCurrency(m.interes)}</td>
                  <td className="p-2 text-slate-600">
                    ${formatCurrency(m.iva)}
                  </td>
                  <td className="p-2 font-bold text-red-600 border-l border-slate-200">
                    ${formatCurrency(m.cuota)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
