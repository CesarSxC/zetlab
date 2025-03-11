import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, User, Phone, MapPin, Calendar, FileText, Mail, Cake, UserCircle, AlertTriangle, Loader2, Percent, Hospital } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils";
import { apiCall } from '@/lib/apicall';

interface ModalProps { 
    isOpen: boolean; 
    onClose: () => void;
    onSucces: () => void;
    medicoData?: {
        id_medico: number;
        codigo_cmp: string
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
      } | null
 }
interface TipoDocumento { id_tipo_doc: number; nombre_tdoc: string; }
interface Sexo { id_sexo: number; nombre_sx: string; }
interface Especialidad { id_especialidad: number; nombre_esp: string; }

export const ModalEDM: React.FC<ModalProps> = ({ isOpen, onClose, onSucces, medicoData  }) => {
  const [formData, setFormData] = useState({
    idMedico: medicoData?.id_medico || "", codigoCmp: medicoData?.codigo_cmp || "", especialidad: medicoData?.nombre_esp ? parseInt(medicoData.nombre_esp) : 0,
    comision: medicoData?.comision || 0 , nombre: medicoData?.nombre_p || "", apellido: medicoData?.apellido_p || "",
    telefono: medicoData?.num_telf || "", direccion: medicoData?.direccion || "",
    observacion: medicoData?.observacion || "", fechaNacimiento: medicoData?.fecha_nacimiento || "",
    edad: "", sexo: medicoData?.nombre_sx ? parseInt(medicoData.nombre_sx) : 0,
    tipoDocumento: medicoData?.nombre_tdoc ? parseInt(medicoData.nombre_tdoc) : 0, numeroDocumento: medicoData?.num_doc || "",
    email: medicoData?.correo || "", 
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([])
  const [sexos, setSexos] = useState<Sexo[]>([])
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([])

  useEffect(() => {
  const fetchSelectData = async () => {
      try {
          const tipos = await apiCall<TipoDocumento>('get_tidoc');
          const sexosList = await apiCall<Sexo>('get_sexo');
          const especialidades = await apiCall<Especialidad>('get_especialidad');
          setTiposDocumento(tipos)
          setSexos(sexosList)
          setEspecialidades(especialidades)
        } catch (error) {
            console.error("Error fetching select data:", error)
        }
    }
    if (isOpen) {
        fetchSelectData()
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && medicoData) {
      setFormData({
        idMedico: medicoData.id_medico,
        nombre: medicoData.nombre_p || "",
        especialidad: especialidades.find((e) => e.nombre_esp === medicoData.nombre_esp)?.id_especialidad || 0,
        codigoCmp: medicoData.codigo_cmp || "",
        comision: medicoData.comision || 0,
        apellido: medicoData.apellido_p || "",
        telefono: medicoData.num_telf || "",
        direccion: medicoData.direccion || "",
        observacion: medicoData.observacion || "",
        fechaNacimiento: medicoData.fecha_nacimiento || "",
        edad: medicoData.fecha_nacimiento
          ? calculateAge(medicoData.fecha_nacimiento)
          : "",
        sexo: sexos.find((s) => s.nombre_sx === medicoData.nombre_sx)?.id_sexo || 0,
        tipoDocumento:
          tiposDocumento.find((t) => t.nombre_tdoc === medicoData.nombre_tdoc)?.id_tipo_doc || 0,
        numeroDocumento: medicoData.num_doc || "",
        email: medicoData.correo || "",
      });
    }
  }, [isOpen, medicoData, tiposDocumento, sexos]);
  

  const calculateBirthDate = (age: string): string => {
    const today = new Date();
    const birthYear = today.getFullYear() - parseInt(age);
    return `${birthYear}-${(today.getMonth() + 1 < 10 ? '0' : '') + (today.getMonth() + 1)}-${today.getDate() < 10 ? '0' : ''}${today.getDate()}`;
  };

  const calculateAge = (birthDate: string): string => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age.toString();
  };

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { id, value } = e.target
  if (id === 'fechaNacimiento') {
    const calculatedAge = calculateAge(value);
    setFormData(prev => ({
      ...prev, 
      [id]: value,
      'edad': calculatedAge
    }));
  } else if (id === 'edad') {
    const calculatedBirthDate = calculateBirthDate(value);
    setFormData(prev => ({
      ...prev,
      'edad': value,
      'fechaNacimiento': calculatedBirthDate
    }));
  } else {
    setFormData(prev => ({ ...prev, [id]: value }))
  }
  
  if (errors[id]) {
    setErrors(prev => ({ ...prev, [id]: "" }))
  }
}
const handleSelectChange = (value: string, id: string) => {
    const numericValue = parseInt(value);
    setFormData((prev) => ({
      ...prev,
      [id]: numericValue,
    }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      await apiCall("update_medico", {
        idPersona: formData.idMedico,
        nombreP: formData.nombre || "",
        apellidoP: formData.apellido || "",
        idSexo: formData.sexo,
        idTipoDoc: formData.tipoDocumento,
        numDoc: formData.numeroDocumento || "",
        direccion: formData.direccion || "",
        correo: formData.email || "",
        fechaNacimiento: new Date(formData.fechaNacimiento).toISOString().split("T")[0] ,
        observacion: formData.observacion || "",
        numTelf: formData.telefono || "",
        codigoCmp: formData.codigoCmp,
        idEspecialidad: formData.especialidad,
        comision: parseInt(formData.comision.toString()) || 0,
      })
      onSucces();
      onClose();      
    } catch (error) {
      console.error("Error al actualizar medico:", error)

    } finally {
      setIsSubmitting(false)
    }
  }

  const formFields = [
    { id: "nombre", label: "Nombres", icon: User, tab: "personal", type:"text", },
    { id: "apellido", label: "Apellidos", icon: User, tab: "personal", type:"text", },
    { id: "fechaNacimiento", label: "Fecha Nacimiento", icon: Calendar, tab: "personal", type: "date" },
    { id: "edad", label: "Edad", icon: Cake, tab: "personal", type:"number" },
    { id: "telefono", label: "Teléfono", icon: Phone, tab: "extra" },
    { id: "email", label: "Email", icon: Mail, tab: "extra", type:"email", },
    { id: "direccion", label: "Dirección", icon: MapPin, tab: "extra" },
    { id: "codigoCmp", label: "Codigo C.M.P.", icon: Hospital, tab: "extra", type:"text" },
    { id: "comision", label: "Comisión", icon: Percent, tab: "extra", type:"number" },
  ]
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
            className="bg-white rounded-lg shadow-2xl max-w-lg w-full mx-auto overflow-hidden"
          >
            <div className="relative bg-gradient-to-r from-yellow-500 to-yellow-300 p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Actualizar Médico</h2>
              <p className="text-yellow-100">Modifica los detalles para actualizar el Médico</p>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-blue-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="personal">Información Personal</TabsTrigger>
                  <TabsTrigger value="extra">Información Extra</TabsTrigger>
                </TabsList>
                {["personal", "extra"].map((tab) => (
                  <TabsContent key={tab} value={tab} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {formFields
                        .filter((field) => field.tab === tab)
                        .map(({ id, label, icon: Icon, type }) => (
                          <div key={id} className="space-y-2">
                            <Label htmlFor={id} className="text-sm font-medium text-gray-700">
                              {label}
                            </Label>
                            <div className="relative">
                              <Input
                                id={id}
                                type={type || "text"}
                                value={formData[id as keyof typeof formData]}
                                onChange={handleChange}
                                className={cn(
                                  "pl-10 bg-gray-50 border-gray-300 focus:ring-teal-500 focus:border-teal-500",
                                  errors[id] && "border-red-500"
                                )}
                              />
                              <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                            {errors[id] && <p className="text-red-500 text-xs mt-1">{errors[id]}</p>}
                          </div>
                        ))}
                      {tab === "personal" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="tipoDocumento" className="text-sm font-medium text-gray-700">
                              Tipo de Documento
                            </Label>
                            <Select onValueChange={(value) => handleSelectChange(value, "tipoDocumento")}
                                    value={formData.tipoDocumento > 0 ? formData.tipoDocumento.toString() : ""}>
                              <SelectTrigger className={cn(
                                "bg-gray-50 border-gray-300 focus:ring-teal-500 focus:border-teal-500",
                                errors.tipoDocumento && "border-red-500"
                              )}>
                                <SelectValue placeholder="Seleccione tipo de documento" />
                              </SelectTrigger>
                              <SelectContent>
                                {tiposDocumento?.length > 0 ? (
                                  tiposDocumento.map((tipo) =>
                                    tipo?.id_tipo_doc ? (
                                      <SelectItem key={tipo.id_tipo_doc} value={tipo.id_tipo_doc.toString()}>
                                        {tipo.nombre_tdoc}
                                      </SelectItem>
                                    ) : null
                                  )
                                ) : (
                                  <p>No hay tipos de documento disponibles</p>
                                )}
                              </SelectContent>
                            </Select>
                            {errors.tipoDocumento && <p className="text-red-500 text-xs mt-1">{errors.tipoDocumento}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="numeroDocumento" className="text-sm font-medium text-gray-700">
                              Número de Documento
                            </Label>
                            <div className="relative">
                              <Input
                                id="numeroDocumento"
                                type="number"
                                value={formData.numeroDocumento}
                                onChange={handleChange}
                                className={cn(
                                  "pl-10 bg-gray-50 border-gray-300 focus:ring-teal-500 focus:border-teal-500",
                                  errors.numeroDocumento && "border-red-500"
                                )}
                              />
                              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                            {errors.numeroDocumento && <p className="text-red-500 text-xs mt-1">{errors.numeroDocumento}</p>}
                          </div>
                        </>
                      )}
                      {tab === "extra" && (
                     <>
  
                        <div className="space-y-2">
                          <Label htmlFor="sexo" className="text-sm font-medium text-gray-700">
                            Sexo
                          </Label>
                          <Select onValueChange={(value) => handleSelectChange(value, "sexo")}
                                    value={formData.sexo > 0 ? formData.sexo.toString() : ""}>
                            <SelectTrigger className="bg-gray-50 border-gray-300 focus:ring-teal-500 focus:border-teal-500">
                              <SelectValue placeholder="Seleccione sexo" />
                            </SelectTrigger> 
                            <SelectContent>
                                {sexos?.length > 0 ? (
                                  sexos.map((tipo) =>
                                    tipo?.id_sexo ? (
                                      <SelectItem key={tipo.id_sexo} value={tipo.id_sexo.toString()}>
                                        {tipo.nombre_sx}
                                      </SelectItem>
                                    ) : null
                                  )
                                ) : (
                                  <p>No hay tipos de documento disponibles</p>
                                )}
                              </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="nombreEspecialidad" className="text-sm font-medium text-gray-700">
                            Especialidad
                          </Label>
                          <Select
                            onValueChange={(value) => handleSelectChange(value, "nombreEspecialidad")}
                            defaultValue={formData.especialidad > 0 ? formData.especialidad.toString() : ""}
                          >
                            <SelectTrigger className="bg-gray-50 border-gray-300 focus:ring-teal-500 focus:border-teal-500">
                              <SelectValue placeholder="Seleccione especialidad" />
                            </SelectTrigger>
                            <SelectContent>
                                {especialidades?.length > 0 ? (
                                  especialidades.map((tipo) =>
                                    tipo?.id_especialidad ? (
                                      <SelectItem key={tipo.id_especialidad} value={tipo.id_especialidad.toString()}>
                                        {tipo.nombre_esp}
                                      </SelectItem>
                                    ) : null
                                  )
                                ) : (
                                  <p>No hay tipos de especialidades disponibles</p>
                                )}
                              </SelectContent>
                          </Select>
                          </div>                        
                    </>     
                      )}
                    </div>
                    {tab === "extra" && (
                      <div className="space-y-2">
                        <Label htmlFor="observacion" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Observación
                        </Label>
                        <Textarea
                          id="observacion"
                          value={formData.observacion}
                          onChange={handleChange}
                          className="bg-gray-50 border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                          placeholder="Agrega una observación si es necesario"
                        />
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500  flex items-center">
                  <AlertTriangle size={16} className="mr-1" />
                  Campos requeridos
                </div>
                <div className="flex justify-end space-x-2">
                  <Button onClick={onClose} type="button" variant="outline" className="hover:bg-gray-100" disabled={isSubmitting}> Cancelar </Button>
                  <Button type="submit" className="bg-gradient-to-r from-yellow-500 to-yellow-300 text-white hover:from-yellow-600 hover:to-yellow-500" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <UserCircle className="mr-2" size={18} />
                        Actualizar Médico
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}