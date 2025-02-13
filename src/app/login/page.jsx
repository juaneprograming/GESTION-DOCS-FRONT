"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FileText, Lock, Mail, FileCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import api from "../api/axios"

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.get('/sanctum/csrf-cookie'); // Obtener el CSRF token si es necesario
      const response = await api.post('/login', formData);
      console.log('API Response:', response);

      // Almacenar el token en localStorage
      localStorage.setItem('token', response.data.token);

      console.log('Token almacenado:', response.data.token);

        // Establecer flag para mostrar la notificación después de la redirección
        localStorage.setItem('showLoginSuccess', 'true');

      // Redirigir al dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('API Error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Credenciales inválidas, intenta de nuevo.');
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  const floatingAnimation = {
    y: [-5, 5],
    transition: {
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#afd8fd]/30 to-white relative overflow-hidden">
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#afd8fd]/20 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#afd8fd]/20 rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2" />
    </div>

    <div className="container max-w-[1200px] mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <Card className="w-full max-w-md mx-auto p-8 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-block p-3 rounded-full bg-[#afd8fd]/20 mb-4">
                <FileText className="w-6 h-6 text-[#0677DB]" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Iniciar Sesión
              </h1>
              <p className="text-sm text-gray-500">
                Ingrese sus credenciales para acceder al sistema
              </p>
            </div>
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    name="username"
                    placeholder="Usuario"
                    className="pl-10 h-12 bg-white/50 border-gray-200 focus:border-[#afd8fd] focus:ring-[#afd8fd]"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    className="pl-10 h-12 bg-white/50 border-gray-200 focus:border-[#afd8fd] focus:ring-[#afd8fd]"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-[#0677DB] hover:bg-[#9ac8f5] text-white transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
              >
                Iniciar Sesión
              </Button>
            </form>
          </div>
        </Card>

        <div className="hidden lg:block">
          <div className="relative aspect-square max-w-[500px] mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-[#afd8fd]/20 to-white rounded-2xl p-8">
              <div className="relative w-full h-full">
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-80">
                  <motion.div 
                    className="h-8 w-32 bg-[#afd8fd] rounded-t-lg mx-auto"
                    animate={{
                      rotateX: [-5, 5, -5],
                      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  />
                  <motion.div 
                    className="w-full h-48 bg-gradient-to-br from-[#0677DB] to-[#9ac8f5] rounded-tr-lg rounded-b-lg p-4 shadow-lg"
                    animate={{
                      rotateX: [-2, 2, -2],
                      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="h-4 bg-white/20 rounded animate-pulse"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>

                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-20 h-28 bg-white rounded-lg shadow-lg p-4 flex items-center justify-center"
                    initial={{ 
                      x: -50, 
                      y: 100 + i * 30,
                      opacity: 0,
                      scale: 0.8
                    }}
                    animate={{
                      x: [null, 20 + i * 50, 20 + i * 50],
                      y: [null, 80 + i * 25, 180],
                      opacity: [null, 1, 0],
                      scale: [null, 1, 0.8],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                      times: [0, 0.5, 1],
                      delay: i * 1
                    }}
                  >
                    <FileCheck className="w-8 h-8 text-[#afd8fd]" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
