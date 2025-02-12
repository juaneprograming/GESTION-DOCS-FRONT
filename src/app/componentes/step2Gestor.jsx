import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { toast } from "sonner"

export const Step2Gestor = ({ formData, errors, onChange }) => {

    const [isSearching, setIsSearching] = useState(false);
    const [showManualFields, setShowManualFields] = useState(false); // Nuevo estado
    const [alertShown, setAlertShown] = useState(false); // Estado para controlar la alerta
    const [loadingToastId, setLoadingToastId] = useState(null); // Estado para controlar el toast loading
    const debounceRef = useRef(null);

      // Función para validar que solo se ingresen letras y espacios
  const validateText = (value) => {
    const textRegex = /^[a-zA-Z\s]*$/; // Solo letras y espacios
    return textRegex.test(value);
  };

  const buscarGestor = async () => {
    const { tipo_identificacion_gestor, identificacion_gestor } = formData;
    const token = localStorage.getItem("token");

    if (!tipo_identificacion_gestor || !identificacion_gestor) return;

    setIsSearching(true);
    const toastId = toast.loading("Buscando gestor...");
    setLoadingToastId(toastId);

    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/pqrsd/buscar-usuario`,
            {
                params: {
                    tipo_identificacion: tipo_identificacion_gestor,
                    identificacion: identificacion_gestor,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.data.success) {
            const user = response.data.user;
            onChange("primer_nombre_gestor", user.primer_nombre);
            onChange("segundo_nombre_gestor", user.segundo_nombre);
            onChange("primer_apellido_gestor", user.primer_apellido);
            onChange("segundo_apellido_gestor", user.segundo_apellido);
            setShowManualFields(false);
            setAlertShown(false);

            toast.success("Datos del gestor cargados", { id: toastId });
        } else {
            setShowManualFields(true);
            toast.warning(
                "Gestor no encontrado. Por favor ingrese los datos manualmente",
                { id: toastId }
            );
        }
    } catch (error) {
        console.error("Error:", error);
        toast.error(
            error.response?.data?.message || "Error en la búsqueda",
            { id: toastId }
        );
    } finally {
        setIsSearching(false);
    }
};

useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (formData.tipo_identificacion_gestor && formData.identificacion_gestor) {
        debounceRef.current = setTimeout(() => {
            buscarGestor();
        }, 500);
    }

    return () => clearTimeout(debounceRef.current);
}, [formData.tipo_identificacion_gestor, formData.identificacion_gestor]);

    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tipo de Identificación */}
                <div className="space-y-2">
                    <Label htmlFor="tipo_identificacion_gestor">Tipo de Identificación</Label>
                    <Select
                        value={formData.tipo_identificacion_gestor}
                        onValueChange={(value) => onChange('tipo_identificacion_gestor', value)}
                    >
                        <SelectTrigger
                            id="tipo_identificacion_gestor"
                            className={errors.tipo_identificacion_gestor ? 'border-red-500' : ''}
                        >
                            <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Cedula de ciudadania">Cédula de Ciudadanía</SelectItem>
                            <SelectItem value="Cedula de extranjeria">Cédula de Extranjería</SelectItem>
                            <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                            <SelectItem value="NIT">NIT</SelectItem>
                            <SelectItem value="Numero unico de Identificacion personal">Número Único de Identificacion Personal</SelectItem>
                            <SelectItem value="Sin Identificacion">Sin identificación</SelectItem>
                            <SelectItem value="Tarjeta de Identidad">Tarjeta de Identidad</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.tipo_identificacion_gestor && (
                        <span className="text-red-500 text-sm">{errors.tipo_identificacion_gestor}</span>
                    )}
                </div>

                {/* Identificación */}
                <div className="space-y-2">
                    <Label htmlFor="identificacion_gestor">Identificación</Label>
                    <Input
                        id="identificacion_gestor"
                        value={formData.identificacion_gestor}
                        onChange={(e) => onChange('identificacion_gestor', e.target.value)}
                        className={`w-full ${errors.identificacion_gestor ? 'border-red-500' : ''}`}
                    />
                    {errors.identificacion_gestor && (
                        <span className="text-red-500 text-sm">{errors.identificacion_gestor}</span>
                    )}
                </div>

                {/* Primer Nombre */}
                <div className="space-y-2">
                    <Label htmlFor="primer_nombre_gestor">
                        Primer Nombre
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="primer_nombre_gestor"
                        value={formData.primer_nombre_gestor}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (validateText(value)) {
                              onChange("primer_nombre_gestor", value);
                            }
                          }}
                        required
                        className={`w-full ${errors.primer_nombre_gestor ? 'border-red-500' : ''}`}
                    />
                    {errors.primer_nombre_gestor && (
                        <span className="text-red-500 text-sm">{errors.primer_nombre_gestor}</span>
                    )}
                </div>

                {/* Segundo Nombre */}
                <div className="space-y-2">
                    <Label htmlFor="segundo_nombre_gestor">Segundo Nombre</Label>
                    <Input
                        id="segundo_nombre_gestor"
                        value={formData.segundo_nombre_gestor}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (validateText(value)) {
                              onChange("segundo_nombre_gestor", value);
                            }
                          }}
                        className={`w-full ${errors.segundo_nombre_gestor ? 'border-red-500' : ''}`}
                    />
                    {errors.segundo_nombre_gestor && (
                        <span className="text-red-500 text-sm">{errors.segundo_nombre_gestor}</span>
                    )}
                </div>

                {/* Primer Apellido */}
                <div className="space-y-2">
                    <Label htmlFor="primer_apellido_gestor">
                        Primer Apellido
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="primer_apellido_gestor"
                        value={formData.primer_apellido_gestor}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (validateText(value)) {
                              onChange("primer_apellido_gestor", value);
                            }
                          }}
                        required
                        className={`w-full ${errors.primer_apellido_gestor ? 'border-red-500' : ''}`}
                    />
                    {errors.primer_apellido_gestor && (
                        <span className="text-red-500 text-sm">{errors.primer_apellido_gestor}</span>
                    )}
                </div>

                {/* Segundo Apellido */}
                <div className="space-y-2">
                    <Label htmlFor="segundo_apellido_gestor">
                        Segundo Apellido
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="segundo_apellido_gestor"
                        value={formData.segundo_apellido_gestor}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (validateText(value)) {
                              onChange("segundo_apellido_gestor", value);
                            }
                          }}
                        required
                        className={`w-full ${errors.segundo_apellido_gestor ? 'border-red-500' : ''}`}
                    />
                    {errors.segundo_apellido_gestor && (
                        <span className="text-red-500 text-sm">{errors.segundo_apellido_gestor}</span>
                    )}
                </div>
            </div>
        </div>
    )
}