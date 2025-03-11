import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, RefreshCcw, X, Plus, ReceiptText } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
/* import { Card, CardContent } from "@/components/ui/card"
 */import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger, 
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ModalAperturarCaja } from "@/pages/principal_views/components/modals/caja/agregar";
import { ModalCerrarCaja } from "@/pages/principal_views/components/modals/caja/cerrarcaja";
import { invoke } from "@tauri-apps/api/tauri";
import { useNavigate  } from 'react-router-dom';

interface Register {
  id_sesion_caja: number;
  nombre_usuario: string;
  monto_inicial: number;
  monto_final: number | null;
  fecha_apertura: string;
  fecha_cierre: string | null;
  estado: string;
}

interface SesionCaja {
  id_sesion_caja: number;
  fecha_apertura: string;
  id_usuario: number;
  monto_inicial: number;
}

export default function RegistroCaja() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isAddModalOpenCaja, setIsAddModalOpenCaja] = useState(false);
  const [isModalCerrarOpen, setIsModalCerrarOpen] = useState(false);
  const [idSesionCaja, setIdSesionCaja] = useState<number | null>(null);
  const [registers, setRegisters] = useState<Register[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const openAddModalCaja = () => setIsAddModalOpenCaja(true);
  const closeAddModalCaja = () => {
    setIsAddModalOpenCaja(false);
  };
  const handleCierreCajaExitoso = () => {
    closeModalCerrarCaja();
  };
  const openModalCerrarCaja = () => {
    setIsModalCerrarOpen(true);
  };
  
  const closeModalCerrarCaja = () => {
    setIsModalCerrarOpen(false);
  };
  useEffect(() => {
    const cargarUltimaSesionCaja = async () => {
      try {
        const ultimaSesion: SesionCaja = await invoke("obtener_detalles_sesion_caja");
        console.log("Respuesta obtenida:", ultimaSesion);
        if (ultimaSesion && ultimaSesion.id_sesion_caja) {
          setIdSesionCaja(ultimaSesion.id_sesion_caja);
        } else {
          setIdSesionCaja(null);
        }
      } catch (error) {
        console.error("Error al obtener la última sesión de caja:", error);
        setError(typeof error === 'string' ? error : "No se pudo encontrar la sesión de caja");
      }
    };
    cargarUltimaSesionCaja();
  }, []);
  
  const fetchCajas = async () => {
      try {
        const data: Register[] = await invoke("mostrar_cajas");
        setRegisters(data);
      } catch (err) {
        setError("Error al cargar los datos de sesiones de caja.");
        console.error(err);
      }
  };
  
  useEffect(() => {
    fetchCajas();
    }, []);
    const handleCajaSuccess = async () => {
      try {
        await fetchCajas();
        try {
          const ultimaSesion: SesionCaja = await invoke("obtener_detalles_sesion_caja");
          if (ultimaSesion && ultimaSesion.id_sesion_caja) {
            setIdSesionCaja(ultimaSesion.id_sesion_caja);
            setError(null);
          }
        } catch (error) {
          console.error("Error al actualizar sesión de caja:", error);
        }
        closeAddModalCaja();
      } catch (error) {
        console.error("Error al actualizar datos:", error);
        closeAddModalCaja();
      }
    };
  const handleVerVentas = (idSesionCaja: number) => {
    navigate(`/ventas/${idSesionCaja}`);
    };

    const filteredRegisters = registers.filter((register) => {
      if (!startDate || !endDate) return true;
      const registerDate = new Date(register.fecha_apertura);
      const start = new Date(startDate.setHours(0, 0, 0, 0));
      const end = new Date(endDate.setHours(23, 59, 59, 999));
      return registerDate >= start && registerDate <= end;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50 p-2">
      <div className="bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 p-3 rounded-t-lg shadow-md mb-2">
        <h1 className="text-2xl font-bold text-white">Cajas</h1>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-full mx-auto space-y-2"
      >
        <div className="bg-white rounded-lg shadow-md p-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1">
            <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[200px] justify-start text-left font-normal border-teal-200 text-xs"
            >
              <Calendar className="mr-2 h-3 w-3 text-teal-500" />
              {startDate ? format(startDate, "dd/MM/yyyy", { locale: es }) : "Fecha de Inicio"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[200px] justify-start text-left font-normal border-teal-200 text-xs"
            >
              <Calendar className="mr-2 h-3 w-3 text-teal-500" />
              {endDate ? format(endDate, "dd/MM/yyyy", { locale: es }) : "Fecha de Fin"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              initialFocus
            />
          </PopoverContent>
          {(startDate || endDate) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStartDate(undefined);
              setEndDate(undefined);
            }}
            className="text-xs text-gray-500"
          >
            <X className="h-3 w-3 mr-1" />
            Limpiar
          </Button>
        )}          
        </Popover>
          </div>
            <div className="flex items-center gap-1 flex-wrap">
              <Button onClick={openAddModalCaja} variant="outline" size="sm" className="text-xs border-sky-200 text-sky-600 hover:bg-sky-50">
                <Plus className="mr-1 h-3 w-3" />
                Aperturar Caja
              </Button>
              <Button onClick={fetchCajas} variant="outline" size="sm" className="text-xs border-cyan-200 text-cyan-600 hover:bg-cyan-50">
                <RefreshCcw className="mr-1 h-3 w-3" />
                Actualizar
              </Button>
{/*               <Button variant="outline" size="sm" className="text-xs border-sky-200 text-sky-600 hover:bg-sky-50">
                <Download className="mr-1 h-3 w-3" />
                Descargar
              </Button> */}
              <Button
                onClick={openModalCerrarCaja}
                disabled={idSesionCaja === null || idSesionCaja === undefined}
                variant="default"
                size="sm"
                className="text-xs bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
              >
                <X className="mr-1 h-3 w-3" />
                Cerrar Caja
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
          {error ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Aviso:</strong>
              <span className="block sm:inline ml-2">
                {error.includes("No hay ninguna sesión de caja abierta")
                  ? "No hay ninguna sesión de caja abierta en este momento."
                  : error}
              </span>
                  <title>Cerrar</title>
            </div>
          ) : (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Caja abierta:</strong>
              <span className="block sm:inline ml-2">Actualmente hay una caja abierta.</span>
            </div>
          )}
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400">
                  <TableHead className="text-white text-xs py-2">Cod Caja</TableHead>
                  <TableHead className="text-white text-xs py-2">Fecha Apertura</TableHead>
                  <TableHead className="text-white text-xs py-2">Estado Caja</TableHead>
                  <TableHead className="text-white text-xs py-2 text-center">Importe Apertura</TableHead>
                  <TableHead className="text-white text-xs py-2">Fecha Cierre</TableHead>
                  <TableHead className="text-white text-xs py-2 text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegisters.map((register) => (
                  <TableRow key={register.id_sesion_caja} className="hover:bg-gray-50">
                    <TableCell className="text-xs py-1">{register.id_sesion_caja}</TableCell>
                    <TableCell className="text-xs py-1"> {format(new Date(register.fecha_apertura), "dd/MM/yyyy HH:mm")}</TableCell>
                    <TableCell className="text-xs py-1">
                      <Badge
                        variant="outline"
                        className={`${
                          register.estado === "Abierta"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : "bg-red-100 text-red-800 border-red-300"
                        } text-[10px] py-0 px-1`}
                      >
                        {register.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs py-1 text-center">
                      {register.monto_inicial.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-xs py-1">{register.fecha_cierre? 
                    format(new Date(register.fecha_cierre), "dd/MM/yyyy HH:mm"): "No cerrada"}
                    </TableCell>
                    <TableCell className="text-xs py-1 text-center">
                    <Button
                        variant="ghost"size="sm"
                        className="text-blue-600 hover:blue-red-800 hover:bg-blue-100"
                        onClick={() => handleVerVentas(register.id_sesion_caja)}
                      >
                        <ReceiptText className="h-4 w-4 mr-1" />
                        Ver Ventas
                      </Button>
                  </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </div>
        </div>

{/*         <div className="grid grid-cols-4 gap-2">
          <Card className="border-teal-100">
            <CardContent className="p-2">
              <div className="text-xs font-medium text-gray-500 mb-1">Apertura</div>
              <div className="text-lg font-bold text-teal-600">S/ 0.00</div>
              <div className="text-[10px] text-gray-400">Saldo Inicial</div>
            </CardContent>
          </Card>

          <Card className="border-cyan-100">
            <CardContent className="p-2">
              <div className="text-xs font-medium text-gray-500 mb-1">Entradas/Ingresos</div>
              <div className="grid grid-cols-3 gap-1 text-[10px]">
                <div>
                  <div className="font-medium text-cyan-600">S/ 0.00</div>
                  <div className="text-gray-400">Ingresos</div>
                </div>
                <div>
                  <div className="font-medium text-cyan-600">S/ 0.00</div>
                  <div className="text-gray-400">OT Vendidas</div>
                </div>
                <div>
                  <div className="font-medium text-cyan-600">S/ 0.00</div>
                  <div className="text-gray-400">OT Cobradas</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardContent className="p-2">
              <div className="text-xs font-medium text-gray-500 mb-1">Saldos</div>
              <div className="text-lg font-bold text-blue-600">S/ 0.00</div>
              <div className="text-[10px] text-gray-400">Saldos</div>
            </CardContent>
          </Card>

          <Card className="border-indigo-100">
            <CardContent className="p-2">
              <div className="text-xs font-medium text-gray-500 mb-1">Cierre de Caja</div>
              <div className="grid grid-cols-3 gap-1 text-[10px]">
                <div>
                  <div className="font-medium text-indigo-600">S/ 0.00</div>
                  <div className="text-gray-400">Efectivo Sistema</div>
                </div>
                <div>
                  <div className="font-medium text-indigo-600">S/ 0.00</div>
                  <div className="text-gray-400">Efectivo Manual</div>
                </div>
                <div>
                  <div className="font-medium text-indigo-600">S/ 0.00</div>
                  <div className="text-gray-400">Diferencia</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div> */}
      </motion.div>
        <ModalAperturarCaja isOpen={isAddModalOpenCaja} onClose={closeAddModalCaja} onSuccess={handleCajaSuccess}/>

        {idSesionCaja && (
        <ModalCerrarCaja
          isOpen={isModalCerrarOpen}
          onClose={closeModalCerrarCaja} 
          onSuccess={handleCierreCajaExitoso}
          idSesionCaja={idSesionCaja}
        />
      )}
    </div>
  )
}