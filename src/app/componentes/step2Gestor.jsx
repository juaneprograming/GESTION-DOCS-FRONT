import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export const Step2Gestor = ({ formData, errors, onChange }) => {
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
                            <SelectItem value="Cedula de Ciudadanía">Cédula de Ciudadanía</SelectItem>
                            <SelectItem value="Cedula de Extranjería">Cédula de Extranjería</SelectItem>
                            <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                            <SelectItem value="NIT">NIT</SelectItem>
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
                    <Label htmlFor="primer_nombre_gestor" className="flex items-center gap-1">
                        Primer Nombre
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="primer_nombre_gestor"
                        value={formData.primer_nombre_gestor}
                        onChange={(e) => onChange('primer_nombre_gestor', e.target.value)}
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
                        onChange={(e) => onChange('segundo_nombre_gestor', e.target.value)}
                        className={`w-full ${errors.segundo_nombre_gestor ? 'border-red-500' : ''}`}
                    />
                    {errors.segundo_nombre_gestor && (
                        <span className="text-red-500 text-sm">{errors.segundo_nombre_gestor}</span>
                    )}
                </div>

                {/* Primer Apellido */}
                <div className="space-y-2">
                    <Label htmlFor="primer_apellido_gestor" className="flex items-center gap-1">
                        Primer Apellido
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="primer_apellido_gestor"
                        value={formData.primer_apellido_gestor}
                        onChange={(e) => onChange('primer_apellido_gestor', e.target.value)}
                        required
                        className={`w-full ${errors.primer_apellido_gestor ? 'border-red-500' : ''}`}
                    />
                    {errors.primer_apellido_gestor && (
                        <span className="text-red-500 text-sm">{errors.primer_apellido_gestor}</span>
                    )}
                </div>

                {/* Segundo Apellido */}
                <div className="space-y-2">
                    <Label htmlFor="segundo_apellido_gestor" className="flex items-center gap-1">
                        Segundo Apellido
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="segundo_apellido_gestor"
                        value={formData.segundo_apellido_gestor}
                        onChange={(e) => onChange('segundo_apellido_gestor', e.target.value)}
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