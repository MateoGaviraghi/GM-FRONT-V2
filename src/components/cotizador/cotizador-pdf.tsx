import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import {
  PrendarioCalculation,
  LeasingCalculation,
  Product,
} from "@/types/cotizador";
import { formatCurrency } from "@/lib/cotizador-calculations";

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  headerImage: {
    width: "100%",
    marginBottom: 15,
  },
  footerImage: {
    width: "100%",
    marginTop: "auto",
  },
  content: {
    paddingHorizontal: 35,
    paddingTop: 0,
    paddingBottom: 15,
    flexGrow: 1,
  },
  contentCompact: {
    paddingHorizontal: 35,
    paddingTop: 0,
    paddingBottom: 10,
    flexGrow: 1,
  },
  header: {
    marginBottom: 15,
    borderBottom: "2 solid #0f172a",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
    paddingBottom: 5,
    borderBottom: "1 solid #cbd5e1",
  },
  grid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  gridItem: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 10,
    borderLeft: "3 solid #0f172a",
  },
  label: {
    fontSize: 8,
    color: "#64748b",
    marginBottom: 3,
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0f172a",
  },
  valueAccent: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#dc2626",
  },
  summary: {
    backgroundColor: "#1e293b",
    color: "#ffffff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 10,
    borderBottom: "1 solid #475569",
    paddingBottom: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 9,
  },
  summaryValue: {
    fontSize: 9,
  },
  summaryHighlight: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f87171",
  },
  table: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 8,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #e2e8f0",
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 8,
  },
  tableRowAlt: {
    flexDirection: "row",
    borderBottom: "1 solid #e2e8f0",
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 8,
    backgroundColor: "#f8fafc",
  },
  tableCell: {
    flex: 1,
    textAlign: "right",
  },
  tableCellCenter: {
    flex: 1,
    textAlign: "center",
  },
  tableCellBold: {
    flex: 1,
    textAlign: "right",
    fontWeight: "bold",
    color: "#dc2626",
  },
  infoBox: {
    backgroundColor: "#fff7ed",
    border: "1 solid #fed7aa",
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#9a3412",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 8,
    color: "#7c2d12",
    marginBottom: 5,
    lineHeight: 1.6,
  },
  disclaimer: {
    fontSize: 7,
    color: "#64748b",
    marginTop: 15,
    paddingTop: 10,
    borderTop: "1 solid #e2e8f0",
  },
});

interface PrendarioPDFProps {
  data: PrendarioCalculation;
  selectedProduct: Product;
  selectedType: { name: string; price: number };
  dollarRate: number;
}

