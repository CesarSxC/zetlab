import { useState, useEffect, useMemo } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { apiCall } from "@/lib/apicall";
import { ModalAA } from "@/pages/principal_views/components/modals/analisis/agregar";
import { ModalEM } from "@/pages/principal_views/components/modals/medicos/eliminar";
import { ModalEDA } from "@/pages/principal_views/components/modals/analisis/editar";

interface Analisis {
    id_analisis: number;
    nombre_categoria_ana: string;
    nombre_analisis: string;
    precio: number;
    nombre_muestra: string;
    nombre_unidad: string;
    rango_referencial: boolean;
    id_categoria_ana: number;
    id_muestra: number;
    id_unidades: number;
}

export default function Analisis() {
  const [Analisis, setAnalisis] = useState<Analisis[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectNombreCat, setselectNombreCat] = useState<number | null>(null);
  const [selectNombreAna, setselectNombreAna] = useState<string | null>(null);
  const [selectPrecio, setselectPrecio] = useState<number | null>(null);
  const [selectNombreMu, setselectNombreMu] = useState<number | null>(null);
  const [selectNombreUn, setselectNombreUn] = useState<number | null>(null);
  const [selectRangoRe, setselectRangoRe] = useState<boolean | null>(null);
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
  const openEditModal = (id: number, analisis: string, precio: number, rangoref: boolean, categoria: number, muestra: number, 
    unidad: number
  ) => {
    console.log("Unidad:", unidad)  // Este es el valor que va a selectNombreUn

    setSelectedId(id);
    setselectNombreAna(analisis);
    setselectPrecio(precio);
    setselectNombreCat(categoria);
    setselectRangoRe(rangoref);
    setselectNombreMu(muestra);
    setselectNombreUn(unidad);
    setIsEditModalOpen(true);

  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedId(null);
    setselectNombreAna(null);
    setselectPrecio(0);
    setselectRangoRe(false);
    setselectNombreCat(null);
    setselectNombreMu(null);
    setselectNombreUn(null);
  };

  const fetchAnalisis = async () => {
    try {
      const data = await apiCall<Analisis[]>("get_analisis");
      console.log("Analisis obtenidas:", data);
      const flattenedData = data.flat();
      setAnalisis(flattenedData);
      setLoading(false);
      console.log(data);
    } catch (err) {
      console.error("Error al obtener Analisis:", err);
      setError("Error al cargar las Analisis");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalisis();
  }, []);

  const filtrarAnalisis = useMemo(() => {
    return Analisis.filter((analisis) => {
      const search = (searchTerm || "").toLowerCase();
      const nombreAnalisis = analisis.nombre_analisis || ""; 
      const nombreCategoriaAna = analisis.nombre_categoria_ana || ""; 
  
      return (
        nombreAnalisis.toLowerCase().includes(search) || 
        nombreCategoriaAna.toLowerCase().includes(search)
      );
    });
  }, [Analisis, searchTerm]);
  

  if (loading) return <div>Cargando Analisis...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Análisis y Exámenes
        </CardTitle>
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
            <Plus className="mr-2 h-5 w-5" /> Agregar Análisis
          </Button>
          <ModalAA isOpen={isAddModalOpen} onClose={closeAddModal} onSucces={fetchAnalisis}/>
        </div>
        <div className="rounded-lg overflow-hidden shadow-xl">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="font-bold">Id</TableHead>
                <TableHead className="font-bold">Nombre A.</TableHead>
                <TableHead className="font-bold">Categoría</TableHead>
                <TableHead className="font-bold">Precio</TableHead>
                <TableHead className="font-bold">Unidad</TableHead>
                <TableHead className="font-bold">Rango</TableHead>
                <TableHead className="text-right font-bold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filtrarAnalisis.map((analisis) => (
                  <motion.tr
                    key={analisis.id_analisis}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TableCell className="font-medium">
                      {analisis.id_analisis}
                    </TableCell>
                    <TableCell className="uppercase font-medium">
                      {analisis.nombre_analisis}
                    </TableCell>
                    <TableCell className="uppercase font-medium">
                      {analisis.nombre_categoria_ana}
                    </TableCell>
                    <TableCell className="uppercase font-medium">
                      {analisis.precio}
                    </TableCell>
                    <TableCell className="uppercase font-medium">
                      {analisis.nombre_unidad}
                    </TableCell>
                    <TableCell className="uppercase font-medium text-center">
                    <Checkbox
                      checked={analisis.rango_referencial}
                      disabled
                      className={`cursor-default rounded-md ${
                        analisis.rango_referencial
                          ? "bg-green-500 border-green-500 text-white" 
                          : "bg-red-500 border-red-500 text-white"
                      } data-[state=checked]:ring-2 data-[state=checked]:ring-offset-1`}
                    />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          openEditModal(
                            analisis.id_analisis, analisis.nombre_analisis, analisis.precio, analisis.rango_referencial,
                            analisis.id_categoria_ana, analisis.id_muestra, analisis.id_unidades,
                          )
                        }
                        className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 mr-2"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteModal(analisis.id_analisis)}
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
        <ModalEM
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          idMedico={selectedId}
          onSucces={fetchAnalisis}
        />
        <ModalEDA
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSucces={fetchAnalisis}
          id_analisis={selectedId}
          nombre_analisis={selectNombreAna}
          a_precio={selectPrecio}
          id_categoria={selectNombreCat}
          id_muestra={selectNombreMu}
          id_unidades={selectNombreUn}
          rango_ref={selectRangoRe}
        />
      </CardContent>
    </Card>
  );
}
