<<<<<<< Updated upstream
'use client';

import Image from "next/image";
import Link from "next/link";
import { Toaster } from 'sonner';
=======
import { HeroCarousel } from "@/app/componentes/herocarousel"
import { ServicesSection } from "@/app/componentes/servicessection"
import { ArticlesSection } from "@/app/componentes/articlessection"
import { SiteHeader } from "@/app/componentes/siteheader"
import { SiteFooter } from "@/app/componentes/sitefooter"
>>>>>>> Stashed changes

export default function Home() {
  return (
<<<<<<< Updated upstream
    <div className="min-h-screen">
     
     <Toaster position="top-right" richColors />
      <main className="max-w-7xl mx-auto p-4">
          Hola Mundo
      <Link href="/login" className="w-full py-4 bg-primary/500 text-black font-bold">
        iniciar sesion
      </Link>
=======
    <main className="flex min-h-screen flex-col bg-gray-100">
      <main className="flex-1">
        <SiteHeader />
        <HeroCarousel />
        <ServicesSection />
        <ArticlesSection />
>>>>>>> Stashed changes
      </main>
      <SiteFooter/>
    </main>
  )
}

