import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ConvenioForm = ({ data, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Número del Convenio */}
      <div className="space-y-2">
        <Label>Número del convenio *</Label>
        <Input
          value={data.numero_convenio}
          onChange={(e) => onChange('numero_convenio', e.target.value)}
          required
        />
      </div>

      {/* Tipo de Convenio */}
      <div className="space-y-2">
        <Label>Tipo de convenio *</Label>
        <Select
          value={data.tipo_convenio}
          onValueChange={(value) => onChange('tipo_convenio', value)}
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

      {/* Entidad Pública */}
      <div className="space-y-2">
        <Label>Entidad pública</Label>
        <Input
          value={data.entidad_publica}
          onChange={(e) => onChange('entidad_publica', e.target.value)}
        />
      </div>

      {/* Entidad Privada */}
      <div className="space-y-2">
        <Label>Entidad privada</Label>
        <Input
          value={data.entidad_privada}
          onChange={(e) => onChange('entidad_privada', e.target.value)}
        />
      </div>

      {/* Fecha de Firma */}
      <div className="space-y-2">
        <Label>Fecha de firma *</Label>
        <Input
          type="date"
          value={data.fecha_firma}
          onChange={(e) => onChange('fecha_firma', e.target.value)}
          required
        />
      </div>

      {/* Fecha de Inicio */}
      <div className="space-y-2">
        <Label>Fecha de inicio *</Label>
        <Input
          type="date"
          value={data.fecha_inicio}
          onChange={(e) => onChange('fecha_inicio', e.target.value)}
          required
        />
      </div>

      {/* Fecha de Fin */}
      <div className="space-y-2">
        <Label>Fecha de fin *</Label>
        <Input
          type="date"
          value={data.fecha_fin}
          onChange={(e) => onChange('fecha_fin', e.target.value)}
          required
        />
      </div>

      {/* Objeto */}
      <div className="space-y-2">
        <Label>Objeto *</Label>
        <Input
          value={data.objeto}
          onChange={(e) => onChange('objeto', e.target.value)}
          required
        />
      </div>

      {/* Valor Total */}
      <div className="space-y-2">
        <Label>Valor total *</Label>
        <Input
          type="number"
          value={data.valor_total}
          onChange={(e) => onChange('valor_total', e.target.value)}
          required
        />
      </div>

      {/* Aporte Entidad Pública */}
      <div className="space-y-2">
        <Label>Aporte entidad pública</Label>
        <Input
          type="number"
          value={data.aporte_entidad_publica}
          onChange={(e) => onChange('aporte_entidad_publica', e.target.value)}
        />
      </div>

      {/* Aporte Entidad Privada */}
      <div className="space-y-2">
        <Label>Aporte entidad privada</Label>
        <Input
          type="number"
          value={data.aporte_entidad_privada}
          onChange={(e) => onChange('aporte_entidad_privada', e.target.value)}
        />
      </div>

      {/* Estado */}
      <div className="space-y-2">
        <Label>Estado *</Label>
        <Select
          value={data.estado}
          onValueChange={(value) => onChange('estado', value)}
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
    </div>
  );
};

export default ConvenioForm;