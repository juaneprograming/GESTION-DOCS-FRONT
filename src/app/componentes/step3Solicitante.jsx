import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export const Step3Solicitante = ({ formData, errors, onChange }) => {
    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Tipo Solicitante */}
                <div className="space-y-2">
                    <Label htmlFor="tipo_solicitante">Tipo Solicitante</Label>
                    <Select 
                        value={formData.tipo_solicitante} 
                        onValueChange={(value) => onChange('tipo_solicitante', value)}
                    >
                        <SelectTrigger 
                            id="tipo_solicitante" 
                            className={errors.tipo_solicitante ? 'border-red-500' : ''}
                        >
                            <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="natural">Persona Natural</SelectItem>
                            <SelectItem value="juridica">Persona Jurídica</SelectItem>
                            <SelectItem value="anonimo">Anónimo</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.tipo_solicitante && (
                        <span className="text-red-500 text-sm">{errors.tipo_solicitante}</span>
                    )}
                </div>

                {/* Tipo Identificación */}
                <div className="space-y-2">
                    <Label htmlFor="tipo_identificacion_solicitante" className="flex items-center gap-1">
                        Tipo Identificación
                        <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={formData.tipo_identificacion_solicitante}
                        onValueChange={(value) => onChange('tipo_identificacion_solicitante', value)}
                        required
                    >
                        <SelectTrigger 
                            id="tipo_identificacion_solicitante" 
                            className={errors.tipo_identificacion_solicitante ? 'border-red-500' : ''}
                        >
                            <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cc">Cédula de Ciudadanía</SelectItem>
                            <SelectItem value="ce">Cédula de Extranjería</SelectItem>
                            <SelectItem value="pa">Pasaporte</SelectItem>
                            <SelectItem value="nit">NIT</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.tipo_identificacion_solicitante && (
                        <span className="text-red-500 text-sm">{errors.tipo_identificacion_solicitante}</span>
                    )}
                </div>

                {/* Identificación */}
                <div className="space-y-2">
                    <Label htmlFor="identificacion_solicitante" className="flex items-center gap-1">
                        Identificación
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="identificacion_solicitante"
                        value={formData.identificacion_solicitante}
                        onChange={(e) => onChange('identificacion_solicitante', e.target.value)}
                        required
                        className={`w-full ${errors.identificacion_solicitante ? 'border-red-500' : ''}`}
                    />
                    {errors.identificacion_solicitante && (
                        <span className="text-red-500 text-sm">{errors.identificacion_solicitante}</span>
                    )}
                </div>

                {/* Primer Nombre */}
                <div className="space-y-2">
                    <Label htmlFor="primer_nombre_solicitante" className="flex items-center gap-1">
                        Primer Nombre
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="primer_nombre_solicitante"
                        value={formData.primer_nombre_solicitante}
                        onChange={(e) => onChange('primer_nombre_solicitante', e.target.value)}
                        required
                        className={`w-full ${errors.primer_nombre_solicitante ? 'border-red-500' : ''}`}
                    />
                    {errors.primer_nombre_solicitante && (
                        <span className="text-red-500 text-sm">{errors.primer_nombre_solicitante}</span>
                    )}
                </div>

                {/* Segundo Nombre */}
                <div className="space-y-2">
                    <Label htmlFor="segundo_nombre_solicitante">Segundo Nombre</Label>
                    <Input
                        id="segundo_nombre_solicitante"
                        value={formData.segundo_nombre_solicitante}
                        onChange={(e) => onChange('segundo_nombre_solicitante', e.target.value)}
                        className={`w-full ${errors.segundo_nombre_solicitante ? 'border-red-500' : ''}`}
                    />
                    {errors.segundo_nombre_solicitante && (
                        <span className="text-red-500 text-sm">{errors.segundo_nombre_solicitante}</span>
                    )}
                </div>

                {/* Primer Apellido */}
                <div className="space-y-2">
                    <Label htmlFor="primer_apellido_solicitante" className="flex items-center gap-1">
                        Primer Apellido
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="primer_apellido_solicitante"
                        value={formData.primer_apellido_solicitante}
                        onChange={(e) => onChange('primer_apellido_solicitante', e.target.value)}
                        required
                        className={`w-full ${errors.primer_apellido_solicitante ? 'border-red-500' : ''}`}
                    />
                    {errors.primer_apellido_solicitante && (
                        <span className="text-red-500 text-sm">{errors.primer_apellido_solicitante}</span>
                    )}
                </div>

                {/* Segundo Apellido */}
                <div className="space-y-2">
                    <Label htmlFor="segundo_apellido_solicitante">Segundo Apellido</Label>
                    <Input
                        id="segundo_apellido_solicitante"
                        value={formData.segundo_apellido_solicitante}
                        onChange={(e) => onChange('segundo_apellido_solicitante', e.target.value)}
                        className={`w-full ${errors.segundo_apellido_solicitante ? 'border-red-500' : ''}`}
                    />
                    {errors.segundo_apellido_solicitante && (
                        <span className="text-red-500 text-sm">{errors.segundo_apellido_solicitante}</span>
                    )}
                </div>

                {/* Dirección */}
                <div className="space-y-2">
                    <Label htmlFor="direccion" className="flex items-center gap-1">
                        Dirección
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="direccion"
                        value={formData.direccion}
                        onChange={(e) => onChange('direccion', e.target.value)}
                        required
                        className={`w-full ${errors.direccion ? 'border-red-500' : ''}`}
                    />
                    {errors.direccion && (
                        <span className="text-red-500 text-sm">{errors.direccion}</span>
                    )}
                </div>

                {/* País */}
                <div className="space-y-2">
                    <Label htmlFor="pais" className="flex items-center gap-1">
                        País
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                        id="pais" 
                        value={formData.pais} 
                        readOnly 
                        className="w-full bg-gray-50" 
                    />
                </div>

                {/* Departamento */}
                <div className="space-y-2">
                    <Label htmlFor="departamento" className="flex items-center gap-1">
                        Departamento
                        <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                        value={formData.departamento} 
                        onValueChange={(value) => onChange('departamento', value)} 
                        required
                    >
                        <SelectTrigger 
                            id="departamento" 
                            className={errors.departamento ? 'border-red-500' : ''}
                        >
                            <SelectValue placeholder="Seleccione un departamento" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="antioquia">Antioquia</SelectItem>
                            <SelectItem value="cundinamarca">Cundinamarca</SelectItem>
                            <SelectItem value="valle">Valle del Cauca</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.departamento && (
                        <span className="text-red-500 text-sm">{errors.departamento}</span>
                    )}
                </div>

                {/* Municipio */}
                <div className="space-y-2">
                    <Label htmlFor="municipio" className="flex items-center gap-1">
                        Municipio
                        <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                        value={formData.municipio} 
                        onValueChange={(value) => onChange('municipio', value)} 
                        required
                    >
                        <SelectTrigger 
                            id="municipio" 
                            className={errors.municipio ? 'border-red-500' : ''}
                        >
                            <SelectValue placeholder="Seleccione un municipio" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="medellin">Medellín</SelectItem>
                            <SelectItem value="bogota">Bogotá</SelectItem>
                            <SelectItem value="cali">Cali</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.municipio && (
                        <span className="text-red-500 text-sm">{errors.municipio}</span>
                    )}
                </div>

                {/* Celular */}
                <div className="space-y-2">
                    <Label htmlFor="celular" className="flex items-center gap-1">
                        Celular
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="celular"
                        value={formData.celular}
                        onChange={(e) => onChange('celular', e.target.value)}
                        required
                        maxLength={10}
                        className={`w-full ${errors.celular ? 'border-red-500' : ''}`}
                    />
                    {errors.celular && (
                        <span className="text-red-500 text-sm">{errors.celular}</span>
                    )}
                </div>

                {/* Email */}
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email" className="flex items-center gap-1">
                        Correo electrónico
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => onChange('email', e.target.value)}
                        required
                        className={`w-full ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && (
                        <span className="text-red-500 text-sm">{errors.email}</span>
                    )}
                </div>

                {/* Confirmar Email */}
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="confirm_email_solicitante" className="flex items-center gap-1">
                        Confirmar Correo electrónico
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="confirm_email_solicitante"
                        type="email"
                        value={formData.confirm_email_solicitante}
                        onChange={(e) => onChange('confirm_email_solicitante', e.target.value)}
                        required
                        className={`w-full ${errors.confirm_email_solicitante ? 'border-red-500' : ''}`}
                    />
                    {errors.confirm_email_solicitante && (
                        <span className="text-red-500 text-sm">{errors.confirm_email_solicitante}</span>
                    )}
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                        id="telefono"
                        value={formData.telefono}
                        onChange={(e) => onChange('telefono', e.target.value)}
                        maxLength={10}
                        className={`w-full ${errors.telefono ? 'border-red-500' : ''}`}
                    />
                    {errors.telefono && (
                        <span className="text-red-500 text-sm">{errors.telefono}</span>
                    )}
                </div>
            </div>
        </div>
    )
}