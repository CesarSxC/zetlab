import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

interface VentaDetallada {
    id_venta: number;
    codigo_barra: string;
    fecha_registro: string;
    total_importe: number;
    estado_venta: string;
    nombre_metodop: string;
    nombre_desc: string;
    valor_desc: string;
    nombre_pro: string;
  
    paciente_dni: string;
    paciente_nombres: string;
    paciente_apellidos: string;
    paciente_sexo: string;
    paciente_fecha_nacimiento: string;
  
    medico_dni: string;
    medico_nombres: string;
    medico_apellidos: string;
    medico_cmp: string;
    comision: number;
    nombre_esp: string;
  
    id_analisis: string;
    categoria: string;
    analisis: string;
    resultado: string;
    muestra: string;
    unidad_medida: string;
    rango_referenciales: string;
    estado_analisis: string;
    precio_analisis: number;
    total_analisis: number;
  }
  
  interface ResultadoPDFProps {
    detalles: VentaDetallada[];
    infoGeneral: VentaDetallada; 
    edad: number; 
  }
const styles = StyleSheet.create({
  page: {
    padding: '40 30',
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    textAlign: 'center',
    marginBottom: 3,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 9,
  },
  specialties: {
    fontSize: 8,
    textAlign: 'center',
    marginBottom: 10,
  },
  contact: {
    fontSize: 8,
    textAlign: 'center',
    marginBottom: 15,
  },
  patientInfo: {
    marginBottom: 20,
  },
  patientRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 80,
  },
  value: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  table: {
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    paddingVertical: 3,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
  },
  tableCellWide: {
    flex: 2,
  },
});

const ResultadoPDF = ({ detalles, infoGeneral, edad }: ResultadoPDFProps) => 
    
    (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={[styles.headerText, styles.title]}>
          LABORATORIO DE ANÁLISIS CLÍNICO
        </Text>
        <Text style={[styles.headerText, styles.subtitle]}>
          Calidad y Confianza
        </Text>
        <Text style={styles.specialties}>
          HEMATOLOGÍA – BIOQUÍMICA – INMUNOLOGÍA – BACTERIOLOGÍA – PARASITOLOGÍA – HORMONAS – MARCADORES TUMORALES
        </Text>
        <Text style={styles.contact}>
          Principal: Calle Loreto N°160 (Frente la cochera){'\n'}
          Sede: Calle virgen del rosario de Yauca B11-pueblo joven señor de Luren-ICA{'\n'}
          Cel: 987710824 - 987927380 Facebook: ZetLab ICA
        </Text>
      </View>

      <View style={styles.patientInfo}>
        <View style={styles.patientRow}>
          <Text style={styles.label}>Paciente:</Text>
          <Text style={styles.value}>
            {`${infoGeneral.paciente_apellidos}, ${infoGeneral.paciente_nombres}`}
          </Text>
        </View>
        <View style={styles.patientRow}>
          <Text style={styles.label}>DNI/Pasaporte:</Text>
          <Text style={styles.value}>{infoGeneral.paciente_dni}</Text>
          <Text style={styles.label}>Sexo:</Text>
          <Text style={styles.value}>{infoGeneral.paciente_sexo}</Text>
        </View>
        <View style={styles.patientRow}>
          <Text style={styles.label}>Edad:</Text>
          <Text style={styles.value}>{`${edad} AÑOS`}</Text>
        </View>
        <View style={styles.patientRow}>
          <Text style={styles.label}>Sede:</Text>
          <Text style={styles.value}>ICA</Text>
        </View>
        <View style={styles.patientRow}>
          <Text style={styles.label}>Médico:</Text>
          <Text style={styles.value}>
            {`${infoGeneral.medico_apellidos}, ${infoGeneral.medico_nombres}`}
          </Text>
        </View>
        <View style={styles.patientRow}>
          <Text style={styles.label}>Fecha y Hrs:</Text>
          <Text style={styles.value}>
            {new Date(infoGeneral.fecha_registro).toLocaleString()}
          </Text>
        </View>
        <View style={styles.patientRow}>
          <Text style={styles.label}>MUESTRAS:</Text>
          <Text style={styles.value}>SANGRE</Text>
        </View>
      </View>

      {detalles.map((detalle, index) => (
        <View key={index}>
          <Text style={styles.sectionTitle}>{detalle.categoria}</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCellWide}>ANÁLISIS</Text>
              <Text style={styles.tableCell}>RESULTADOS</Text>
              <Text style={styles.tableCell}>RANGO DE REFERENCIALES</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellWide}>{detalle.analisis}</Text>
              <Text style={styles.tableCell}>{detalle.resultado}</Text>
              <Text style={styles.tableCell}>{detalle.rango_referenciales}</Text>
            </View>
          </View>
        </View>
      ))}
    </Page>
  </Document>
);

export const PreviewResultadosModal: React.FC<ResultadoPDFProps> = (props) => (
  <PDFViewer style={{ width: '100%', height: '600px' }}>
    <ResultadoPDF {...props} />
  </PDFViewer>
);
export default ResultadoPDF;