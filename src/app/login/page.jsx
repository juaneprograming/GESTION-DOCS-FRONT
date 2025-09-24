"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileCheck, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import api from "../api/axios";
import Image from "next/image";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.get("/sanctum/csrf-cookie"); // Obtener el CSRF token si es necesario
      const response = await api.post("/login", formData);
      console.log("API Response:", response);

      // Almacenar el token en localStorage
      localStorage.setItem("token", response.data.token);

      document.cookie = `token=${response.data.token}; path=/`;

      console.log("Token almacenado:", response.data.token);

      // Establecer flag para mostrar la notificación después de la redirección
      localStorage.setItem("showLoginSuccess", "true");

      // Redirigir al dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("API Error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Credenciales inválidas, intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const floatingAnimation = {
    y: [-5, 5],
    transition: {
      y: { duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-sky-50 relative overflow-hidden">
      {/* Blobs suaves estilo Garono */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-24 -left-24 w-[28rem] h-[28rem] bg-gradient-to-br from-sky-200/35 to-emerald-200/35 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 9, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] bg-gradient-to-br from-emerald-200/35 to-indigo-200/35 rounded-full blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], rotate: [90, 0, 90] }}
          transition={{ duration: 9, repeat: Infinity }}
        />
      </div>

      <div className="container max-w-[1200px] mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-12 items-center relative z-10"
        >
          {/* Card de Login */}
          <Card className="w-full max-w-md mx-auto p-8 bg-white/95 backdrop-blur-sm border border-slate-100 shadow-2xl rounded-2xl">
            <div className="space-y-6">
              {/* Encabezado con logo */}
              <motion.div className="text-center space-y-3" variants={itemVariants}>
                <div className="mx-auto flex items-center justify-center gap-3">
                  
                  {/* <img 
  src="/img/dcmanagersinletras.png" 
  alt="Garono" 
  className="w-20 h-25 rounded"
/> */}

                  <div>
                    <h2 className="text-2xl text-center font-semibold tracking-wide text-slate-900">Iniciar Sesión</h2>
                    {/* <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Document Manager</p> */}
                  <p className="text-center text-xs mt-4 text-slate-500">Sistema de documentación, para el registro de documentos y su gestión.</p>

                  </div>
                </div>
              </motion.div>

              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      type="text"
                      name="username"
                      placeholder="Usuario"
                      className="pl-10 h-12 bg-white border-slate-200 focus:border-sky-400 focus:ring-sky-400"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      type="password"
                      name="password"
                      placeholder="Contraseña"
                      className="pl-10 h-12 bg-white border-slate-200 focus:border-sky-400 focus:ring-sky-400"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white transition-all duration-200 ease-in-out transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <a href="/login/forgot" className="text-sky-700 hover:underline text-sm">
                  ¿Olvidaste tu Contraseña?
                </a>
              </div>

              <div className="border-t border-slate-200 mt-8 pt-6">
                <p className="text-slate-500 text-center text-sm">
                  Software desarrollado por <span className="text-sky-700">Enterprise Control</span>
                </p>
                <p className="text-slate-400 text-center text-xs mt-1">
                  © {new Date().getFullYear()} Enterprise Control. Todos los derechos reservados.
                </p>
              </div>
            </div>
          </Card>

          <div className="hidden lg:block">
            <div className="relative aspect-square max-w-[500px] mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-white rounded-2xl p-8 border border-slate-100">
                <div className="relative w-full h-full">
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-80">
                    <motion.div
                      className="h-8 w-32 bg-sky-200 rounded-t-lg mx-auto"
                      animate={{ rotateX: [-5, 5, -5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="w-full h-48 bg-gradient-to-br from-slate-900 to-slate-700 rounded-tr-lg rounded-b-lg p-4 shadow-lg"
                      animate={{ rotateX: [-2, 2, -2] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
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
                      initial={{ x: -50, y: 100 + i * 30, opacity: 0, scale: 0.8 }}
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
                        delay: i * 1,
                      }}
                    >
                      <FileCheck className="w-8 h-8 text-sky-700" />
                    </motion.div>
                  ))}

                  {/* Logo flotante */}
                  <motion.div
                    className="absolute top-8 left-8 flex items-center gap-3"
                    animate={floatingAnimation}
                  >
                    <Image
                      src="/img/dcmanagersinletraslogoazul.png"
                      alt="Garono"
                      width={90}
                      height={90}
                      className="rounded"
                      priority
                    />
                    <div>
                      <p className="text-md font-semibold tracking-wide">GARONO</p>
                      <p className="text-sm uppercase tracking-widest text-slate-500">Document Manager</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
