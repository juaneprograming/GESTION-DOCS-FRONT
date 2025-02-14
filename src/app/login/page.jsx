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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-purple-100 relative overflow-hidden">
      {/* Elementos decorativos del fondo */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full filter blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          transition: { duration: 8, repeat: Infinity }
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full filter blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [90, 0, 90],
          transition: { duration: 8, repeat: Infinity }
        }}
      />

      {/* Contenedor principal */}
      <motion.div
        className="w-full max-w-6xl mx-auto p-4 md:p-8 flex flex-col lg:flex-row items-center gap-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Login Form Side */}
        <motion.div className="flex-1" variants={itemVariants}>
          <Card className="p-8 shadow-xl bg-white/90 backdrop-blur-sm border-0">
            <motion.div className="space-y-6" variants={containerVariants}>
              <motion.div
                className="space-y-2 text-center"
                variants={itemVariants}
              >
                <div className="inline-block p-3 rounded-full bg-purple-50">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                  Iniciar Sesión
                </h1>
                <p className="text-sm text-gray-500">
                  Ingrese sus credenciales para acceder al sistema
                </p>
              </motion.div>

              {error && (
                <motion.div
                  className="p-3 text-sm text-red-500 bg-red-50 rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div variants={itemVariants} className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      name="username"
                      placeholder="Usuario"
                      className="pl-10 bg-white/50 border-gray-200"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="password"
                      name="password"
                      placeholder="Contraseña"
                      className="pl-10 bg-white/50 border-gray-200"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                  >
                    Iniciar Sesión
                  </Button>
                </motion.div>
              </form>
              <div className="mt-4 text-center text-purple-500">

              <a href="/login/forgot">¿Olvidaste tu Contraseña?</a>
              </div>
            </motion.div>
          </Card>
        </motion.div>

        {/* Illustration Side */}
        <motion.div className="flex-1 hidden lg:block" variants={itemVariants}>
          <motion.div className="relative w-full aspect-square max-w-[500px] mx-auto">
            {/* Fondo del área de trabajo */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white rounded-2xl"
            />

            {/* Mesa de trabajo */}
            <motion.div
              className="absolute bottom-10 w-full h-72"
              animate={floatingAnimation}
            >
              {/* Laptop */}
              <motion.div
                className=" bottom-0 left-1/2 -translate-x-1/4 w-80 h-48 bg-gray-800 rounded-lg shadow-xl"
                animate={floatingAnimation}
              >
                <div className="absolute inset-2 bg-gradient-to-br from-blue-400 to-purple-400 rounded-md overflow-hidden">
                  <div className="grid grid-cols-2 gap-2 p-4">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="h-4 bg-white/20 rounded"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Documentos flotantes */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    top: `${20 + i * 25}%`,
                    left: `${7 + i * 25}%`,
                    zIndex: 3 - i
                  }}
                  animate={{
                    y: [-5 - i * 2, 5 + i * 2],
                    rotate: [-5 + i * 2, 5 - i * 2],
                    transition: {
                      duration: 2 + i * 0.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }
                  }}
                >
                  <div className="w-20 h-28 bg-white rounded-lg shadow-lg p-4 flex items-center justify-center">
                    <FileCheck className="w-8 h-8 text-purple-600" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
