import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export function middleware(request: NextRequest) {
  // Solo proteger rutas bajo /admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const hasSession = request.cookies.get("authUser");
    if (!hasSession) {
      return NextResponse.redirect(new URL("/auth/sign-in", BASE_URL));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
