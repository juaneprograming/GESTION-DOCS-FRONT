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
                return;
            }

            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/administracion/empleados/${empleadoId}`, {
                headers: { Authorization: `Bearer ${token}` },
                cancelToken: source.token
            });

            const employeeData = response.data.data || response.data;
            setCache(prev => ({ ...prev, [empleadoId]: employeeData }));

            if (!background) setFormData(employeeData);
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
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/administracion/empleados/${empleadoId}`, formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });

            toast.success("Empleado actualizado exitosamente");
            onEmpleadoActualizado && onEmpleadoActualizado(); // Actualiza la lista en el padre
            setCache(prev => ({ ...prev, [empleadoId]: formData }));
            setOpen(false);
        } catch (error) {
            toast.error(`Error al Actualizar: ${error.response?.data?.message || error.message}`);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) setErrors({});
        }}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onMouseEnter={() => handlePrefetch()}
                >
                    <Edit2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Editar Empleado</DialogTitle>
                    <DialogDescription>
                        Modifica los campos necesarios para actualizar la información del empleado.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 grid-cols-2">
                    {/* Campo de ejemplo - Repetir para los demás campos */}
                    <div className="grid items-center gap-4">
                        <Label htmlFor="nombre_1">Nombre 1 *</Label>
                        <Input
                            id="nombre_1"
                            value={formData.nombre_1}
                            onChange={(e) => handleChange("nombre_1", e.target.value)}
                            className={errors.nombre_1 ? "border-red-500" : ""}
                        />
                        {errors.nombre_1 && (
                            <span className="text-red-500 text-sm">{errors.nombre_1}</span>
                        )}
                    </div>
                    <div className="grid items-center gap-4">
                        <Label htmlFor="nombre_2">Nombre 2</Label>
                        <Input
                            id="nombre_2"
                            value={formData.nombre_2}
                            onChange={(e) => handleChange("nombre_2", e.target.value)}
                        />
                    </div>
                    <div className="grid items-center gap-4">
                        <Label htmlFor="apellido_1">Apellido 1 *</Label>
                        <Input
                            id="apellido_1"
                            value={formData.apellido_1}
                            onChange={(e) => handleChange("apellido_1", e.target.value)}
                            className={errors.apellido_1 ? "border-red-500" : ""}
                        />
                        {errors.apellido_1 && <span className="text-red-500 text-sm">{errors.apellido_1}</span>}
                    </div>
                    <div className="grid items-center gap-4">
                        <Label htmlFor="apellido_2">Apellido 2</Label>
                        <Input
                            id="apellido_2"
                            value={formData.apellido_2}
                            onChange={(e) => handleChange("apellido_2", e.target.value)}
                        />
                    </div>
                    <div className="grid items-center gap-4">
                        <Label htmlFor="tipo_identificacion">Tipo de Identificación *</Label>
                        <Input
                            id="tipo_identificacion"
                            value={formData.tipo_identificacion}
                            onChange={(e) => handleChange("tipo_identificacion", e.target.value)}
                            className={errors.tipo_identificacion ? "border-red-500" : ""}
                        />
                        {errors.tipo_identificacion && <span className="text-red-500 text-sm">{errors.tipo_identificacion}</span>}
                    </div>
                    <div className="grid items-center gap-4">
                        <Label htmlFor="numero_identificacion">Número de Identificación *</Label>
                        <Input
                            id="numero_identificacion"
                            value={formData.numero_identificacion}
                            onChange={(e) => handleChange("numero_identificacion", e.target.value)}
                            className={errors.numero_identificacion ? "border-red-500" : ""}
                        />
                        {errors.numero_identificacion && <span className="text-red-500 text-sm">{errors.numero_identificacion}</span>}
                    </div>
                    <div className="grid items-center gap-4">
                        <Label htmlFor="correo">Correo *</Label>
                        <Input
                            id="correo"
                            value={formData.correo}
                            onChange={(e) => handleChange("correo", e.target.value)}
                            className={errors.correo ? "border-red-500" : ""}
                        />
                        {errors.correo && <span className="text-red-500 text-sm">{errors.correo}</span>}
                    </div>
                    <div className="grid items-center gap-4">
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                            id="telefono"
                            value={formData.telefono}
                            onChange={(e) => handleChange("telefono", e.target.value)}
                        />
                    </div>
                    <div className="grid items-center gap-4">
                        <Label htmlFor="cargo_id">Cargo *</Label>
                        <Select
                            value={formData.cargo_id?.toString()}
                            onValueChange={(value) => handleChange("cargo_id", value)}
                        >
                            <SelectTrigger className={errors.cargo_id ? "border-red-500" : ""}>
                                <SelectValue placeholder="Selecciona un cargo" />
                            </SelectTrigger>
                            <SelectContent>
                                {cargos.map((cargo) => (
                                    <SelectItem
                                        key={cargo.id}
                                        value={cargo.id.toString()}
                                    >
                                        {cargo.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.cargo_id && (
                            <span className="text-red-500 text-sm">{errors.cargo_id}</span>
                        )}
                    </div>
                    {/* Select para Sede */}
                    <div className="grid items-center gap-4">
                        <Label htmlFor="sede_id">Sede *</Label>
                        <Select
                            value={formData.sede_id?.toString()}
                            onValueChange={(value) => handleChange("sede_id", value)}
                        >
                            <SelectTrigger className={errors.sede_id ? "border-red-500" : ""}>
                                <SelectValue placeholder={
                                    isFetchingSedes ? "Cargando..." : "Selecciona una sede"
                                } />
                            </SelectTrigger>
                            <SelectContent>
                                {sedes.map((sede) => (
                                    <SelectItem
                                        key={sede.id}
                                        value={sede.id.toString()}
                                    >
                                        {sede.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.sede_id && (
                            <span className="text-red-500 text-sm">{errors.sede_id}</span>
                        )}
                    </div>
                    {/* Select para Área */}
                    <div className="grid items-center gap-4">
                        <Label htmlFor="area_id">Área *</Label>
                        <Select
                            value={formData.area_id?.toString()}
                            onValueChange={(value) => handleChange("area_id", value)}
                        >
                            <SelectTrigger className={errors.area_id ? "border-red-500" : ""}>
                                <SelectValue placeholder={
                                    isFetchingAreas ? "Cargando..." : "Selecciona un área"
                                } />
                            </SelectTrigger>
                            <SelectContent>
                                {areas.map((area) => (
                                    <SelectItem
                                        key={area.id}
                                        value={area.id.toString()}
                                    >
                                        {area.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.area_id && (
                            <span className="text-red-500 text-sm">{errors.area_id}</span>
                        )}
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
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