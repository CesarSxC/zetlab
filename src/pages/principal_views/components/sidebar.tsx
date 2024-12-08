import * as React from "react"
import { Link  } from "react-router-dom";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ChevronLeft, ChevronRight, HelpCircle, LogOut, Home, BarChart3, Users, FileText, BriefcaseMedical,
  PencilRuler, FlaskConical, Beaker, Stethoscope
 } from "lucide-react"

const menuItems = [
  { icon: Home, label: "Inicio", link: "/especialidades" },
  { icon: BarChart3, label: "Caja", link: "/ventas" },
  { icon: Users, label: "Pacientes", link: "/pacientes" },
  { icon: Stethoscope, label: "Médicos", link: "/medicos" },
  { icon: FileText, label: "Análisis", link: "/analisis" },
  { icon: FlaskConical, label: "Categorias", link: "/categorias" },
  { icon: Beaker, label: "Muestras", link: "/muestras" }, 
  { icon: BriefcaseMedical, label: "Especialidades", link: "/especialidades" },
  { icon: PencilRuler, label: "Unidades", link: "/unidades" },
]

const Sidebar = ({ expanded, toggleSidebar }: { expanded: boolean; toggleSidebar: () => void }) => {
  const [activeItem, setActiveItem] = React.useState(menuItems[0].label)
  
  return (
    <div className={cn(
      "flex flex-col h-screen bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-400 text-white transition-all duration-300 ease-in-out",
      expanded ? "w-64" : "w-[70px]"
    )}>
      <div className="flex items-center justify-between p-4">
        <img
          src="/placeholder.svg?height=40&width=40"
          alt="Logo"
          className={cn(
            "rounded-full transition-all duration-300 ease-in-out bg-white p-1",
            expanded ? "w-10 h-10" : "w-8 h-8"
          )}
        />
        <Button
          onClick={toggleSidebar}
          variant="ghost"
          className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full"
        >
          {expanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-grow">
        <TooltipProvider>
          <ul className="space-y-2 p-4">
            {menuItems.map((item) => (
              <li key={item.label}>
                <Tooltip>
                  <TooltipTrigger asChild>

                  <Link to={item.link}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-white hover:bg-white/20", activeItem === item.label && "bg-white/30",
                        expanded ? "px-4" : "px-2",
                        "rounded-lg"
                      )}
                      onClick={() => setActiveItem(item.label)}

                    >
                      <item.icon className={cn("h-5 w-5", expanded ? "mr-4" : "mr-0")} />
                      {expanded && <span className="font-medium">{item.label}</span>}
                    </Button>
                  </Link>

                  </TooltipTrigger>
                  {!expanded && (
                    <TooltipContent side="right" className="bg-indigo-800 text-white">
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              </li>
            ))}
          </ul>
        </TooltipProvider>
      </ScrollArea>

      <div className="p-4 border-t border-white/20">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20 transition-all duration-200 rounded-lg">
                <HelpCircle className={cn("h-5 w-5", expanded ? "mr-4" : "mr-0")} />
                {expanded && <span className="font-medium">Ayuda y Soporte</span>}
              </Button>
            </TooltipTrigger>
            {!expanded && (
              <TooltipContent side="right" className="bg-indigo-800 text-white">
                Help & Support
              </TooltipContent>
            )}
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="w-full justify-start mt-2 text-white hover:bg-white/20 transition-all duration-200 rounded-lg">
                <LogOut className={cn("h-5 w-5", expanded ? "mr-4" : "mr-0")} />
                {expanded && <span className="font-medium">Cerrar Sesión</span>}
              </Button>
            </TooltipTrigger>
            {!expanded && (
              <TooltipContent side="right" className="bg-indigo-800 text-white">
                Logout
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

export default Sidebar
