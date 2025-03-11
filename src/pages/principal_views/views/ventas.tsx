import { useState, useEffect, useCallback  } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, UserPlus, Stethoscope, Receipt, X, Ticket, Eraser, List } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ModalAP } from "@/pages/principal_views/components/modals/pacientes/agregar";
import { ModalAM } from "@/pages/principal_views/components/modals/medicos/agregar";
import { ModalBP } from "@/pages/principal_views/components/modals/ventas/buscar_p";
import { ModalBM } from "@/pages/principal_views/components/modals/ventas/buscar_m";
import { ModalBA } from "@/pages/principal_views/components/modals/ventas/buscar_a";
import  VerTicket  from "@/pages/principal_views/components/documents/ticket";
import { apiCall } from '@/lib/apicall';
import { invoke } from "@tauri-apps/api/tauri";
import { Link  } from "react-router-dom";
import Barcode from "react-barcode";


interface Analisis {
  id_analisis: number;
  nombre_categoria_ana: string;
  nombre_analisis: string;
  precio: number;
  nombre_muestra: string;
  nombre_unidad: string;
  rango_referencial: boolean;
}
interface Procedencia { id_procedencia: number; nombre_pro: string; }
interface MetodoPago { id_metodo_pago: number; nombre_metodop: string; }
interface Descuento { id_desc: number; nombre_desc: string; valor_desc: number}

interface SesionCaja {
  id_sesion_caja: number;
  fecha_apertura: string;
  id_usuario: number;
  monto_inicial: number;
}
interface VentaResponse {
  id_venta: number;
  codigo_barra: string;
  mensaje: string;
}
interface VentaDatos{
  id_paciente: number;
  id_procedencia: number;
  id_metodo_pago: number;
  id_medico: number;
  id_desc?: number | null;
  observacion: string;
  total_importe: number;
  detalles: {
    id_analisis: number;
    precio: number;
    resultado: string;
    total: number;
  }[];
  codigoBarra: string;
};

