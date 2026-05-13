/**
 * Hostnames that should serve the Energy & Resources segment (Option A).
 * Set in Vercel / Azure: `ER_APP_HOSTNAMES=er.yourdomain.com,er-preview.vercel.app`
 * (comma-separated, no protocol). When empty, only `/er/*` paths work (no subdomain).
 */
export function parseErAppHostnames(): string[] {
  const raw = process.env.ER_APP_HOSTNAMES ?? '';
  return raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isErSegmentHost(hostHeader: string | null): boolean {
  if (!hostHeader) return false;
  const host = hostHeader.split(':')[0].toLowerCase();
  const list = parseErAppHostnames();
  if (list.length === 0) return false;
  return list.includes(host);
}
