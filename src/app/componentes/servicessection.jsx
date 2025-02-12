import Link from "next/link"
import { FileText, Users, Workflow, Lock } from "lucide-react"

const services = [
  {
    icon: FileText,
    title: "Gestión Documental",
    description: "Servicios integrales de almacenamiento y organización de documentos",
    url: "http://localhost:3000/login",
  },
  {
    icon: Users,
    title: "Portal Ciudadano",
    description: "Plataformas interactivas para mejorar la comunicación con los ciudadanos",
    url: "https://portal-five-sepia.vercel.app",
  },
  {
    icon: Workflow,
    title: "Automatización de Workflow",
    description: "Procesos automatizados para mejorar la eficiencia organizacional",
    url: "/services/workflow-automation",
  },
  {
    icon: Lock,
    title: "Consulta tu PQRSD",
    description: "Gestión segura y eficiente de peticiones, quejas, reclamos, sugerencias y denuncias",
    url: "/services/pqrsd",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="h-screen py-8 md:py-16 px-4 md:px-8">
      <div className="text-center mb-8 md:mb-12 px-4">
        <p className="text-blue-500 font-medium mb-2">Nuestros Servicios</p>
        <h2 className="text-2xl md:text-4xl font-bold mb-4">Soluciones Especializadas</h2>
        <p className="text-muted-foreground">
          Descubre nuestros servicios diseñados para optimizar procesos y mejorar la eficiencia en diversas áreas:
          <br className="hidden md:block" />
          Gestión Documental, Portal Ciudadano, Automatización de Workflow y PQRSD.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {services.map((service, index) => (
          <Link 
            href={service.url || "#"} 
            key={index}
            className="block group transition-all duration-300 ease-in-out bg-background border p-4 md:p-6 rounded-lg hover:bg-blue-500 hover:text-blue-500-foreground"
          >
            <service.icon className="h-8 w-8 md:h-10 md:w-10 mb-4 group-hover:text-white" />
            <h3 className="text-base md:text-lg font-semibold mb-2 group-hover:text-white">
              {service.title}
            </h3>
            <p className="text-sm group-hover:text-white/80">
              {service.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
