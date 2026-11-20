// Diseño de la nota en PDF (react-pdf). Se carga bajo demanda desde
// renderNotePdf para no sumar la librería al bundle principal.
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import noteBackgroundImage from "../../assets/rianimg.jpeg";
import type { NoteData } from "./noteData";

const BRAND = "#B3262D";
const ACCENT = "#D71920";
const INK = "#020617";
const MUTED = "#64748B";
const BODY = "#334155";
const BORDER = "#E2E8F0";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: INK,
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    objectFit: "cover",
    opacity: 0.12,
  },
  stamp: {
    position: "absolute",
    top: 228,
    right: 60,
    borderWidth: 3,
    borderColor: "#059669",
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 16,
    color: "#047857",
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    opacity: 0.8,
    transform: "rotate(-12deg)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingBottom: 14,
  },
  brandRow: { flexDirection: "row", alignItems: "center" },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 4,
    backgroundColor: BRAND,
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    textAlign: "center",
    paddingTop: 11,
    marginRight: 10,
  },
  brandName: { fontSize: 16, fontFamily: "Helvetica-Bold" },
  brandSubtitle: { fontSize: 10, color: MUTED, marginTop: 2 },
  headerMeta: { alignItems: "flex-end" },
  code: { fontSize: 11, fontFamily: "Helvetica-Bold" },
  meta: { fontSize: 10, color: MUTED, marginTop: 3 },
  status: { fontSize: 10, color: BRAND, fontFamily: "Helvetica-Bold", marginTop: 3 },
  section: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingVertical: 14,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    padding: 10,
  },
  column: { flex: 1 },
  gap: { width: 12 },
  sectionLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: ACCENT,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  detailGrid: { flexDirection: "row", flexWrap: "wrap" },
  detail: { width: "50%", marginBottom: 6 },
  detailFull: { marginBottom: 6 },
  detailLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
    textTransform: "uppercase",
  },
  detailValue: { fontSize: 10, fontFamily: "Helvetica-Bold", marginTop: 2 },
  paragraph: { fontSize: 10, color: BODY, lineHeight: 1.5 },
  table: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    marginTop: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    paddingVertical: 7,
    paddingHorizontal: 10,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  colType: { width: 100, paddingRight: 8 },
  colDescription: { flex: 1, paddingRight: 8 },
  colAmount: { width: 90, textAlign: "right" },
  itemType: { fontFamily: "Helvetica-Bold", color: BODY },
  itemDescription: { color: BODY },
  itemAmount: { fontFamily: "Helvetica-Bold" },
  emptyItems: {
    paddingVertical: 14,
    textAlign: "center",
    color: MUTED,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  totals: {
    alignSelf: "flex-end",
    width: 230,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 10,
    marginTop: 6,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalLabel: { fontFamily: "Helvetica-Bold", color: "#475569" },
  totalValue: { fontFamily: "Helvetica-Bold" },
  totalEmphasisRow: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 6,
  },
  totalEmphasisLabel: { fontFamily: "Helvetica-Bold", fontSize: 12 },
  totalEmphasisValue: { fontFamily: "Helvetica-Bold", fontSize: 12, color: BRAND },
  footer: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 10,
    textAlign: "center",
    fontSize: 8,
    color: MUTED,
  },
  footerStrong: { fontFamily: "Helvetica-Bold", color: BODY, marginBottom: 4 },
});

function Detail({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <View style={full ? styles.detailFull : styles.detail}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export function NotePdfDocument({ data }: { data: NoteData }) {
  const { customer, vehicle } = data;

  return (
    <Document author="Rian Automotriz" title={`${data.title} ${data.code}`}>
      <Page size="LETTER" style={styles.page}>
        <Image fixed src={noteBackgroundImage} style={styles.background} />

        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Text style={styles.logo}>RA</Text>
            <View>
              <Text style={styles.brandName}>Rian Automotriz</Text>
              <Text style={styles.brandSubtitle}>{data.title}</Text>
            </View>
          </View>
          <View style={styles.headerMeta}>
            <Text style={styles.code}>{data.code}</Text>
            <Text style={styles.meta}>Fecha {data.date}</Text>
            <Text style={styles.meta}>Creado por {data.createdBy}</Text>
            <Text style={styles.status}>{data.statusLabel}</Text>
          </View>
        </View>

        <View style={styles.section} wrap={false}>
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Cliente</Text>
            <Detail full label="Nombre" value={customer.name} />
            <Detail full label="Teléfono" value={customer.phone} />
          </View>
          <View style={styles.gap} />
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Vehículo</Text>
            <View style={styles.detailGrid}>
              <Detail label="Vehículo" value={vehicle.description} />
              <Detail label="Placas" value={vehicle.plate} />
              <Detail label="Marca" value={vehicle.make} />
              <Detail label="Modelo" value={vehicle.model} />
              <Detail label="Año" value={vehicle.year} />
              <Detail label="Color" value={vehicle.color} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.column}>
            <Text style={styles.sectionLabel}>Diagnóstico</Text>
            <Text style={styles.paragraph}>{data.diagnosis}</Text>
          </View>
          <View style={styles.gap} />
          <View style={styles.column}>
            <Text style={styles.sectionLabel}>Notas</Text>
            <Text style={styles.paragraph}>{data.notes}</Text>
          </View>
        </View>

        <View style={{ paddingTop: 14 }}>
          <Text style={styles.sectionLabel}>Piezas y mano de obra</Text>
          <View style={styles.table}>
            <View fixed style={styles.tableHeader}>
              <Text style={styles.colType}>Tipo</Text>
              <Text style={styles.colDescription}>Descripción</Text>
              <Text style={styles.colAmount}>Importe</Text>
            </View>
            {data.items.length ? (
              data.items.map((item, index) => (
                <View key={index} style={styles.tableRow} wrap={false}>
                  <Text style={[styles.colType, styles.itemType]}>{item.type}</Text>
                  <Text style={[styles.colDescription, styles.itemDescription]}>
                    {item.description}
                  </Text>
                  <Text style={[styles.colAmount, styles.itemAmount]}>{item.amount}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyItems}>Sin items registrados.</Text>
            )}
          </View>
        </View>

        <View style={styles.totals} wrap={false}>
          {data.totals.map((row) => (
            <View
              key={row.label}
              style={row.emphasis ? [styles.totalRow, styles.totalEmphasisRow] : styles.totalRow}
            >
              <Text style={row.emphasis ? styles.totalEmphasisLabel : styles.totalLabel}>
                {row.label}
              </Text>
              <Text style={row.emphasis ? styles.totalEmphasisValue : styles.totalValue}>
                {row.value}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footer} wrap={false}>
          {data.footer.strong ? (
            <Text style={styles.footerStrong}>{data.footer.strong}</Text>
          ) : null}
          <Text>{data.footer.text}</Text>
        </View>

        {data.paid ? <Text style={styles.stamp}>PAGADO</Text> : null}
      </Page>
    </Document>
  );
}