export const PrendarioPDF = ({
  data,
  selectedProduct,
  selectedType,
  dollarRate,
}: PrendarioPDFProps) => {
  const firstQuota = data.breakdown[0].cuota;
  const lastQuota = data.breakdown[data.breakdown.length - 1].cuota;

  // Optimizado para A4 con header/footer y filas compactas
  const ROWS_PER_PAGE = 36;

  // Crear chunks para las páginas de tabla (todas las filas)
  const additionalPages = [];
  for (let i = 0; i < data.breakdown.length; i += ROWS_PER_PAGE) {
    additionalPages.push(data.breakdown.slice(i, i + ROWS_PER_PAGE));
  }

  return (
    <Document>
      {/* PRIMERA PÁGINA - Con resumen e información */}
      <Page size="A4" style={styles.page} wrap={false}>
        <Image
          src="/images/FOTON/header-cotizador-update.png"
          style={styles.headerImage}
        />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>GUZMAN MOTORS</Text>
            <Text style={styles.title}>Cotización Prendaria</Text>
            <Text style={styles.subtitle}>
              Vehículo: {selectedProduct.name} - {selectedType.name}
            </Text>
          </View>

          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Valor Unidad (c/IVA):</Text>
              <Text style={styles.value}>${formatCurrency(data.totalARS)}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Monto a Financiar:</Text>
              <Text style={styles.valueAccent}>
                ${formatCurrency(data.montoFinanciar)}
              </Text>
            </View>
          </View>

          <View style={[styles.summary, { padding: 10 }]}>
            <Text
              style={[
                styles.summaryTitle,
                { marginBottom: 5, paddingBottom: 5 },
              ]}
            >
              RESUMEN DEL PLAN ({data.months} CUOTAS)
            </Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tasa Nominal Anual (TNA):</Text>
              <Text style={styles.summaryValue}>{data.rateAnnual}%</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sistema de Amortización:</Text>
              <Text style={styles.summaryValue}>Francés (Decreciente)</Text>
            </View>
            <View
              style={[
                styles.summaryRow,
                { marginTop: 5, borderTop: "1 solid #475569", paddingTop: 5 },
              ]}
            >
              <Text style={styles.summaryLabel}>1ª Cuota (Máxima):</Text>
              <Text style={styles.summaryHighlight}>
                ${formatCurrency(firstQuota)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Última Cuota (Aprox):</Text>
              <Text style={styles.summaryValue}>
                ${formatCurrency(lastQuota)}
              </Text>
            </View>
          </View>

          <View style={[styles.infoBox, { padding: 8, marginBottom: 10 }]}>
            <Text style={[styles.infoTitle, { marginBottom: 4, fontSize: 9 }]}>
              LÓGICA DESARROLLADA
            </Text>
            <Text style={[styles.infoText, { marginBottom: 2, fontSize: 7 }]}>
              1. Valor Base: Precio del vehículo USD + Gastos Fijos pesificado
              al TC confirmado (${dollarRate}).
            </Text>
            <Text style={[styles.infoText, { marginBottom: 2, fontSize: 7 }]}>
              2. Devengamiento de Tasa: {data.rateAnnual}% anual / 12 = TEM del{" "}
              {(data.rateAnnual / 12).toFixed(2)}%.
            </Text>
            <Text style={[styles.infoText, { marginBottom: 2, fontSize: 7 }]}>
              3. Sistema Francés: Cuota Pura (Capital + Interés) constante en $
              {formatCurrency(data.pureQuota)}.
            </Text>
            <Text style={[styles.infoText, { marginBottom: 0, fontSize: 7 }]}>
              4. Impacto del IVA: 21% sobre intereses. Al bajar el interés, baja
              el IVA → Cuota Final decreciente.
            </Text>
          </View>

          <Text style={[styles.disclaimer, { marginTop: 8, paddingTop: 5 }]}>
            * Los montos expresados son estimativos y pueden variar al momento
            del otorgamiento según condiciones bancarias vigentes.
          </Text>
        </View>

        <Image
          src="/images/FOTON/footer-cotizador-update.png"
          style={styles.footerImage}
        />
      </Page>

      {/* PÁGINAS DE TABLA - Desglose completo de cuotas */}
      {additionalPages.map((pageData, pageIndex) => (
        <Page
          key={`page-${pageIndex}`}
          size="A4"
          style={styles.page}
          wrap={false}
        >
          <Image
            src="/images/FOTON/header-cotizador-update.png"
            style={styles.headerImage}
          />

          <View style={styles.contentCompact}>
            <Text style={[styles.sectionTitle, { marginBottom: 5 }]}>
              DESGLOSE DETALLADO DE CUOTAS{" "}
              {pageIndex > 0 ? "(Continuación)" : ""}
            </Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCellCenter}>Mes</Text>
                <Text style={styles.tableCell}>Capital</Text>
                <Text style={styles.tableCell}>Interés</Text>
                <Text style={styles.tableCell}>IVA (21%)</Text>
                <Text style={styles.tableCellBold}>CUOTA TOTAL</Text>
              </View>
              {pageData.map((m) => (
                <View
                  key={m.mes}
                  style={m.mes % 2 === 0 ? styles.tableRowAlt : styles.tableRow}
                >
                  <Text style={styles.tableCellCenter}>{m.mes}</Text>
                  <Text style={styles.tableCell}>
                    ${formatCurrency(m.capital)}
                  </Text>
                  <Text style={styles.tableCell}>
                    ${formatCurrency(m.interes)}
                  </Text>
                  <Text style={styles.tableCell}>${formatCurrency(m.iva)}</Text>
                  <Text style={styles.tableCellBold}>
                    ${formatCurrency(m.cuota)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <Image
            src="/images/FOTON/footer-cotizador-update.png"
            style={styles.footerImage}
          />
        </Page>
      ))}
    </Document>
  );
};

interface LeasingPDFProps {
  data: LeasingCalculation;
  selectedProduct: Product;
  selectedType: { name: string; price: number };
  dollarRate: number;
}

export const LeasingPDF = ({
  data,
  selectedProduct,
  selectedType,
  dollarRate,
}: LeasingPDFProps) => {
  const firstCanon = data.breakdown[0].cuota;
  const lastCanon = data.breakdown[data.breakdown.length - 1].cuota;

  // Optimizado para A4 con header/footer y filas compactas
  const ROWS_PER_PAGE = 36;

  // Crear chunks para las páginas de tabla (todas las filas)
  const additionalPages = [];
  for (let i = 0; i < data.breakdown.length; i += ROWS_PER_PAGE) {
    additionalPages.push(data.breakdown.slice(i, i + ROWS_PER_PAGE));
  }

  return (
    <Document>
      {/* PRIMERA PÁGINA - Con resumen e información */}
      <Page size="A4" style={styles.page} wrap={false}>
        <Image
          src="/images/FOTON/header-cotizador-update.png"
          style={styles.headerImage}
        />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>GUZMAN MOTORS</Text>
            <Text style={styles.title}>Cotización Leasing</Text>
            <Text style={styles.subtitle}>
              Vehículo: {selectedProduct.name} - {selectedType.name}
            </Text>
          </View>

          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Valor Unidad (c/IVA):</Text>
              <Text style={styles.value}>${formatCurrency(data.totalARS)}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Valor Neto (Sin IVA):</Text>
              <Text style={styles.valueAccent}>
                ${formatCurrency(data.valorNeto)}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.section,
              { backgroundColor: "#f1f5f9", padding: 10, borderRadius: 6 },
            ]}
          >
            <Text style={[styles.sectionTitle, { marginBottom: 5 }]}>
              1. PARA RETIRAR (GASTOS INICIALES)
            </Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Canon Inicial (15%):</Text>
              <Text style={styles.summaryValue}>
                ${formatCurrency(data.desgloseEntrada.canon)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Comisión (2.5%):</Text>
              <Text style={styles.summaryValue}>
                ${formatCurrency(data.desgloseEntrada.comision)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Patentamiento (6% Est):</Text>
              <Text style={styles.summaryValue}>
                ${formatCurrency(data.desgloseEntrada.pat)}
              </Text>
            </View>
            <View
              style={[
                styles.summaryRow,
                { marginTop: 5, borderTop: "1 solid #0f172a", paddingTop: 5 },
              ]}
            >
              <Text style={[styles.summaryLabel, { fontWeight: "bold" }]}>
                TOTAL INICIAL:
              </Text>
              <Text style={[styles.valueAccent, { fontSize: 14 }]}>
                ${formatCurrency(data.totalEntrada)}
              </Text>
            </View>
          </View>

          <View style={[styles.summary, { padding: 10 }]}>
            <Text
              style={[
                styles.summaryTitle,
                { marginBottom: 5, paddingBottom: 5 },
              ]}
            >
              2. PLAN DE CÁNONES ({data.months} MESES)
            </Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Porcentaje Financiado:</Text>
              <Text style={styles.summaryValue}>
                {data.percentToFinance * 100}%
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>TNA Aplicada:</Text>
              <Text style={styles.summaryValue}>{data.rateAnnual}%</Text>
            </View>
            <View
              style={[
                styles.summaryRow,
                { marginTop: 5, borderTop: "1 solid #475569", paddingTop: 5 },
              ]}
            >
              <Text style={styles.summaryLabel}>1º Canon (Máximo):</Text>
              <Text style={styles.summaryHighlight}>
                ${formatCurrency(firstCanon)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Último Canon (Min):</Text>
              <Text style={styles.summaryValue}>
                ${formatCurrency(lastCanon)}
              </Text>
            </View>
          </View>

          <View style={[styles.infoBox, { padding: 8, marginBottom: 10 }]}>
            <Text style={[styles.infoTitle, { marginBottom: 4, fontSize: 9 }]}>
              LÓGICA DESARROLLADA (LEASING)
            </Text>
            <Text style={[styles.infoText, { marginBottom: 2, fontSize: 7 }]}>
              1. Valor Neto: Se segrega el IVA (10.5%) del precio total para
              obtener el Valor Neto (${formatCurrency(data.valorNeto)}).
            </Text>
            <Text style={[styles.infoText, { marginBottom: 2, fontSize: 7 }]}>
              2. Gastos Iniciales: Canon inicial (15%), Comisión (2.5%) y
              Patentamiento (6%) sobre el Valor Neto.
            </Text>
            <Text style={[styles.infoText, { marginBottom: 2, fontSize: 7 }]}>
              3. Sistema Francés: Monto financiado ($
              {formatCurrency(data.montoFinanciar)}). Canon Puro: $
              {formatCurrency(data.pureQuota)}.
            </Text>
            <Text style={[styles.infoText, { marginBottom: 0, fontSize: 7 }]}>
              4. IVA Decreciente: 21% sobre intereses. Al bajar la deuda, bajan
              los cánones.
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#e0f2fe",
              border: "1 solid #bae6fd",
              padding: 8,
              borderRadius: 6,
              textAlign: "center",
            }}
          >
            <Text
              style={{
                fontSize: 9,
                fontWeight: "bold",
                color: "#0369a1",
                textAlign: "center",
                marginBottom: 3,
              }}
            >
              OPCIÓN DE COMPRA
            </Text>
            <Text
              style={{
                fontSize: 8,
                color: "#0c4a6e",
                marginBottom: 3,
                textAlign: "center",
              }}
            >
              Al finalizar el mes {data.months}, el cliente puede adquirir el
              bien por el 4% del valor neto:
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                color: "#0369a1",
                textAlign: "center",
              }}
            >
              ${formatCurrency(data.montoOpcionCompra)}
            </Text>
          </View>
        </View>

        <Image
          src="/images/FOTON/footer-cotizador-update.png"
          style={styles.footerImage}
        />
      </Page>

      {/* PÁGINAS DE TABLA - Desglose completo de cánones */}
      {additionalPages.map((pageData, pageIndex) => (
        <Page
          key={`page-${pageIndex}`}
          size="A4"
          style={styles.page}
          wrap={false}
        >
          <Image
            src="/images/FOTON/header-cotizador-update.png"
            style={styles.headerImage}
          />

          <View style={styles.contentCompact}>
            <Text style={[styles.sectionTitle, { marginBottom: 5 }]}>
              DESGLOSE DETALLADO DE CÁNONES{" "}
              {pageIndex > 0 ? "(Continuación)" : ""}
            </Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCellCenter}>Mes</Text>
                <Text style={styles.tableCell}>Capital</Text>
                <Text style={styles.tableCell}>Interés</Text>
                <Text style={styles.tableCell}>IVA (21%)</Text>
                <Text style={styles.tableCellBold}>CANON TOTAL</Text>
              </View>
              {pageData.map((m) => (
                <View
                  key={m.mes}
                  style={m.mes % 2 === 0 ? styles.tableRowAlt : styles.tableRow}
                >
                  <Text style={styles.tableCellCenter}>{m.mes}</Text>
                  <Text style={styles.tableCell}>
                    ${formatCurrency(m.capital)}
                  </Text>
                  <Text style={styles.tableCell}>
                    ${formatCurrency(m.interes)}
                  </Text>
                  <Text style={styles.tableCell}>${formatCurrency(m.iva)}</Text>
                  <Text style={styles.tableCellBold}>
                    ${formatCurrency(m.cuota)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <Image
            src="/images/FOTON/footer-cotizador-update.png"
            style={styles.footerImage}
          />
        </Page>
      ))}
    </Document>
  );
};
