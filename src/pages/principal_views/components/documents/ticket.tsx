import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import Barcode from 'react-barcode';
import './ticket-styles.css';

interface Analisis {
  id_analisis: number;
  nombre_analisis: string;
  precio: number;
}
interface SelectedPerson {
  id_paciente: number;
  fullName: string;
  num_doc: string;
}
interface SelectedMedico {
  id_medico: number;
  fullName: string;
  codigo_cmp: string;
}
interface PreviewTicketProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPerson: SelectedPerson;
  selectedMedico: SelectedMedico;
  selectedAnalisis: Analisis[];
  subtotal: number;
  igv: number;
  total: number;
  codigoBarra: string | null;
}

const VerTicket: React.FC<PreviewTicketProps> = ({ 
  isOpen, 
  onClose,
  selectedPerson,
  selectedMedico,
  selectedAnalisis,
  subtotal,
  igv,
  total,
  codigoBarra
}) => {
  const fechaActual = new Date().toLocaleString('es-PE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handlePrint = () => {
    window.print();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Vista Previa del Ticket</DialogTitle>
        </DialogHeader>

        <div className="bg-white p-4 rounded-lg border">
          <div className="ticket-preview space-y-4" style={{ fontFamily: 'monospace', width: '80mm', margin: '0 auto' }}>
            <div className="text-center border-b pb-2">
              <h2 className="font-bold">LABORATORIO ZETLAB E.I.R.L</h2>
              <p className="text-sm">RUC: 20612119717</p>
              <p className="text-sm">Ca.Loreto 160</p>
              <p className="text-sm">Tel: 987-710-824</p>
            </div>

            <div className="text-left text-sm space-y-1">
              <p>Fecha: {fechaActual}</p>
              <p>Paciente: {selectedPerson?.fullName || 'No seleccionado'}</p>
              <p>Num Doc: {selectedPerson?.num_doc || '-'}</p>
              <p>Médico: {selectedMedico?.fullName || 'No seleccionado'}</p>
              <p>CMP: {selectedMedico?.codigo_cmp || '-'}</p>
            </div>

            <div className="border-t border-b py-2">
              <p className="font-bold mb-1">ANÁLISIS:</p>
              {selectedAnalisis.map((analisis, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="truncate max-w-[70%]">{analisis.nombre_analisis}</span>
                  <span>S/ {analisis.precio.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="text-right space-y-1">
              <p className="text-sm">Subtotal: S/ {subtotal.toFixed(2)}</p>
              <p className="text-sm">IGV (18%): S/ {igv.toFixed(2)}</p>
              <p className="font-bold">Total: S/ {total.toFixed(2)}</p>
            </div>

            <div className="text-center text-sm pt-2 border-t">
              <p>¡Gracias por su preferencia!</p>
              {codigoBarra && (
                <div className="mt-2 flex flex-col items-center">
                  <Barcode 
                    value={codigoBarra}
                    width={1.5}
                    height={50}
                    fontSize={12}
                    margin={5}
                    displayValue={true}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={handlePrint} className="bg-primary">
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerTicket;