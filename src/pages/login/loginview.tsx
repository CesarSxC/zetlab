import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { invoke } from "@tauri-apps/api/tauri"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { User, Lock, AlertCircle, Loader2 } from "lucide-react"
import loginImg from "@/img/login_img.jpg"

interface LoginResponse {
  id_usuario: number
  id_rol: number
  nombre_rol: string
}

async function login(username: string, password: string): Promise<LoginResponse> {
  try {
    const response = await invoke<LoginResponse>("login", { username, password });
    if (!response || typeof response !== "object") {
      throw new Error("Respuesta inválida del servidor");
    }
    return response;
  } catch (error) {
    console.error("Error durante el login:", error);
    throw error;
  }
}

export default function LoginView() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Los campos no pueden estar vacíos");
      setIsLoading(false);
      return;
    }
    try {
      const loggedInUser = await login(username, password);
      console.log("Usuario autenticado:", loggedInUser);
      
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
      
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
};
  return (
<div className="flex min-h-screen bg-white">
  <div className="hidden lg:block lg:w-2/3 relative overflow-hidden">
    <motion.img
      initial={{ scale: 1.1, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.5 }}
      src={loginImg}
      alt="Imagen Inicio Sesión"
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-blue-500 opacity-70 flex items-center justify-center">
      <motion.h1 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-5xl font-bold text-white text-center px-4"
      >
        ZetLab Seguridad y Calidad
      </motion.h1>
    </div>
  </div>
  <div className="flex items-center justify-center w-full lg:w-1/3 p-8">
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-md"
    >
      <Card className="bg-white border-none shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">Iniciar Sesión</CardTitle>
          <CardDescription className="text-gray-500">Ingrese sus credenciales para acceder al sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">Usuario</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="username"
                  placeholder="Nombre de usuario"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="pl-10 bg-gray-50 border-gray-300 text-gray-700"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Contraseña"
                  className="pl-10 bg-gray-50 border-gray-300 text-gray-700"
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          {error && (
            <Alert variant="destructive" className="bg-red-500/50 border-red-600 text-white">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  </div>
</div>
  )
}