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
import { ModalAC } from '@/pages/secondary_views/components/modals/categorias/agregar'
import { ModalEC }  from '@/pages/secondary_views/components/modals/categorias/eliminar';
import { ModalEDC }  from '@/pages/secondary_views/components/modals/categorias/editar';

interface CategoriaAnalisis {
    id_categoria_ana: number;
    nombre_categoria_ana: string;
}

export default function CateogriasAn() {
  const [categorias, setCategorias] = useState<CategoriaAnalisis[]>([]);
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
  const openEditModal = (id:number, nCategoria:string) =>{
    setSelectedId(id);
    setSelectedName(nCategoria);
    setIsEditModalOpen(true);
  }
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedId(null);
    setSelectedName(null)
  }

    const fetchCategorias = async () => {
      try {
        const data = await apiCall<CategoriaAnalisis[]>('get_cat_analisis');
        console.log('Categorias obtenidas:', data);
        const flattenedData = data.flat();
        setCategorias(flattenedData);
        setLoading(false);
      } catch (err) {
        console.error('Error al obtener categorias:', err);
        setError('Error al cargar las categorias');
        setLoading(false);
      }
    };

    useEffect(() => {
    fetchCategorias();
    }, []);

  const filtrarCategorias = useMemo(() => {
    return categorias.filter((categorias) =>
        categorias.nombre_categoria_ana.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categorias, searchTerm]);

  if (loading) return <div>Cargando categorias...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Gestión de Categorías</CardTitle>
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
            <Plus className="mr-2 h-5 w-5" /> Agregar Categoría
          </Button>
          <ModalAC isOpen={isAddModalOpen} onClose={closeAddModal} onSucces={fetchCategorias} />
        </div>
        <div className="rounded-lg overflow-hidden shadow-xl">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="w-[200px] font-bold">Id</TableHead>
                <TableHead className="font-bold">Nombre Categoría</TableHead>
                <TableHead className="text-right font-bold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filtrarCategorias.map((categoria) => (
                  <motion.tr
                    key={categoria.id_categoria_ana}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TableCell className="font-medium">{categoria.id_categoria_ana}</TableCell>
                    <TableCell className='uppercase font-medium'>{categoria.nombre_categoria_ana}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(categoria.id_categoria_ana , categoria.nombre_categoria_ana)}
                        className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 mr-2"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteModal(categoria.id_categoria_ana)}
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

        <ModalEC
          isOpen = {isDeleteModalOpen}
          onClose = {closeDeleteModal}
          idCategoriaAna = {selectedId} 
          onSucces = {fetchCategorias}
        />
        <ModalEDC
          isOpen = {isEditModalOpen}
          onClose = {closeEditModal}
          idCategoriaAna = {selectedId}
          initialName = {selectedName}
          onSucces = {fetchCategorias} 
        />

      </CardContent>
    </Card>
  );
}
