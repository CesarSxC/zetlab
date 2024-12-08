import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Loader2, User, Mail, Phone, Calendar, IdCard } from 'lucide-react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiCall } from '@/lib/apicall';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPersonSelect: (person: any) => void;
}

interface Personas {
    id_paciente: number;
    nombre_p: string;
    apellido_p: string;
    nombre_sx: string;
    nombre_tdoc: string;
    num_doc: string;
    num_telf: string;
    direccion: string;
    correo: string;
    fecha_nacimiento: string;
    observacion: string;
    fecha_registrado: string;
    fecha_actualizado: string;
  }

export const ModalBP: React.FC<ModalProps> = ({ isOpen, onClose, onPersonSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [personas, setPersonas] = useState<Personas[]>([]);
  const [filteredPersonas, setFilteredPersonas] = useState<Personas[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPersonas();
    }
  }, [isOpen]);

  const fetchPersonas = async () => {
    setIsLoading(true);
    try {
    const respuesta = await apiCall<Personas>('get_paciente')
      setPersonas(respuesta);
      setFilteredPersonas(respuesta);
    } catch (error) {
      console.error("Error fetching personas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = personas.filter((persona) => {
      const fullName = `${persona.nombre_p} ${persona.apellido_p}`.toLowerCase();
      const document = persona.num_doc.toLowerCase();
      return fullName.includes(term.toLowerCase()) || document.includes(term.toLowerCase()) 
    });
    setFilteredPersonas(filtered);
  };
  
  const handleSelectPerson = (person: Personas) => {
    onPersonSelect(person);
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
            <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Buscar Paciente</h2>
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
                  placeholder="Buscar por nombre o apellido..."
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
                  {filteredPersonas.map((persona) => (
                    <li key={persona.id_paciente} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <User className="mr-2 text-blue-500" size={20} />
                            {persona.id_paciente} - {persona.apellido_p}, {persona.nombre_p}
                          </h3>
                          <span className="text-sm uppercase text-gray-600 font-semibold">{persona.nombre_sx}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p className="flex items-center text-gray-600">
                            <Mail className="mr-2 text-blue-400" size={16} />
                            {persona.correo}
                          </p>
                          <p className="flex items-center text-gray-600">
                            <Phone className="mr-2 text-blue-400" size={16} />
                            {persona.num_telf}
                          </p>
                          <p className="flex items-center text-gray-600">
                            <Calendar className="mr-2 text-blue-400" size={16} />
                            {new Date(persona.fecha_nacimiento).toLocaleDateString()}
                          </p>
                          <p className="flex items-center text-gray-600">
                            <IdCard className="mr-2 text-blue-400" size={16} />
                            {persona.nombre_tdoc}: {persona.num_doc}
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end">
                        <Button
                          variant="outline"
                          onClick={() => handleSelectPerson(persona)}
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
