import { motion, AnimatePresence } from 'framer-motion'
import { X, TestTubes } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from 'react'
import { apiCall } from '@/lib/apicall'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  idMuestra: number | null
  initialName: string | null
  onSucces: () => void
}

export const ModalEDM: React.FC<ModalProps> = ({ isOpen, onClose, idMuestra, initialName, onSucces }) => {
  const [name, setName] = useState(initialName)

  useEffect(() => {
    setName(initialName)
  }, [initialName])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idMuestra) return

    try {
      await apiCall("update_muestras", {
        idMuestra: idMuestra,
        nombreMuestra: name,
      })
      setName("");
      onSucces();
      onClose();
    } catch (error) {
      console.error("Error al actualizar la muestra:", error)
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
              <h2 className="text-3xl font-bold text-white mb-2">Actualizar Muestra</h2>
              <p className="text-yellow-100">Modifica los detalles para actualizar la muestra</p>
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
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre</Label>
                  <div className="relative">
                    <Input
                      id="name"
                      type="text"
                      value={(name as string) || ""}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-gray-50 border-gray-300 focus:ring-yellow-500 focus:border-yellow-500"
                      required
                    />
                    <TestTubes className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
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
