"use client";

import { PrendarioCalculation, Product } from "@/types/cotizador";
import { formatCurrency } from "@/lib/cotizador-calculations";
import { QUOTER_CONFIG } from "@/data/cotizador-data";

interface PrendarioResultProps {
  data: PrendarioCalculation;
  selectedProduct: Product;
  selectedType: { name: string; price: number };
  dollarRate: number;
}

export function PrendarioResult({
  data,
  selectedProduct,
  selectedType,
  dollarRate,
}: PrendarioResultProps) {
  const firstQuota = data.breakdown[0].cuota;
  const lastQuota = data.breakdown[data.breakdown.length - 1].cuota;

  return (
    <div className="font-body bg-white text-gray-900 text-sm leading-relaxed w-full p-5">
      <div className="border-b-2 border-slate-900 mb-5 pb-2.5">
        <h2 className="text-slate-900 font-heading uppercase text-xl font-bold">
          Cotización Prendaria
        </h2>
        <p className="text-lg font-semibold">
          Vehículo: {selectedProduct.name} - {selectedType.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-slate-900">
          <p className="text-sm text-slate-500">Valor Unidad (c/IVA):</p>
          <p className="text-2xl font-bold text-slate-900">
            ${formatCurrency(data.totalARS)}
          </p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-red-600">
          <p className="text-sm text-slate-500">Monto a Financiar:</p>
          <p className="text-2xl font-bold text-red-600">
            ${formatCurrency(data.montoFinanciar)}
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-5 rounded-xl mb-7 shadow-md">
        <h4 className="mb-4 border-b border-slate-700 pb-2.5 font-heading uppercase text-sm">
          📊 RESUMEN DEL PLAN ({data.months} CUOTAS)
        </h4>
        <table className="w-full text-white border-collapse bg-transparent">
          <tbody>
            <tr className="bg-transparent">
              <td className="py-2 border-none">
                <strong>Tasa Nominal Anual (TNA):</strong>
              </td>
              <td className="text-right border-none">{data.rateAnnual}%</td>
            </tr>
            <tr className="bg-transparent">
              <td className="py-2 border-none">
                <strong>Sistema de Amortización:</strong>
              </td>
              <td className="text-right border-none">Francés (Decreciente)</td>
            </tr>
            <tr className="border-t border-slate-700 bg-transparent">
              <td className="pt-4 pb-1 border-none">
                <span className="bg-white/10 px-2 py-1 rounded">
                  1ª Cuota (Máxima):
                </span>
              </td>
              <td className="text-right pt-4 pb-1 text-2xl text-red-400 font-extrabold border-none">
                ${formatCurrency(firstQuota)}
              </td>
            </tr>
            <tr className="bg-transparent">
              <td className="py-1 pb-4 border-none">
                <span className="bg-white/10 px-2 py-1 rounded">
                  Última Cuota (Aprox):
                </span>
              </td>
              <td className="text-right py-1 pb-4 text-xl text-slate-400 border-none">
                ${formatCurrency(lastQuota)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-orange-50 border border-orange-200 p-5 rounded-lg mb-7">
        <h4 className="text-orange-900 mb-2.5 font-heading font-semibold">
          🔍 LÓGICA DESARROLLADA
        </h4>
        <div className="text-sm text-orange-950 leading-relaxed space-y-2">
          <p>
            <strong>1. Valor Base:</strong> Se toma el precio del vehículo USD +
            Gastos Fijos (Flete/Formularios) y se pesifica al tipo de cambio
            confirmado (${dollarRate}).
          </p>
          <p>
            <strong>2. Devengamiento de Tasa:</strong> El {data.rateAnnual}%
            anual se divide por 12 para obtener la{" "}
            <strong>Tasa Efectiva Mensual (TEM)</strong> del{" "}
            {(data.rateAnnual / 12).toFixed(2)}%.
          </p>
          <p>
            <strong>3. Sistema Francés:</strong> Se utiliza la fórmula de
            amortización francesa donde la <strong>Cuota Pura</strong> (Capital
            + Interés) se mantiene constante en $
            {formatCurrency(data.pureQuota)}.
          </p>
          <p>
            <strong>4. Impacto del IVA:</strong> Se aplica un 21% de IVA{" "}
            <strong>únicamente sobre los intereses</strong>. Como el interés
            disminuye a medida que se paga capital, el IVA también baja,
            haciendo que la <strong>Cuota Final sea decreciente</strong>.
          </p>
        </div>
      </div>

      <div className="mt-5">
        <h4 className="mb-4 text-slate-900 font-heading font-semibold">
          📋 DESGLOSE DETALLADO DE CUOTAS
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs text-right">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-2.5 text-center">Mes</th>
                <th className="p-2.5">Capital</th>
                <th className="p-2.5">Interés</th>
                <th className="p-2.5">IVA (21%)</th>
                <th className="p-2.5 border-l border-white/20">CUOTA TOTAL</th>
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

      <p className="text-xs text-slate-600 mt-5 border-t border-slate-200 pt-2.5">
        * Los montos expresados son estimativos y pueden variar al momento del
        otorgamiento según condiciones bancarias vigentes.
      </p>
    </div>
  );
}
