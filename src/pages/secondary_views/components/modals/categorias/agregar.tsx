import { motion, AnimatePresence } from 'framer-motion'
import { X, FlaskConical } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react'
import { apiCall } from '@/lib/apicall'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onSucces: () => void
}

export const ModalAC: React.FC<ModalProps> = ({ isOpen, onClose, onSucces }) => {
  const [name, setName] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiCall("insert_cat_analisis", {
        nombreCategoriaAna: name,
      })
      setName("");
      onSucces();
      onClose();
    } catch (error) {
      console.error("Error al agregar la categoria:", error)
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
            <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 p-6 pb-14">
              <h2 className="text-3xl font-bold text-white mb-2">Agregar Información</h2>
              <p className="text-blue-100">Completa los detalles a continuación</p>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-blue-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6 -mt-8">
              <div className="bg-gray-50 rounded-xl p-4 shadow-lg space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre Categoría</Label>
                  <div className="relative">
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <FlaskConical className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button onClick={onClose} type="button" variant="outline" className="hover:bg-gray-100">
                  Cancelar
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-teal-400 to-blue-500 text-white hover:from-teal-500 hover:to-blue-600">
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
