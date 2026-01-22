import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import {
  PrendarioCalculation,
  LeasingCalculation,
  Product,
} from "@/types/cotizador";
import { PrendarioPDF, LeasingPDF } from "@/components/cotizador/cotizador-pdf";

interface UseCotizadorPDFParams {
  selectedProduct: Product | null;
  selectedType: { name: string; price: number } | null;
  dollarRate: number;
  selectedFinancingProduct: "Prendario" | "Leasing" | null;
}

export function useCotizadorPDF() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const createPDFDocument = (
    params: UseCotizadorPDFParams,
    data: PrendarioCalculation | LeasingCalculation,
  ) => {
    if (params.selectedFinancingProduct === "Prendario") {
      return (
        <PrendarioPDF
          data={data as PrendarioCalculation}
          selectedProduct={params.selectedProduct!}
          selectedType={params.selectedType!}
          dollarRate={params.dollarRate}
        />
      );
    } else {
      return (
        <LeasingPDF
          data={data as LeasingCalculation}
          selectedProduct={params.selectedProduct!}
          selectedType={params.selectedType!}
          dollarRate={params.dollarRate}
        />
      );
    }
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

      const pdfDocument = createPDFDocument(params, data);

      // Generar el blob del PDF
      const blob = await pdf(pdfDocument).toBlob();

      // Crear un enlace de descarga
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const fileName = `Cotizacion_${params.selectedFinancingProduct}_${params.selectedProduct.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Limpiar el URL
      URL.revokeObjectURL(url);

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

      const pdfDocument = createPDFDocument(params, data);

      // Generar el blob del PDF
      const blob = await pdf(pdfDocument).toBlob();

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