export default function VentasProceso() {
  const [selectedAnalisis, setSelectedAnalisis] = useState<Analisis[]>([]);
  const [procedencia, setProcedencia] = useState<Procedencia[]>([]);
  const [selectedProcedencia, setSelectedProcedencia] = useState<string>("");
  const [metpago, setMetPago] = useState<MetodoPago[]>([]);
  const [selectedMetpago, setSelectedMetpago] = useState<string>("");
  const [descuento, setDescuento] = useState<Descuento[]>([]);
  const [selectedDescuento, setSelectedDescuento] = useState<string>("1");;
  const [subtotal, setSubtotal] = useState(0);
  const [igv, setIgv] = useState(0);
  const [total, setTotal] = useState(0);
  const [isCajaAbierta, setIsCajaAbierta] = useState(false);
  const [codigoBarra, setCodigoBarra] = useState<string | null>(null);
  const [isTicketModalOpen, setTicketModalOpen] = useState(false);
  const [ventaDatos, setVentaDatos] = useState<VentaDatos | null>(null);
  const [ventaGuardada, setVentaGuardada] = useState(false);

  const [isAddModalOpenP, setIsAddModalOpenP] = useState(false);
  const openAddModalP = () => setIsAddModalOpenP(true);
  const closeAddModalP = () => setIsAddModalOpenP(false);
  
  const [isAddModalOpenM, setIsAddModalOpenM] = useState(false);
  const openAddModalM = () => setIsAddModalOpenM(true);
  const closeAddModalM = () => setIsAddModalOpenM(false);

  const [isModalOpenBP, setIsModalOpenBP] = useState(false);
  const openModalBP = () => setIsModalOpenBP(true);
  const closeModalBP = () => setIsModalOpenBP(false);
  const [selectedPerson, setSelectedPerson] = useState({
    id_paciente: 0, 
    num_doc: "",
    nombre_p: "",
    apellido_p: "",
    fullName: "",
    fecha_nacimiento: "",
    edad: 0,
    nombre_sx: "",
  });

  const [isModalOpenBM, setIsModalOpenBM] = useState(false);
  const openModalBM = () => setIsModalOpenBM(true);
  const closeModalBM = () => setIsModalOpenBM(false);
  const [selectedMedico, setSelectedMedico] = useState({
    id_medico: 0, 
    codigo_cmp: "",
    nombre_esp: "",
    comision: 0,
    num_doc: "",
    nombre_p: "",
    apellido_p: "",
    fullName: "",
    fecha_nacimiento: "",
    edad: 0,
    nombre_sx: "",
  });  
  const [observacion, setObservacion] = useState("");
  const [isModalOpenBA, setIsModalOpenBA] = useState(false);
  const openModalBA = () => setIsModalOpenBA(true);
  const closeModalBA = () => setIsModalOpenBA(false);
  
  const calcularEdad = (fechaNacimiento: string) => {
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth();
    const dia = hoy.getDate();
      if (mes < nacimiento.getMonth() || (mes === nacimiento.getMonth() && dia < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const handlePersonSelect = (person: { id_paciente: number, nombre_p: string, apellido_p: string, num_doc: string, fecha_nacimiento:string, nombre_sx: string }) => {
    const edad = calcularEdad(person.fecha_nacimiento);
    setSelectedPerson({
      id_paciente: person.id_paciente,
      nombre_p: person.nombre_p,
      apellido_p: person.apellido_p,
      num_doc: person.num_doc,
      fecha_nacimiento: person.fecha_nacimiento,
      fullName: `${person.apellido_p}, ${person.nombre_p}`,
      edad: edad,
      nombre_sx:person.nombre_sx,
    });
      
    closeModalBP();
  };

  const handleMedicoSelect = (medico: { id_medico: number, nombre_p: string, codigo_cmp: string, nombre_esp:string, comision: number, apellido_p: string, num_doc: string, fecha_nacimiento:string, nombre_sx: string }) => {
    const edad = calcularEdad(medico.fecha_nacimiento);
    setSelectedMedico({
      id_medico: medico.id_medico,
      codigo_cmp: medico.codigo_cmp,
      nombre_esp: medico.nombre_esp,
      comision: medico.comision,
      nombre_p: medico.nombre_p,
      apellido_p: medico.apellido_p,
      num_doc: medico.num_doc,
      fecha_nacimiento: medico.fecha_nacimiento,
      fullName: `${medico.apellido_p}, ${medico.nombre_p}`,
      edad: edad,
      nombre_sx:medico.nombre_sx,
    });
    closeModalBM();
  };

  const limpiarFormulario = () => {
    setSelectedPerson({
      id_paciente: 0,
      num_doc: "",
      nombre_p: "",
      apellido_p: "",
      fullName: "",
      fecha_nacimiento: "",
      edad: 0,
      nombre_sx: "",
    });
    setSelectedMedico({
      id_medico: 0,
      codigo_cmp: "",
      nombre_esp: "",
      comision: 0,
      num_doc: "",
      nombre_p: "",
      apellido_p: "",
      fullName: "",
      fecha_nacimiento: "",
      edad: 0,
      nombre_sx: "",
    });
    setSelectedAnalisis([]);
    setSelectedProcedencia("");
    setSelectedMetpago("");
    setSelectedDescuento("1");
    setObservacion("");
    setSubtotal(0);
    setIgv(0);
    setTotal(0);
    setVentaGuardada(false); 
  };
  const handleAddAnalisis = (newAnalisis: Analisis[]) => {
    setSelectedAnalisis((prev) => {
      return [...(prev || []), ...newAnalisis];
    });
    closeModalBA(); 
  };
  
  const flatAnalisis = selectedAnalisis.flat();
  const handleRemoveAnalisis = (id_analisis: number) => {
    setSelectedAnalisis((prev) => prev.filter((analisis) => analisis.id_analisis !== id_analisis));
  };

  useEffect(() => {
  const fetchDatos = async () => {
    try {
      
      const procedencia = await apiCall<Procedencia>("get_procedencia");
      const metodopago = await apiCall<MetodoPago>("get_metodo_pago");
      const descuento = await apiCall<Descuento>("get_descuentos");
      const ultimaSesion: SesionCaja | null = await invoke("obtener_detalles_sesion_caja");

      if (!ultimaSesion) {
        throw new Error("No hay ninguna sesión de caja abierta");
      }      
      setProcedencia(procedencia);
      setMetPago(metodopago);
      setDescuento(descuento);
      setIsCajaAbierta(true);
    } catch (err) {
      console.error("Error al obtener Medicos:", err);
      setIsCajaAbierta(false);
    }
  };
  fetchDatos();
}, []);  
  const calcularMontos = useCallback(() => {
    const calculatedTotal = selectedAnalisis.reduce((sum, analisis) => {
      return sum + analisis.precio;
    }, 0);
    const descuentoSeleccionado = descuento.find(
      (desc) => desc.id_desc.toString() === selectedDescuento
    );
    const descuentoValor = descuentoSeleccionado 
      ? calculatedTotal * (descuentoSeleccionado.valor_desc / 100) 
      : 0;
    const totalConDescuento = calculatedTotal - descuentoValor;
  
    const calculatedIgv = totalConDescuento * 0.18;
    const calculatedSubtotal = totalConDescuento - calculatedIgv;
       
    setSubtotal(calculatedSubtotal);
    setIgv(calculatedIgv);
    setTotal(totalConDescuento);
  }, [selectedAnalisis, selectedDescuento, descuento]);
  
  useEffect(() => {
    calcularMontos();
  }, [selectedAnalisis, calcularMontos]); 

  async function handleGuardarVenta() {   
   if (!selectedPerson || !selectedPerson.id_paciente || !selectedProcedencia || !selectedMetpago) {
      alert("Por favor complete todos los campos requeridos");
      return;
    }
    const procedenciaId = parseInt(selectedProcedencia); 
    const metodoPagoId = parseInt(selectedMetpago);
    const descuentoId = selectedDescuento ? parseInt(selectedDescuento) : null;
  
    if (!procedenciaId || !metodoPagoId) {
      alert("Por favor seleccione opciones válidas para Procedencia y Método de Pago.");
      return;
    }
    if (!selectedMedico || !selectedMedico.id_medico) {
      alert("Por favor seleccione un médico.");
      return;
    }
    try {
      const ventaData: VentaDatos = {
        id_paciente: selectedPerson.id_paciente,
        id_procedencia: procedenciaId,
        id_metodo_pago: metodoPagoId,
        id_medico: selectedMedico.id_medico,
        id_desc: descuentoId || null,
        observacion: observacion || "",
        total_importe: total,
        codigoBarra: "", 
        detalles: selectedAnalisis.map((analisis) => ({
          id_analisis: analisis.id_analisis,
          precio: analisis.precio,
          resultado: "",
          total: analisis.precio,
        })),
      };
      const response = await invoke<string>("registrar_venta", { venta: ventaData });
      const ventaResponse: VentaResponse = JSON.parse(response);
      setCodigoBarra(ventaResponse.codigo_barra);
      setTicketModalOpen(true);
      setVentaDatos(ventaData);
      setVentaGuardada(true);
      alert(`Venta registrada: ${ventaResponse.mensaje}, Código: ${ventaResponse.codigo_barra}`);
    } catch (error:any) {
      console.error("Error al registrar la venta:", error);
      alert(error.message || "Ocurrió un error al registrar la venta.");
    }
  }
  const isGuardarVentaDisabled =
  ventaGuardada ||
  !selectedPerson.id_paciente ||
  !selectedProcedencia ||
  !selectedMetpago ||
  !selectedAnalisis.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        >
        <div className="bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 p-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Orden de Trabajo</h1>
          <Badge variant="outline" className="text-white border-white px-3 py-1 text-lg">
            {codigoBarra ? (
              <Barcode value={codigoBarra} width={2} height={40} displayValue={false} />
            ) : (
              "Sin código"
            )}
          </Badge>
          <Link to="/listactual">
            <Button 
              variant="outline"
              className="bg-gradient-to-r from-teal-400 to-sky-400 hover:from-teal-500 hover:to-sky-500 text-white">
              <List className="mr-2 h-5 w-5" />
                Ventas
            </Button>
            </Link>
        </div>
        <div className="grid grid-cols-3 gap-6 p-6">
          <div className="col-span-2 space-y-6">
            <Card className="overflow-hidden border-teal-100">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-teal-400 to-cyan-400 p-4">
                  <h2 className="text-xl font-semibold text-white">Información del Paciente</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">DNI Paciente</Label>
                      <div className="flex space-x-2">
                        <Input readOnly className="bg-gray-100 border-teal-200" 
                          value={selectedPerson.num_doc} onChange={(e) => setSelectedPerson((prev) => ({ ...prev, name: e.target.value }))} />
                        <TooltipProvider>
                          <Tooltip>
                          <TooltipTrigger asChild>
                            <Button onClick={openModalBP} size="icon" variant="outline" className="border-teal-200 text-teal-600 hover:bg-teal-50">
                              <Search className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                            <TooltipContent>
                              <p>Buscar paciente</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button onClick={openAddModalP} size="icon" variant="outline" className="border-teal-200 text-teal-600 hover:bg-teal-50" >
                                <UserPlus className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Agregar nuevo paciente</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">Procedencia</Label>
                        <Select 
                        value={selectedProcedencia} 
                        onValueChange={setSelectedProcedencia}
                      >
                        <SelectTrigger className="bg-gray-50 border-teal-200">
                          <SelectValue placeholder="Seleccionar procedencia" />
                        </SelectTrigger>
                        <SelectContent>
                          {procedencia.map((proc) => (
                            <SelectItem 
                              key={proc.id_procedencia} 
                              value={proc.id_procedencia.toString()}
                            >
                              {proc.id_procedencia} - {proc.nombre_pro}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">Paciente</Label>
                      <Input value={selectedPerson.fullName} readOnly className="bg-gray-100 border-teal-200 uppercase"
                        onChange={(e) => {
                          const [nombre_p, apellido_p] = e.target.value.split(" "); 
                          setSelectedPerson((prev) => ({
                            ...prev,
                            fullName: e.target.value,
                            nombre_p, 
                            apellido_p, 
                          }));
                        }}  />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-600">Sexo</Label>
                        <Input value={selectedPerson.nombre_sx} readOnly className="bg-gray-100 border-teal-200" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-600">Edad</Label>
                        <Input value={selectedPerson.edad === 0 ? "" : `${selectedPerson.edad} años`} readOnly className="bg-gray-100 border-teal-200" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-cyan-100">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-cyan-400 to-sky-400 p-4">
                  <h2 className="text-xl font-semibold text-white">Información del Médico</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">Código C.M.P.</Label>
                      <div className="flex space-x-2">
                        <Input value={selectedMedico.codigo_cmp} readOnly className="bg-gray-100 border-cyan-200" />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button onClick={openModalBM} size="icon" variant="outline" className="border-cyan-200 text-cyan-600 hover:bg-cyan-50">
                                <Search className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Buscar médico</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button onClick={openAddModalM}  size="icon" variant="outline" className="border-cyan-200 text-cyan-600 hover:bg-cyan-50">
                                <Stethoscope className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Agregar nuevo médico</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <div className='flex space-x-2'>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-600">Comisión %</Label>
                        <Input value={selectedMedico.edad === 0 ? "" : selectedMedico.comision} readOnly type="number" className="w-24 bg-gray-100 border-cyan-200" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-600">Cantidad S/.</Label>
                        <Input value={total && selectedMedico.comision? (total * (selectedMedico.comision / 100)).toFixed(2)  : ""} readOnly type="number" className="w-24 bg-gray-100 border-cyan-200" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">Nombre del Médico</Label>
                      <Input value={selectedMedico.fullName} readOnly className="bg-gray-100 border-teal-200 uppercase"
                        onChange={(e) => {
                          const [nombre_p, apellido_p] = e.target.value.split(" "); 
                          setSelectedPerson((prev) => ({
                            ...prev,
                            fullName: e.target.value,
                            nombre_p, 
                            apellido_p, 
                          }));
                        }}  />                   
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">Especialidad</Label>
                      <Input value={selectedMedico.nombre_esp} readOnly className="bg-gray-100 border-cyan-200" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-sky-100">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-sky-400 to-teal-400 p-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Análisis Solicitados</h2>
                  <Button onClick={openModalBA} variant="outline" className="bg-white text-sky-600 hover:bg-sky-50 border-sky-200">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Análisis
                  </Button>
                </div>
                <div className="p-4 space-y-4">
                  <div className="border rounded-lg overflow-hidden border-sky-200">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-sky-50">
                          <TableHead className="w-[100px]">Código</TableHead>
                          <TableHead>Nombre del Análisis</TableHead>
                          <TableHead>Categoría</TableHead>
                          <TableHead className="text-center">Precio</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                      {selectedAnalisis.length > 0 ? (
                        flatAnalisis.map((analisis) => (
                          <TableRow key={analisis.id_analisis} className="hover:bg-sky-50">
                            <TableCell>{analisis.id_analisis}</TableCell>
                            <TableCell>{analisis.nombre_analisis}</TableCell>
                            <TableCell>{analisis.nombre_categoria_ana}</TableCell>
                            <TableCell className="text-center">S/ {analisis.precio}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" className="text-sky-600 hover:text-sky-700 hover:bg-sky-100" 
                                onClick={() => handleRemoveAnalisis(analisis.id_analisis)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow >))
                            ):(
                              <TableRow key="empty-row">
                              <TableCell colSpan={6} className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                                No se han agregado análisis.
                              </TableCell>
                            </TableRow>
                            )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="overflow-hidden border-teal-100">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-teal-400 to-sky-400 p-4">
                  <h2 className="text-xl font-semibold text-white">Detalles de la Venta</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Método Pago</Label>
                  <Select value={selectedMetpago} onValueChange={setSelectedMetpago}>
                  <SelectTrigger className="bg-gray-50 border-teal-200">
                    <SelectValue placeholder="Tipo Pago" />
                  </SelectTrigger>
                  <SelectContent>
                    {metpago.map((metp) => (
                      <SelectItem key={metp.id_metodo_pago} value={metp.id_metodo_pago.toString()}>
                        {metp.id_metodo_pago} - {metp.nombre_metodop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                  </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">Descuento %</Label>
                      <div className="flex items-center space-x-2">
                      <Select value={selectedDescuento} onValueChange={(value) => setSelectedDescuento(value)}>
                        <SelectTrigger className="bg-gray-50 border-teal-200">
                          <SelectValue placeholder="Seleccione Descuento" />
                        </SelectTrigger>
                        <SelectContent>
                        {descuento.map((desc) => (
                          <SelectItem
                            key={desc.id_desc} value={desc.id_desc.toString()}>
                              {desc.nombre_desc} - {desc.valor_desc}%
                          </SelectItem>
                        ))}
                      </SelectContent>
                      </Select>
                      </div>
                    </div>
                    <div className="border-t border-teal-200 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">SubTotal:</span>
                        <span className="font-medium">S/ {subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">IGV 18%:</span>
                        <span className="font-medium">S/ {igv.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Venta:</span>
                        <span>S/ {total.toFixed(2)}</span>
                      </div>
                    </div>
                    <Button
                        onClick={handleGuardarVenta}
                        disabled={!isCajaAbierta || selectedAnalisis.length === 0 || isGuardarVentaDisabled}
                        className="w-full bg-gradient-to-r from-teal-400 to-sky-400 hover:from-teal-500 hover:to-sky-500 text-white">
                        <Receipt className="mr-2 h-5 w-5" />
                        Registrar Venta
                      </Button>
                    <Button 
                        onClick={() => setTicketModalOpen(true)}
                        disabled={!selectedPerson.id_paciente || !selectedAnalisis.length}
                        variant="outline"
                        className="w-full bg-gradient-to-r from-teal-400 to-sky-400 hover:from-teal-500 hover:to-sky-500 text-white">
                      <Ticket className="mr-2 h-5 w-5" />
                      Generar Ticket 
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-teal-100">
                <CardContent className="p-4">
                  <Label className="text-sm font-medium text-gray-600">Comentario sobre la venta</Label>
                  <Textarea value={observacion} onChange={(e) => setObservacion(e.target.value)} placeholder="Ingrese un comentario..." className="mt-2 bg-gray-50 border-teal-200" />
                </CardContent>
              </Card>
              <Card className="border-teal-100">
                <CardContent className="p-4">
                  <Button 
                        onClick={limpiarFormulario}
                        variant="outline"
                        className="w-full bg-gradient-to-r from-teal-400 to-sky-400 hover:from-teal-500 hover:to-sky-500 text-white">
                      <Eraser className="mr-2 h-5 w-5" />
                      Limpiar Formulario 
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
        <ModalBP isOpen={isModalOpenBP} onClose={closeModalBP} onPersonSelect={handlePersonSelect} />
        <ModalBM isOpen={isModalOpenBM} onClose={closeModalBM} onMedicoSelect={handleMedicoSelect} />
        <ModalBA isOpen={isModalOpenBA} onClose={closeModalBA} onAnalisisSelect={handleAddAnalisis} />
        <ModalAP isOpen={isAddModalOpenP} onClose={closeAddModalP} onSucces={closeAddModalP} />
        <ModalAM isOpen={isAddModalOpenM} onClose={closeAddModalM} onSucces={closeAddModalM}/>
        <VerTicket
          isOpen={isTicketModalOpen}
          onClose={() => setTicketModalOpen(false)}
          selectedPerson={selectedPerson}
          selectedMedico={selectedMedico}
          selectedAnalisis={selectedAnalisis}
          subtotal={subtotal}
          igv={igv}
          total={total}
          codigoBarra={codigoBarra}
/>
      </div>  
    )
  }