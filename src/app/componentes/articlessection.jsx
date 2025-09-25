import Image from "next/image";
import Link from "next/link";

const articles = [
  {
    categories: ["Gestión Documental", "PQRSD"],
    title: "Buenas prácticas para clasificar y versionar documentos",
    date: "Ago 21, 2025",
    description: "Lineamientos para metadatos, tablas de retención y control de versiones.",
    image: "/img/dcmanager-logo.png",
  },
  {
    categories: ["PQRSD"],
    title: "Ciclo de vida de una PQRSD: de la radicación a la respuesta",
    date: "Ago 11, 2025",
    description: "Roles, tiempos de atención, evidencias y notificaciones.",
    image: "/img/dcmanager-logo.png",
  },
  {
    categories: ["Gestión Documental"],
    title: "Trazabilidad y auditoría en gestores documentales",
    date: "Jul 30, 2025",
    description: "Bitácoras, firmas, sellos de tiempo y cumplimiento.",
    image: "/img/dcmanager-logo.png",
  },
];

export function ArticlesSection() {
  return (
    <section id="articles" className="py-14 md:py-20 bg-white">
      <div className="text-center mb-10 md:mb-14 px-4">
        <p className="text-sky-700 font-medium mb-2">Artículos & Tendencias</p>
        <h2 className="text-2xl md:text-4xl font-bold mb-4">Gestión Documental & PQRSD</h2>
        <p className="text-slate-600">
          Novedades, guías y mejores prácticas para fortalecer tus procesos y cumplir normativas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-16">
        {articles.map((article, index) => (
          <article key={index} className="group">
            <Link href="#" className="block">
              <div className="relative h-56 md:h-64 mb-4 overflow-hidden rounded-xl">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
              </div>
              <div className="space-y-2 md:space-y-3">
                <div className="flex flex-wrap gap-2">
                  {article.categories.map((category, idx) => (
                    <span key={idx} className="text-sky-700 text-xs font-medium">
                      {category}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg md:text-xl font-bold line-clamp-2 group-hover:text-sky-700 transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-slate-500">{article.date}</p>
                <p className="text-slate-600 line-clamp-3 text-sm md:text-base">{article.description}</p>
                <p className="text-sm font-medium text-sky-700">Leer más</p>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
