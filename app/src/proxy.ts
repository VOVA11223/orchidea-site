import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hashAdminPassword, ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

export const config = {
  matcher: ["/admin/:path*"],
};

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return new NextResponse("ADMIN_PASSWORD не задан на сервере (.env.local)", { status: 500 });
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const expected = await hashAdminPassword(adminPassword);

  if (session !== expected) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
