import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE = 'sdx_auth';

export async function POST(req: NextRequest) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const expected = process.env.PASSWORD_HASH ?? 'Sodexo2025!';
  if (body.password === expected) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, '1', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8,
    });
    return res;
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
