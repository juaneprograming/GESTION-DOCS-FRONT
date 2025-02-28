"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { InboxIcon } from "lucide-react"
import PinInput from "@/app/componentes/pin-input"

export default function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [codeActive, setCodeActive] = useState(false)
  const [codeTimer, setCodeTimer] = useState(0)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [resendCount, setResendCount] = useState(() => Number(localStorage.getItem("resendCount")) || 0)
  const [blocked, setBlocked] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (resendCount >= 2) {
      setBlocked(true)
    }
  }, [resendCount])

  const startCodeTimer = () => {
    setCodeActive(true)
    setCodeTimer(180)
    const interval = setInterval(() => {
      setCodeTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval)
          setCodeActive(false)
          if (resendCount < 2) {
            setResendDisabled(false)
          }
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSendCode = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      if (response.ok) {
        toast.success(data.message)
        setStep(2)
        setResendCount(data.attempts - 1)
        setResendDisabled(true)
        startCodeTimer()
        if (data.blocked) {
          setBlocked(true)
        }
      } else {
        toast.error(data.message)
        if (data.blocked) {
          setBlocked(true)
        }
      }
    } catch {
      toast.error("Error de conexión.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    if (code.length !== 6) return
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify-reset-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      })
      const data = await response.json()
      if (response.ok) {
        toast.success(data.message)
        setStep(3)
      } else {
        toast.error(data.message)
      }
    } catch {
      toast.error("Error de conexión.")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code,
          password: newPassword,
          password_confirmation: newPassword,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        toast.success(data.message)
        setTimeout(() => router.push("/login"), 2000)
      } else {
        toast.error(data.message)
      }
    } catch {
      toast.error("Error de conexión.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (resendCount >= 2) {
      setBlocked(true)
      toast.error("Has alcanzado el límite de intentos. Contacta al administrador.")
      return
    }
    setResendDisabled(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      if (response.ok) {
        toast.success(data.message)
        setResendCount(data.attempts - 1)
        startCodeTimer()
        if (data.blocked) {
          setBlocked(true)
        }
      } else {
        toast.error(data.message)
        if (data.blocked) {
          setBlocked(true)
        }
      }
    } catch {
      toast.error("Error de conexión.")
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-white">
      <div className="w-full max-w-md p-8">
        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <h2 className="text-2xl font-semibold text-center mb-4">Recuperar Contraseña</h2>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              required
            />
            <Button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white">
              {loading ? "Enviando..." : "Enviar Código"}
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-6">
                <InboxIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-center">Ingresa tu código</h2>
              <p className="mt-2 text-sm text-gray-600">Enviamos un código a {email}</p>
            </div>

            <PinInput length={6} value={code} onChange={setCode} />

            <div className="text-center">
              {blocked ? (
                <p className="text-red-600">Has alcanzado el límite de intentos. Contacta al administrador.</p>
              ) : (
                <p className="text-sm text-gray-600">
                  {"¿No recibiste el código? "}
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendDisabled}
                    className="text-green-500 hover:text-green-600 font-medium"
                  >
                    {resendDisabled 
                      ? `Reenviar (${Math.floor(codeTimer / 60)}:${(codeTimer % 60).toString().padStart(2, '0')})` 
                      : "Haz clic para reenviar"}
                  </button>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6 || !codeActive}
              className="w-full py-3 px-4 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Verificando..." : "Continuar"}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <h2 className="text-2xl font-semibold text-center mb-4">Nueva Contraseña</h2>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nueva contraseña"
              required
            />
            <Button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white">
              {loading ? "Actualizando..." : "Actualizar Contraseña"}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}

