"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ActionMenu } from "@/app/componentes/actionmenu"

export default function DocumentUpload() {
    const [selectedFile, setSelectedFile] = useState(null)
    const [documents, setDocuments] = useState([])
    const [documentType, setDocumentType] = useState("")
    const [observation, setObservation] = useState("")

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0])
    }

    const handleAddDocument = () => {
        if (!documentType || !selectedFile) {
            alert("Por favor seleccione un tipo de documento y un archivo")
            return
        }

        const newDocument = {
            type: documentType,
            observation: observation,
            file: selectedFile,
        }

        setDocuments([...documents, newDocument])

        // Limpiar el formulario
        setDocumentType("")
        setObservation("")
        setSelectedFile(null)
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
                    <Select onValueChange={(e) => setDocumentType(e)}>
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

                {documents.map((document, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div>
                            <p>Tipo: {document.type}</p>
                            <p>Observación: {document.observation}</p>
                            <p>Archivo: {document.file.name}</p>
                        </div>
                        <Button variant="destructive" onClick={() => handleDelete(index)}>
                            Eliminar
                        </Button>
                    </div>
                ))}

                {documents.length === 0 && <p className="text-gray-500 mt-8">No hay documentos adjuntos.</p>}
            </div>
        </div>
    )
}

