'use client';

import Image from "next/image";
import Link from "next/link";


export default function Home() {

  // Si está autenticado, mostrar el dashboard
  return (
    <div className="min-h-screen">
     
      
      <main className="max-w-7xl mx-auto p-4">
          Hola Mundo
      <Link href="/login" className="w-full py-4 bg-primary/500 text-black font-bold">
        iniciar sesion
      </Link>
      </main>

      <footer className="mt-auto py-4 border-t">
        <div className="max-w-7xl mx-auto px-4 flex gap-6 flex-wrap items-center justify-center">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://nextjs.org/learn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/file.svg"
              alt="File icon"
              width={16}
              height={16}
            />
            Learn
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://vercel.com/templates"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/window.svg"
              alt="Window icon"
              width={16}
              height={16}
            />
            Examples
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            Go to nextjs.org →
          </a>
        </div>
      </footer>
    </div>
  );
}