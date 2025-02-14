"use client"

import DashboardLayout from "@/app/dashboard/layout"
import { useState, useRef, useEffect } from "react"
import { Breadcrumb } from "@/app/componentes/breadcrumb"
import { Save, FileUp, Trash2, Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import axios from "axios"
import { toast } from "sonner"

import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"

const IngresoDocumentos = () => {

  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  // Estados para TRD
  const [openSection, setOpenSection] = useState(false)
  const [openSerie, setOpenSerie] = useState(false)
  const [openSubserie, setOpenSubserie] = useState(false)
  const [selectedSection, setSelectedSection] = useState("")
  const [selectedSerie, setSelectedSerie] = useState("")
  const [selectedSubserie, setSelectedSubserie] = useState("")

  // Estados para datos específicos
  const [tipoDocumento, setTipoDocumento] = useState("")
  const [contratoData, setContratoData] = useState({
    numero_contrato: "",
    objeto_contrato: "",
    empresa_involucrada: "",
    anio: "",
    expediente: "",
    folio: "",
    carpeta: "",
    estado: "Activo"
  })

  const [convenioData, setConvenioData] = useState({
    numero_convenio: "",
    objeto_convenio: "",
    empresa_involucrada: "",
    anio: "",
    expediente: "",
    folio: "",
    carpeta: "",
    estado: "Activo"
  })

  const [hojaVidaData, setHojaVidaData] = useState({
    nombre_empleado: "",
    fecha_nacimiento: "",
    posicion: "",
    experiencia: "",
    fecha_ingreso: "",
    estado: "Activo"
  })


  // Datos de ejemplo (debes reemplazar con llamadas a tu API)
  const sections = [
    { value: "1", label: "Contratos" },
    { value: "2", label: "Convenios" },
    { value: "3", label: "Recursos Humanos" },
  ]

  const series = [
    { value: "1", label: "Serie Legal" },
    { value: "2", label: "Serie Administrativa" },
  ]

  const subseries = [
    { value: "1", label: "Subserie Contratos" },
    { value: "2", label: "Subserie Convenios" },
    { value: "3", label: "Subserie Hojas de Vida" },
  ]

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (file.type === "application/pdf" || file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
      }
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (file.type === "application/pdf" || file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
      }
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!selectedSubserie) {
      alert("Debes seleccionar una subserie TRD antes de guardar.")
      setLoading(false)
      return
    }


    if (!selectedFile) {
      alert("Debes adjuntar un archivo antes de enviar el formulario.");
      setLoading(false);
      return;
    }

    const formData = new FormData()
    formData.append('tipo_documento', tipoDocumento);
    formData.append('nombre_documento', e.target.nombreArchivo.value);
    formData.append('trd_id', selectedSubserie);
    formData.append('asunto', e.target.asunto.value);
    formData.append('ruta_archivo', selectedFile);
    formData.append('version', '1');
    formData.append('comentarios', e.target.asunto.value);
    // Agregar datos específicos según el tipo de documento
    switch (tipoDocumento) {
      case 'Contrato':
        formData.append('numero_contrato', (contratoData.numero_contrato))
        formData.append('objeto_contrato', (contratoData.objeto_contrato))
        formData.append('empresa_involucrada', (contratoData.empresa_involucrada))
        formData.append('anio', contratoData.anio)
        formData.append('expediente', contratoData.expediente)
        formData.append('folio', contratoData.folio)
        formData.append('carpeta', contratoData.carpeta)
        formData.append('estado', contratoData.estado)
        break

      case 'Convenio':
        formData.append('numero_convenio', convenioData.numero_convenio)
        formData.append('objeto_convenio', (convenioData.objeto_convenio))
        formData.append('empresa_involucrada', (convenioData.empresa_involucrada))
        formData.append('anio', (convenioData.anio))
        formData.append('expediente', convenioData.expediente)
        formData.append('folio', convenioData.folio)
        formData.append('carpeta', convenioData.carpeta)
        formData.append('estado', convenioData.estado)
        break

      case 'Hoja de Vida':
        formData.append('nombre_empleado', hojaVidaData.nombre_empleado)
        formData.append('fecha_nacimiento', format(hojaVidaData.fecha_nacimiento, 'yyyy-MM-dd'))
        formData.append('posicion', hojaVidaData.posicion)
        formData.append('experiencia', hojaVidaData.experiencia)
        formData.append('fecha_ingreso', format(hojaVidaData.fecha_ingreso, 'yyyy-MM-dd'))
        formData.append('estado', hojaVidaData.estado)
        break
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/historico`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,

          },
        }
      );

      toast.success("El documento se ha registrado correctamente")

      // Resetear formulario
      setSelectedFile(null)
      setPreviewUrl(null)
      e.target.reset()
      setTipoDocumento("")
      setSelectedSection("")
      setSelectedSerie("")
      setSelectedSubserie("")

    } catch (error) {
      if (error.response && error.response.data.errors && error.response.data.errors.trd_id) {
        alert(`Error: ${error.response.data.errors.trd_id[0]}`);
      } else {
        toast.error("Error al guardar el documento.");
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit}>
        <div className="p-4 md:p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">Ingreso de Documentos</h2>
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
              {loading ? 'Guardando...' : 'Guardar'}
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
            <Button variant="destructive" className="px-3 py-1 text-sm" type="button">
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
                      <Button variant="outline" className="w-full justify-between">
                        {selectedSection ? sections.find(s => s.value === selectedSection)?.label : "Seleccionar sección"}
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
                                setSelectedSection(section.value)
                                setOpenSection(false)
                              }}
                            >
                              <Check className={cn("mr-2 h-4 w-4", selectedSection === section.value ? "opacity-100" : "opacity-0")} />
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
                      <Button variant="outline" className="w-full justify-between">
                        {selectedSerie ? series.find(s => s.value === selectedSerie)?.label : "Seleccionar serie"}
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
                                setSelectedSerie(serie.value)
                                setOpenSerie(false)
                              }}
                            >
                              <Check className={cn("mr-2 h-4 w-4", selectedSerie === serie.value ? "opacity-100" : "opacity-0")} />
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
                      <Button variant="outline" className="w-full justify-between">
                        {selectedSubserie ? subseries.find(s => s.value === selectedSubserie)?.label : "Seleccionar subserie"}
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
                                setSelectedSubserie(subserie.value)
                                setOpenSubserie(false)
                              }}
                            >
                              <Check className={cn("mr-2 h-4 w-4", selectedSubserie === subserie.value ? "opacity-100" : "opacity-0")} />
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
                      <SelectItem value="Contrato">Contrato</SelectItem>
                      <SelectItem value="Convenio">Convenio</SelectItem>
                      <SelectItem value="Hoja de Vida">Hoja de Vida</SelectItem>
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
                    onChange={(e) => setSelectedFile({ ...selectedFile, name: e.target.value })}
                    readOnly
                  />
                </div>

                {/* Campos específicos por tipo de documento */}
                {tipoDocumento === 'Contrato' && (
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
                      <Label> Objeto del contrato *</Label>
                      <Input
                        value={contratoData.objeto_contrato}
                        onChange={(e) => setContratoData({ ...contratoData, objeto_contrato: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label> Empresa involucrada (NIT)*</Label>
                      <Input
                        value={contratoData.empresa_involucrada}
                        onChange={(e) => setContratoData({ ...contratoData, empresa_involucrada: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Año *</Label>
                      <Input
                        value={contratoData.anio}
                        onChange={(e) => setContratoData({ ...contratoData, anio: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Expediente *</Label>
                      <Input
                        value={contratoData.expediente}
                        onChange={(e) => setContratoData({ ...contratoData, expediente: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Folio *</Label>
                      <Input
                        value={contratoData.folio}
                        onChange={(e) => setContratoData({ ...contratoData, folio: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tomo / Carpeta *</Label>
                      <Input
                        value={contratoData.carpeta}
                        onChange={(e) => setContratoData({ ...contratoData, carpeta: e.target.value })}
                        required
                      />
                    </div>
                  </>
                )}

                {tipoDocumento === 'Convenio' && (
                  <>
                  <div className="space-y-2">
                    <Label>Número del convenio *</Label>
                    <Input
                      value={convenioData.numero_convenio}
                      onChange={(e) => setConvenioData({ ...convenioData, numero_convenio: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Objeto del convenio *</Label>
                    <Input
                      value={convenioData.objeto_convenio}
                      onChange={(e) => setConvenioData({ ...convenioData, objeto_convenio: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Empresa involucrada (NIT) *</Label>
                    <Input
                      value={convenioData.empresa_involucrada}
                      onChange={(e) => setConvenioData({ ...convenioData, empresa_involucrada: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Año *</Label>
                    <Input
                      value={convenioData.anio}
                      onChange={(e) => setConvenioData({ ...convenioData, anio: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Expediente *</Label>
                    <Input
                      value={convenioData.expediente}
                      onChange={(e) => setConvenioData({ ...convenioData, expediente: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Folio *</Label>
                    <Input
                      value={convenioData.folio}
                      onChange={(e) => setConvenioData({ ...convenioData, folio: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tomo / Carpeta *</Label>
                    <Input
                      value={convenioData.carpeta}
                      onChange={(e) => setConvenioData({ ...convenioData, carpeta: e.target.value })}
                      required
                    />
                  </div>
                </>
                )}

                {tipoDocumento === 'Hoja de Vida' && (
                  <>

                  <div className="space-y-2">
                    <Label>Nombre del Empleado *</Label>
                    <Input
                      value={hojaVidaData.nombre_empleado}
                      onChange={(e) => setHojaVidaData({ ...hojaVidaData, nombre_empleado: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha de nacimiento *</Label>
                    <Input
                      value={hojaVidaData.fecha_nacimiento}
                      onChange={(e) => setHojaVidaData({ ...hojaVidaData, fecha_nacimiento: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha de ingreso *</Label>
                    <Input
                      value={hojaVidaData.fecha_ingreso}
                      onChange={(e) => setHojaVidaData({ ...hojaVidaData, fecha_ingreso: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Experiencia *</Label>
                    <Input
                      value={hojaVidaData.experiencia}
                      onChange={(e) => setHojaVidaData({ ...hojaVidaData, experiencia: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Posición del Empleado *</Label>
                    <Input
                      value={hojaVidaData.posicion}
                      onChange={(e) => setHojaVidaData({ ...hojaVidaData, posicion: e.target.value })}
                      required
                    />
                  </div>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="asunto">Asunto/Comentarios *</Label>
                <Textarea
                  id="asunto"
                  required
                />
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
                    <iframe src={previewUrl} className="w-full h-full" title="PDF preview" />
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
                    <p className="text-sm">(Formatos soportados: PDF | Peso máximo: 20MB)</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </DashboardLayout>
  )
}

export default IngresoDocumentos