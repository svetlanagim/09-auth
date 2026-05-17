import { NextRequest, NextResponse } from "next/server";

const PRIVATE_ROUTES = ["/profile", "/notes"];
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

const isPrivateRoute = (pathname: string) =>
  PRIVATE_ROUTES.some((route) => pathname.startsWith(route));

const isAuthRoute = (pathname: string) =>
  AUTH_ROUTES.some((route) => pathname.startsWith(route));

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  if (isPrivateRoute(pathname) && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute(pathname) && token) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.png).*)"],
};
