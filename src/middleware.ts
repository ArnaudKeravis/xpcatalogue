import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ER_SEGMENT_HEADER } from '@/lib/erNav';
import { isErSegmentHost } from '@/lib/erSegmentHost';

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

  const host = req.headers.get('host');
  const isEr = isErSegmentHost(host);
  const erRequestOpts = isEr
    ? (() => {
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set(ER_SEGMENT_HEADER, '1');
        return { request: { headers: requestHeaders } } as const;
      })()
    : undefined;

  const authed = req.cookies.get(COOKIE)?.value === '1';

  if (!authed) {
    if (pathname === '/login' && req.method === 'POST') {
      return NextResponse.next();
    }
    if (pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }

  if (isEr) {
    if (pathname === '/') {
      const url = req.nextUrl.clone();
      url.pathname = '/er/segment-home';
      return NextResponse.rewrite(url, erRequestOpts);
    }
    const flat: Record<string, string> = {
      '/personae': '/er/personae',
      '/needs': '/er/needs',
      '/ifm': '/er/ifm',
      '/journey': '/er/journey',
      '/moments': '/er/moments',
      '/operator': '/er/operator',
    };
    const target = flat[pathname];
    if (target) {
      const url = req.nextUrl.clone();
      url.pathname = target;
      return NextResponse.rewrite(url, erRequestOpts);
    }
    if (pathname.startsWith('/personae/')) {
      const url = req.nextUrl.clone();
      url.pathname = `/er${pathname}`;
      return NextResponse.rewrite(url, erRequestOpts);
    }
  }

  return erRequestOpts ? NextResponse.next(erRequestOpts) : NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
