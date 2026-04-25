import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];
const protectedRoutes = ["/dashboard", "/my-banks", "/transaction-history", "/payment-transfer", "/settings", "/profile"];

export function middleware(request: NextRequest) {
  // Use a lightweight client-side cookie set by the frontend after login/verify.
  // We can't read the httpOnly backend cookie here since it's on a different domain (Render vs Vercel).
  const isLoggedIn = request.cookies.get("isLoggedIn")?.value === "true";
  const { pathname } = request.nextUrl;

  // Already logged in → don't let them revisit auth pages
  if (publicRoutes.includes(pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Not logged in → block protected pages
  if (protectedRoutes.some((r) => pathname.startsWith(r)) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", "/my-banks/:path*", "/transaction-history/:path*",
    "/payment-transfer/:path*", "/settings/:path*", "/profile/:path*",
    "/login", "/register", "/forgot-password", "/reset-password", "/verify-email",
  ],
};