"use client";

import DashboardLayout from "@/app/dashboard/layout";
import { useState, useRef, useEffect } from "react";
import { Breadcrumb } from "@/app/componentes/breadcrumb";
import { Save, FileUp, Trash2, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";

import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";

const IngresoDocumentos = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Estados para TRD
  const [openSection, setOpenSection] = useState(false);
  const [openSerie, setOpenSerie] = useState(false);
  const [openSubserie, setOpenSubserie] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSerie, setSelectedSerie] = useState("");
  const [selectedSubserie, setSelectedSubserie] = useState("");

  // Estados para datos específicos
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [contratoData, setContratoData] = useState({
    numero_contrato: "",
    fecha_firma: "",
    empresa_involucrada: "",
    anio: "",
    valor_contrato: "",
    objeto: "",
    obligaciones_contratista: "",
    plazo_ejecucion: "",
    estado: "Activo",
  });

  const [convenioData, setConvenioData] = useState({
    numero_convenio: "",
    tipo_convenio: "",
    entidad_publica: "",
    entidad_privada: "",
    fecha_firma: "",
    fecha_inicio: "",
    fecha_fin: "",
    objeto: "",
    valor_total: "",
    aporte_entidad_publica: "",
    aporte_entidad_privada: "",
    estado: "Activo",
  });

  const [hojaVidaData, setHojaVidaData] = useState({
    nombres: "",
    apellidos: "",
    tipo_identificacion: "",
    numero_documento: "",
    fecha_nacimiento: "",
    lugar_nacimiento: "",
    direccion: "",
    telefono: "",
    email: "",
    nivel_educativo: "",
    titulo_obtenido: "",
    institucion_educativa: "",
    experiencia_laboral: "",
    posicion: "",
    fecha_ingreso: "",
    trd_id: "",
  });

  // Datos de ejemplo (debes reemplazar con llamadas a tu API)
  const sections = [
    { value: "1", label: "Contratos" },
    { value: "2", label: "Convenios" },
    { value: "3", label: "Recursos Humanos" },
  ];

  const series = [
    { value: "1", label: "Serie Legal" },
    { value: "2", label: "Serie Administrativa" },
  ];

  const subseries = [
    { value: "1", label: "Subserie Contratos" },
    { value: "2", label: "Subserie Convenios" },
    { value: "3", label: "Subserie Hojas de Vida" },
  ];

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type === "application/pdf" || file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type === "application/pdf" || file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedSubserie) {
        alert("Debes seleccionar una subserie TRD antes de guardar.");
        setLoading(false);
        return;
    }

    if (!selectedFile) {
        alert("Debes adjuntar un archivo antes de enviar el formulario.");
        setLoading(false);
        return;
    }
    if (!selectedSubserie) {
        alert("Debes seleccionar una subserie TRD antes de guardar.");
        setLoading(false);
        return;
    }

    const formData = new FormData();
    formData.append("tipo_documento", tipoDocumento);
    formData.append("nombre_documento", e.target.nombreArchivo.value);
    formData.append("trd_id", selectedSubserie);
    formData.append("asunto", e.target.asunto.value);
    formData.append("ruta_archivo", selectedFile);
    formData.append("version", "1");
    formData.append("comentarios", e.target.asunto.value);

    // Agregar datos específicos según el tipo de documento
    switch (tipoDocumento) {
        case "contrato":
            formData.append("numero_contrato", contratoData.numero_contrato);
            formData.append("fecha_firma", contratoData.fecha_firma);
            formData.append("empresa_involucrada", contratoData.empresa_involucrada);
            formData.append("anio", contratoData.anio);
            formData.append("valor_contrato", contratoData.valor_contrato);
            formData.append("objeto", contratoData.objeto);
            formData.append("obligaciones_contratista", contratoData.obligaciones_contratista);
            formData.append("plazo_ejecucion", contratoData.plazo_ejecucion);
            formData.append("estado", contratoData.estado);
            break;

        case "convenio":
            formData.append("numero_convenio", convenioData.numero_convenio);
            formData.append("tipo_convenio", convenioData.tipo_convenio);
            formData.append("entidad_publica", convenioData.entidad_publica);
            formData.append("entidad_privada", convenioData.entidad_privada);
            formData.append("fecha_firma", convenioData.fecha_firma);
            formData.append("fecha_inicio", convenioData.fecha_inicio);
            formData.append("fecha_fin", convenioData.fecha_fin);
            formData.append("objeto", convenioData.objeto);
            formData.append("valor_total", convenioData.valor_total);
            formData.append("aporte_entidad_publica", convenioData.aporte_entidad_publica);
            formData.append("aporte_entidad_privada", convenioData.aporte_entidad_privada);
            formData.append("estado", convenioData.estado);
            break;

        case "hv":
            formData.append("nombres", hojaVidaData.nombres);
            formData.append("apellidos", hojaVidaData.apellidos);
            formData.append("tipo_identificacion", hojaVidaData.tipo_identificacion);
            formData.append("numero_documento", hojaVidaData.numero_documento);
            formData.append("fecha_nacimiento", format(hojaVidaData.fecha_nacimiento, "yyyy-MM-dd"));
            formData.append("lugar_nacimiento", hojaVidaData.lugar_nacimiento);
            formData.append("direccion", hojaVidaData.direccion);
            formData.append("telefono", hojaVidaData.telefono);
            formData.append("email", hojaVidaData.email);
            formData.append("nivel_educativo", hojaVidaData.nivel_educativo);
            formData.append("titulo_obtenido", hojaVidaData.titulo_obtenido);
            formData.append("institucion_educativa", hojaVidaData.institucion_educativa);
            formData.append("experiencia_laboral", hojaVidaData.experiencia_laboral);
            formData.append("posicion", hojaVidaData.posicion);
            formData.append("fecha_ingreso", format(hojaVidaData.fecha_ingreso, "yyyy-MM-dd"));
            // formData.append("trd_id", hojaVidaData.trd_id);
            formData.append("trd_id", selectedSubserie); // Use selectedSubserie here
            break;
    }

    try {
        const token = localStorage.getItem("token");
        await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/historico`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        toast.success("El documento se ha registrado correctamente");

        // Resetear formulario
        setSelectedFile(null);
        setPreviewUrl(null);
        e.target.reset();
        setTipoDocumento("");
        setSelectedSection("");
        setSelectedSerie("");
        setSelectedSubserie("");
    } catch (error) {
        if (error.response && error.response.data.errors && error.response.data.errors.trd_id) {
            alert(`Error: ${error.response.data.errors.trd_id[0]}`);
        } else {
            toast.error("Error al guardar el documento.");
        }
    } finally {
        setLoading(false);
    }
};

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit}>
        <div className="p-4 md:p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                Ingreso de Documentos
              </h2>
              <Breadcrumb />
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2 mb-6">
            <Button
              type="submit"
              disabled={loading}
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm"
            >
              <Save className="mr-1 h-3 w-3" />
              {loading ? "Guardando..." : "Guardar"}
            </Button>
            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm"
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              <FileUp className="mr-1 h-3 w-3" />
              Nuevo
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,image/*"
              className="hidden"
            />
            <Button
              variant="destructive"
              className="px-3 py-1 text-sm"
              type="button"
            >
              <Trash2 className="mr-1 h-3 w-3" />
              Eliminar
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Sección TRD */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Sección TRD *</Label>
                  <Popover open={openSection} onOpenChange={setOpenSection}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        {selectedSection
                          ? sections.find((s) => s.value === selectedSection)
                              ?.label
                          : "Seleccionar sección"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Buscar sección..." />
                        <CommandList>
                          {sections.map((section) => (
                            <CommandItem
                              key={section.value}
                              onSelect={() => {
                                setSelectedSection(section.value);
                                setOpenSection(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedSection === section.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {section.label}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Serie TRD</Label>
                  <Popover open={openSerie} onOpenChange={setOpenSerie}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        {selectedSerie
                          ? series.find((s) => s.value === selectedSerie)?.label
                          : "Seleccionar serie"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Buscar serie..." />
                        <CommandList>
                          {series.map((serie) => (
                            <CommandItem
                              key={serie.value}
                              onSelect={() => {
                                setSelectedSerie(serie.value);
                                setOpenSerie(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedSerie === serie.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {serie.label}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Subserie TRD *</Label>
                  <Popover open={openSubserie} onOpenChange={setOpenSubserie}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        {selectedSubserie
                          ? subseries.find((s) => s.value === selectedSubserie)
                              ?.label
                          : "Seleccionar subserie"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Buscar subserie..." />
                        <CommandList>
                          {subseries.map((subserie) => (
                            <CommandItem
                              key={subserie.value}
                              onSelect={() => {
                                setSelectedSubserie(subserie.value);
                                setOpenSubserie(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedSubserie === subserie.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {subserie.label}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipoDocumento">Tipo de Documento *</Label>
                  <Select
                    value={tipoDocumento}
                    onValueChange={setTipoDocumento}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contrato">Contrato</SelectItem>
                      <SelectItem value="convenio">Convenio</SelectItem>
                      <SelectItem value="hv">Hoja de Vida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nombreArchivo">Nombre de Archivo *</Label>
                  <Input
                    type="text"
                    id="nombreArchivo"
                    required
                    value={selectedFile?.name || ""}
                    onChange={(e) =>
                      setSelectedFile({ ...selectedFile, name: e.target.value })
                    }
                    readOnly
                  />
                </div>

                {/* Campos específicos por tipo de documento */}
                {tipoDocumento === 'contrato' && (
  <>
    <div className="space-y-2">
      <Label>Número del contrato *</Label>
      <Input
        value={contratoData.numero_contrato}
        onChange={(e) => setContratoData({ ...contratoData, numero_contrato: e.target.value })}
        required
      />
    </div>

    <div className="space-y-2">
      <Label>Fecha de firma *</Label>
      <Input type="date"
        value={contratoData.fecha_firma}
        onChange={(e) => setContratoData({ ...contratoData, fecha_firma: e.target.value })}
        required
      />
    </div>

    <div className="space-y-2">
      <Label>Empresa involucrada (NIT) *</Label>
      <Input
        value={contratoData.empresa_involucrada}
        onChange={(e) => setContratoData({ ...contratoData, empresa_involucrada: e.target.value })}
        required
      />
    </div>

    <div className="space-y-2">
      <Label>Año *</Label>
      <Input type="number"
        value={contratoData.anio}
        onChange={(e) => setContratoData({ ...contratoData, anio: e.target.value })}
        required
      />
    </div>

    <div className="space-y-2">
      <Label>Valor del contrato *</Label>
      <Input type="number"
        value={contratoData.valor_contrato}
        onChange={(e) => setContratoData({ ...contratoData, valor_contrato: e.target.value })}
        required
      />
    </div>

    <div className="space-y-2">
      <Label>Objeto *</Label>
      <Input
        value={contratoData.objeto}
        onChange={(e) => setContratoData({ ...contratoData, objeto: e.target.value })}
        required
      />
    </div>

    <div className="space-y-2">
      <Label>Obligaciones del contratista *</Label>
      <Input
        value={contratoData.obligaciones_contratista}
        onChange={(e) => setContratoData({ ...contratoData, obligaciones_contratista: e.target.value })}
        required
      />
    </div>

    <div className="space-y-2">
      <Label>Plazo de ejecución *</Label>
      <Input
        value={contratoData.plazo_ejecucion}
        onChange={(e) => setContratoData({ ...contratoData, plazo_ejecucion: e.target.value })}
        required
      />
    </div>
  </>
)}

{tipoDocumento === "convenio" && (
  <>
    <div className="space-y-2">
      <Label>Número del convenio *</Label>
      <Input
        value={convenioData.numero_convenio}
        onChange={(e) =>
          setConvenioData({
            ...convenioData,
            numero_convenio: e.target.value,
          })
        }
        required
      />
    </div>
    <div className="space-y-2">
      <Label>Tipo de convenio *</Label>
      <Select
        value={convenioData.tipo_convenio}
        onValueChange={(value) =>
          setConvenioData({
            ...convenioData,
            tipo_convenio: value,
          })
        }
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Colaboracion">Colaboración</SelectItem>
          <SelectItem value="Asociacion">Asociación</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label>Entidad pública</Label>
      <Input
        value={convenioData.entidad_publica}
        onChange={(e) =>
          setConvenioData({
            ...convenioData,
            entidad_publica: e.target.value,
          })
        }
      />
    </div>
    <div className="space-y-2">
      <Label>Entidad privada</Label>
      <Input
        value={convenioData.entidad_privada}
        onChange={(e) =>
          setConvenioData({
            ...convenioData,
            entidad_privada: e.target.value,
          })
        }
      />
    </div>
    <div className="space-y-2">
      <Label>Fecha de firma *</Label>
      <Input
        type="date"
        value={convenioData.fecha_firma}
        onChange={(e) =>
          setConvenioData({
            ...convenioData,
            fecha_firma: e.target.value,
          })
        }
        required
      />
    </div>
    <div className="space-y-2">
      <Label>Fecha de inicio *</Label>
      <Input
        type="date"
        value={convenioData.fecha_inicio}
        onChange={(e) =>
          setConvenioData({
            ...convenioData,
            fecha_inicio: e.target.value,
          })
        }
        required
      />
    </div>
    <div className="space-y-2">
      <Label>Fecha de fin *</Label>
      <Input
        type="date"
        value={convenioData.fecha_fin}
        onChange={(e) =>
          setConvenioData({
            ...convenioData,
            fecha_fin: e.target.value,
          })
        }
        required
      />
    </div>
    <div className="space-y-2">
      <Label>Objeto *</Label>
      <Input
        value={convenioData.objeto}
        onChange={(e) =>
          setConvenioData({
            ...convenioData,
            objeto: e.target.value,
          })
        }
        required
      />
    </div>
    <div className="space-y-2">
      <Label>Valor total *</Label>
      <Input
        type="number"
        value={convenioData.valor_total}
        onChange={(e) =>
          setConvenioData({
            ...convenioData,
            valor_total: e.target.value,
          })
        }
        required
      />
    </div>
    <div className="space-y-2">
      <Label>Aporte entidad pública</Label>
      <Input
        type="number"
        value={convenioData.aporte_entidad_publica}
        onChange={(e) =>
          setConvenioData({
            ...convenioData,
            aporte_entidad_publica: e.target.value,
          })
        }
      />
    </div>
    <div className="space-y-2">
      <Label>Aporte entidad privada</Label>
      <Input
        type="number"
        value={convenioData.aporte_entidad_privada}
        onChange={(e) =>
          setConvenioData({
            ...convenioData,
            aporte_entidad_privada: e.target.value,
          })
        }
      />
    </div>
    <div className="space-y-2">
      <Label>Estado *</Label>
      <Select
        value={convenioData.estado}
        onValueChange={(value) =>
          setConvenioData({
            ...convenioData,
            estado: value,
          })
        }
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Activo">Activo</SelectItem>
          <SelectItem value="Finalizado">Finalizado</SelectItem>
          <SelectItem value="Rescindido">Rescindido</SelectItem>
          <SelectItem value="Suspendido">Suspendido</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </>
)}


{tipoDocumento === "hv" && (
  <>
    <div className="space-y-2">
      <Label>Nombres *</Label>
      <Input
        value={hojaVidaData.nombres}
        onChange={(e) =>
          setHojaVidaData({
            ...hojaVidaData,
            nombres: e.target.value,
          })
        }
        required
      />
    </div>
    <div className="space-y-2">
      <Label>Apellidos *</Label>
      <Input
        value={hojaVidaData.apellidos}
        onChange={(e) =>
          setHojaVidaData({
            ...hojaVidaData,
            apellidos: e.target.value,
          })
        }
        required
      />
    </div>
    <div className="space-y-2">
      <Label>Tipo de Documento *</Label>
      <Select
        value={hojaVidaData.tipo_identificacion}
        onValueChange={(value) =>
          setHojaVidaData({
            ...hojaVidaData,
            tipo_identificacion: value,
          })
        }
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="CC">CC</SelectItem>
          <SelectItem value="CE">CE</SelectItem>
          {/* <SelectItem value="TI">TI</SelectItem> */}
          <SelectItem value="PAS">Pasaporte</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label>Número de Documento *</Label>
      <Input
        value={hojaVidaData.numero_documento}
        onChange={(e) =>
          setHojaVidaData({
            ...hojaVidaData,
            numero_documento: e.target.value,
          })
        }
        required
      />
    </div>
    <div className="space-y-2">
      <Label>Fecha de Nacimiento *</Label>
      <Input
        type="date"
        value={hojaVidaData.fecha_nacimiento}
        onChange={(e) =>
          setHojaVidaData({
            ...hojaVidaData,
            fecha_nacimiento: e.target.value,
          })
        }
        required
      />
    </div>
    <div className="space-y-2">
      <Label>Lugar de Nacimiento</Label>
      <Input
        value={hojaVidaData.lugar_nacimiento}
        onChange={(e) =>
          setHojaVidaData({
            ...hojaVidaData,
            lugar_nacimiento: e.target.value,
          })
        }
      />
    </div>
    <div className="space-y-2">
      <Label>Dirección</Label>
      <Input
        value={hojaVidaData.direccion}
        onChange={(e) =>
          setHojaVidaData({
            ...hojaVidaData,
            direccion: e.target.value,
          })
        }
      />
    </div>
    <div className="space-y-2">
      <Label>Teléfono</Label>
      <Input
        value={hojaVidaData.telefono}
        onChange={(e) =>
          setHojaVidaData({
            ...hojaVidaData,
            telefono: e.target.value,
          })
        }
      />
    </div>
    <div className="space-y-2">
      <Label>Email</Label>
      <Input
        type="email"
        value={hojaVidaData.email}
        onChange={(e) =>
          setHojaVidaData({
            ...hojaVidaData,
            email: e.target.value,
          })
        }
      />
    </div>
    <div className="space-y-2">
      <Label>Nivel Educativo</Label>
      <Input
        value={hojaVidaData.nivel_educativo}
        onChange={(e) =>
          setHojaVidaData({
            ...hojaVidaData,
            nivel_educativo: e.target.value,
          })
        }
      />
    </div>
    <div className="space-y-2">
      <Label>Título Obtenido</Label>
      <Input
        value={hojaVidaData.titulo_obtenido}
        onChange={(e) =>
          setHojaVidaData({
            ...hojaVidaData,
            titulo_obtenido: e.target.value,
          })
        }
      />
    </div>
    <div className="space-y-2">
      <Label>Institución Educativa</Label>
      <Input
        value={hojaVidaData.institucion_educativa}
        onChange={(e) =>
          setHojaVidaData({
            ...hojaVidaData,
            institucion_educativa: e.target.value,
          })
        }
      />
    </div>
    <div className="space-y-2">
      <Label>Experiencia Laboral</Label>
      <Input
        value={hojaVidaData.experiencia_laboral}
        onChange={(e) =>
          setHojaVidaData({
            ...hojaVidaData,
            experiencia_laboral: e.target.value,
          })
        }
      />
    </div>
    <div className="space-y-2">
      <Label>Posición</Label>
      <Input
        value={hojaVidaData.posicion}
        onChange={(e) =>
          setHojaVidaData({
            ...hojaVidaData,
            posicion: e.target.value,
          })
        }
      />
    </div>
    <div className="space-y-2">
      <Label>Fecha de Ingreso</Label>
      <Input
        type="date"
        value={hojaVidaData.fecha_ingreso}
        onChange={(e) =>
          setHojaVidaData({
            ...hojaVidaData,
            fecha_ingreso: e.target.value,
          })
        }
      />
    </div>
  </>
)}

              </div>

              <div className="space-y-2">
                <Label htmlFor="asunto">Asunto/Comentarios *</Label>
                <Textarea id="asunto" required />
              </div>
            </div>

            {/* Previsualización de documento */}
            <div className="space-y-4">
              <div
                className="bg-gray-100 border rounded-lg h-96 flex items-center justify-center overflow-hidden"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {previewUrl ? (
                  selectedFile?.type === "application/pdf" ? (
                    <iframe
                      src={previewUrl}
                      className="w-full h-full"
                      title="PDF preview"
                    />
                  ) : (
                    <img
                      src={previewUrl}
                      alt="Document preview"
                      className="max-w-full max-h-full object-contain"
                      multiple
                    />
                  )
                ) : (
                  <div className="text-center text-gray-500 p-4">
                    <p>Arrastra y suelta un documento aquí</p>
                    <p>o usa el botón "Nuevo Documento"</p>
                    <p className="text-sm">
                      (Formatos soportados: PDF | Peso máximo: 20MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default IngresoDocumentos;
