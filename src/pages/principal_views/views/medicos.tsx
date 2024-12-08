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
import { Search, Edit, Trash2, UserRoundPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiCall } from "@/lib/apicall";
import { ModalAM } from "@/pages/principal_views/components/modals/medicos/agregar";
import { ModalEM } from "@/pages/principal_views/components/modals/medicos/eliminar";
import { ModalEDM } from "@/pages/principal_views/components/modals/medicos/editar";

interface Medicos {
  id_medico: number;
  codigo_cmp: string;
  nombre_esp: string;
  comision: number;
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

export default function Medicos() {
  const [medicos, setmedicos] = useState<Medicos[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedMedico, setSelectedMedico] = useState<Medicos | null>(null);
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
  const openEditModal = (id: number, medico: Medicos) => {
    setSelectedId(id);
    setSelectedMedico(medico);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedId(null);
    setSelectedMedico(null);
  };

  const fetchMedicos = async () => {
    try {
      const data = await apiCall<Medicos[]>("get_medico");
      console.log("Medicos obtenidas:", data);
      const flattenedData = data.flat();
      setmedicos(flattenedData);
      setLoading(false);
      console.log(data);
    } catch (err) {
      console.error("Error al obtener Medicos:", err);
      setError("Error al cargar las Medicos");
      setLoading(false);
    }
  };

  const calcularEdad = (fecha_nacimiento: string): number => {
    const fnacimiento = new Date(fecha_nacimiento);
    const factual = new Date();
    let edad = factual.getFullYear() - fnacimiento.getFullYear();

    const mes = factual.getMonth() - fnacimiento.getMonth();
    if (mes < 0 || (mes === 0 && factual.getDate() < fnacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  useEffect(() => {
    fetchMedicos();
  }, []);

  const filtrarMedicos = useMemo(() => {
    return medicos.filter((medicos) =>{
      const search = searchTerm.toLowerCase();

    return (
      medicos.apellido_p.toLowerCase().includes(search) ||
      medicos.nombre_p.toLowerCase().includes(search) ||
      medicos.num_telf.toLowerCase().includes(search) ||
      medicos.num_doc.toLowerCase().includes(search) ||
      medicos.nombre_esp.toLowerCase().includes(search)
    );
  });
}, [medicos, searchTerm]);

  if (loading) return <div>Cargando medicos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Gestión de Médicos
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
            <UserRoundPlus className="mr-2 h-5 w-5" /> Agregar Médico
          </Button>
          <ModalAM isOpen={isAddModalOpen} onClose={closeAddModal} onSucces={fetchMedicos}/>
        </div>
        <div className="rounded-lg overflow-hidden shadow-xl">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="font-bold">Id</TableHead>
                <TableHead className="font-bold">Apellidos</TableHead>
                <TableHead className="font-bold">Nombres</TableHead>
                <TableHead className="font-bold">Especialidad</TableHead>
                <TableHead className="font-bold">Telefono</TableHead>
                <TableHead className="font-bold text-center">Edad</TableHead>
                <TableHead className="font-bold text-center">Comision %</TableHead>
                <TableHead className="text-right font-bold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filtrarMedicos.map((medico) => (
                  <motion.tr
                    key={medico.id_medico}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TableCell className="font-medium">
                      {medico.id_medico}
                    </TableCell>
                    <TableCell className="uppercase font-medium">
                      {medico.apellido_p}
                    </TableCell>
                    <TableCell className="uppercase font-medium">
                      {medico.nombre_p}
                    </TableCell>
                    <TableCell className="uppercase font-medium">
                      {medico.nombre_esp}
                    </TableCell>
                    <TableCell className="uppercase font-medium">
                      {medico.num_telf}
                    </TableCell>
                    <TableCell className="uppercase font-medium text-center">
                      {calcularEdad(medico.fecha_nacimiento)}
                    </TableCell>
                    <TableCell className="uppercase font-medium text-center">
                      {medico.comision}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          openEditModal(
                            medico.id_medico,
                            medico
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
                        onClick={() => openDeleteModal(medico.id_medico)}
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
          onSucces={fetchMedicos}
        />
        <ModalEDM
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSucces={fetchMedicos}
          medicoData={selectedMedico}
        />
      </CardContent>
    </Card>
  );
}
