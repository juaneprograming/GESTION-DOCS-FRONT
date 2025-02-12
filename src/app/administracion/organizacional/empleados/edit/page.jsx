"use client"; // Agrega esta línea al inicio del archivo

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

// Cache global con TTL y bloqueo de solicitudes
let globalCache = {
    cargos: { data: null, timestamp: 0, isFetching: false },
    areas: { data: null, timestamp: 0, isFetching: false },
    sedes: { data: null, timestamp: 0, isFetching: false },
    CACHE_TTL: 5 * 60 * 1000 // 5 minutos
};

export function EditEmpleado({ empleadoId, onEmpleadoActualizado }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [cache, setCache] = useState({});
    const [cargos, setCargos] = useState([]);
    const [isFetchingCargos, setIsFetchingCargos] = useState(false);
    const [isFetchingAreas, setIsFetchingAreas] = useState(false);
    const [isFetchingSedes, setIsFetchingSedes] = useState(false);
    const [areas, setAreas] = useState([]);
    const [sedes, setSedes] = useState([]);
    const [isEmployeeLoading, setIsEmployeeLoading] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const [formData, setFormData] = useState({
        nombre_1: "",
        nombre_2: "",
        apellido_1: "",
        apellido_2: "",
        tipo_identificacion: "",
        numero_identificacion: "",
        correo: "",
        telefono: "",
        cargo_id: "",
        sede_id: "",
        area_id: ""
    });

    const fetchDataWithCache = useCallback(async (endpoint, cacheKey) => {
        const now = Date.now();
        if (globalCache[cacheKey].data && now - globalCache[cacheKey].timestamp < globalCache.CACHE_TTL) {
            return globalCache[cacheKey].data;
        }
        if (globalCache[cacheKey].isFetching) {
            return new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (!globalCache[cacheKey].isFetching) {
                        clearInterval(interval);
                        resolve(globalCache[cacheKey].data);
                    }
                }, 100);
            });
        }
        globalCache[cacheKey].isFetching = true;
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/administracion/${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = response.data.data || response.data;
        globalCache[cacheKey] = { data, timestamp: now, isFetching: false };
        return data;
    }, []);

    const fetchCargos = useCallback(async () => {
        const data = await fetchDataWithCache('cargos', 'cargos');
        setCargos(data);
    }, [fetchDataWithCache]);

    const fetchAreas = useCallback(async () => {
        const data = await fetchDataWithCache('areas', 'areas');
        setAreas(data);
    }, [fetchDataWithCache]);

    const fetchSedes = useCallback(async () => {
        const data = await fetchDataWithCache('sedes', 'sedes');
        setSedes(data);
    }, [fetchDataWithCache]);

    useEffect(() => {
        let isMounted = true; // Bandera para verificar si el componente está montado
        const loadInitialData = async () => {
            await Promise.all([fetchCargos(), fetchAreas(), fetchSedes()]);
        };
        if (isMounted) {
            loadInitialData();
        }
        return () => {
            isMounted = false; // Cleanup: cambia la bandera al desmontar
        };
    }, [fetchCargos, fetchAreas, fetchSedes]);

    const fetchEmployeeData = useCallback(async (background = false) => {
        const source = axios.CancelToken.source();
        try {
            if (!background) setIsEmployeeLoading(true);
            if (cache[empleadoId] && !background) {
                setFormData(cache[empleadoId]);
                setOriginalData(cache[empleadoId]); // Almacenar datos originales
                return;
            }
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/administracion/empleados/${empleadoId}`, {
                headers: { Authorization: `Bearer ${token}` },
                cancelToken: source.token
            });
            const employeeData = response.data.data || response.data;
            // Formatear IDs a strings
            const formattedEmployeeData = {
                ...employeeData,
                cargo_id: employeeData.cargo_id?.toString(),
                sede_id: employeeData.sede_id?.toString(),
                area_id: employeeData.area_id?.toString(),
            };
            setCache(prev => ({ ...prev, [empleadoId]: formattedEmployeeData }));
            if (!background) setFormData(formattedEmployeeData);
            setOriginalData(formattedEmployeeData); // Almacenar datos originales formateados
        } catch (err) {
            if (!axios.isCancel(err)) {
                console.error("Error fetching employee:", err);
            }
        } finally {
            if (!background) setIsEmployeeLoading(false);
        }
        return () => source.cancel("Request cancelado");
    }, [empleadoId, cache]);

    const handlePrefetch = useCallback(() => {
        if (!cache[empleadoId]) {
            // Ejecutar después de un breve retraso
            setTimeout(() => {
                fetchEmployeeData(true);
            }, 100);
        }
    }, [empleadoId, cache, fetchEmployeeData]);

    useEffect(() => {
        if (open) {
            if (cache[empleadoId]) {
                setFormData(cache[empleadoId]);
            }
            fetchEmployeeData();
        }
    }, [open, empleadoId, cache, fetchEmployeeData]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const handleSubmit = async () => {
        // Verificar cambios
        const hasChanges = Object.keys(formData).some(
            key => formData[key] !== originalData[key]
        );
        if (!hasChanges) {
            toast.info('No se han hecho cambios');
            return;
        }
        // Validar solo si el número de identificación ha cambiado
        if (formData.numero_identificacion !== originalData.numero_identificacion) {
            const esUnico = await validarNumeroIdentificacionUnico(formData.numero_identificacion);
            if (!esUnico) {
                setErrors(prev => ({ ...prev, numero_identificacion: "Este número de identificación ya está registrado para otro empleado." }));
                toast.error("El número de identificación ya está registrado para otro empleado.");
                return;
            }
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/administracion/empleados/${empleadoId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            toast.success("Empleado actualizado exitosamente");
            onEmpleadoActualizado?.();
            setCache(prev => ({ ...prev, [empleadoId]: formData }));
            setOpen(false);
        } catch (error) {
            // Manejar errores de duplicados
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                setErrors(validationErrors);
                if (validationErrors.numero_identificacion) {
                    toast.error("Este número de identificación ya está registrado para otro empleado");
                }
                Object.entries(validationErrors).forEach(([field, messages]) => {
                    if (field !== 'numero_identificacion') {
                        toast.error(messages[0]);
                    }
                });
            } else {
                toast.error(`Error al actualizar: ${error.response?.data?.message || 'Error en la actualización'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    async function validarNumeroIdentificacionUnico(numero_identificacion) {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/administracion/empleados/validar-numero-identificacion`,
                { numero_identificacion, empleado_id: empleadoId }, // Envía el ID del empleado
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data.existe; // Devuelve si el número de identificación ya existe
        } catch (error) {
            console.error("Error al validar número de identificación:", error);
            return false;
        }
    }

    const handleKeyPress = (e, type) => {
        if (type === 'number' && !/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
        if (type === 'letter' && !/[a-zA-Z]/.test(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={handlePrefetch}>
                    <Edit2 className="mr-2 h-4 w-4" /> Editar Empleado
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Empleado</DialogTitle>
                    <DialogDescription>
                        Modifica los campos necesarios para actualizar la información del empleado.
                    </DialogDescription>
                </DialogHeader>
                {/* Campo de ejemplo - Repetir para los demás campos */}
                <div>
                    <Label>Nombre 1 *</Label>
                    <Input
                        value={formData.nombre_1}
                        onChange={(e) => handleChange("nombre_1", e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, 'letter')}
                        className={errors.nombre_1 ? "border-red-500" : ""}
                    />
                    {errors.nombre_1 && <p className="text-red-500">{errors.nombre_1}</p>}
                </div>
                <div>
                    <Label>Nombre 2</Label>
                    <Input
                        value={formData.nombre_2}
                        onChange={(e) => handleChange("nombre_2", e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, 'letter')}
                    />
                </div>
                <div>
                    <Label>Apellido 1 *</Label>
                    <Input
                        value={formData.apellido_1}
                        onChange={(e) => handleChange("apellido_1", e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, 'letter')}
                        className={errors.apellido_1 ? "border-red-500" : ""}
                    />
                    {errors.apellido_1 && <p className="text-red-500">{errors.apellido_1}</p>}
                </div>
                <div>
                    <Label>Apellido 2</Label>
                    <Input
                        value={formData.apellido_2}
                        onChange={(e) => handleChange("apellido_2", e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, 'letter')}
                    />
                </div>
                <div>
                    <Label>Tipo de Identificación *</Label>
                    <Input
                        value={formData.tipo_identificacion}
                        onChange={(e) => handleChange("tipo_identificacion", e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, 'number')}
                        className={errors.tipo_identificacion ? "border-red-500" : ""}
                    />
                    {errors.tipo_identificacion && <p className="text-red-500">{errors.tipo_identificacion}</p>}
                </div>
                <div>
                    <Label>Número de Identificación *</Label>
                    <Input
                        value={formData.numero_identificacion}
                        onChange={(e) => handleChange("numero_identificacion", e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, 'number')}
                        className={errors.numero_identificacion ? "border-red-500" : ""}
                    />
                    {errors.numero_identificacion && <p className="text-red-500">{errors.numero_identificacion}</p>}
                </div>
                <div>
                    <Label>Correo *</Label>
                    <Input
                        value={formData.correo}
                        onChange={(e) => handleChange("correo", e.target.value)}
                        className={errors.correo ? "border-red-500" : ""}
                    />
                    {errors.correo && <p className="text-red-500">{errors.correo}</p>}
                </div>
                <div>
                    <Label>Teléfono</Label>
                    <Input
                        value={formData.telefono}
                        onChange={(e) => handleChange("telefono", e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, 'number')}
                    />
                </div>
                <div>
                    <Label>Cargo *</Label>
                    <Select value={formData.cargo_id} onValueChange={(value) => handleChange("cargo_id", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un cargo" />
                        </SelectTrigger>
                        <SelectContent>
                            {cargos.map((cargo) => (
                                <SelectItem key={cargo.id} value={cargo.id.toString()}>
                                    {cargo.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.cargo_id && <p className="text-red-500">{errors.cargo_id}</p>}
                </div>
                <div>
                    <Label>Sede *</Label>
                    <Select value={formData.sede_id} onValueChange={(value) => handleChange("sede_id", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una sede" />
                        </SelectTrigger>
                        <SelectContent>
                            {sedes.map((sede) => (
                                <SelectItem key={sede.id} value={sede.id.toString()}>
                                    {sede.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.sede_id && <p className="text-red-500">{errors.sede_id}</p>}
                </div>
                <div>
                    <Label>Área *</Label>
                    <Select value={formData.area_id} onValueChange={(value) => handleChange("area_id", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un área" />
                        </SelectTrigger>
                        <SelectContent>
                            {areas.map((area) => (
                                <SelectItem key={area.id} value={area.id.toString()}>
                                    {area.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.area_id && <p className="text-red-500">{errors.area_id}</p>}
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Guardando..." : "Actualizar"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}