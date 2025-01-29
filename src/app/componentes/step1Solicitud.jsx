import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"



export const Step1Solicitud = ({ formData , errors, onChange }) => {
    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {/* Tipo */}
                <div className="space-y-2">
                    <Label htmlFor="tipo_solicitud" className="flex items-center gap-1">
                        Tipo
                        <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                        value={formData.tipo_solicitud}  
                        onValueChange={(value) => onChange('tipo_solicitud', value)}
                        required
                    >
                        <SelectTrigger id="tipo_solicitud" className={errors.tipo_solicitud ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="denuncia">Denuncia</SelectItem>
                            <SelectItem value="peticion">Petición</SelectItem>
                            <SelectItem value="queja">Queja</SelectItem>
                            <SelectItem value="reclamo">Reclamo</SelectItem>
                            <SelectItem value="sugerencia">Sugerencia</SelectItem>
                            <SelectItem value="tramite">Trámite Ambiental</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.tipo && <span className="text-red-500 text-sm">{errors.tipo_solicitud}</span>}
                </div>

                {/* Motivo */}
                <div className="space-y-2">
                    <Label htmlFor="motivo" className="flex items-center gap-1">
                        Motivo
                        <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                        value={formData.motivo} 
                        onValueChange={(value) => onChange('motivo', value)}
                        required
                    >
                        <SelectTrigger id="motivo" className={errors.motivo ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="motivo1">Motivo 1</SelectItem>
                            <SelectItem value="motivo2">Motivo 2</SelectItem>
                            <SelectItem value="motivo3">Motivo 3</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.motivo && <span className="text-red-500 text-sm">{errors.motivo}</span>}
                </div>

                {/* Medio de Radicación */}
                <div className="space-y-2">
                    <Label htmlFor="medio_radicacion" className="flex items-center gap-1">
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
                    {errors.medio_radicacion && <span className="text-red-500 text-sm">{errors.medio_radicacion}</span>}
                </div>

                {/* Medio de Respuesta */}
                <div className="space-y-2">
                    <Label htmlFor="medio_respuesta" className="flex items-center gap-1">
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
                            <SelectItem value="correo_electronico">Correo electrónico</SelectItem>
                            <SelectItem value="direccion_correspondencia">Dirección de correspondencia</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.medio_respuesta && <span className="text-red-500 text-sm">{errors.medio_respuesta}</span>}
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