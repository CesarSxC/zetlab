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
import { ModalAM } from '@/pages/secondary_views/components/modals/muestras/agregar'
import { ModalEM }  from '@/pages/secondary_views/components/modals/muestras/eliminar';
import { ModalEDM }  from '@/pages/secondary_views/components/modals/muestras/editar';

interface Muestra {
  id_muestra: number;
  nombre_muestra: string;
}

export default function Muestras() {
  const [muestras, setMuestras] = useState<Muestra[]>([]);
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
  

  const openDeleteModal = (id: number) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedId(null);
  };

  const openEditModal = (id:number, nMuestra:string) =>{
    setSelectedId(id);
    setSelectedName(nMuestra);
    setIsEditModalOpen(true);
  }
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedId(null);
    setSelectedName(null)
  }

  const fetchMuestras = async () => {
    try {
      const data = await apiCall<Muestra[]>('get_muestras');
      console.log('Muestras obtenidas:', data);
      const flattenedData = data.flat();
      setMuestras(flattenedData);
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener muestras:', err);
      setError('Error al cargar las muestras');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMuestras();
  }, []);

  const filtrarMuestras = useMemo(() => {
    return muestras.filter((muestras) =>
      muestras.nombre_muestra.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [muestras, searchTerm]);


  if (loading) return <div>Cargando muestras...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Gestión de Muestras</CardTitle>
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
            <Plus className="mr-2 h-5 w-5" /> Agregar Muestra
          </Button>
          <ModalAM isOpen={isAddModalOpen} onClose={closeAddModal} onSucces={fetchMuestras}/>
        </div>
        <div className="rounded-lg overflow-hidden shadow-xl">
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="w-[200px] font-bold">Id</TableHead>
                <TableHead className="font-bold">Nombre Muestra</TableHead>
                <TableHead className="text-center font-bold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filtrarMuestras.map((muestra) => (
                  <motion.tr
                    key={muestra.id_muestra}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TableCell className="font-medium">{muestra.id_muestra}</TableCell>
                    <TableCell className='uppercase font-medium'>{muestra.nombre_muestra}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(muestra.id_muestra , muestra.nombre_muestra)}
                        className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 mr-2"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteModal(muestra.id_muestra)}
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

        <ModalEM
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          idMuestra={selectedId} 
          onSucces={fetchMuestras}
        />
        <ModalEDM
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          idMuestra={selectedId}
          initialName={selectedName} 
          onSucces={fetchMuestras}
        />

      </CardContent>
    </Card>
  );
}
