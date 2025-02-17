'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

export function UploadDocumentModal({ expedienteId, onUploadSuccess }) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const entidad = searchParams.get('entidad')
  const [file, setFile] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [open, setOpen] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !documentName) {
      toast.error('Debes completar el nombre del documento y seleccionar un archivo');
      return;
    }

    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('nombre_documento', documentName);
    formData.append('expediente_id', expedienteId);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/expedientes/${id}/${entidad}/documentos`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      toast.success('Documento subido con éxito');
      setFile(null);
      setDocumentName('');
      setOpen(false);
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      toast.error('Error al subir el documento');
      console.error(error);
    }
  };
 
  useEffect(() => {
    if (id && entidad) {
      loadDocuments();
    }
  }, [id, entidad]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="primary" className="gap-2" onClick={() => setOpen(true)}>
        <Upload className="h-4 w-4" />
        Subir Documento
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subir nuevo documento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Nombre del documento"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
          />
          <Input type="file" name="archivo" onChange={handleFileChange} />
          <Button onClick={handleUpload} className="w-full">
            Cargar Documento
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UploadDocumentModal;
