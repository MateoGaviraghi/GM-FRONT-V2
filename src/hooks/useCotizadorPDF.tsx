import { useState } from "react";
import {
  PrendarioCalculation,
  LeasingCalculation,
  Product,
} from "@/types/cotizador";

interface UseCotizadorPDFParams {
  selectedProduct: Product | null;
  selectedType: { name: string; price: number } | null;
  dollarRate: number;
  selectedFinancingProduct: "Prendario" | "Leasing" | null;
}

export function useCotizadorPDF() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // @react-pdf/renderer (y sus documentos) se cargan solo al generar/imprimir
  // un PDF, para no inflar el bundle inicial de /cotizador.
  const buildPdfBlob = async (
    params: UseCotizadorPDFParams,
    data: PrendarioCalculation | LeasingCalculation,
  ) => {
    const [{ pdf }, { PrendarioPDF, LeasingPDF }] = await Promise.all([
      import("@react-pdf/renderer"),
      import("@/components/cotizador/cotizador-pdf"),
    ]);

    const pdfDocument =
      params.selectedFinancingProduct === "Prendario" ? (
        <PrendarioPDF
          data={data as PrendarioCalculation}
          selectedProduct={params.selectedProduct!}
          selectedType={params.selectedType!}
          dollarRate={params.dollarRate}
        />
      ) : (
        <LeasingPDF
          data={data as LeasingCalculation}
          selectedProduct={params.selectedProduct!}
          selectedType={params.selectedType!}
          dollarRate={params.dollarRate}
        />
      );

    return pdf(pdfDocument).toBlob();
  };

  const generatePDF = async (
    params: UseCotizadorPDFParams,
    data: PrendarioCalculation | LeasingCalculation,
  ) => {
    if (
      !params.selectedProduct ||
      !params.selectedType ||
      !params.selectedFinancingProduct
    ) {
      throw new Error("Faltan datos necesarios para generar el PDF");
    }

    try {
      setIsGenerating(true);

      // Generar el blob del PDF
      const blob = await buildPdfBlob(params, data);

      // Crear URL y abrir en nueva pestaña
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");

      return true;
    } catch (error) {
      console.error("Error al generar PDF:", error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const printPDF = async (
    params: UseCotizadorPDFParams,
    data: PrendarioCalculation | LeasingCalculation,
  ) => {
    if (
      !params.selectedProduct ||
      !params.selectedType ||
      !params.selectedFinancingProduct
    ) {
      throw new Error("Faltan datos necesarios para imprimir");
    }

    try {
      setIsPrinting(true);

      // Generar el blob del PDF
      const blob = await buildPdfBlob(params, data);

      // Crear URL del blob
      const url = URL.createObjectURL(blob);

      // Abrir en nueva ventana e imprimir
      const printWindow = window.open(url, "_blank");

      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 500);
        };
      } else {
        // Si no se pudo abrir popup, descargar el PDF
        const link = document.createElement("a");
        link.href = url;
        link.download = `Cotizacion_${params.selectedFinancingProduct}_${params.selectedProduct.name.replace(/\s+/g, "_")}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Limpiar después de un tiempo
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 60000);

      return true;
    } catch (error) {
      console.error("Error al imprimir PDF:", error);
      throw error;
    } finally {
      setIsPrinting(false);
    }
  };

  return {
    generatePDF,
    printPDF,
    isGenerating,
    isPrinting,
  };
}
