import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, /* FileText */ SearchCheck } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
/* import { Card, CardContent } from "@/components/ui/card"
 */import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
/* import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select" */
import { invoke } from "@tauri-apps/api/tauri";
import { apiCall } from '@/lib/apicall';
import Barcode from "react-barcode"; 
import { useNavigate  } from 'react-router-dom';
import { Link  } from "react-router-dom";

interface VentaListar {
  id_venta: number;
  codigo_barra: string;
  nombres_p: string;
  apellidos_p: string;
  num_doc: string,
  nombre_pro: string;
  observacion: string;
  total_importe: number;
  estado_venta: string;
  fecha_regis: string;
  total_analisis: number;
  analisis_completos: number;
  resumen_analisis: string;
}
interface CierreSesionResult {
  id_sesion_caja: number;
  monto_inicial: number;
  total_ventas: number;
  monto_final: number;
  diferencia: number;
}

export default function VentasActuales() {
  const [idSesionCaja, setIdSesionCaja] = useState<number | null>(null);
  const [ventas, setVentas] = useState<VentaListar[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarInformacionCaja = async () => {
      try {
        const respuesta = await invoke<CierreSesionResult>('obtener_detalles_sesion_caja');
        if (respuesta && respuesta.id_sesion_caja) {
          setIdSesionCaja(respuesta.id_sesion_caja);
        } else {
          console.warn('No se encontró una caja abierta.');
        }
      } catch (error) {
        console.error('Error al cargar detalles de caja:', error);
      }
    };
    cargarInformacionCaja();
  }, []);
  const fetchVentas = async () => {
    if (typeof idSesionCaja !== "number" || isNaN(idSesionCaja)) {
      setError("ID de sesión de caja no válido o caja no esta abierta.");
      return;
    }
    try {
      setError(null);
      setLoading(true);
      const data = await apiCall<VentaListar[]>("listar_ventas_por_sesion_caja", {
        idSesionCaja: parseInt(idSesionCaja.toString()),
      });
      const flattenedData = Array.isArray(data) ? data.flat() : [];
      setVentas(flattenedData);
      setLoading(false);
    } catch (err) {
      setError("Error al obtener las ventas: " + (err as Error).message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, [idSesionCaja]);

  const handleVerDetVenta = (idVenta: number) => {
    navigate(`/detventas/${idVenta}`);
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50 p-2">
      <div className="bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 p-3 rounded-t-lg shadow-md mb-2">
        <h1 className="text-2xl font-bold text-white">Ventas - Caja Actual</h1>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Cargando ventas...</p>}
      {!loading && ventas.length === 0 && <p>No hay ventas para esta sesión de caja o caja no esta abierta.</p>}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-full mx-auto space-y-2"
      >
        <div className="bg-white rounded-lg shadow-md p-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1">
{/*               <Select>
                <SelectTrigger className="w-[200px] text-xs border-teal-200">
                  <SelectValue placeholder="Columna a Filtrar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cód. OT">Cód. OT</SelectItem>
                  <SelectItem value="Paciente">Paciente</SelectItem>
                  <SelectItem value="Procedencia">Procedencia</SelectItem>
                </SelectContent>
              </Select> */}
            <div className="flex items-center gap-1 flex-wrap">
              <Link to= "/ventas">
                <Button variant="outline" size="sm" className="text-xs border-cyan-200 text-cyan-600 hover:bg-cyan-50">
                  <Plus className="mr-1 h-3 w-3" />
                  Nueva Orden
                </Button>
              </Link>
{/*               <Button variant="outline" size="sm" className="text-xs border-sky-200 text-sky-600 hover:bg-sky-50">
                <FileText className="mr-1 h-3 w-3" />
                Planilla
              </Button> */}
            </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
          <div className="max-h-96 overflow-y-auto">

            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400">
                  <TableHead className="text-white text-xs py-2">Cód Barras</TableHead>
                  <TableHead className="text-white text-xs py-2">Fecha</TableHead>
                  <TableHead className="text-white text-xs py-2">Paciente</TableHead>
                  <TableHead className="text-white text-xs py-2 text-center">Procedencia</TableHead>
                  <TableHead className="text-white text-xs py-2 text-center">Total Paga</TableHead>
                  <TableHead className="text-white text-xs py-2 text-center">Estado</TableHead>
                  <TableHead className="text-white text-xs py-2 text-center">Estado Análisis</TableHead>
                  <TableHead className="text-white text-xs py-2 text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ventas.map((venta) => (
                  <TableRow key={venta.id_venta} className="hover:bg-gray-50">
                    <TableCell className="text-xs py-1">        
                      <Barcode 
                      value={venta.codigo_barra} 
                      width={0.9} 
                      height={20}  
                      displayValue={false} 
                      lineColor="#000"/>
                    </TableCell>
                    <TableCell className="text-xs py-1">{format(new Date(venta.fecha_regis), "dd/MM/yyyy HH:mm")}</TableCell>
                    <TableCell className="text-xs py-1">{venta.apellidos_p},{venta.nombres_p}</TableCell>
                    <TableCell className="text-xs py-1 text-center">{venta.nombre_pro}</TableCell>
                    <TableCell className="text-xs py-1 text-center">S/ {venta.total_importe.toFixed(2)}</TableCell>
                    <TableCell className="text-xs py-1 text-center">
                      <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px] py-0 px-1">
                        {venta.estado_venta}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs py-1 text-center">{venta.resumen_analisis}</TableCell>
                    <TableCell className="text-xs py-1 text-center">
                    <Button
                        variant="ghost"size="sm"
                        onClick={() => handleVerDetVenta(venta.id_venta)}
                        className="text-blue-600 hover:blue-red-800 hover:bg-blue-100"
                      >
                        <SearchCheck className="h-4 w-4 mr-1" />
                        Ver Detalles
                      </Button>
                  </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        </div>

{/*         <div className="grid grid-cols-5 gap-2">
          <Card className="border-teal-100">
            <CardContent className="p-2">
              <div className="text-xs font-medium text-gray-500 mb-1">Total Registros</div>
              <div className="text-lg font-bold text-teal-600">1</div>
            </CardContent>
          </Card>

          <Card className="border-cyan-100">
            <CardContent className="p-2">
              <div className="text-xs font-medium text-gray-500 mb-1">Sub Total</div>
              <div className="text-lg font-bold text-cyan-600">S/ 116.00</div>
            </CardContent>
          </Card>

          <Card className="border-orange-100">
            <CardContent className="p-2">
              <div className="text-xs font-medium text-gray-500 mb-1">Descuentos</div>
              <div className="text-lg font-bold text-orange-600">S/ 0.00</div>
            </CardContent>
          </Card>

          <Card className="border-sky-100">
            <CardContent className="p-2">
              <div className="text-xs font-medium text-gray-500 mb-1">Total</div>
              <div className="text-lg font-bold text-sky-600">S/ 116.00</div>
            </CardContent>
          </Card>

          <Card className="border-rose-100">
            <CardContent className="p-2">
              <div className="text-xs font-medium text-gray-500 mb-1">Saldos</div>
              <div className="text-lg font-bold text-rose-600">S/ 0.00</div>
            </CardContent>
          </Card>
        </div> */}
      </motion.div>
    </div>
  )
}