import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    const session = request.cookies.get("session")?.value;

    const pathname = request.nextUrl.pathname;

    // Public paths
    const isPublicPath =
        pathname === "/" ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/signup") ||
        pathname.startsWith("/profile/") || // Public profiles
        pathname.startsWith("/api/uploads/signed"); // Public upload endpoint (auth handled inside)

    // Decrypt session
    let parsedSession = null;
    if (session) {
        try {
            parsedSession = await decrypt(session);
        } catch (e) {
            // Invalid session
        }
    }

    // 1. If user is logged in and tries to access login/signup, redirect to dashboard or home
    if ((pathname.startsWith("/login") || pathname.startsWith("/signup")) && parsedSession) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // 2. If user is NOT logged in and tries to access protected routes, redirect to login
    if (!parsedSession && !isPublicPath && pathname !== "/api/seed") {
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
