import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

export async function middleware(request) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (token && url.pathname === "/") {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  if (!token && url.pathname.startsWith("/chat")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
