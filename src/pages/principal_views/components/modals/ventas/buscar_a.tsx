import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Loader2, FlaskConical, Beaker, FileText, PencilRuler } from 'lucide-react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiCall } from '@/lib/apicall';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPersonSelect: (person: any) => void;
}

interface Analisis {
    id_analisis: number;
    nombre_categoria_ana: string;
    nombre_analisis: string;
    precio: number;
    nombre_muestra: string;
    nombre_unidad: string;
    rango_referencial: boolean;
  }

export const ModalBA: React.FC<ModalProps> = ({ isOpen, onClose, onPersonSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [analisis, setAnalisis] = useState<Analisis[]>([]);
  const [filteredAnalisis, setFilteredAnalisis] = useState<Analisis[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAnalisisF();
    }
  }, [isOpen]);

  const fetchAnalisisF = async () => {
    setIsLoading(true);
    try {
    const respuesta = await apiCall<Analisis>('get_analisis')
    setAnalisis(respuesta);
      setFilteredAnalisis(respuesta);
    } catch (error) {
      console.error("Error fetching personas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = analisis.filter((analisis) => {
      const nomAnalisis = analisis.nombre_analisis.toLowerCase();
      const catAnalisis = analisis.nombre_categoria_ana.toLowerCase();
      return nomAnalisis.includes(term.toLowerCase()) || catAnalisis.includes(term.toLowerCase())
    });
    setFilteredAnalisis(filtered);
  };
  
  const handleSelectAnalisis = (analisis: Analisis) => {
    onPersonSelect(analisis);
    onClose();
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
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-auto overflow-hidden"
          >
            <div className="relative bg-gradient-to-r  from-sky-400 to-teal-400 p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Buscar Análisis de Laboratorio</h2>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-blue-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="relative">
                <Input
                  placeholder="Buscar por nombre o categoría..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full bg-white border-2 border-blue-200 rounded-full focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={18} />
              </div>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="animate-spin text-blue-500" size={40} />
                </div>
              ) : (
                <ul className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {filteredAnalisis.map((analisisl) => (
                    <li key={analisisl.id_analisis} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <FileText className="mr-2 text-blue-500" size={20} />
                            {analisisl.id_analisis} - {analisisl.nombre_analisis}
                          </h3>
                          <span className="text-base text-gray-600 uppercase font-semibold">S/. {analisisl.precio}</span>                         
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p className="flex items-center text-gray-600">
                            <FlaskConical className="mr-2 text-blue-400" size={16} />
                            Categoría: {analisisl.nombre_categoria_ana}
                          </p>
                          <p className="flex items-center text-gray-600">
                            <Beaker className="mr-2 text-blue-400" size={16} />
                            Muestra: {analisisl.nombre_muestra}
                          </p>
                          <p className="flex items-center text-gray-600">
                            <PencilRuler className="mr-2 text-blue-400" size={16} />
                            Unidad: {analisisl.nombre_unidad}
                          </p>
                          <p className="flex items-center text-gray-600">
                            <PencilRuler className="mr-2 text-blue-400" size={16} />
                            Rango Referencial: {analisisl.rango_referencial ? "Sí" : "No"}
                            </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end">
                        <Button
                          variant="outline"
                          onClick={() => handleSelectAnalisis(analisisl)}
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                        >
                          Seleccionar
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
