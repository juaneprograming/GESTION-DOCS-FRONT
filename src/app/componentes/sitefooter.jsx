import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";

export function SiteFooter() {
  return (
    <footer id="contact" className="bg-slate-950 text-slate-400 py-16 px-6 md:px-12 lg:px-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* About */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-semibold">Garono Document Manager</h3>
          <p className="text-sm leading-relaxed">
            Plataforma para **gestión documental** con enfoque en trazabilidad, seguridad y eficiencia.
            Módulo disponible: **PQRSD**.
          </p>
          <div className="flex gap-3">
            <Link href="#" className="bg-sky-700 rounded-full p-2 hover:bg-sky-600 transition-colors">
              <Facebook className="h-4 w-4 text-white" />
            </Link>
            <Link href="#" className="bg-sky-700 rounded-full p-2 hover:bg-sky-600 transition-colors">
              <Instagram className="h-4 w-4 text-white" />
            </Link>
            <Link href="#" className="bg-sky-700 rounded-full p-2 hover:bg-sky-600 transition-colors">
              <Twitter className="h-4 w-4 text-white" />
            </Link>
          </div>
        </div>

        {/* Servicios */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-semibold">Servicios</h3>
          <ul className="space-y-2 text-sm">
            <li><span className="text-slate-300">PQRSD (Disponible)</span></li>
            <li className="opacity-70">Gestión Documental (Próximamente)</li>
            <li className="opacity-70">Portal Ciudadano (Próximamente)</li>
            <li className="opacity-70">Automatización de Workflow (Próximamente)</li>
          </ul>
        </div>

        {/* Industrias */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-semibold">Industrias</h3>
          <ul className="space-y-2 text-sm">
            {["Sector Público", "Educación", "Salud", "Servicios"].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-semibold">Contacto</h3>
          <p className="text-sm">¿Tienes dudas? Escríbenos.</p>
          <p className="text-sky-400 text-lg font-semibold">gestiondocumental@gmail.com</p>
          <p className="text-sm">Cartagena de Indias, Colombia.</p>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-800 text-sm text-center">
        © {new Date().getFullYear()} Garono Document Manager.
      </div>
    </footer>
  );
}
