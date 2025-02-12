import { HeroCarousel } from "@/app/componentes/herocarousel"
import { ServicesSection } from "@/app/componentes/servicessection"
import { ArticlesSection } from "@/app/componentes/articlessection"
import { SiteHeader } from "@/app/componentes/siteheader"
import { SiteFooter } from "@/app/componentes/sitefooter"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-100 overflow-x-hidden">
      <SiteHeader />
      <div className="flex-1 w-full">
        <HeroCarousel />
        <ServicesSection />
        <ArticlesSection />
      </div>
      <SiteFooter />
    </main>
  )
}
