import { useState, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Edit, Trash2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiCall } from '@/lib/apicall';
import { ModalAE } from '@/pages/secondary_views/components/modals/especialidades/agregar'
import { ModalEES }  from '@/pages/secondary_views/components/modals/especialidades/eliminar';
import { ModalEDES }  from '@/pages/secondary_views/components/modals/especialidades/editar';

interface Especialidad {
    id_especialidad: number;
    nombre_esp: string;
}

export default function Especialidades() {
  const [especialidad, setEspecialidad] = useState<Especialidad[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  
//Modal Eliminar
  const openDeleteModal = (id: number) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedId(null);
  };
//Modal Editar
  const openEditModal = (id:number, nEspecialidad:string) =>{
    setSelectedId(id);
    setSelectedName(nEspecialidad);
    setIsEditModalOpen(true);
  }
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedId(null);
    setSelectedName(null)
  }

  const fetchEspecialidad = async () => {
    try {
      const data = await apiCall<Especialidad[]>('get_especialidad');
      console.log('Especialidades obtenidas:', data);
      const flattenedData = data.flat();
      setEspecialidad(flattenedData);
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener especialidad:', err);
      setError('Error al cargar las especialidad');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchEspecialidad();
  }, []);

  const filtrarEspecialidades = useMemo(() => {
    return especialidad.filter((especialidad) =>
        especialidad.nombre_esp.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [especialidad, searchTerm]);


  if (loading) return <div>Cargando especialidades...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Gestión de Especialidades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-full focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <Button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <Plus className="mr-2 h-5 w-5" /> Agregar Especialidad
          </Button>
          <ModalAE isOpen={isAddModalOpen} onClose={closeAddModal} onSucces={fetchEspecialidad} />
        </div>
        <div className="rounded-lg overflow-hidden shadow-xl">
        <div className="max-h-96 overflow-y-auto">

          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="w-[200px] font-bold">Id</TableHead>
                <TableHead className="font-bold">Nombre Especialidad</TableHead>
                <TableHead className="text-center font-bold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filtrarEspecialidades.map((especialidad) => (
                  <motion.tr
                    key={especialidad.id_especialidad}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TableCell className="font-medium">{especialidad.id_especialidad}</TableCell>
                    <TableCell className='uppercase font-medium'>{especialidad.nombre_esp}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(especialidad.id_especialidad , especialidad.nombre_esp)}
                        className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 mr-2"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteModal(especialidad.id_especialidad)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
          </div>
        </div>

        <ModalEES
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          idEspecialidad={selectedId} 
          onSucces={fetchEspecialidad}
        />
        <ModalEDES
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          idEspecialidad={selectedId}
          initialName={selectedName} 
          onSucces={fetchEspecialidad}
        />

      </CardContent>
    </Card>
  );
}