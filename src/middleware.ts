import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE = 'sdx_auth';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images/') ||
    pathname === '/favicon.ico' ||
    pathname === '/icon.svg' ||
    pathname === '/apple-icon.png'
  ) {
    return NextResponse.next();
  }

  if (req.cookies.get(COOKIE)?.value === '1') {
    return NextResponse.next();
  }

  if (pathname === '/login' && req.method === 'POST') {
    return NextResponse.next();
  }

  if (pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
