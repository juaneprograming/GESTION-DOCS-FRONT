import { NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard', '/administracion/users'];
const publicRoutes = ['/login'];

export function middleware(request) {
  const token = request.cookies.get('token')?.value; // Obtener el token de las cookies
  const { pathname } = request.nextUrl;

  // Redirigir a /login si la ruta es protegida y no hay token
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirigir a /dashboard si está autenticado y quiere acceder a /login
  if (publicRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next(); // Permitir el acceso si no hay restricciones
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
