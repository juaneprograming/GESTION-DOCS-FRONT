import Link from "next/link";
import { FileText, Users, Workflow, Lock } from "lucide-react";

const services = [
  {
    icon: Lock,
    title: "PQRSD",
    description: "Radicación, distribución, trazabilidad y respuesta a solicitudes.",
    url: "/login",
    active: true,
  },
  {
    icon: FileText,
    title: "Gestión Documental",
    description: "Archivo, versiones, metadatos y permisos.",
    url: "#",
    active: false,
  },
  {
    icon: Users,
    title: "Portal Ciudadano",
    description: "Interacción y consulta pública.",
    url: "https://portal-five-sepia.vercel.app/#inicio",
    active: true,
  },
  {
    icon: Workflow,
    title: "Automatización de Workflow",
    description: "Flujos, aprobaciones y alertas.",
    url: "#",
    active: false,
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-14 md:py-20 px-4 md:px-8">
      <div className="text-center mb-10 md:mb-14">
        <p className="text-sky-700 font-medium mb-2">Servicios</p>
        <h2 className="text-2xl md:text-4xl font-bold mb-4">Soluciones para gestión documental</h2>
        <p className="text-slate-600">
          Nuestro módulo disponible es <span className="font-semibold text-slate-900">PQRSD</span>. 
          Próximamente habilitaremos más capacidades del gestor documental.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {services.map((service, index) => (
          <div
            key={index}
            className={[
              "relative group rounded-xl border bg-white p-6 transition-all duration-300",
              service.active
                ? "hover:shadow-xl hover:border-sky-300"
                : "opacity-80",
            ].join(" ")}
          >
            <service.icon className={["mb-4 h-10 w-10",
              service.active ? "text-sky-700" : "text-slate-400"
            ].join(" ")} />
            <h3 className="text-lg font-semibold mb-1 text-slate-900">{service.title}</h3>
            <p className="text-slate-600 mb-4">{service.description}</p>

            {service.active ? (
              <Link href={service.url} className="inline-flex">
                <span className="text-sky-700 font-medium group-hover:underline">Ingresar</span>
              </Link>
            ) : (
              <span
                aria-disabled
                className="inline-flex items-center text-xs font-medium rounded-full bg-slate-100 text-slate-500 px-2 py-1"
              >
                Próximamente
              </span>
            )}

            {!service.active && (
              <div className="pointer-events-none absolute inset-0 rounded-xl bg-slate-50/40" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
