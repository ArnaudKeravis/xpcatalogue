import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ER_SEGMENT_HEADER } from '@/lib/erNav';
import { isErSegmentHost } from '@/lib/erSegmentHost';

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
  const isErHost = isErSegmentHost(host);
  const isErPath = pathname.startsWith('/er');
  const isEr = isErHost || isErPath;

  const erRequestOpts = isEr
    ? (() => {
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set(ER_SEGMENT_HEADER, '1');
        return { request: { headers: requestHeaders } } as const;
      })()
    : undefined;

  if (isErHost) {
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
