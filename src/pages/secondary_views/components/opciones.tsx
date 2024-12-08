import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import {
  BriefcaseMedical,
  PencilRuler,
  FlaskConical,
  Beaker,
  Menu,
  Undo2,
} from "lucide-react";

const navItems = [
  {
    icon: BriefcaseMedical, label: "ESPECIALIDADES", link: "/gestiondatos/especialidades",},
  { icon: PencilRuler, label: "UNIDADES", link: "/gestiondatos/unidades" },
  { icon: FlaskConical, label: "CATEGORÍA", link: "/gestiondatos/categorias" }, 
  { icon: Beaker, label: "MUESTRA", link: "/gestiondatos/muestras" },
];

export function Opciones() {
  const [activeItem, setActiveItem] = React.useState(navItems[0].label);

  return (
    <motion.nav
      className="sticky top-0 z-40 w-full bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-500 text-white shadow-lg"
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-12 px-4 text-white hover:bg-white/20")}
            >
              <Undo2 className="mr-2 h-5 w-5" />            
              <span className="text-2xl font-bold">Volver</span>
            </Button>
          </Link>
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navItems.map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to={item.link}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-12 px-4 text-white hover:bg-white/20",
                      activeItem === item.label && "bg-white/30"
                    )}
                    onClick={() => setActiveItem(item.label)}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[200px] bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-none"
              >
                {navItems.map((item) => (
                  <DropdownMenuItem
                    key={item.label}
                    onClick={() => setActiveItem(item.label)}
                    className="hover:bg-white/20"
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
