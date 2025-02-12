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
      nombre_contrato: "",
      fecha_firma: new Date(),
      empresa_involucrada: "",
      duracion: "",
      valor: "",
      estado: "Activo"
    })

    const [convenioData, setConvenioData] = useState({
      nombre_convenio: "",
      fecha_inicio: new Date(),
      fecha_fin: new Date(),
      instituciones_involucradas: "",
      descripcion: "",
      estado: "Activo"
    })

    const [hojaVidaData, setHojaVidaData] = useState({
      nombre_empleado: "",
      fecha_nacimiento: new Date(),
      posicion: "",
      experiencia: "",
      fecha_ingreso: new Date(),
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
          formData.append('nombre_contrato', contratoData.nombre_contrato)
          formData.append('fecha_firma', format(contratoData.fecha_firma, 'yyyy-MM-dd'))
          formData.append('empresa_involucrada', contratoData.empresa_involucrada)
          formData.append('duracion', contratoData.duracion)
          formData.append('valor', contratoData.valor)
          formData.append('estado', contratoData.estado)
          break

        case 'Convenio':
          formData.append('nombre_convenio', convenioData.nombre_convenio)
          formData.append('fecha_inicio', format(convenioData.fecha_inicio, 'yyyy-MM-dd'))
          formData.append('fecha_fin', format(convenioData.fecha_fin, 'yyyy-MM-dd'))
          formData.append('instituciones_involucradas', convenioData.instituciones_involucradas)
          formData.append('descripcion', convenioData.descripcion)
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
          `${process.env.NEXT_PUBLIC_API_URL}/documentos`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`,

            },
          }
        );

        alert("El documento se ha registrado correctamente")

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
          alert("Error al guardar el documento.");
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
                        <Label>Nombre del Contrato *</Label>
                        <Input
                          value={contratoData.nombre_contrato}
                          onChange={(e) => setContratoData({ ...contratoData, nombre_contrato: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Empresa involucrada *</Label>
                        <Input
                          value={contratoData.empresa_involucrada}
                          onChange={(e) => setContratoData({ ...contratoData, empresa_involucrada: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Duracion *</Label>
                        <Input
                          value={contratoData.duracion}
                          onChange={(e) => setContratoData({ ...contratoData, duracion: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Valor *</Label>
                        <Input
                          value={contratoData.valor}
                          onChange={(e) => setContratoData({ ...contratoData, valor: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Fecha de Firma *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {contratoData.fecha_firma ? format(contratoData.fecha_firma, 'PPP') : 'Seleccionar fecha'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={contratoData.fecha_firma}
                              onSelect={(date) => setContratoData({ ...contratoData, fecha_firma: date })}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </>
                  )}

                  {tipoDocumento === 'Convenio' && (
                    <>
                    <div className="space-y-2">
                      <Label>Nombre del convenio *</Label>
                      <Input
                        value={convenioData.nombre_convenio}
                        onChange={(e) => setConvenioData({ ...convenioData, nombre_convenio: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                        <Label>Fecha de inicio *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {contratoData.fecha_inicio ? format(contratoData.fecha_inicio, 'PPP') : 'Seleccionar fecha'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={contratoData.fecha_inicio}
                              onSelect={(date) => setContratoData({ ...contratoData, fecha_inicio: date })}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label>Fecha de fin *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {contratoData.fecha_fin ? format(contratoData.fecha_fin, 'PPP') : 'Seleccionar fecha'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={contratoData.fecha_fin}
                              onSelect={(date) => setContratoData({ ...contratoData, fecha_fin: date })}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    <div className="space-y-2">
                      <Label>Instituciones Involucradas *</Label>
                      <Input
                        value={convenioData.instituciones_involucradas}
                        onChange={(e) => setConvenioData({ ...convenioData, instituciones_involucradas: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Descripcion *</Label>
                      <Input
                        value={convenioData.descripcion}
                        onChange={(e) => setConvenioData({ ...convenioData, descripcion: e.target.value })}
                        required
                      />
                    </div>
                    </>
                  )}

                  {tipoDocumento === 'Hoja de Vida' && (
                    <div className="space-y-2">
                      <Label>Posición del Empleado *</Label>
                      <Input
                        value={hojaVidaData.posicion}
                        onChange={(e) => setHojaVidaData({ ...hojaVidaData, posicion: e.target.value })}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="asunto">Asunto/Comentarios *</Label>
                  <Textarea
                    id="asunto"
                    required
                  />
                </div>

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
                      />
                    )
                  ) : (
                    <div className="text-center text-gray-500 p-4">
                      <p>Arrastra y suelta un documento aquí</p>
                      <p>o usa el botón "Nuevo Documento"</p>
                      <p className="text-sm">(Formatos soportados: PDF, PNG, JPG)</p>
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