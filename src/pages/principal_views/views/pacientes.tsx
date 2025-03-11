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
import { ModalAP } from "@/pages/principal_views/components/modals/pacientes/agregar";
import { ModalEP } from "@/pages/principal_views/components/modals/pacientes/eliminar";
import { ModalEDP } from "@/pages/principal_views/components/modals/pacientes/editar";

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

export default function Personas() {
  const [personas, setPersonas] = useState<Personas[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedPaciente, setSelectedPaciente] = useState<Personas | null>(null);

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
  const openEditModal = (id: number, paciente: Personas) => {
    setSelectedId(id);
    setSelectedPaciente(paciente);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedId(null);
    setSelectedPaciente(null);
  };

  const fetchPacientes = async () => {
    try {
      const data = await apiCall<Personas[]>("get_paciente");
      console.log("Personas obtenidas:", data);
      const flattenedData = data.flat();
      setPersonas(flattenedData);
      setLoading(false);
      console.log(data);
    } catch (err) {
      console.error("Error al obtener Personas:", err);
      setError("Error al cargar las Personas");
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
    fetchPacientes();
  }, []);

  const filtrarPersonas = useMemo(() => {
    return personas.filter((personas) =>{
      const search = searchTerm.toLowerCase();

    return (
      personas.apellido_p.toLowerCase().includes(search) ||
      personas.nombre_p.toLowerCase().includes(search) ||
      personas.num_telf.toLowerCase().includes(search) ||
      personas.num_doc.toLowerCase().includes(search)
    );
  });
}, [personas, searchTerm]);

  if (loading) return <div>Cargando pacientes...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Gestión de Pacientes
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
            <UserRoundPlus className="mr-2 h-5 w-5" /> Agregar Paciente
          </Button>
          <ModalAP isOpen={isAddModalOpen} onClose={closeAddModal} onSucces={fetchPacientes} />
        </div>
        <div className="rounded-lg overflow-hidden shadow-xl">
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="font-bold">Id</TableHead>
                <TableHead className="font-bold">Apellidos</TableHead>
                <TableHead className="font-bold">Nombres</TableHead>
                <TableHead className="font-bold">Documento</TableHead>
                <TableHead className="font-bold">Telefono</TableHead>
                <TableHead className="font-bold">Edad</TableHead>
                <TableHead className="text-center font-bold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filtrarPersonas.map((persona) => (
                  <motion.tr
                    key={persona.id_paciente}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TableCell className="font-medium">
                      {persona.id_paciente}
                    </TableCell>
                    <TableCell className="uppercase font-medium">
                      {persona.apellido_p}
                    </TableCell>
                    <TableCell className="uppercase font-medium">
                      {persona.nombre_p}
                    </TableCell>
                    <TableCell className="uppercase font-medium">
                      {persona.num_doc}
                    </TableCell>
                    <TableCell className="uppercase font-medium">
                      {persona.num_telf}
                    </TableCell>
                    <TableCell className="uppercase font-medium">
                      {calcularEdad(persona.fecha_nacimiento)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          openEditModal(
                            persona.id_paciente,
                            persona
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
                        onClick={() => openDeleteModal(persona.id_paciente)}
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
        <ModalEP
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          idPaciente={selectedId}
          onSucces={fetchPacientes}
        />
        <ModalEDP
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSucces={fetchPacientes}
          pacienteData={selectedPaciente}
        />
      </CardContent>
    </Card>
  );
}
