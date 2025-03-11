import { useState, useEffect, useCallback } from 'react'
import { useParams } from "react-router-dom";
import { motion } from 'framer-motion';
import { PencilLine, Eye, Undo2, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import Barcode from "react-barcode";
import { apiCall } from '@/lib/apicall';
import { Link  } from "react-router-dom";
import { ResultadoModal }  from "@/pages/principal_views/components/modals/ventas/resultados"
import { PDFDownloadLink } from '@react-pdf/renderer';
import ResultadoPDF from '@/pages/principal_views/components/documents/resultadosdoc';
import { PreviewResultadosModal } from '@/pages/principal_views/components/documents/resultadosdoc';
interface VentaDetallada {
  id_venta: number;
  codigo_barra: string;
  fecha_registro: string;
  total_importe: number;
  estado_venta: string;
  nombre_metodop: string;
  nombre_desc: string;
  valor_desc: string;
  nombre_pro: string;

  paciente_dni: string;
  paciente_nombres: string;
  paciente_apellidos: string;
  paciente_sexo: string;
  paciente_fecha_nacimiento: string;

  medico_dni: string;
  medico_nombres: string;
  medico_apellidos: string;
  medico_cmp: string;
  comision: number;
  nombre_esp:string;

  id_analisis: string;
  categoria: string;
  analisis: string;
  resultado: string;
  muestra: string;
  unidad_medida: string;
  rango_referenciales: string;
  estado_analisis: string;
  precio_analisis: number;
  total_analisis: number;
}

export default function VentasCompleta() {
  const { idVenta } = useParams<{ idVenta: string }>();
  const [detalles, setDetalles] = useState<VentaDetallada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [igv, setIgv] = useState<number>(0);
  const [medad, setEdad] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetalle, setSelectedDetalle] = useState<VentaDetallada | null>(null);
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);

  const fetchDetallesVenta = async () => {
    if (!idVenta || isNaN(parseInt(idVenta))) {
      setError("ID de venta no válido.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await apiCall<VentaDetallada[]>("obtener_detalles_venta", {
        idVenta: parseInt(idVenta),
      });
      const flattenedData = Array.isArray(data) ? data.flat() : [];
      setDetalles(flattenedData);
      setLoading(false);
      console.log(flattenedData)
    } catch (err) {
      setError("Error al obtener los detalles de la venta: " + (err as Error).message);
      setLoading(false);
    }
  };
  const infoGeneral = detalles[0];

  const handleSaveResultado = (idAnalisis: string, resultado: string) => {
    const updatedDetalles = detalles.map((detalle) =>
      detalle.id_analisis === idAnalisis ? { ...detalle, resultado } : detalle
    );
    setDetalles(updatedDetalles);
  };
  

  useEffect(() => {
    fetchDetallesVenta();
  }, [idVenta]);

  const calcularEdad = () => {
    try {
      const fechaPartes = infoGeneral.paciente_fecha_nacimiento.split('-');
      const nacimiento = new Date(
        parseInt(fechaPartes[0]),
        parseInt(fechaPartes[1]) - 1,
        parseInt(fechaPartes[2]) 
      );
      
      const hoy = new Date();
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const mes = hoy.getMonth();
      const mesNacimiento = nacimiento.getMonth();
      
      if (mes < mesNacimiento || 
          (mes === mesNacimiento && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }
      
      setEdad(edad);
    } catch (error) {
      console.error("Error al calcular la edad:", error);
      setEdad(null);
    }
  };
  useEffect(() => {
    if (infoGeneral) {
      calcularEdad();
    }
  }, [infoGeneral]);

  const calcularMontos = useCallback(() => {
    if (!detalles || detalles.length === 0) return;
  
    const calculatedTotal = detalles.reduce((sum, detalle) => {
      return sum + detalle.total_analisis;
    }, 0);
  
    const descuentoValor = infoGeneral?.valor_desc 
      ? calculatedTotal * (parseFloat(infoGeneral.valor_desc) / 100)
      : 0;
  
    const totalConDescuento = calculatedTotal - descuentoValor;
    
    const calculatedIgv = totalConDescuento * 0.18;
    const calculatedSubtotal = totalConDescuento - calculatedIgv;
       
    setSubtotal(calculatedSubtotal);
    setIgv(calculatedIgv);
    }, [detalles, infoGeneral]);
  
  useEffect(() => {
    calcularMontos();
  }, [calcularMontos,calcularEdad]);
  
  return (
    
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50 p-8">
      {loading && <p>Cargando detalles de la venta...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        >
        <div className="bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 p-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Venta Registrada</h1>
          <Badge variant="outline" className="text-white border-white px-3 py-1 text-lg">
            <Barcode value={infoGeneral.codigo_barra} width={2} height={40} displayValue={false}/>
          </Badge>
          <Link to="/listactual">
            <Button 
              variant="outline"
              className="bg-gradient-to-r from-teal-400 to-sky-400 hover:from-teal-500 hover:to-sky-500 text-white">
              <Undo2 className="mr-2 h-5 w-5" />
                Volver
            </Button>
            </Link>
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
                        <Input value={infoGeneral.paciente_dni} readOnly className="bg-gray-100 border-teal-200"/>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">Procedencia</Label>
                      <Input value={infoGeneral.nombre_pro} readOnly className="bg-gray-100 border-teal-200"/>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">Paciente</Label>
                      <Input   value={infoGeneral ? `${infoGeneral.paciente_apellidos}, ${infoGeneral.paciente_nombres}` : ''}  readOnly className="bg-gray-100 border-teal-200 uppercase"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-600">Sexo</Label>
                        <Input value={infoGeneral.paciente_sexo} readOnly className="bg-gray-100 border-teal-200" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-600">Edad</Label>
                        <Input value={medad !== null ? `${medad} años` : ''}  readOnly className="bg-gray-100 border-teal-200" />
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
                        <Input value={infoGeneral.medico_cmp} readOnly className="bg-gray-100 border-cyan-200" />
                      </div>
                    </div>
                    <div className='flex space-x-2'>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-600">Comisión %</Label>
                        <Input value={infoGeneral.comision} readOnly type="number" className="w-24 bg-gray-100 border-cyan-200" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-600">Cantidad S/.</Label>
                        <Input 
                          value={infoGeneral.total_importe && infoGeneral?.comision 
                            ? `${(infoGeneral.total_importe * (infoGeneral.comision) / 100).toFixed(2).trim()}` 
                            : ""} 
                          readOnly 
                          type="number" 
                          className="w-24 bg-gray-100 border-cyan-200" 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">Nombre del Médico</Label>
                      <Input value={`${infoGeneral.medico_apellidos}, ${infoGeneral.medico_nombres}`} readOnly className="bg-gray-100 border-teal-200 uppercase"/>                   
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">Especialidad</Label>
                      <Input value={infoGeneral.nombre_esp} readOnly className="bg-gray-100 border-cyan-200" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-sky-100">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-sky-400 to-teal-400 p-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Análisis Solicitados</h2>

                </div>
                <div className="p-4 space-y-4">
                  <div className="border rounded-lg overflow-hidden border-sky-200">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-sky-50">
                          <TableHead>Nombre del Análisis</TableHead>
                          <TableHead>Categoría</TableHead>
                          <TableHead className="text-center">Estado</TableHead>
                          <TableHead className="text-center">Precio</TableHead>
                          <TableHead className='text-center'>Resultado</TableHead>
                          <TableHead className='text-center'>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                      {detalles.map((detalle, index) => (
                          <TableRow key={index} className="hover:bg-sky-50">
                            <TableCell>{detalle.analisis}</TableCell>
                            <TableCell>{detalle.categoria}</TableCell>
                            <TableCell className='text-center'>
                            <span 
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                detalle.estado_analisis === 'Completado' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {detalle.estado_analisis}
                            </span>
                            </TableCell>
                            <TableCell className="text-center">{detalle.precio_analisis.toFixed(2)}</TableCell>
                            <TableCell className="text-center">{detalle.resultado}</TableCell>
                            <TableCell className="text-center">
                              <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedDetalle(detalle);
                                    setIsModalOpen(true);
                                  }}                                   
                                  className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 mr-2"
                                >
                                  <PencilLine className="h-4 w-4 mr-1" />
                                  Resultados
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
          <div className="space-y-6">
            <Card className="overflow-hidden border-teal-100">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-teal-400 to-sky-400 p-4">
                  <h2 className="text-xl font-semibold text-white">Detalles de la Venta</h2>
                </div>
                <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Fecha Registro</Label>
                  <Input value={new Date(infoGeneral.fecha_registro).toLocaleString()} readOnly className="bg-gray-100 border-teal-200"/>
                  </div>
                  <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Método Pago</Label>
                  <Input value={infoGeneral.nombre_metodop} readOnly className="bg-gray-100 border-teal-200"/>
                  </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">Descuento %</Label>
                      <div className="flex items-center space-x-2">
                      <Input value={infoGeneral.nombre_desc} readOnly className="bg-gray-100 border-teal-200"/>
                      </div>
                    </div>
                    <div className="border-t border-teal-200 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">SubTotal:</span>
                        <span className="font-medium">S/ {subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">IGV 18%:</span>
                        <span className="font-medium">S/ {igv.toFixed(2)}`</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Venta:</span>
                        <span>S/{infoGeneral.total_importe}</span>
                      </div>
                    </div>
                      <Button 
                        variant="outline"
                        className="w-full bg-gradient-to-r from-teal-400 to-sky-400 hover:from-teal-500 hover:to-sky-500 text-white"
                        onClick={() => setIsPdfPreviewOpen(true)}
                      >
                        <Eye className="mr-2 h-5 w-5" />
                        Vista Previa
                      </Button>
                      <PDFDownloadLink
                          document={<ResultadoPDF detalles={detalles} infoGeneral={infoGeneral} edad={medad ?? 0} />}
                          fileName={`Resultados_${infoGeneral?.paciente_apellidos || 'analisis'}.pdf`}
                        >
                          <Button
                            variant="outline"
                            className="w-full bg-gradient-to-r from-teal-400 to-sky-400 hover:from-teal-500 hover:to-sky-500 text-white"
                          >
                            <FileText className="mr-2 h-5 w-5" />
                            Descargar PDF
                          </Button>
                        </PDFDownloadLink>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-teal-100">
                <CardContent className="p-4">
                  <Label className="text-sm font-medium text-gray-600">Comentario sobre la venta</Label>
                  <Textarea readOnly placeholder="Comentario" className="mt-2 bg-gray-100 border-teal-200" />
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
              )}

        <ResultadoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          detalle={selectedDetalle}
          onSave={handleSaveResultado}
        />
          {infoGeneral && (
            <PreviewResultadosModal
              isOpen={isPdfPreviewOpen}
              onClose={() => setIsPdfPreviewOpen(false)}
              detalles={detalles}
              infoGeneral={infoGeneral}
              edad={medad ?? 0}
            />
          )}
        </div>
    )
}
