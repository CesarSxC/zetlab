import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useState } from 'react'
import { apiCall } from '@/lib/apicall'

interface ModalEliminarProps {
  isOpen: boolean
  onClose: () => void
  idEspecialidad: number | null
  onSucces: () => void
}

export const ModalEES: React.FC<ModalEliminarProps> = ({ isOpen, onClose, idEspecialidad, onSucces }) => {
  const [loading, setLoading] = useState(false)
  
  const handleDelete = async () => {
    setLoading(true)
    try {
      await apiCall("delete_especialidad", { idEspecialidad })
      onSucces();
      onClose();
    } catch (error) {
      console.error("Error al eliminar la especialidad:", error)
    } finally {
      setLoading(false)
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
            <div className="relative bg-gradient-to-r from-red-500 to-red-700 p-6 pb-14">
              <h2 className="text-3xl font-bold text-white mb-2">Eliminar Información</h2>
              <p className="text-red-100">¿Estás seguro de que deseas eliminar este elemento?</p>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-red-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6 -mt-8">
              <div className="bg-gray-50 rounded-xl p-4 shadow-lg text-center">
                <p className="text-gray-700">
                  Esta acción no se puede deshacer. Se eliminará permanentemente la información.
                </p>
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-2">
                <Button onClick={onClose} type="button" variant="outline" className="hover:bg-gray-100">
                  Cancelar
                </Button>
                <Button
                  onClick={handleDelete}
                  className="bg-gradient-to-r from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800"
                  disabled={loading}
                >
                  {loading ? "Eliminando..." : "Eliminar"}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
