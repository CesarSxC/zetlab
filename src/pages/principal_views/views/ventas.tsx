import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, UserPlus, Stethoscope, Receipt, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

interface Analisis {
  id_analisis: string
  nombre_analisis: string
  nombre_categoria_ana: string
  precio: number
}

export default function VentasProceso() {
  const [selectedExams, setSelectedExams] = useState<Analisis[]>([
    { id_analisis: 'E0132', nombre_analisis: 'SARS-COV-2 X PCR (PCR-RT MOLECULAR)', nombre_categoria_ana: 'BIOQUÍMICA', precio: 100 },
    { id_analisis: 'E0244', nombre_analisis: 'UREA', nombre_categoria_ana: 'BIOQUÍMICA', precio: 15 },
  ])
  const [subtotal, setSubtotal] = useState(0)
  const [igv, setIgv] = useState(0)
  const [total, setTotal] = useState(0)
  const [priceType, setPriceType] = useState("public")

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
    id_persona: 0, 
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

  const handlePersonSelect = (person: { id_persona: number, nombre_p: string, apellido_p: string, num_doc: string, fecha_nacimiento:string, nombre_sx: string }) => {
    console.log("Persona seleccionada:", person);
    const edad = calcularEdad(person.fecha_nacimiento);
    setSelectedPerson({
      id_persona: person.id_persona,
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

  const handleMedicoSelect = (medico: { id_persona: number, nombre_p: string, codigo_cmp: string, nombre_esp:string, comision: number, apellido_p: string, num_doc: string, fecha_nacimiento:string, nombre_sx: string }) => {
    console.log("Medico seleccionada:", medico);
    const edad = calcularEdad(medico.fecha_nacimiento);
    setSelectedMedico({
      id_medico: medico.id_persona,
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

  useEffect(() => {
    const newSubtotal = selectedExams.reduce((sum, exam) => sum + exam.precio, 0)
    const newIgv = newSubtotal * 0.18
    setSubtotal(newSubtotal)
    setIgv(newIgv)
    setTotal(newSubtotal + newIgv)
  }, [selectedExams])

  const removeExam = (codExamen: string) => {
    setSelectedExams(selectedExams.filter(exam => exam.id_analisis !== codExamen))
  }

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
            OT000163
          </Badge>
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
                          value={selectedPerson.nombre_p} onChange={(e) => setSelectedPerson((prev) => ({ ...prev, name: e.target.value }))} />
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
                      <Select defaultValue="02">
                        <SelectTrigger className="bg-gray-50 border-teal-200">
                          <SelectValue placeholder="Seleccionar procedencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="02">02 - MÉDICO</SelectItem>
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
                        <Input value={selectedPerson.edad === 0 ? "" : selectedPerson.edad} readOnly className="bg-gray-100 border-teal-200" />
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
                        <Input readOnly type="number" className="w-24 bg-gray-100 border-cyan-200" />
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
                  <RadioGroup defaultValue="public" className="flex space-x-4" onValueChange={setPriceType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public" id="public" />
                      <Label htmlFor="public">Precio venta Público</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="corporate" id="corporate" />
                      <Label htmlFor="corporate">Precio Corporativo/Convenio</Label>
                    </div>
                  </RadioGroup>

                  <div className="border rounded-lg overflow-hidden border-sky-200">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-sky-50">
                          <TableHead className="w-[100px]">Código</TableHead>
                          <TableHead>Nombre del Examen</TableHead>
                          <TableHead>Categoría</TableHead>
                          <TableHead className="text-right">Precio</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedExams.map((exam) => (
                          <TableRow key={exam.id_analisis} className="hover:bg-sky-50">
                            <TableCell>{exam.id_analisis}</TableCell>
                            <TableCell>{exam.nombre_analisis}</TableCell>
                            <TableCell>{exam.nombre_categoria_ana}</TableCell>
                            <TableCell className="text-right">S/ {exam.precio.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-sky-100 text-sky-800 border-sky-300">
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" className="text-sky-600 hover:text-sky-700 hover:bg-sky-100" onClick={() => removeExam(exam.id_analisis)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Right Column - Sale Details */}
          <div className="space-y-6">
            <Card className="overflow-hidden border-teal-100">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-teal-400 to-sky-400 p-4">
                  <h2 className="text-xl font-semibold text-white">Detalles de la Venta</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Select defaultValue="T1">
                      <SelectTrigger className="border-teal-200">
                        <SelectValue placeholder="Tipo de comprobante" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="T1">T1 - TICKET</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="01">
                      <SelectTrigger className="border-teal-200">
                        <SelectValue placeholder="Método de pago" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="01">01 - CONTADO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">Cliente</Label>
                    <div className="flex space-x-2">
                      <Input placeholder="00001" className="bg-gray-50 border-teal-200" />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon"variant="outline" className="border-teal-200 text-teal-600 hover:bg-teal-50">
                                <Search className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Buscar cliente</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-600">DNI</Label>
                        <Input value="00000000" readOnly className="bg-gray-100 border-teal-200" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-600">Nombre</Label>
                        <Input value="CLIENTE GENÉRICO" readOnly className="bg-gray-100 border-teal-200" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">Descuento</Label>
                      <div className="flex items-center space-x-2">
                        <Select defaultValue="amount">
                          <SelectTrigger className="w-[150px] border-teal-200">
                            <SelectValue placeholder="Tipo descuento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="amount">Por Importe</SelectItem>
                          </SelectContent>
                        </Select>
                        <span>=</span>
                        <Input type="number" defaultValue="0" className="w-24 bg-gray-50 border-teal-200" />
                        <Input value="S/ 0.00" readOnly className="bg-gray-100 border-teal-200" />
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

                    <Button className="w-full bg-gradient-to-r from-teal-400 to-sky-400 hover:from-teal-500 hover:to-sky-500 text-white">
                      <Receipt className="mr-2 h-5 w-5" />
                      Generar Venta
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-teal-100">
                <CardContent className="p-4">
                  <Label className="text-sm font-medium text-gray-600">Comentario sobre la venta</Label>
                  <Textarea placeholder="Ingrese un comentario..." className="mt-2 bg-gray-50 border-teal-200" />
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
        <ModalBP isOpen={isModalOpenBP} onClose={closeModalBP} onPersonSelect={handlePersonSelect} />
        <ModalBM isOpen={isModalOpenBM} onClose={closeModalBM} onPersonSelect={handleMedicoSelect} />
        <ModalBA isOpen={isModalOpenBA} onClose={closeModalBA} onPersonSelect={handleMedicoSelect} />
        <ModalAP isOpen={isAddModalOpenP} onClose={closeAddModalP} onSucces={closeAddModalP} />
        <ModalAM isOpen={isAddModalOpenM} onClose={closeAddModalM} onSucces={closeAddModalM}/>
      </div>
      
    )
  }