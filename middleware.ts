import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protege tudo em /admin exceto /admin/login e rotas de auth
  const isAdmin = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";
  const isAuthApi =
    pathname.startsWith("/api/admin/login") ||
    pathname.startsWith("/api/admin/logout");

  if (isAdmin && !isLoginPage && !isAuthApi) {
    const token = req.cookies.get("admin_auth")?.value;
    if (token !== "1") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};