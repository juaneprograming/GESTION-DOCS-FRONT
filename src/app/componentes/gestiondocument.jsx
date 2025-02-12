import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ActionMenu } from "@/app/componentes/actionmenu"
import { useSearchParams } from "next/navigation"
import axios from "axios"

export default function DocumentUpload() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    const [selectedFile, setSelectedFile] = useState(null)
    const [documents, setDocuments] = useState([])
    const [documentType, setDocumentType] = useState("")
    const [observation, setObservation] = useState("")

    const loadDocuments = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/documento/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setDocuments(response.data.documentos);
        } catch (error) {
            console.error('Error al cargar documentos:', error);
            alert('Error al cargar la lista de documentos.');
        }
    };

    useEffect(() => {
        if (id) {
            loadDocuments();
        }
    }, [id]);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    }

    const handleAddDocument = async () => {
        if (!documentType || !selectedFile) {
            alert("Por favor seleccione un tipo de documento y un archivo")
            return
        }

        const formData = new FormData()
        formData.append('nombre_documento', documentType)
        formData.append('observacion', observation || '')
        formData.append('archivo', selectedFile)

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/documento/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Clear form fields **AFTER** successful save
            setDocumentType("")
            setObservation("")
            setSelectedFile(null)

            // Refresh document list **AFTER** successful save and clearing fields
            loadDocuments();


        } catch (error) {
            console.error('Error:', error)
            alert(error.response?.data?.error || 'Error al cargar el documento')
        }
    }
    const handleDelete = (index) => {
        const newDocuments = documents.filter((_, i) => i !== index)
        setDocuments(newDocuments)
    }
    
    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Documentos</h2>
                <div className="flex items-center gap-4">
                    <ActionMenu />
                    <Button variant="default" className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black" onClick={handleAddDocument}>
                        Adicionar Documentos
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="documentType">
                        Tipo de Documento <span className="text-red-500">*</span>
                    </Label>
                    <Select value={documentType} onValueChange={(e) => setDocumentType(e)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar documento" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="dni">DNI</SelectItem>
                            <SelectItem value="passport">Pasaporte</SelectItem>
                            <SelectItem value="license">Licencia</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="observation">Observación</Label>
                    <Textarea
                        id="observation"
                        className="min-h-[120px]"
                        placeholder="Ingrese su observación aquí..."
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Seleccionar Archivo</Label>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="secondary"
                            className="bg-[#1f2937] text-white hover:bg-[#1f2937]/90"
                            onClick={() => document.getElementById("file-upload").click()}
                        >
                            Elegir archivo
                        </Button>
                        <span className="text-gray-500">
                            {selectedFile ? selectedFile.name : "No se ha seleccionado ningún archivo"}
                        </span>

                        <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                    </div>
                </div>

                <div className="overflow-x-auto"></div>

                {documents.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="text-left font-semibold px-4 py-2 border-b dark:border-slate-700">Tipo de Documento</th>
                                    <th className="text-left font-semibold px-4 py-2 border-b dark:border-slate-700">Observación</th>
                                    <th className="text-left font-semibold px-4 py-2 border-b dark:border-slate-700">Archivo</th>
                                    <th className="text-left font-semibold px-4 py-2 border-b dark:border-slate-700">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.map((document, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-600">
                                        <td className="px-4 py-2 border-b dark:border-slate-700">{document.nombre_documento}</td>
                                        <td className="px-4 py-2 border-b dark:border-slate-700">{document.observacion}</td>
                                        <td className="px-4 py-2 border-b dark:border-slate-700">{document.nombre_original}</td>
                                        <td className="px-4 py-2 border-b dark:border-slate-700">
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(index)}>
                                                Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 mt-8">No hay documentos adjuntos.</p>
                )}
            </div>
        </div>
    )
}