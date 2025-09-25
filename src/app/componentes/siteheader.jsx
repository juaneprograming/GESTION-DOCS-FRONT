"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X, Menu } from "lucide-react";
import Image from "next/image";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div id="inicio" className="flex h-16 items-center justify-between px-4 md:px-8 lg:px-12">
        {/* Logo + marca */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/img/dcmanagersinletras.png"
            alt="Garono Logo"
            width={40}
            height={40}
            className="h-10 w-20 rounded-md"
          />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-semibold tracking-wide text-slate-900">GARONO</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Document Manager</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="#inicio" className="text-slate-600 hover:text-slate-900 transition-colors">Inicio</Link>
          <Link href="#services" className="text-slate-600 hover:text-slate-900 transition-colors">Servicios</Link>
          <Link href="#articles" className="text-slate-600 hover:text-slate-900 transition-colors">Artículos</Link>
          <Link href="#contact" className="text-slate-600 hover:text-slate-900 transition-colors">Contacto</Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white">Ingresar a PQRSD</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Navigation */}
      </div>
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white/95 backdrop-blur">
          <nav className="flex flex-col p-4">
            {[
              { href: "#inicio", label: "Inicio" },
              { href: "#services", label: "Servicios" },
              { href: "#articles", label: "Artículos" },
              { href: "#contact", label: "Contacto" },
            ].map((it) => (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setIsMenuOpen(false)}
                className="py-2 px-4 rounded-md text-slate-700 hover:bg-sky-600 hover:text-white transition-colors"
              >
                {it.label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setIsMenuOpen(false)} className="mt-2">
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">Ingresar a PQRSD</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
