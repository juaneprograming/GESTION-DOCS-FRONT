import { HeroCarousel } from "@/app/componentes/herocarousel"
import { ServicesSection } from "@/app/componentes/servicessection"
import { ArticlesSection } from "@/app/componentes/articlessection"
import { SiteHeader } from "@/app/componentes/siteheader"
import { SiteFooter } from "@/app/componentes/sitefooter"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-100">
      <main className="flex-1">
        <SiteHeader />
        <HeroCarousel />
        <ServicesSection />
        <ArticlesSection />
      </main>
      <SiteFooter/>
    </main>
  )
}

