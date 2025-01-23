"use client"

import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

const slides = [
  {
    title: "Optimización de la Gestión Documental",
    subtitle: "Eficiencia y Seguridad en la Era Digital",
    description:
      "Descubre cómo las organizaciones están transformando sus procesos de gestión documental para mejorar la eficiencia y la seguridad.",
    image: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1200&h=600&fit=crop",
  },
  {
    title: "Mejorando la Experiencia del Usuario",
    subtitle: "Portales Ciudadanos Interactivos",
    description:
      "Explora las mejores prácticas para diseñar portales ciudadanos que faciliten el acceso a servicios y mejoren la interacción.",
    image: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1200&h=600&fit=crop",
  },
  {
    title: "Automatización de PQRSD",
    subtitle: "Un Enfoque Moderno",
    description:
      "La automatización de procesos de PQRSD está revolucionando la forma en que las organizaciones manejan las solicitudes de los ciudadanos.",
    image: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1200&h=600&fit=crop",
  },
]

export function HeroCarousel() {
  return (
    <div className="overflow-x-hidden">
      <Carousel
        className="w-screen max-w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="h-full">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="pl-0 h-full">
              <div className="relative w-full h-full">
                <div 
                  className="absolute inset-0 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="absolute inset-0 bg-black/60" />
                </div>
                <div className="relative h-screen flex flex-col justify-center text-white px-4 md:px-16 lg:px-36">
                  <p className="text-sm md:text-lg mb-2 md:mb-4">{slide.subtitle}</p>
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 max-w-2xl">{slide.title}</h1>
                  <p className="text-xs md:text-base lg:text-xl mb-4 md:mb-8 max-w-2xl">{slide.description}</p>
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
                    <Button 
                      size="lg" 
                      
                      className="w-full sm:flex-1 bg-blue-500"
                    >
                      Más Sobre Nosotros
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:flex-1 text-black border-white hover:bg-black hover:text-white hover:border-black"
                    >
                      Nuestros Servicios
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10" />
          <CarouselNext className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10" />
        </div>
      </Carousel>
    </div>
  )
}
