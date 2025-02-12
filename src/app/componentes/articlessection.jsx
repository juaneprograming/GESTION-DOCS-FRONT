import Image from "next/image"
import Link from "next/link"

const articles = [
  {
    categories: ["Gestión Documental", "PQRSD"],
    title: "Optimización de la Gestión Documental en la Era Digital",
    date: "Oct 10, 2023",
    description:
      "Explora cómo las organizaciones están transformando sus procesos de gestión documental para mejorar la eficiencia y la seguridad...",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-G7GOuqLMWgMCq76ga5fqFAv3XQXa97.png",
  },
  {
    categories: ["Portal Ciudadano", "Workflow"],
    title: "Mejorando la Experiencia del Usuario en Portales Ciudadanos",
    date: "Oct 12, 2023",
    description:
      "Descubre las mejores prácticas para diseñar portales ciudadanos que faciliten el acceso a servicios y mejoren la interacción...",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-G7GOuqLMWgMCq76ga5fqFAv3XQXa97.png",
  },
  {
    categories: ["Workflow", "PQRSD"],
    title: "Automatización de PQRSD: Un Enfoque Moderno",
    date: "Oct 15, 2023",
    description:
      "La automatización de procesos de PQRSD está revolucionando la forma en que las organizaciones manejan las solicitudes de los ciudadanos...",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-G7GOuqLMWgMCq76ga5fqFAv3XQXa97.png",
  },
];

export function ArticlesSection() {
  return (
    <section className="py-8 md:py-16">
      <div className="text-center mb-8 md:mb-12 px-4">
        <p className="text-blue-500 font-medium mb-2">Insight And Trends</p>
        <h2 className="text-2xl md:text-4xl font-bold mb-4">Recent Articles</h2>
        <p className="text-muted-foreground">
          Follow our latest news and thoughts which focuses exclusively on insight,
          <br className="hidden md:block" />
          industry trends, top news headlines.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-16">
        {articles.map((article, index) => (
          <article key={index} className="group">
            <a href="#" className="block">
              <div className="relative h-48 md:h-64 mb-4 overflow-hidden rounded-lg">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="space-y-2 md:space-y-3">
                <div className="flex gap-2">
                  {article.categories.map((category, idx) => (
                    <span key={idx} className="text-blue-500 text-sm">
                      {category}
                      {idx < article.categories.length - 1 && ", "}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg md:text-xl font-bold line-clamp-2 group-hover:text-blue-500 transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground">{article.date}</p>
                <p className="text-muted-foreground line-clamp-3 text-sm md:text-base">{article.description}</p>
                <p className="text-sm font-medium text-blue-500">Read More</p>
              </div>
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
