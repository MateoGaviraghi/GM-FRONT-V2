import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger todas las rutas /admin excepto /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    // Verificar si hay token en las cookies
    const token = request.cookies.get("token")?.value;

    // Si no hay token, redirigir a login
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
