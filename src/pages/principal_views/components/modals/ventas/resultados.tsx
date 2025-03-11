import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { invoke } from '@tauri-apps/api/tauri';

interface ResultadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  detalle: VentaDetallada | null;
  onSave: (idAnalisis: string, resultado: string) => void;
}
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

export function ResultadoModal({ isOpen, onClose, detalle, onSave }: ResultadoModalProps) {
  const [resultado, setResultado] = useState("");

  const handleSubmit = async () => {
    if (detalle && resultado) {
      try {
        console.log('Enviando:', { id_venta: detalle.id_venta, id_analisis: detalle.id_analisis, resultado });
  
        const response = await invoke('editar_resultado', {
          idVenta: detalle.id_venta,
          idAnalisis: detalle.id_analisis,
          resultado: resultado,
        });
  
        console.log('Respuesta de la API:', response);
  
        onSave(detalle.id_analisis, resultado);
        onClose();
      } catch (error) {
        console.error('Error al guardar el resultado:', error);
      }
    }
  };
  useEffect(() => {
    if (detalle) {
      setResultado(detalle.resultado || "");
    }
  }, [detalle]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Resultado</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="analisis">Análisis</Label>
            <Input
              id="analisis"
              value={detalle?.analisis || ""}
              readOnly
              className="bg-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unidad">Unidad de Medida</Label>
            <Input
              id="unidad"
              value={detalle?.unidad_medida || ""}
              readOnly
              className="bg-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="referencial">Rango Referencial</Label>
            <Input
              id="referencial"
              value={detalle?.rango_referenciales || ""}
              readOnly
              className="bg-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resultado">Resultado</Label>
            <Input
              id="resultado"
              value={resultado}
              onChange={(e) => setResultado(e.target.value)}
              placeholder="Ingrese el resultado"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-gradient-to-r from-teal-400 to-sky-400 text-white"
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}