import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// REMOVE: export { default } from "next-auth/middleware"; 
// This was likely clashing with your custom logic below.

export async function middleware(request) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // 1. Redirect logged-in users away from the landing page to /chat
  if (token && url.pathname === "/") {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  // 2. Redirect unauthenticated users away from /chat to the landing page
  if (!token && url.pathname.startsWith("/chat")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// 3. IMPORTANT: Add a matcher to prevent the middleware from running on auth APIs and static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth internal routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
