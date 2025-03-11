import { motion, AnimatePresence } from "framer-motion"
import { X, PencilRuler, DollarSign } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { apiCall } from "@/lib/apicall"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSucces: () => void;
  id_analisis: number | null;
  nombre_analisis: string | null;
  a_precio: number | null;
  id_categoria: number | null;
  id_muestra: number | null;
  id_unidades: number | null;
  rango_ref: string | null;
}

interface CategoriaA { id_categoria_ana: number; nombre_categoria_ana: string }
interface Muestra { id_muestra: number; nombre_muestra: string }
interface Unidad { id_unidades: number; abreviatura_unidad: string; nombre_unidad: string }

export const ModalEDA: React.FC<ModalProps> = ({ isOpen, onClose, onSucces, id_analisis, nombre_analisis, 
    a_precio, id_categoria, id_muestra, id_unidades, rango_ref}) => {

  const [nombreAnalisis, setNombreAnalisis] = useState(nombre_analisis)
  const [precio, setPrecio] = useState<number | null>(a_precio)
  const [idCategoriaAna, setIdCategoriaAna] = useState<CategoriaA[]>([])
  const [idCategoriaAnaSelected, setIdCategoriaAnaSelected] = useState<number | null>(id_categoria)
  const [idMuestra, setIdMuestra] = useState<Muestra[]>([])
  const [idMuestraSelected, setIdMuestraSelected] = useState<number | null>(id_muestra)
  const [idUnidades, setIdUnidades] = useState<Unidad[]>([])
  const [idUnidadesSelected, setIdUnidadesSelected] = useState<number | null>(id_unidades)
  const [rangoReferencial, setRangoReferencial] = useState(rango_ref)

  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        if (idCategoriaAna.length === 0) {
          const categorias = await apiCall<CategoriaA>('get_cat_analisis')
          const muestras = await apiCall<Muestra>('get_muestras')
          const unidades = await apiCall<Unidad>('get_unidades')
          setIdCategoriaAna(categorias)
          setIdMuestra(muestras)
          setIdUnidades(unidades)
        }
      } catch (error) {
        console.error("Error al cargar los datos de selección:", error)
      }
    }
  
    if (isOpen) {
      fetchSelectData()
    }
  }, [isOpen, idCategoriaAna.length])

  useEffect(() => {
    if (isOpen) {
      setNombreAnalisis(nombre_analisis || "")
      setPrecio(a_precio)
      setIdCategoriaAnaSelected(id_categoria)
      setIdMuestraSelected(id_muestra)
      setIdUnidadesSelected(id_unidades)
      setRangoReferencial(rango_ref)
    }
  }, [isOpen, nombre_analisis, a_precio, id_categoria, id_muestra, id_unidades, rango_ref])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!id_analisis) return
    try {
      await apiCall("update_analisis", {
        idAnalisis: id_analisis,
        nombreAnalisis: nombreAnalisis,
        precio: precio,
        idCategoriaAna: idCategoriaAnaSelected,
        idMuestra: idMuestraSelected,
        idUnidades: idUnidadesSelected,
        rangoReferencial: rangoReferencial,
      })
      onSucces()
      onClose()
    } catch (error) {
      console.error("Error al agregar el análisis:", error)
    }
  }

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
            className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-auto overflow-hidden"
          >
            <div className="relative bg-gradient-to-r from-yellow-400 to-yellow-500 p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Editar Análisis</h2>
              <p className="text-yellow-100 text-sm">Modifica los detalles para actualizar análisis</p>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-blue-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombreAnalisis" className="text-sm font-medium text-gray-700">
                    Nombre Análisis
                  </Label>
                  <div className="relative">
                    <Input
                      id="nombreAnalisis"
                      type="text"
                      value={nombreAnalisis ?? ""}
                      onChange={(e) => setNombreAnalisis(e.target.value)}
                      className={cn(
                        "pl-10 bg-white border-gray-300",
                        "focus:ring-yellow-500 focus:yellow-blue-500"
                      )}
                      required
                    />
                    <PencilRuler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="precio" className="text-sm font-medium text-gray-700">
                    Precio
                  </Label>
                  <div className="relative">
                    <Input
                      id="precio"
                      type="number"
                      step="0.01"
                      value={precio ?? 0.00}
                      onChange={(e) => setPrecio(Number(e.target.value))}
                      className={cn(
                        "pl-10 bg-white border-gray-300",
                        "focus:ring-yellow-500 focus:border-yellow-500"
                      )}
                      required
                    />
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria" className="text-sm font-medium text-gray-700">Categoría</Label>
                      <Select
                          value={idCategoriaAnaSelected?.toString() || ""}
                          onValueChange={(value) => setIdCategoriaAnaSelected(value ? Number(value) : null)}
                        >
                          <SelectTrigger className="bg-white border-gray-300">
                            <SelectValue 
                              placeholder="Seleccione tipo de categoría" 
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {idCategoriaAna.map((categoria) => (
                              <SelectItem 
                                key={categoria.id_categoria_ana} 
                                value={categoria.id_categoria_ana.toString()}
                              >
                                {categoria.nombre_categoria_ana}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="muestra" className="text-sm font-medium text-gray-700">Muestra</Label>
                    <Select
                            value={idMuestraSelected?.toString() || ""}
                            onValueChange={(value) => setIdMuestraSelected(value ? Number(value) : null)}
                          >
                            <SelectTrigger className="bg-white border-gray-300">
                              <SelectValue 
                                placeholder="Seleccione tipo de muestra" 
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {idMuestra.map((muestra) => (
                                <SelectItem 
                                  key={muestra.id_muestra} 
                                  value={muestra.id_muestra.toString()}
                                >
                                  {muestra.nombre_muestra}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unidades" className="text-sm font-medium text-gray-700">Unidad</Label>
                  <Select
                    value={idUnidadesSelected ? idUnidadesSelected.toString() : undefined}
                    onValueChange={(value) => setIdUnidadesSelected(value ? Number(value) : null)}
                  >
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue 
                        placeholder="Seleccione tipo de unidad" 
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {idUnidades.map((unidad) => (
                        <SelectItem 
                          key={unidad.id_unidades} 
                          value={unidad.id_unidades.toString()}
                        >
                          {unidad.nombre_unidad} - {unidad.abreviatura_unidad}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="rangoReferencial" className="text-sm font-medium text-gray-700">
                    Rango Referencial
                  </Label>
                  <Input
                      id="rangoReferencial"
                      type="text"
                      value={rangoReferencial ?? ""}
                      onChange={(e) => setRangoReferencial(e.target.value)}
                      className={cn(
                        "pl-10 bg-white border-gray-300",
                        "focus:ring-yellow-500 focus:yellow-blue-500"
                      )}
                      required
                    />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <Button onClick={onClose} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                  Cancelar
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600">
                  Guardar
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}