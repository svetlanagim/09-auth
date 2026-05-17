import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "./lib/api/serverApi";

const PRIVATE_ROUTES = ["/profile", "/notes"];
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

const isPrivateRoute = (pathname: string) =>
  PRIVATE_ROUTES.some((route) => pathname.startsWith(route));

const isAuthRoute = (pathname: string) =>
  AUTH_ROUTES.some((route) => pathname.startsWith(route));

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (isPrivateRoute(pathname)) {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (!accessToken && refreshToken) {
      try {
        const response = await checkSession();
        const newAccessToken = response.headers["set-cookie"];
        const nextResponse = NextResponse.next();
        if (newAccessToken) {
          nextResponse.headers.set("set-cookie", newAccessToken.toString());
        }
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
