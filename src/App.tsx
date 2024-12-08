import { Routes, Route } from 'react-router-dom';

import Layout from '@/pages/principal_views/views/layout'
import Pacientes from '@/pages/principal_views/views/pacientes'
import Medicos from '@/pages/principal_views/views/medicos'
import Analisis from '@/pages/principal_views/views/analisis'
import Ventas from '@/pages/principal_views/views/ventas'
//import LoginView from '@/pages/login/loginview'
import Muestras from '@/pages/secondary_views/views/muestras'
import CategoriaAn from '@/pages/secondary_views/views/categorias'
import Unidades from '@/pages/secondary_views/views/unidades'
import Especialidades from '@/pages/secondary_views/views/especialidades'

function App() {
  return (
      <Routes>
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Pacientes />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/analisis" element={<Analisis />} />
          <Route path="/medicos" element={<Medicos />} />
          <Route path="/muestras" element={<Muestras />} />
          <Route path="/categorias" element={<CategoriaAn />} />
          <Route path="/unidades" element={<Unidades />} />
          <Route path="/especialidades" element={<Especialidades />} />
        </Route>     
      </Routes>
  );
}
export default App;