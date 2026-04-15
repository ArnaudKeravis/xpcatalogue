import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--surface)] px-6 text-center">
      <h1 className="text-2xl font-extrabold text-[var(--blue)]" style={{ fontFamily: 'var(--font-heading)' }}>
        Page not found
      </h1>
      <Link href="/" className="font-semibold text-[var(--blue-primary)] underline">
        Back to home
      </Link>
    </div>
  );
}
