import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/pages/principal_views/views/layout'
import Pacientes from '@/pages/principal_views/views/pacientes'
import Medicos from '@/pages/principal_views/views/medicos'
import Analisis from '@/pages/principal_views/views/analisis'
import VentasProceso from '@/pages/principal_views/views/ventas'
import RegistroCaja from '@/pages/principal_views/views/cajas'
import VentasLista from '@/pages/principal_views/views/ventaslist'
import VentasActuales from '@/pages/principal_views/views/vestasactuales'
import VentasCompleta from '@/pages/principal_views/views/ventacomp'
import LoginView from '@/pages/login/loginview'
import Muestras from '@/pages/secondary_views/views/muestras'
import CategoriaAn from '@/pages/secondary_views/views/categorias'
import Unidades from '@/pages/secondary_views/views/unidades'
import Especialidades from '@/pages/secondary_views/views/especialidades'
import ProtectedRoute from '@/pages/login/protecroute';

function App() {
  return (
    <Routes>
    <Route path="/login" element={<LoginView />} />
    
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }
    >
      <Route index element={<RegistroCaja />} />
      <Route path="caja" element={<RegistroCaja />} />
      <Route path="ventas/:idSesionCaja" element={<VentasLista />} />
      <Route path="detventas/:idVenta" element={<VentasCompleta />} />
      <Route path="ventas" element={<VentasProceso />} />
      <Route path="listactual" element={<VentasActuales />} />
      <Route path="pacientes" element={<Pacientes />} />
      <Route path="analisis" element={<Analisis />} />
      <Route path="medicos" element={<Medicos />} />
      <Route path="muestras" element={<Muestras />} />
      <Route path="categorias" element={<CategoriaAn />} />
      <Route path="unidades" element={<Unidades />} />
      <Route path="especialidades" element={<Especialidades />} />
    </Route>

    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>

  );
}
export default App;