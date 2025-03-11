import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { cn } from "@/lib/utils";

interface CierreSesionResult {
  id_sesion_caja: number;
  monto_inicial: number;
  total_ventas: number;
  monto_final: number;
  diferencia: number;
}

interface ModalCerrarCajaProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result: CierreSesionResult) => void;
  idSesionCaja: number | null;
}

export const ModalCerrarCaja: React.FC<ModalCerrarCajaProps> = ({
  isOpen,
  onClose,
  onSuccess,
  idSesionCaja
}) => {
  const [montoFinal, setMontoFinal] = useState<number | "">("");
  const [montoInicial, setMontoInicial] = useState<number>(0);
  const [totalVentas, setTotalVentas] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [diferencia, setDiferencia] = useState<number>(0);

  useEffect(() => {
    const cargarInformacionCaja = async () => {
      if (isOpen) {
        try {
          const resultado: CierreSesionResult = await invoke("obtener_detalles_sesion_caja", {
            idSesionCaja: idSesionCaja,
          });
          setMontoInicial(resultado.monto_inicial);
          setTotalVentas(resultado.total_ventas);
        } catch (error) {
          console.error("Error al cargar detalles de caja:", error);
          setError("No se pudo cargar la información de la caja");
        }
      }
    };

    cargarInformacionCaja();
  }, [isOpen, idSesionCaja]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      // Llamar al comando de Tauri para cerrar la caja
      const resultado: CierreSesionResult = await invoke("cerrar_caja", {
        idSesionCaja: idSesionCaja,
        montoFinal: montoFinal || 0,
      });

      // Establecer la diferencia
      setDiferencia(resultado.diferencia);

      // Llamar a la función de éxito con el resultado completo
      onSuccess(resultado);
      onClose();
    } catch (error) {
      console.error("Error al cerrar la caja:", error);
      setError(typeof error === 'string' ? error : "No se pudo cerrar la caja. Intente nuevamente.");
    }
  };

  const calcularTotalEsperado = () => {
    const esperado = montoInicial + totalVentas;
    return isNaN(esperado) ? 0 : esperado; // Asegúrate de que siempre sea un número
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-auto overflow-hidden"
          >
            <div className="relative bg-gradient-to-r from-red-400 via-red-500 to-red-500 p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Cerrar Sesión de Caja</h2>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-red-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-4">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    {error}
                  </div>
                )}
                {/* Información de la caja */}
                <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Monto Inicial:</p>
                    <p className="font-semibold">S/ {(montoInicial || 0).toFixed(2)}</p>
                  </div>
{/*                   <div>
                    <p className="text-sm text-gray-600">Total Ventas:</p>
                    <p className="font-semibold">S/ {(totalVentas || 0).toFixed(2)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Total Esperado:</p>
                    <p className="font-bold text-green-600">S/ {calcularTotalEsperado().toFixed(2)}</p>
                  </div> */}
                </div>

                {/* Monto Final */}
                <div className="space-y-2">
                  <Label htmlFor="montoFinal" className="text-sm font-medium text-gray-700">
                    Monto Final Real
                  </Label>
                  <div className="relative">
                    <Input
                      id="montoFinal"
                      type="number"
                      step="0.01"
                      value={montoFinal}
                      onChange={(e) => setMontoFinal(Number(e.target.value))}
                      className={cn(
                        "pl-10 bg-white border-gray-300",
                        "focus:ring-red-500 focus:border-red-500"
                      )}
                      required
                    />
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                {/* Mostrar diferencia si existe */}
{/*                 {diferencia !== 0 && (
                  <div className={`p-4 rounded-lg ${diferencia >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    <p className="font-medium">Diferencia: S/ {diferencia.toFixed(2)}</p>
                    {diferencia >= 0 
                      ? 'El monto final coincide o supera lo esperado.' 
                      : 'El monto final es menor que lo esperado.'}
                  </div>
                )} */}
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button 
                  type="button"
                  onClick={onClose} 
                  variant="outline" 
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-red-400 to-red-500 text-white hover:from-red-500 hover:to-red-600"
                >
                  Cerrar Caja
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};