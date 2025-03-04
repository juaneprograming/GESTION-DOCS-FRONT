import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HojaVidaForm = ({ data, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Nombres */}
      <div className="space-y-2">
        <Label>Nombres *</Label>
        <Input
          value={data.nombres}
          onChange={(e) => onChange('nombres', e.target.value)}
          required
        />
      </div>

      {/* Apellidos */}
      <div className="space-y-2">
        <Label>Apellidos *</Label>
        <Input
          value={data.apellidos}
          onChange={(e) => onChange('apellidos', e.target.value)}
          required
        />
      </div>

      {/* Tipo de Documento */}
      <div className="space-y-2">
        <Label>Tipo de Documento *</Label>
        <Select
          value={data.tipo_identificacion}
          onValueChange={(value) => onChange('tipo_identificacion', value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CC">CC</SelectItem>
            <SelectItem value="CE">CE</SelectItem>
            <SelectItem value="PAS">Pasaporte</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Número de Documento */}
      <div className="space-y-2">
        <Label>Número de Documento *</Label>
        <Input
          value={data.numero_documento}
          onChange={(e) => onChange('numero_documento', e.target.value)}
          required
        />
      </div>

      {/* Fecha de Nacimiento */}
      <div className="space-y-2">
        <Label>Fecha de Nacimiento *</Label>
        <Input
          type="date"
          value={data.fecha_nacimiento}
          onChange={(e) => onChange('fecha_nacimiento', e.target.value)}
          required
        />
      </div>

      {/* Lugar de Nacimiento */}
      <div className="space-y-2">
        <Label>Lugar de Nacimiento</Label>
        <Input
          value={data.lugar_nacimiento}
          onChange={(e) => onChange('lugar_nacimiento', e.target.value)}
        />
      </div>

      {/* Dirección */}
      <div className="space-y-2">
        <Label>Dirección</Label>
        <Input
          value={data.direccion}
          onChange={(e) => onChange('direccion', e.target.value)}
        />
      </div>

      {/* Teléfono */}
      <div className="space-y-2">
        <Label>Teléfono</Label>
        <Input
          value={data.telefono}
          onChange={(e) => onChange('telefono', e.target.value)}
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          value={data.email}
          onChange={(e) => onChange('email', e.target.value)}
        />
      </div>

      {/* Nivel Educativo */}
      <div className="space-y-2">
        <Label>Nivel Educativo</Label>
        <Input
          value={data.nivel_educativo}
          onChange={(e) => onChange('nivel_educativo', e.target.value)}
        />
      </div>

      {/* Título Obtenido */}
      <div className="space-y-2">
        <Label>Título Obtenido</Label>
        <Input
          value={data.titulo_obtenido}
          onChange={(e) => onChange('titulo_obtenido', e.target.value)}
        />
      </div>

      {/* Institución Educativa */}
      <div className="space-y-2">
        <Label>Institución Educativa</Label>
        <Input
          value={data.institucion_educativa}
          onChange={(e) => onChange('institucion_educativa', e.target.value)}
        />
      </div>

      {/* Experiencia Laboral */}
      <div className="space-y-2">
        <Label>Experiencia Laboral</Label>
        <Input
          value={data.experiencia_laboral}
          onChange={(e) => onChange('experiencia_laboral', e.target.value)}
        />
      </div>

      {/* Posición */}
      <div className="space-y-2">
        <Label>Posición</Label>
        <Input
          value={data.posicion}
          onChange={(e) => onChange('posicion', e.target.value)}
        />
      </div>

      {/* Fecha de Ingreso */}
      <div className="space-y-2">
        <Label>Fecha de Ingreso</Label>
        <Input
          type="date"
          value={data.fecha_ingreso}
          onChange={(e) => onChange('fecha_ingreso', e.target.value)}
        />
      </div>
    </div>
  );
};

export default HojaVidaForm;