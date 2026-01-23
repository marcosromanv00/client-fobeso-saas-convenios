/*
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const cookies = request.cookies.getAll(); // Muestra todas las cookies
  console.log(cookies);  // Debugging
  const isLoggedIn = Boolean(request.cookies.get('authToken')); // Verifica la existencia del token
  console.log('Is Logged In:', isLoggedIn); // Debugging

  // Permitir el acceso a la página principal y otras rutas públicas
  if (request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/auth/signin')) {
    return NextResponse.next();
  }

  // Si el usuario no está autenticado y está intentando acceder a una ruta privada (por ejemplo, /admin)
  {/* 

    if (!isLoggedIn && request.nextUrl.pathname.startsWith('/admin')) {
    // Redirigir a la página de login
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

    ***}

  // Permitir la solicitud si está autenticado
  return NextResponse.next();
}

// Configurar las rutas que serán protegidas por el middleware
export const config = {
  //matcher: ['/admin/'], // Aplica a todas las rutas que comienzan con "/admin"
};

*/