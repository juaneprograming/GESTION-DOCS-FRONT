'use client'

import React, { useState } from "react"
import DashboardLayout from "@/app/dashboard/layout"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function MultiStepForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    tipo: "",
    motivo: "",
    medioRadicacion: "",
    medioRespuesta: "",
    asunto: "",
  })

  const steps = [
    { id: 1, name: "Datos de la Solicitud" },
    { id: 2, name: "Datos del Gestor" },
    { id: 3, name: "Datos del Solicitante" },
  ]

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, steps.length))
  }

  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <nav aria-label="Progress">
          <ol role="list" className="flex justify-center space-x-80">
            {steps.map((stepItem, stepIdx) => (
              <li key={stepItem.name} className={cn(stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : "", "relative")}>
                <div className="flex items-center">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      step > stepItem.id
                        ? "bg-primary"
                        : step === stepItem.id
                          ? "border-2 border-primary"
                          : "border-2 border-gray-300",
                    )}
                  >
                    {step > stepItem.id ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <span className={cn("text-sm", step === stepItem.id ? "text-primary" : "text-gray-500")}>
                        {stepItem.id}
                      </span>
                    )}
                  </div>
                  {stepIdx !== steps.length - 1 && (
                    <div
                      className={cn(
                        "absolute left-0 top-4 -z-10 h-0.5 w-full",
                        step > stepItem.id ? "bg-primary" : "bg-gray-300",
                      )}
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "absolute left-0 top-10 w-max text-sm",
                    step === stepItem.id ? "text-primary font-medium" : "text-gray-500",
                  )}
                >
                  {stepItem.name}
                </span>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-16">
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tipo">
                    Tipo <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.tipo} onValueChange={(value) => updateFormData("tipo", value)}>
                    <SelectTrigger id="tipo">
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tipo1">Tipo 1</SelectItem>
                      <SelectItem value="tipo2">Tipo 2</SelectItem>
                      <SelectItem value="tipo3">Tipo 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivo">
                    Motivo <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.motivo} onValueChange={(value) => updateFormData("motivo", value)}>
                    <SelectTrigger id="motivo">
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="motivo1">Motivo 1</SelectItem>
                      <SelectItem value="motivo2">Motivo 2</SelectItem>
                      <SelectItem value="motivo3">Motivo 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medioRadicacion">
                    Medio de Radicación <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.medioRadicacion}
                    onValueChange={(value) => updateFormData("medioRadicacion", value)}
                  >
                    <SelectTrigger id="medioRadicacion">
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medio1">Medio 1</SelectItem>
                      <SelectItem value="medio2">Medio 2</SelectItem>
                      <SelectItem value="medio3">Medio 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medioRespuesta">
                    Medio de respuesta <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.medioRespuesta}
                    onValueChange={(value) => updateFormData("medioRespuesta", value)}
                  >
                    <SelectTrigger id="medioRespuesta">
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="respuesta1">Respuesta 1</SelectItem>
                      <SelectItem value="respuesta2">Respuesta 2</SelectItem>
                      <SelectItem value="respuesta3">Respuesta 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="asunto">
                  Asunto <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="asunto"
                  value={formData.asunto}
                  onChange={(e) => updateFormData("asunto", e.target.value)}
                  placeholder="Escriba el asunto..."
                  className="min-h-[100px]"
                />
                <div className="text-xs text-muted-foreground">{formData.asunto.length}/1000 caracteres</div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Datos del Gestor</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nombreGestor">
                    Nombre del Gestor <span className="text-destructive">*</span>
                  </Label>
                  <input
                    id="nombreGestor"
                    type="text"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Ingrese el nombre del gestor"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailGestor">
                    Email del Gestor <span className="text-destructive">*</span>
                  </Label>
                  <input
                    id="emailGestor"
                    type="email"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Ingrese el email del gestor"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl flex text-center font-bold">Datos del Solicitante</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nombreSolicitante">
                    Nombre del Solicitante <span className="text-destructive">*</span>
                  </Label>
                  <input
                    id="nombreSolicitante"
                    type="text"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Ingrese el nombre del solicitante"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailSolicitante">
                    Email del Solicitante <span className="text-destructive">*</span>
                  </Label>
                  <input
                    id="emailSolicitante"
                    type="email"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Ingrese el email del solicitante"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={step === 1}>
              Anterior
            </Button>
            <Button onClick={handleNext} disabled={step === steps.length}>
              {step === steps.length ? "Enviar" : "Siguiente"}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

