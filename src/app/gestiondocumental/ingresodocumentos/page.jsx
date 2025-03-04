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

// Componentes hijos
import ContratoForm from "@/app/componentes/ContratoForm";
import ConvenioForm from "@/app/componentes/ConvenioForm";
import HojaVidaForm from "@/app/componentes/HojaVidaForm";

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

  // Handlers para actualizar estados desde hijos
  const handleDataChange = (setter) => (field, value) => {
    setter((prev) => ({ ...prev, [field]: value }));
  };

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

    const formData = new FormData();
    formData.append("tipo_documento", tipoDocumento);
    formData.append("nombre_documento", e.target.nombreArchivo.value);
    formData.append("trd_id", selectedSubserie);
    formData.append("asunto", e.target.asunto.value);
    formData.append("ruta_archivo", selectedFile);
    formData.append("version", "1");
    formData.append("comentarios", e.target.asunto.value);

    // Agregar datos específicos según el tipo de documento
    const dataMap = {
      contrato: contratoData,
      convenio: convenioData,
      hv: hojaVidaData,
    };

    Object.entries(dataMap[tipoDocumento]).forEach(([key, value]) => {
      formData.append(key, value);
    });

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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                {[
                  { label: "Sección TRD *", state: openSection, setState: setOpenSection, selected: selectedSection, setSelected: setSelectedSection, items: sections },
                  { label: "Serie TRD", state: openSerie, setState: setOpenSerie, selected: selectedSerie, setSelected: setSelectedSerie, items: series },
                  { label: "Subserie TRD *", state: openSubserie, setState: setOpenSubserie, selected: selectedSubserie, setSelected: setSelectedSubserie, items: subseries },
                ].map(({ label, state, setState, selected, setSelected, items }) => (
                  <div key={label} className="space-y-2">
                    <Label>{label}</Label>
                    <Popover open={state} onOpenChange={setState}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {selected ? items.find((s) => s.value === selected)?.label : `Seleccionar ${label.toLowerCase()}`}
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput placeholder={`Buscar ${label.toLowerCase()}...`} />
                          <CommandList>
                            {items.map((item) => (
                              <CommandItem key={item.value} onSelect={() => { setSelected(item.value); setState(false); }}>
                                <Check className={cn("mr-2 h-4 w-4", selected === item.value ? "opacity-100" : "opacity-0")} />
                                {item.label}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                ))}
                <div className="space-y-2">
                  <Label htmlFor="nombreArchivo">Nombre de Archivo *</Label>
                  <Input
                    type="text"
                    id="nombreArchivo"
                    required
                    value={selectedFile?.name || ""}
                    onChange={(e) => setSelectedFile({ ...selectedFile, name: e.target.value })}
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipoDocumento">Tipo de Documento *</Label>
                  <Select value={tipoDocumento} onValueChange={setTipoDocumento} required>
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
              </div>

              {/* Campos específicos por tipo de documento */}
              {tipoDocumento === 'contrato' && (
                <ContratoForm data={contratoData} onChange={handleDataChange(setContratoData)} />
              )}
              {tipoDocumento === 'convenio' && (
                <ConvenioForm data={convenioData} onChange={handleDataChange(setConvenioData)} />
              )}
              {tipoDocumento === 'hv' && (
                <HojaVidaForm data={hojaVidaData} onChange={handleDataChange(setHojaVidaData)} />
              )}

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
