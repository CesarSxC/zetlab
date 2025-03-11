import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, User, Calendar, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { invoke } from "@tauri-apps/api/tauri";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  nombreUsuario?: string; 
}
export const ModalAperturarCaja: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  nombreUsuario = "Admin" 
}) => {
  const [montoApertura, setMontoApertura] = useState<number | "">("");
  const [idUsuarioSelected] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const limpiar = () => {
    setMontoApertura("");
    setError(null);
  };

  const handleClose = () => {
    limpiar();
    onClose();
  };

  const [shouldClose, setShouldClose] = useState(false);

  useEffect(() => {
    if (shouldClose) {
      limpiar();
      onClose();
      setShouldClose(false);
    }
  }, [shouldClose, onClose]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
  
    try {
      const result = await invoke<{
        id_sesion_caja: number;
        mensaje: string;
      }>("aperturar_caja", {
        idUsuario: idUsuarioSelected,
        montoInicial: montoApertura,
      });
  
      console.log("Sesión de caja abierta con ID:", result.id_sesion_caja);
      onSuccess();
      setIsLoading(false);
      setTimeout(() => {
        limpiar();
        handleClose();
      }, 1000);
    } catch (error) {
      console.error("Error al aperturar la caja:", error);
      setError(typeof error === 'string' ? error : 'Error al aperturar la caja');
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-2xl max-w-lg w-full mx-auto overflow-hidden"
          >
            <div className="relative bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Aperturar Sesión de Caja</h2>
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white hover:text-blue-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="bg-gray-50 p-4 border-b">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="text-gray-400" size={20} />
                  <span className="text-sm text-gray-600">{formatDate(currentDateTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-gray-400" size={20} />
                  <span className="text-sm text-gray-600">{formatTime(currentDateTime)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <User className="text-gray-400" size={20} />
                <span className="text-sm text-gray-600">Usuario: {nombreUsuario}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="montoApertura" className="text-sm font-medium text-gray-700">
                  Monto de Apertura
                </Label>
                <div className="relative">
                  <Input
                    id="montoApertura"
                    type="number"
                    step="0.01"
                    value={montoApertura}
                    onChange={(e) => setMontoApertura(Number(e.target.value))}
                    className={cn(
                      "pl-10 bg-white border-gray-300 text-2xl font-bold h-16",
                      "focus:ring-blue-500 focus:border-blue-500"
                    )}
                    required
                    disabled={isLoading}
                  />
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                </div>
              </div>

              {montoApertura !== "" && (
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-lg">
                  <p className="text-center text-gray-600">Monto a registrar:</p>
                  <p className="text-center text-3xl font-bold text-teal-600">
                    ${Number(montoApertura).toFixed(2)}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-4 mt-6">
                <Button 
                  type="button"
                  onClick={handleClose} 
                  variant="outline" 
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className={`bg-gradient-to-r ${
                    isLoading ? 'from-green-500 to-green-600' : 'from-teal-400 to-blue-500'
                  } text-white hover:from-teal-500 hover:to-blue-600`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Enviado' : 'Guardar'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};