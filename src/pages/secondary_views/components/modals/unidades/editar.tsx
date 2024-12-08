import { motion, AnimatePresence } from 'framer-motion'
import { X, PencilRuler, CaseUpper } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from 'react'
import { apiCall } from '@/lib/apicall'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  idUnidades: number | null
  initialName: string | null
  initialAbreviatura: string | null
  onSucces: () => void
}

export const ModalEDU: React.FC<ModalProps> = ({ isOpen, onClose, idUnidades, initialName, initialAbreviatura, onSucces }) => {
  const [nombreUnidad, setNombreUnidad] = useState(initialName);
  const [abreviatura, setAbreviatura] = useState(initialAbreviatura)

  useEffect(() => {
    setNombreUnidad(initialName);
    setAbreviatura(initialAbreviatura)
  }, [initialName, initialAbreviatura])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idUnidades) return

    try {
      await apiCall("update_unidades", {
        idUnidades: idUnidades,
        abreviaturaUnidad: abreviatura,
        nombreUnidad: nombreUnidad,
      })
      setNombreUnidad("");
      onSucces();
      onClose();
    } catch (error) {
      console.error("Error al actualizar unidad:", error)
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
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto overflow-hidden"
          >
            <div className="relative bg-gradient-to-r from-yellow-500 to-yellow-300 p-6 pb-14">
              <h2 className="text-3xl font-bold text-white mb-2">Actualizar Unidad</h2>
              <p className="text-yellow-100">Modifica los detalles para actualizar la unidad</p>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-yellow-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 -mt-8">
              <div className="bg-gray-50 rounded-xl p-4 shadow-lg space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre Unidad</Label>
                  <div className="relative">
                    <Input
                      id="name"
                      type="text"
                      value={(nombreUnidad as string) || ""}
                      onChange={(e) => setNombreUnidad(e.target.value)}
                      className="pl-10 bg-gray-50 border-gray-300 focus:ring-yellow-500 focus:border-yellow-500"
                      required
                    />
                    <PencilRuler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Abreviatura Unidad</Label>
                  <div className="relative">
                    <Input
                      id="abreviatura"
                      type="text"
                      value={(abreviatura as string) || ""}
                      onChange={(e) => setAbreviatura(e.target.value)}
                      className="pl-10 bg-gray-50 border-gray-300 focus:ring-yellow-500 focus:border-yellow-500"
                      required
                    />
                    <CaseUpper className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button onClick={onClose} type="button" variant="outline" className="hover:bg-gray-100">
                  Cancelar
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-yellow-500 to-yellow-300 text-white hover:from-yellow-600 hover:to-yellow-500">
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
