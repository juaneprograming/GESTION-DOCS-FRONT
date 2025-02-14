import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ActionMenu } from "@/app/componentes/actionmenu";
import { useSearchParams } from "next/navigation";
import axios from "axios";

export default function DocumentUpload() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const entidad = searchParams.get('entidad') || "pqrsd"; // Default a "pqrsd" si no se proporciona
    const [selectedFile, setSelectedFile] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [nombreDocumento, setNombreDocumento] = useState(""); // Reemplaza documentType
    const [observation, setObservation] = useState("");

    const loadDocuments = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/${entidad}/${id}/documentos`,
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
        if (id && entidad) {
            loadDocuments();
        }
    }, [id, entidad]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type !== "application/pdf") {
            alert("Solo se permiten archivos PDF.");
            setSelectedFile(null);
            return;
        }
        if (file && file.size > 2 * 1024 * 1024) {
            alert("El archivo no debe exceder los 2 MB.");
            setSelectedFile(null);
            return;
        }
        setSelectedFile(file);
    };

    const handleAddDocument = async () => {
        // Validación del nombre del documento
        if (!nombreDocumento) {
            alert("Por favor ingrese el nombre del documento.");
            return;
        }

        // Validación del archivo
        if (!selectedFile) {
            alert("Por favor seleccione un archivo PDF.");
            return;
        }

        const formData = new FormData();
        formData.append('nombre_documento', nombreDocumento); // Campo obligatorio
        formData.append('observacion', observation || ''); // Campo opcional
        formData.append('archivo', selectedFile); // Archivo obligatorio

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/${entidad}/${id}/documentos`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Limpiar campos después de guardar exitosamente
            setNombreDocumento("");
            setObservation("");
            setSelectedFile(null);

            // Recargar la lista de documentos
            loadDocuments();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = Object.values(error.response.data.errors).flat();
                alert(errors.join("\n"));
            } else {
                alert('Error al cargar el documento.');
            }
        }
    };

    const handleDelete = (index) => {
        const newDocuments = documents.filter((_, i) => i !== index);
        setDocuments(newDocuments);
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                    {entidad === 'pqrsd' ? 'PQRSD' : 'Expediente'} - Documentos
                </h2>
                <div className="flex items-center gap-4">
                    <ActionMenu />
                    <Button
                        variant="default"
                        className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black"
                        onClick={handleAddDocument}
                        disabled={!nombreDocumento || !selectedFile}
                    >
                        Adicionar Documentos
                    </Button>
                </div>
            </div>
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="nombreDocumento">
                        Nombre del Documento <span className="text-red-500">*</span>
                    </Label>
                    <input
                        id="nombreDocumento"
                        type="text"
                        className="w-full border rounded-md px-3 py-2"
                        placeholder="Ingrese el nombre del documento"
                        value={nombreDocumento}
                        onChange={(e) => setNombreDocumento(e.target.value)}
                    />
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
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            accept=".pdf"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto"></div>
                {documents.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="text-left font-semibold px-4 py-2 border-b dark:border-slate-700">
                                        Nombre del Documento
                                    </th>
                                    <th className="text-left font-semibold px-4 py-2 border-b dark:border-slate-700">
                                        Observación
                                    </th>
                                    <th className="text-left font-semibold px-4 py-2 border-b dark:border-slate-700">
                                        Archivo
                                    </th>
                                    <th className="text-left font-semibold px-4 py-2 border-b dark:border-slate-700">
                                        Acción
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.map((document, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-600">
                                        <td className="px-4 py-2 border-b dark:border-slate-700">
                                            {document.nombre_documento}
                                        </td>
                                        <td className="px-4 py-2 border-b dark:border-slate-700">
                                            {document.observacion}
                                        </td>
                                        <td className="px-4 py-2 border-b dark:border-slate-700">
                                            {document.nombre_original}
                                        </td>
                                        <td className="px-4 py-2 border-b dark:border-slate-700">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(index)}
                                            >
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
    );
}