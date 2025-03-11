import { PDFViewer } from '@react-pdf/renderer';
import ResultadoPDF from './resultadosdoc';
import { Dialog, DialogContent } from "@/components/ui/dialog";


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
    nombre_esp:string;
  
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

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  detalles: VentaDetallada[];
  infoGeneral: VentaDetallada;
  edad: number;
}

export function PreviewResultadosModal({ isOpen, onClose, detalles, infoGeneral, edad }: PreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90%] h-[90vh]">
        <PDFViewer style={{ width: '100%', height: '100%' }}>
          <ResultadoPDF detalles={detalles} infoGeneral={infoGeneral} edad={edad} />
        </PDFViewer>
      </DialogContent>
    </Dialog>
  );
}