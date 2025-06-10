import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Solo proteger rutas bajo /admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const hasSession = request.cookies.get("authUser");
    if (!hasSession) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
