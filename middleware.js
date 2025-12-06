import { NextResponse } from 'next/server';

export default function middleware(request) {
    const token = request.cookies.get('token')?.value;
    console.log("DEBUG TOKEN VALUE:", token);
    const path = request.nextUrl.pathname;
    // console.log("Raw Token Value:", token);

    let user = null;

    if (token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error("Token is not a valid JWT string (missing parts)");
            }

            const base64Url = parts[1];

            let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

            const pad = base64.length % 4;
            if (pad) {
                base64 += '='.repeat(4 - pad);
            }
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            user = JSON.parse(jsonPayload);

            if (user.exp && Date.now() >= user.exp * 1000) {
                throw new Error("Token expired");
            }

            console.log(`[Middleware] User: ${user.email} | Role: ${user.role} | Target: ${path}`);

        } catch (e) {
            console.error("[Middleware] Token Decode Failed:", e.message);
            user = null;
        }
    }

    if ((path === '/login' || path === '/signup') && user) {
        if (user.role === 'admin') {
            return NextResponse.redirect(new URL('/admin/products', request.url));
        } else {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    if (path.startsWith('/admin')) {
        if (!user || user.role !== 'admin') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    if (path.startsWith('/checkout') && !user) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/login', '/signup', '/checkout'],
};