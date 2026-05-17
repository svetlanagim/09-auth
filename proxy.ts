import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

const PRIVATE_ROUTES = ["/profile", "/notes"];
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

const isPrivateRoute = (pathname: string) =>
  PRIVATE_ROUTES.some((route) => pathname.startsWith(route));

const isAuthRoute = (pathname: string) =>
  AUTH_ROUTES.some((route) => pathname.startsWith(route));

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (isPrivateRoute(pathname)) {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (!accessToken && refreshToken) {
      try {
        const response = await checkSession();
        const setCookieHeader = response.headers["set-cookie"];

        if (!setCookieHeader) {
          return NextResponse.redirect(new URL("/sign-in", request.url));
        }

        const nextResponse = NextResponse.next();
        const cookieList = Array.isArray(setCookieHeader)
          ? setCookieHeader
          : [setCookieHeader];

        cookieList.forEach((cookie) => {
          nextResponse.headers.append("Set-Cookie", cookie);
        });

        return nextResponse;
      } catch {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }
  }

  if (isAuthRoute(pathname) && (accessToken || refreshToken)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
