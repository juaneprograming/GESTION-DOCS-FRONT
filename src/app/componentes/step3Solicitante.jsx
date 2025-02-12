import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import colombiaData from "../colombiaJson/colombia.json";
import { useState, useEffect } from "react";

export const Step3Solicitante = ({ formData, errors, onChange, copiarDatosGestor }) => {

    const [departamentos, setDepartamentos] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    // Función para validar solo letras
    const validateLetters = (value) => /^[a-zA-Z\s]*$/.test(value);

    // Función para validar solo números
    const validateNumbers = (value) => /^\d*$/.test(value);

    // Función para validar dominios de correo permitidos
    const validateEmailDomain = (email) => {
        const allowedDomains = ['gmail.com', 'outlook.com', 'hotmail.com'];
        const emailParts = email.split('@');
        if (emailParts.length === 2) {
            const domain = emailParts[1];
            return allowedDomains.includes(domain);
        }
        return false;
    };

    useEffect(() => {
        setDepartamentos(colombiaData);
    }, []);

    const handleDepartamentoChange = (departamento) => {
        onChange("departamento", departamento);
        const deptoSeleccionado = colombiaData.find((d) => d.departamento === departamento);
        setMunicipios(deptoSeleccionado ? deptoSeleccionado.ciudades : []);
        onChange("municipio", ""); // Resetear municipio al cambiar departamento
    };


    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            <Button onClick={copiarDatosGestor}>Copiar Datos del Gestor</Button>
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
                            <SelectItem value="Persona Natural">Persona Natural</SelectItem>
                            <SelectItem value="Persona Juridica">Persona Jurídica</SelectItem>
                            <SelectItem value="Anonimo">Anónimo</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.tipo_solicitante && (
                        <span className="text-red-500 text-sm">{errors.tipo_solicitante}</span>
                    )}
                </div>

                {/* Tipo Identificación */}
                <div className="space-y-2">
                    <Label htmlFor="tipo_identificacion_solicitante">
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
                            <SelectItem value="Cedula de ciudadania">Cédula de Ciudadanía</SelectItem>
                            <SelectItem value="Cedula de extranjeria">Cédula de Extranjería</SelectItem>
                            <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                            <SelectItem value="NIT">NIT</SelectItem>
                            <SelectItem value="Numero unico de Identificacion personal">Número Único de
                                Identificación
                                personal</SelectItem>
                            <SelectItem value="Sin identificacion">Sin identificación</SelectItem>
                            <SelectItem value="Tarjeta de Identidad">Tarjeta de Identidad</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.tipo_identificacion_solicitante && (
                        <span className="text-red-500 text-sm">{errors.tipo_identificacion_solicitante}</span>
                    )}
                </div>

                {/* Identificación */}
                <div className="space-y-2">
                    <Label htmlFor="identificacion_solicitante" >
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
                    <Label htmlFor="primer_nombre_solicitante">
                        Primer Nombre
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="primer_nombre_solicitante"
                        value={formData.primer_nombre_solicitante}
                        onChange={(e) => {
                            const value = e.target.value;
                            onChange('primer_nombre_solicitante', value); // Actualiza el estado siempre
                            if (!validateLetters(value)) {
                                toast.error("El primer nombre solo puede contener letras.");
                            }
                        }}
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
                        onChange={(e) => {
                            const value = e.target.value;
                            onChange('segundo_nombre_solicitante', value); // Actualiza el estado siempre
                            if (!validateLetters(value)) {
                                toast.error("El segundo nombre solo puede contener letras.");
                            }
                        }}
                        className={`w-full ${errors.segundo_nombre_solicitante ? 'border-red-500' : ''}`}
                    />
                    {errors.segundo_nombre_solicitante && (
                        <span className="text-red-500 text-sm">{errors.segundo_nombre_solicitante}</span>
                    )}
                </div>

                {/* Primer Apellido */}
                <div className="space-y-2">
                    <Label htmlFor="primer_apellido_solicitante">
                        Primer Apellido
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="primer_apellido_solicitante"
                        value={formData.primer_apellido_solicitante}
                        onChange={(e) => {
                            if (validateLetters(e.target.value)) {
                                onChange('primer_apellido_solicitante', e.target.value);
                            }
                        }}
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
                        onChange={(e) => {
                            if (validateLetters(e.target.value)) {
                                onChange('segundo_apellido_solicitante', e.target.value);
                            }
                        }}
                        className={`w-full ${errors.segundo_apellido_solicitante ? 'border-red-500' : ''}`}
                    />
                    {errors.segundo_apellido_solicitante && (
                        <span className="text-red-500 text-sm">{errors.segundo_apellido_solicitante}</span>
                    )}
                </div>

                {/* Dirección */}
                <div className="space-y-2">
                    <Label htmlFor="direccion">
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
                    <Label htmlFor="departamento">Departamento <span className="text-red-500">*</span></Label>
                    <Select
                        value={formData.departamento}
                        onValueChange={handleDepartamentoChange}
                        required
                    >
                        <SelectTrigger id="departamento" className={errors.departamento ? "border-red-500" : ""}>
                            <SelectValue placeholder="Seleccione un departamento" />
                        </SelectTrigger>
                        <SelectContent>
                            {departamentos.map((depto) => (
                                <SelectItem key={depto.id} value={depto.departamento}>{depto.departamento}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.departamento && <span className="text-red-500 text-sm">{errors.departamento}</span>}
                </div>

                {/* Municipio */}
                <div className="space-y-2">
                    <Label htmlFor="municipio">Municipio <span className="text-red-500">*</span></Label>
                    <Select
                        value={formData.municipio}
                        onValueChange={(value) => onChange("municipio", value)}
                        required
                        disabled={municipios.length === 0}
                    >
                        <SelectTrigger id="municipio" className={errors.municipio ? "border-red-500" : ""}>
                            <SelectValue placeholder="Seleccione un municipio" />
                        </SelectTrigger>
                        <SelectContent>
                            {municipios.map((municipio, index) => (
                                <SelectItem key={index} value={municipio}>{municipio}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.municipio && <span className="text-red-500 text-sm">{errors.municipio}</span>}
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
                        onChange={(e) => {
                            if (validateNumbers(e.target.value)) {
                                onChange('celular', e.target.value);
                            }
                        }}
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
                        onChange={(e) => onChange('email', e.target.value)} // Actualiza el estado siempre
                        onBlur={(e) => {
                            const email = e.target.value;
                            if (email && !validateEmailDomain(email)) {
                                toast.error("El correo debe pertenecer a un dominio permitido (gmail.com, outlook.com, hotmail.com).");
                            }
                        }}
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
                        onChange={(e) => onChange('confirm_email_solicitante', e.target.value)} // Actualiza el estado siempre
                        onBlur={(e) => {
                            const confirmEmail = e.target.value;
                            if (confirmEmail && confirmEmail !== formData.email) {
                                toast.error("Los correos no coinciden.");
                            }
                        }}
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
                        onChange={(e) => {
                            if (validateNumbers(e.target.value)) {
                                onChange('telefono', e.target.value);
                            }
                        }}
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