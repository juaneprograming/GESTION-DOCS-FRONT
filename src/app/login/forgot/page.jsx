"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Importamos useRouter para la redirección
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // Control del flujo
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Hook para redirigir al usuario

  // 1️⃣ Enviar código al correo
  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Código enviado al correo.");
        setStep(2); // Pasar al siguiente paso (verificación del código)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ Verificar código
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify-reset-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Código verificado correctamente.");
        setStep(3); // Pasar al siguiente paso (cambio de contraseña)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ Cambiar la contraseña
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
          password: newPassword,
          password_confirmation: newPassword, // Laravel requiere este campo
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Contraseña actualizada con éxito.");
        setStep(4); // Finalización

        // ⏳ Redirigir al usuario después de 2 segundos al login
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.error(data.message || "Error al actualizar la contraseña.");
      }
    } catch (error) {
      toast.error("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 shadow-lg rounded-md w-full max-w-md">
        {step === 1 && (
          <form onSubmit={handleSendCode}>
            <h2 className="text-xl font-semibold mb-3">Recuperar Contraseña</h2>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" required />
            <Button type="submit" disabled={loading} className="mt-3 w-full">
              {loading ? "Enviando..." : "Enviar Código"}
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode}>
            <h2 className="text-xl font-semibold mb-3">Verificar Código</h2>
            <Input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Código de verificación" required />
            <Button type="submit" disabled={loading} className="mt-3 w-full">
              {loading ? "Verificando..." : "Validar Código"}
            </Button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <h2 className="text-xl font-semibold mb-3">Nueva Contraseña</h2>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nueva contraseña" required />
            <Button type="submit" disabled={loading} className="mt-3 w-full">
              {loading ? "Cambiando..." : "Actualizar Contraseña"}
            </Button>
          </form>
        )}

        {step === 4 && (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-green-600">✅ Contraseña actualizada</h2>
            <p className="text-gray-600">Serás redirigido al login en unos segundos...</p>
          </div>
        )}
      </div>
    </div>
  );
}
