export default function Loading() {
  return (
    <div
      id="main-content"
      role="status"
      aria-live="polite"
      className="flex min-h-screen flex-col gap-6 bg-[var(--surface)] px-6 py-10"
    >
      <span className="sr-only">Loading the catalogue…</span>

      {/* Navbar skeleton */}
      <div
        className="flex h-14 items-center gap-3 rounded-xl bg-white/70 px-4"
        style={{ boxShadow: 'var(--shadow-nav)' }}
      >
        <div className="h-6 w-6 animate-pulse rounded-full bg-[var(--icon-bg)]" />
        <div className="h-4 w-40 animate-pulse rounded bg-[var(--icon-bg)]" />
        <div className="ml-auto h-4 w-20 animate-pulse rounded bg-[var(--icon-bg)]" />
      </div>

      {/* Hero skeleton */}
      <div
        className="grid gap-6 rounded-[var(--radius-xl)] bg-white p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
        style={{ boxShadow: 'var(--shadow-soft)' }}
      >
        <div className="aspect-[3/4] w-full animate-pulse rounded-[var(--radius-lg)] bg-[var(--icon-bg)]" />
        <div className="space-y-3">
          <div className="h-8 w-2/3 animate-pulse rounded bg-[var(--icon-bg)]" />
          <div className="h-4 w-full animate-pulse rounded bg-[var(--icon-bg)]" />
          <div className="h-4 w-11/12 animate-pulse rounded bg-[var(--icon-bg)]" />
          <div className="h-4 w-9/12 animate-pulse rounded bg-[var(--icon-bg)]" />
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="h-7 w-24 animate-pulse rounded-full bg-[var(--icon-bg)]" />
            <div className="h-7 w-20 animate-pulse rounded-full bg-[var(--icon-bg)]" />
            <div className="h-7 w-28 animate-pulse rounded-full bg-[var(--icon-bg)]" />
          </div>
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-2xl bg-white p-3"
            style={{ boxShadow: 'var(--shadow-sm)' }}
          >
            <div className="h-1.5 w-full animate-pulse rounded bg-[var(--icon-bg)]" />
            <div className="mt-1 h-6 w-6 animate-pulse rounded bg-[var(--icon-bg)]" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--icon-bg)]" />
            <div className="h-3 w-full animate-pulse rounded bg-[var(--icon-bg)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
