"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { CotizacionState, Product } from "@/types/cotizador";
import { PRODUCTS, FIXED_COSTS } from "@/data/cotizador-data";
import {
  calculatePrendario,
  calculateLeasing,
  formatCurrency,
} from "@/lib/cotizador-calculations";
import { PrendarioResult } from "./prendario-result";
import { LeasingResult } from "./leasing-result";
import { useCotizadorPDF } from "@/hooks/useCotizadorPDF";
import "@/app/cotizador-print.css";

export function CotizadorVehiculos() {
  const [state, setState] = useState<CotizacionState>({
    selectedProvider: null,
    selectedProduct: null,
    selectedType: null,
    dollarRate: 1450,
    selectedFinancingProduct: null,
  });

  const [step2Enabled, setStep2Enabled] = useState(false);
  const [step3Enabled, setStep3Enabled] = useState(false);
  const [step4Enabled, setStep4Enabled] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<any>(null);

  const resultRef = useRef<HTMLDivElement>(null);
  const { generatePDF, printPDF, isGenerating, isPrinting } = useCotizadorPDF();

  // Función para generar PDF
  const handleGeneratePDF = async () => {
    if (!resultData) return;

    try {
      await generatePDF(
        {
          selectedProduct: state.selectedProduct,
          selectedType: state.selectedType,
          dollarRate: state.dollarRate,
          selectedFinancingProduct: state.selectedFinancingProduct,
        },
        resultData,
      );
    } catch (error) {
      alert("Error al generar el PDF. Por favor intente nuevamente.");
    }
  };

  // Función para imprimir PDF
  const handlePrintPDF = async () => {
    if (!resultData) return;

    try {
      await printPDF(
        {
          selectedProduct: state.selectedProduct,
          selectedType: state.selectedType,
          dollarRate: state.dollarRate,
          selectedFinancingProduct: state.selectedFinancingProduct,
        },
        resultData,
      );
    } catch (error) {
      alert("Error al imprimir. Por favor intente nuevamente.");
    }
  };

  // Paso 1: Seleccionar proveedor
  const selectProvider = (provider: "LTA" | "DIRECTA") => {
    setState((prev) => ({
      ...prev,
      selectedProvider: provider,
      selectedProduct: null,
      selectedType: null,
      selectedFinancingProduct: null,
    }));
    setStep2Enabled(true);
    setStep3Enabled(false);
    setStep4Enabled(false);
    setShowResult(false);
  };

  // Paso 2: Seleccionar producto
  const selectProduct = (product: Product) => {
    setState((prev) => ({
      ...prev,
      selectedProduct: product,
      selectedType: null,
      selectedFinancingProduct: null,
    }));
    setStep3Enabled(false);
    setStep4Enabled(false);
    setShowResult(false);
  };

  // Paso 2: Seleccionar tipo
  const selectType = (typeName: string) => {
    if (!state.selectedProduct) return;
    setState((prev) => ({
      ...prev,
      selectedType: {
        name: typeName,
        price: state.selectedProduct!.types[typeName],
      },
    }));
  };

  // Paso 2: Confirmar costos fijos
  const confirmFixedCosts = () => {
    setStep3Enabled(true);
    setTimeout(() => {
      document.getElementById("step3")?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 300);
  };

  // Paso 3: Confirmar dólar
  const confirmDollar = () => {
    if (state.dollarRate <= 0) {
      alert("Por favor ingrese una cotización válida");
      return;
    }
    setStep4Enabled(true);
    setTimeout(() => {
      document.getElementById("step4")?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 300);
  };

  // Paso 4: Seleccionar producto financiero y calcular
  const showFinancingForm = (product: "Prendario" | "Leasing") => {
    if (!state.selectedProduct || !state.selectedType) return;

    setState((prev) => ({ ...prev, selectedFinancingProduct: product }));

    let data;
    if (product === "Prendario") {
      data = calculatePrendario(
        state.selectedProduct,
        state.selectedType,
        state.dollarRate,
      );
    } else {
      data = calculateLeasing(
        state.selectedProduct,
        state.selectedType,
        state.dollarRate,
      );
    }

    setResultData(data);
    setShowResult(true);

    setTimeout(() => {
      resultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 100);
  };

  const filteredProducts = state.selectedProvider
    ? PRODUCTS.filter((p) => p.provider === state.selectedProvider)
    : [];

  return (
    <div className="max-w-4xl mx-auto min-h-screen bg-white shadow-2xl pb-20">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 text-center sticky top-0 z-50 shadow-md">
        <h1 className="font-heading text-2xl font-bold tracking-wide uppercase">
          GUZMAN MOTORS
        </h1>
        <div className="text-sm text-slate-400 mt-1 font-medium">
          Cotizador de Vehículos
        </div>
      </div>

      <div className="p-5">
        {/* PASO 1: Proveedor */}
        <div className="bg-white mb-6 rounded-2xl border border-slate-300 p-6 transition-all">
          <div className="flex items-center gap-3 mb-5 font-heading text-xl font-semibold text-slate-900">
            <div className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0">
              1
            </div>
            <span>Seleccione Proveedor de Financiación</span>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => selectProvider("LTA")}
              className={`flex-1 min-w-[140px] p-4 font-heading text-base font-semibold rounded-xl border-2 transition-all min-h-[56px] ${
                state.selectedProvider === "LTA"
                  ? "bg-slate-900 border-slate-900 text-white"
                  : "bg-white border-slate-300 text-slate-900 hover:border-slate-900 hover:bg-slate-50"
              }`}
            >
              LTA
            </button>
            <button
              onClick={() => selectProvider("DIRECTA")}
              className={`flex-1 min-w-[140px] p-4 font-heading text-base font-semibold rounded-xl border-2 transition-all min-h-[56px] ${
                state.selectedProvider === "DIRECTA"
                  ? "bg-slate-900 border-slate-900 text-white"
                  : "bg-white border-slate-300 text-slate-900 hover:border-slate-900 hover:bg-slate-50"
              }`}
            >
              DIRECTA
            </button>
          </div>
        </div>

        {/* PASO 2: Vehículo y Tipo */}
        <div
          className={`bg-white mb-6 rounded-2xl border p-6 transition-all ${
            !step2Enabled
              ? "opacity-60 pointer-events-none grayscale border-dashed border-slate-300 bg-slate-50"
              : "border-slate-300"
          }`}
          id="step2"
        >
          <div className="flex items-center gap-3 mb-5 font-heading text-xl font-semibold text-slate-900">
            <div className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0">
              2
            </div>
            <span>Seleccione el Vehículo y Tipo</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => selectProduct(product)}
                className={`flex flex-col items-center gap-3 p-5 border-2 rounded-xl cursor-pointer transition-all ${
                  state.selectedProduct?.id === product.id
                    ? "border-red-600 bg-red-50 shadow-sm"
                    : "border-slate-300 bg-white hover:border-slate-900"
                }`}
              >
                <div className="w-full h-32 relative flex-shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 text-center w-full">
                  <div className="font-heading text-lg font-bold text-slate-900 leading-tight mb-2">
                    {product.name}
                  </div>
                  <div className="inline-block bg-slate-900 text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                    Desde $
                    {formatCurrency(Math.min(...Object.values(product.types)))}{" "}
                    USD
                  </div>
                </div>
              </div>
            ))}
          </div>

          {state.selectedProduct && (
            <div className="mt-5">
              <h3 className="font-semibold mb-2.5">Seleccione el Tipo:</h3>
              <select
                onChange={(e) => selectType(e.target.value)}
                value={state.selectedType?.name || ""}
                className="w-full p-4 text-base font-body border-2 border-slate-300 rounded-xl bg-white text-slate-900 h-14"
              >
                <option value="">-- Seleccione Tipo --</option>
                {Object.entries(state.selectedProduct.types).map(
                  ([typeName, price]) => (
                    <option key={typeName} value={typeName}>
                      {typeName} - ${formatCurrency(price)} USD
                    </option>
                  ),
                )}
              </select>
            </div>
          )}

          {state.selectedType && state.selectedProduct && (
            <div className="mt-6 bg-slate-50 border border-slate-200 p-5 rounded-xl">
              <p className="text-sm mb-2">
                Costo Fijo para esta unidad (Flete + Formularios):
              </p>
              <strong className="text-2xl block my-2">
                $
                {formatCurrency(
                  FIXED_COSTS[state.selectedProduct.costCategory],
                )}{" "}
                USD
              </strong>
              <p className="text-sm text-slate-600">
                (Se sumará al precio final)
              </p>
              <button
                onClick={confirmFixedCosts}
                className="mt-5 w-full bg-slate-900 text-white p-4 rounded-xl font-semibold hover:bg-slate-800 transition-all"
              >
                Continuar
              </button>
            </div>
          )}
        </div>

        {/* PASO 3: Cotización del Dólar */}
        <div
          className={`bg-white mb-6 rounded-2xl border p-6 transition-all ${
            !step3Enabled
              ? "opacity-60 pointer-events-none grayscale border-dashed border-slate-300 bg-slate-50"
              : "border-slate-300"
          }`}
          id="step3"
        >
          <div className="flex items-center gap-3 mb-5 font-heading text-xl font-semibold text-slate-900">
            <div className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0">
              3
            </div>
            <span>Ingrese Cotización del Dólar</span>
          </div>
          <div>
            <label
              htmlFor="dollarInput"
              className="block mb-2 font-semibold text-slate-700 text-sm"
            >
              Valor del Dólar (ARS):
            </label>
            <input
              type="number"
              id="dollarInput"
              placeholder="Ej: 1450"
              value={state.dollarRate || ""}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  dollarRate: parseFloat(e.target.value) || 0,
                }))
              }
              className="w-full p-4 text-base font-body border-2 border-slate-300 rounded-xl bg-white text-slate-900 h-14"
            />

            <div className="flex gap-3 flex-wrap mt-5">
              <button
                onClick={() =>
                  window.open(
                    "https://www.bna.com.ar/Personas#billetes",
                    "_blank",
                  )
                }
                className="flex-1 min-w-[140px] p-4 font-heading text-base font-semibold rounded-xl border-2 bg-white border-slate-300 text-slate-900 hover:border-slate-900 hover:bg-slate-50 transition-all"
              >
                Consultar cotización BNA
              </button>
              <button
                onClick={confirmDollar}
                className="flex-1 min-w-[140px] p-4 font-heading text-base font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>

        {/* PASO 4: Producto Financiero */}
        <div
          className={`bg-white mb-6 rounded-2xl border p-6 transition-all ${
            !step4Enabled
              ? "opacity-60 pointer-events-none grayscale border-dashed border-slate-300 bg-slate-50"
              : "border-slate-300"
          }`}
          id="step4"
        >
          <div className="flex items-center gap-3 mb-5 font-heading text-xl font-semibold text-slate-900">
            <div className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0">
              4
            </div>
            <span>Seleccione Producto Financiero</span>
          </div>
          <div className="flex gap-3 flex-wrap mb-5">
            <button
              onClick={() => showFinancingForm("Prendario")}
              className={`flex-1 min-w-[140px] p-4 font-heading text-base font-semibold rounded-xl border-2 transition-all min-h-[56px] ${
                state.selectedFinancingProduct === "Prendario"
                  ? "bg-slate-900 border-slate-900 text-white"
                  : "bg-white border-slate-300 text-slate-900 hover:border-slate-900 hover:bg-slate-50"
              }`}
            >
              Prendario
            </button>
            <button
              onClick={() => showFinancingForm("Leasing")}
              className={`flex-1 min-w-[140px] p-4 font-heading text-base font-semibold rounded-xl border-2 transition-all min-h-[56px] ${
                state.selectedFinancingProduct === "Leasing"
                  ? "bg-slate-900 border-slate-900 text-white"
                  : "bg-white border-slate-300 text-slate-900 hover:border-slate-900 hover:bg-slate-50"
              }`}
            >
              Leasing
            </button>
          </div>
        </div>

        {/* RESULTADO */}
        {showResult &&
          resultData &&
          state.selectedProduct &&
          state.selectedType && (
            <div
              ref={resultRef}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-slideUp"
            >
              {/* Header para impresión */}
              <div className="print-header">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/FOTON/header-cotizador-update.png"
                  alt="Header"
                  style={{ width: "100%", display: "block" }}
                />
              </div>

              <div className="result-content">
                {state.selectedFinancingProduct === "Prendario" ? (
                  <PrendarioResult
                    data={resultData}
                    selectedProduct={state.selectedProduct}
                    selectedType={state.selectedType}
                    dollarRate={state.dollarRate}
                  />
                ) : (
                  <LeasingResult
                    data={resultData}
                    selectedProduct={state.selectedProduct}
                    selectedType={state.selectedType}
                    dollarRate={state.dollarRate}
                  />
                )}
              </div>

              {/* Footer para impresión */}
              <div className="print-footer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/FOTON/footer-cotizador-update.png"
                  alt="Footer"
                  style={{ width: "100%", display: "block" }}
                />
              </div>

              <div className="p-8 bg-white text-center print:hidden">
                <div className="flex gap-3 justify-center flex-wrap">
                  <button
                    onClick={handleGeneratePDF}
                    disabled={isGenerating || isPrinting}
                    className="flex-1 max-w-xs bg-blue-600 text-white text-base font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? "⏳ Generando..." : "📄 Descargar PDF"}
                  </button>
                  <button
                    onClick={handlePrintPDF}
                    disabled={isGenerating || isPrinting}
                    className="flex-1 max-w-xs bg-red-600 text-white text-base font-semibold px-6 py-3 rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPrinting ? "⏳ Preparando..." : "🖨️ Imprimir"}
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
