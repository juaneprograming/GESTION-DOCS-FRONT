import { Search, ChevronDown } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    name: "Administracion",
    icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z",
    subItems: [
      {
        name: "Organizacional",
        subItems: [
          { name: "Organizacion" },
          { name: "Organigrama Organizacional" },
          { name: "Cargos" },
          { name: "Empleados" },
        ],
      },
      {
        name: "Configuracion",
      },
      {
        name: "Seguridad",
        subItems: [
          { name: "Usuarios" },
          { name: "Perfiles" },
          { name: "Cambiar Contraseña" },
          { name: "Gestion de Menu" },
          { name: "Gestion de Firmas" },
        ],
      },
    ],
  },
  {
    name: "PQRSD",
    icon: "M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18",
    subItems: [
      { name: "Consulta de PQRSD" },
      { name: "Nueva PQRSD" },
      { name: "Gestion de PQRSD" },
      { name: "Gestion Archivo" },
      { name: "Informe de PQRSD" },
      { name: "Analisis Individual" },
      { name: "Administrar PQRSD" },
      {
        name: "Parametricas",
        subItems: [
          { name: "Motivos de Solicitud" },
        ],
      },
    ],
  },
];

const MenuItem = ({ item, level = 0 }) => {
  return (
    <Collapsible>
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
          level === 0 ? "hover:bg-primary/10" : "hover:bg-primary/5",
          level > 0 && "pl-[calc(0.75rem*1.5)]"
        )}
      >
        {level === 0 && (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d={item.icon} />
          </svg>
        )}
        <span className="flex-1 text-left">{item.name}</span>
        {item.subItems && <ChevronDown className="w-4 h-4" />}
      </CollapsibleTrigger>
      {item.subItems && (
        <CollapsibleContent className="pl-4">
          {item.subItems.map((subItem) => (
            <MenuItem key={subItem.name} item={subItem} level={level + 1} />
          ))}
        </CollapsibleContent>
      )}
    </Collapsible>
  );
};

export default function Dashboard() {
  const stats = [
    { title: "Total Images", value: "36,476 GB", percent: 32, change: "+32.40%", trend: "up" },
    { title: "Total Videos", value: "53,406 GB", percent: 48, change: "-18.45%", trend: "down" },
    { title: "Total Documents", value: "90,875 GB", percent: 89, change: "+20.34%", trend: "up" },
    { title: "Total Musics", value: "63,076 GB", percent: 78, change: "+14.45%", trend: "up" },
  ];

  return (
    <div className="flex h-screen bg-background font-poppins">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card p-6 space-y-6 overflow-y-auto">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <div className="w-8 h-8">
            <svg viewBox="0 0 24 24" className="fill-current">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          DOCUMENT
        </div>

        <nav className="space-y-2">
          <div className="text-sm text-muted-foreground uppercase tracking-wide">Overview</div>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <MenuItem key={item.name} item={item} />
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Search Bar */}
        <div className="relative w-full max-w-2xl mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search your page..." className="pl-10 pr-16" />
          <Badge variant="secondary" className="absolute right-3 top-1/2 transform -translate-y-1/2">
            ⌘K
          </Badge>
        </div>

        {/* Storage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">{stat.title}</div>
                  <div className="text-2xl font-bold mt-2">{stat.value}</div>
                  <div
                    className={`text-sm mt-2 ${
                      stat.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {stat.change} last month
                  </div>
                </div>
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-primary/10"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${stat.percent * 1.76} 176`}
                      className="text-primary"
                    />
                  </svg>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
