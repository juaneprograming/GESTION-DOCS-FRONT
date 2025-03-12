import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

const motivoOptions = {
    Denuncia: ["Denuncia"],
    Peticion: ["Derecho de petición", "Derecho de petición de información", "Informes", "Propuesta", "Recurso de reposición", "Solicitud", "Solicitud de servicio", "Solicitud de viabilidad"],
    Queja: ["Queja"],
    Reclamo: ["Reclamo"],
    Sugerencia: ["Sugerencia"],
    "tramite ambiental": ["Trámite Ambiental"]
};

export const Step1Solicitud = ({ formData, errors, onChange }) => {
    const [motivos, setMotivos] = useState([]);

    useEffect(() => {
        setMotivos(motivoOptions[formData.tipo_solicitud] || []);
        onChange("motivo", ""); // Reinicia el motivo cuando cambia el tipo
    }, [formData.tipo_solicitud]);

    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {/* Tipo */}
                <div className="space-y-2 min-h-[120px]">
                    <Label htmlFor="tipo_solicitud">Tipo <span className="text-red-500">*</span></Label>
                    <Select 
                        value={formData.tipo_solicitud}  
                        onValueChange={(value) => onChange("tipo_solicitud", value)}
                        required
                    >
                        <SelectTrigger id="tipo_solicitud" className={errors.tipo_solicitud ? "border-red-500" : ""}>
                            <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(motivoOptions).map((tipo) => (
                                <SelectItem key={tipo} value={tipo}>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="h-6">
                        {errors.tipo_solicitud && <span className="text-red-500 text-sm">{errors.tipo_solicitud}</span>}
                    </div>
                </div>

                {/* Motivo */}
                <div className="space-y-2 min-h-[120px]">
                    <Label htmlFor="motivo">Motivo <span className="text-red-500">*</span></Label>
                    <Select 
                        value={formData.motivo} 
                        onValueChange={(value) => onChange("motivo", value)}
                        required
                        disabled={motivos.length === 0}
                    >
                        <SelectTrigger id="motivo" className={errors.motivo ? "border-red-500" : ""}>
                            <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                            {motivos.map((motivo, index) => (
                                <SelectItem key={index} value={motivo}>{motivo}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="h-6">
                        {errors.motivo && <span className="text-red-500 text-sm">{errors.motivo}</span>}
                    </div>
                </div>

                {/* Medio de Radicación */}
                <div className="space-y-2 min-h-[120px]">
                    <Label htmlFor="medio_radicacion">
                        Medio de Radicación
                        <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={formData.medio_radicacion}
                        onValueChange={(value) => onChange('medio_radicacion', value)}
                        required
                    >
                        <SelectTrigger id="medio_radicacion" className={errors.medio_radicacion ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="correo certificado">Correo certificado</SelectItem>
                            <SelectItem value="correo electronico">Correo electrónico</SelectItem>
                            <SelectItem value="persona directa">Persona directa</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="h-6">
                        {errors.medio_radicacion && <span className="text-red-500 text-sm">{errors.medio_radicacion}</span>}
                    </div>
                </div>

                {/* Medio de Respuesta */}
                <div className="space-y-2 min-h-[120px]">
                    <Label htmlFor="medio_respuesta">
                        Medio de respuesta
                        <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={formData.medio_respuesta}
                        onValueChange={(value) => onChange('medio_respuesta', value)}
                        required
                    >
                        <SelectTrigger id="medio_respuesta" className={errors.medio_respuesta ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Correo electronico">Correo electrónico</SelectItem>
                            <SelectItem value="Direccion correspondencia">Dirección de correspondencia</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="h-6">
                        {errors.medio_respuesta && <span className="text-red-500 text-sm">{errors.medio_respuesta}</span>}
                    </div>
                </div>
            </div>

            {/* Asunto de la Solicitud */}
            <div className="space-y-2">
                <Label htmlFor="asunto_solicitud" className="flex items-center gap-1">
                    Asunto de la Solicitud
                    <span className="text-red-500">*</span>
                </Label>
                <Textarea
                    id="asunto_solicitud"
                    value={formData.asunto_solicitud}
                    onChange={(e) => onChange('asunto_solicitud', e.target.value)}
                    required
                    maxLength={1000}
                    rows={8}
                    className={`resize-none ${errors.asunto_solicitud ? 'border-red-500' : ''}`}
                />
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                        {formData.asunto_solicitud.length}/1000 caracteres
                    </span>
                    {errors.asunto_solicitud && (
                        <span className="text-red-500 text-sm">{errors.asunto_solicitud}</span>
                    )}
                </div>
            </div>
        </div>
    )
}