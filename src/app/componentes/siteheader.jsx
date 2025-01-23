"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { X, Menu } from "lucide-react"
import Image from "next/image"

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header  className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div id="inicio" className="flex h-16 items-center justify-between px-12">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-jIAFPeYABoqYc3V89FD1NrRL3UyJIm.png"
              alt="Equita Logo"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="#inicio" className="transition-colors hover:text-foreground/80">
            Inicio
          </Link>
          <Link href="#services" className="transition-colors hover:text-foreground/80">
            Servicios
          </Link>
          <Link href="#features" className="transition-colors hover:text-foreground/80">
            ¿Quienes Somos?
          </Link>
          <Link href="#contact" className="transition-colors hover:text-foreground/80">
            Contacto
          </Link>
        </nav>

        {/* Desktop Login Button */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login">
            <Button className="bg-blue-500 text-white">Iniciar sesión</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b md:hidden">
            <nav className="flex flex-col p-4">
              <Link
                href="#inicio"
                className="py-2 px-4 hover:bg-blue-500 hover:text-white rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
             
              <Link
                href="#services"
                className="py-2 px-4 hover:bg-blue-500 hover:text-white rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Servicio
              </Link>
              <Link
                href="/news"
                className="py-2 px-4 hover:bg-blue-500 hover:text-white rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                ¿Quienes somos?
              </Link>
              
              <Link
                href="/contact"
                className="py-2 px-4 hover:bg-blue-500 hover:text-white rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
              <Link href="/login" className="mt-2" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-blue-500 text-white">
                  Iniciar sesión
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
