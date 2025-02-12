'use client'

import React, { useState } from "react"
import axios from "axios"
import DashboardLayout from "@/app/dashboard/layout"
import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/app/componentes/breadcrumb"
import { ProgressStepper } from "@/app/componentes/progressStepper"
import { Step1Solicitud } from "@/app/componentes/step1Solicitud"
import { Step2Gestor } from "@/app/componentes/step2Gestor"
import { Step3Solicitante } from "@/app/componentes/step3Solicitante"
import { useRouter } from "next/navigation"; // Agrega esto al inicio
import { toast } from "sonner"

export default function MultiStepForm({ onSuccess }) {
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState({})
  const router = useRouter();


  const copiarDatosGestor = () => {
    const tipoSolicitanteMap = { // Valores deben coincidir con Step3
      'Cedula de ciudadania': 'Persona Natural',
      'Cedula de extranjeria': 'Persona Natural',
      'Numero unico de Identificacion personal': 'Persona Natural',
      'Pasaporte': 'Persona Natural',
      'Tarjeta de Identidad': 'Persona Natural',
      'Sin Identificacion': 'Anonimo',
      'NIT': 'Persona Juridica'
    };
  
    const tipoSolicitante = tipoSolicitanteMap[formData.tipo_identificacion_gestor] || '';
  
    setFormData((prev) => ({
      ...prev,
      tipo_solicitante: tipoSolicitante,
      tipo_identificacion_solicitante: formData.tipo_identificacion_gestor,
      identificacion_solicitante: formData.identificacion_gestor,
      primer_nombre_solicitante: formData.primer_nombre_gestor,
      segundo_nombre_solicitante: formData.segundo_nombre_gestor,
      primer_apellido_solicitante: formData.primer_apellido_gestor,
      segundo_apellido_solicitante: formData.segundo_apellido_gestor,
    }));
  };
  


  const [formData, setFormData] = useState({
    tipo_solicitud: "",
    motivo: "",
    medio_radicacion: "",
    medio_respuesta: "",
    asunto_solicitud: "",
    tipo_identificacion_gestor: "",
    identificacion_gestor: "",
    primer_nombre_gestor: "",
    segundo_nombre_gestor: "",
    primer_apellido_gestor: "",
    segundo_apellido_gestor: "",
    tipo_solicitante: "",
    tipo_identificacion_solicitante: "",
    identificacion_solicitante: "",
    primer_nombre_solicitante: "",
    segundo_nombre_solicitante: "",
    primer_apellido_solicitante: "",
    segundo_apellido_solicitante: "",
    direccion: "",
    pais: "Colombia",
    departamento: "",
    municipio: "",
    celular: "",
    email: "",
    confirm_email_solicitante: "",
    telefono: "",
  });

  const steps = [
    { id: 1, name: "Datos Solicitud" },
    { id: 2, name: "Datos Gestor" },
    { id: 3, name: "Datos Solicitante" },
  ];

  const requiredFields = {
    1: ['tipo_solicitud', 'motivo', 'medio_radicacion', 'medio_respuesta', 'asunto_solicitud'],
    2: ['primer_nombre_gestor', 'primer_apellido_gestor'],
    3: ['tipo_solicitante', 'tipo_identificacion_solicitante', 'identificacion_solicitante',
      'primer_nombre_solicitante', 'primer_apellido_solicitante', 'direccion',
      'departamento', 'municipio', 'celular', 'email', 'confirm_email_solicitante']
  };

  const validateStep = () => {
    const currentRequired = requiredFields[step];
    const newErrors = {};

    currentRequired.forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors[field] = 'Este campo es requerido';
      }
    });

    if (step === 3 && formData.email !== formData.confirm_email_solicitante) {
      newErrors.confirm_email_solicitante = 'Los correos no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep(prev => Math.min(prev + 1, steps.length));
  };

  const handlePrevious = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    // Validar campos específicamente para el Step 3
    const requiredFieldsStep3 = [
      'tipo_solicitante', 
      'tipo_identificacion_solicitante', 
      'identificacion_solicitante', 
      'primer_nombre_solicitante', 
      'primer_apellido_solicitante', 
      'direccion', 
      'departamento', 
      'municipio', 
      'celular', 
      'email', 
      'confirm_email_solicitante'
    ];
  
    const missingFields = requiredFieldsStep3.filter(field => 
      !formData[field] || formData[field].trim() === ''
    );
  
    if (missingFields.length > 0) {
      toast.error('Por favor, diligencie todos los campos requeridos');
      return;
    }
  
    // Validación de correos
    if (formData.email !== formData.confirm_email_solicitante) {
      toast.error('Los correos electrónicos no coinciden');
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/pqrsd`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
  
      const newPqrsdId = response.data?.data?.id;
  
      if (newPqrsdId) {
        toast.success('PQRSD creada exitosamente');
        router.push(`/pqrsd/consulta/informacionpqrsd?id=${newPqrsdId}`);
      } else {
        toast.error("Error: No se recibió el ID de la PQRSD");
      }
    } catch (error) {
      console.error('Error creating PQRSD:', error);
      toast.error(error.response?.data?.message || 'Error de conexión con el servidor');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Nueva PQRSD</h2>
            <Breadcrumb />
          </div>
        </div>
      </div>

      <div className="space-y-6 px-4">
        <ProgressStepper steps={steps} currentStep={step} />

        <div className="mt-16">
          {step === 1 && <Step1Solicitud
            formData={formData}
            errors={errors}
            onChange={handleChange} // Nombre correcto de la prop
          />}
          {step === 2 && <Step2Gestor formData={formData}
            errors={errors}
            onChange={handleChange} />}
          {step === 3 && <Step3Solicitante formData={formData}
            errors={errors}
            copiarDatosGestor={copiarDatosGestor}
            onChange={handleChange} />}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={step === 1}
            >
              Anterior
            </Button>

            {step === steps.length ? (
              <Button onClick={handleSubmit}>
                Enviar PQRSD
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Siguiente
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

