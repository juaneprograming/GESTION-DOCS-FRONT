// middleware.js
import { NextResponse } from 'next/server';

// Rutas que requieren autenticación
const protectedRoutes = ['/dashboard'];
// Rutas públicas
const publicRoutes = ['/login'];

export function middleware(request) {
    // Obtener el token del localStorage o cookies
    const token = request.cookies.get('token');
    const { pathname } = request.nextUrl;

    // Si es una ruta protegida y no hay token, redirigir al login
    if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Si hay token y el usuario intenta acceder al login, redirigir al dashboard
    if (publicRoutes.includes(pathname) && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Continuar con la solicitud normal
    return NextResponse.next();
}

// Configurar en qué rutas se ejecutará el middleware
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};