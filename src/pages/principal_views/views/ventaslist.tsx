import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, X} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { apiCall } from "@/lib/apicall";
import { useParams } from "react-router-dom";
import Barcode from "react-barcode";
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
export default function VentaLista() {
  const [ventas, setVentas] = useState<VentaListar[]>([]);
  const { idSesionCaja } = useParams<{ idSesionCaja: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchCaja = async () => {
    if (!idSesionCaja || isNaN(parseInt(idSesionCaja))) {
      setError("ID de sesión de caja no válido.");
      return;
    }  
    try {
      setLoading(true);
      const data = await apiCall<VentaListar[]>("listar_ventas_por_sesion_caja", {
        idSesionCaja: parseInt(idSesionCaja), 
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
    fetchCaja();
  }, [idSesionCaja]);

  const fetchVentas = async () => {
    if (!idSesionCaja || isNaN(parseInt(idSesionCaja.toString()))) {
      setError("ID de sesión de caja no válido.");
      return;
    }
    try {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50 p-2">
      <div className="bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 p-3 rounded-t-lg shadow-md mb-2">
        <h1 className="text-2xl font-bold text-white">Buscar Órdenes de Trabajo</h1>
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
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <Button variant="outline" size="sm" className="text-xs border-sky-200 text-sky-600 hover:bg-sky-50">
                <Download className="mr-1 h-3 w-3" />
                Descargar
              </Button>
              <Link to="/caja">
              <Button variant="default" size="sm" className="text-xs bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white">
                  <X className="mr-1 h-3 w-3" />
                  Regresar
                </Button>
              </Link>  
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
            {loading && <p>Cargando datos...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && ventas.length === 0 && <p>No hay ventas registradas para esta sesión de caja.</p>}
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400">
                  <TableHead className="text-white text-xs py-2 font-semibold">Codigo</TableHead>
                  <TableHead className="text-white text-xs py-2 font-semibold">Codigo Barras</TableHead>
                  <TableHead className="text-white text-xs py-2 font-semibold">Procedencia</TableHead>
                  <TableHead className="text-white text-xs py-2 font-semibold">Paceinte</TableHead>
                  <TableHead className="text-white text-xs py-2 font-semibold">Num Doc.</TableHead>
                  <TableHead className="text-white text-xs py-2 font- text-center">Total Importe</TableHead>
                  <TableHead className="text-white text-xs py-2 font-semibold">Estado Caja</TableHead>
                  <TableHead className="text-white text-xs py-2 font-semibold text-center">Análisis</TableHead>
                  <TableHead className="text-white text-xs py-2 text-center font-semibold">Fecha Registro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ventas.map((venta) => (
                  <TableRow key={venta.id_venta} className="hover:bg-gray-50">
                    <TableCell className="text-xs py-1">{venta.id_venta}</TableCell>
                    <TableCell className="text-xs py-1">        
                      <Barcode 
                      value={venta.codigo_barra} 
                      width={0.9} 
                      height={20}  
                      displayValue={false} 
                      lineColor="#000"/>
                    </TableCell>
                    <TableCell className="text-xs py-1">{venta.nombre_pro}</TableCell>
                    <TableCell className="text-xs py-1">{venta.apellidos_p}</TableCell>
                    <TableCell className="text-xs py-1">{venta.num_doc}</TableCell>
                    <TableCell className="text-xs py-1 text-center">{venta.total_importe.toFixed(2)}</TableCell>
                    
                    <TableCell className="text-xs py-1">
                      <Badge
                        variant="outline"
                        className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px] py-0 px-1"
                      >
                        {venta.estado_venta}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs py-1 text-center">{venta.resumen_analisis}</TableCell>
                    <TableCell className="text-xs py-1 text-center">
                      {venta.fecha_regis}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </motion.div>
    </div>
  )
}