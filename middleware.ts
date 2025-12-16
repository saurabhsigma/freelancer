import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    const session = request.cookies.get("session")?.value;

    const pathname = request.nextUrl.pathname;

    // Public paths that don't require auth
    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");

    // Decrypt session
    let parsedSession = null;
    if (session) {
        try {
            parsedSession = await decrypt(session);
        } catch (e) {
            // Invalid session
        }
    }

    // 1. If user is logged in and tries to access login/signup, redirect to dashboard
    if (isAuthPage && parsedSession) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // 2. If user is NOT logged in and tries to access protected routes, redirect to login
    if (!parsedSession && !isAuthPage && pathname !== "/api/seed") {
        // Basic protection for all routes except auth pages and public assets (usually handled by Next.js matcher)
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes - though we might want to protect these too, for now keeping accessible or handled inside)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
