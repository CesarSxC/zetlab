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
import { ModalAU } from '@/pages/secondary_views/components/modals/unidades/agregar'
import { ModalEU }  from '@/pages/secondary_views/components/modals/unidades/eliminar';
import { ModalEDU }  from '@/pages/secondary_views/components/modals/unidades/editar';

interface Unidades {
    id_unidades: number;
    abreviatura_unidad: string;
    nombre_unidad: string;
}

export default function Unidades() {
  const [unidades, setUnidades] = useState<Unidades[]>([]);
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
  const [selectAbreviatura, setSelectAbreviatura] = useState<string | null>(null);

  
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
  const openEditModal = (id:number, nUnidad:string, nAbreviatura:string) =>{
    setSelectedId(id);
    setSelectedName(nUnidad);
    setSelectAbreviatura(nAbreviatura);
    setIsEditModalOpen(true);
  }
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedId(null);
    setSelectedName(null)
  }

  const fetchUnidades = async () => {
    try {
      const data = await apiCall<Unidades[]>('get_unidades');
      console.log('Unidades obtenidas:', data);
      const flattenedData = data.flat();
      setUnidades(flattenedData);
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener unidades:', err);
      setError('Error al cargar las unidades');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUnidades();
  }, []);

  const filtrarUnidades = useMemo(() => {
    return unidades.filter((unidades) =>
        unidades.nombre_unidad.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [unidades, searchTerm]);


  if (loading) return <div>Cargando unidades...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Gestión de Unidades</CardTitle>
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
            <Plus className="mr-2 h-5 w-5" /> Agregar Unidad
          </Button>
          <ModalAU isOpen={isAddModalOpen} onClose={closeAddModal} onSucces={fetchUnidades}  />
        </div>
        <div className="rounded-lg overflow-hidden shadow-xl">
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="w-[200px] font-bold">Id</TableHead>
                <TableHead className="font-bold">Nombre Categoría</TableHead>
                <TableHead className="font-bold">Abreviatura</TableHead>
                <TableHead className="text-center font-bold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filtrarUnidades.map((unidad) => (
                  <motion.tr
                    key={unidad.id_unidades}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TableCell className="font-medium">{unidad.id_unidades}</TableCell>
                    <TableCell className='uppercase font-medium'>{unidad.nombre_unidad}</TableCell>
                    <TableCell className='uppercase font-medium'>{unidad.abreviatura_unidad}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(unidad.id_unidades , unidad.nombre_unidad, unidad.abreviatura_unidad)}
                        className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 mr-2"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteModal(unidad.id_unidades)}
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

        <ModalEU
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          idUnidades={selectedId}
          onSucces={fetchUnidades} 
        />
        <ModalEDU
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          idUnidades={selectedId}
          initialName={selectedName} 
          initialAbreviatura={selectAbreviatura}
          onSucces={fetchUnidades} 
        />
      </CardContent>
    </Card>
  );
}
