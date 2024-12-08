import {Opciones} from '@/pages/secondary_views/components/opciones'
import { Outlet } from "react-router-dom";

const MenuExt = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Opciones/>
      <main className="flex-grow p-6 bg-gray-100">
        <Outlet/>
      </main>
    </div>
  );
};

export default MenuExt;