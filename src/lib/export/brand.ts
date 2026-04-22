/**
 * Brand tokens for PowerPoint exports.
 *
 * We don't try to bit-match the web design — PPT has its own constraints
 * (no custom font embedding by default, no gradients on text, no CSS
 * variables). Instead we rebuild the language with pptxgenjs-native
 * primitives: flat Sodexo navy/teal, large uppercase eyebrows, clean
 * Arial/Calibri typography so the file opens cleanly on every OS.
 */

export const SODEXO = {
  navy: '293896',
  navyDeep: '1a2276',
  blue: '1a69ff',
  bluePrimary: '1a3af0',
  teal: '00A096',
  tealDark: '00776F',
  amber: 'FFD05E',
  textDark: '1A2276',
  textBody: '2A2F4C',
  textMuted: '6B7390',
  white: 'FFFFFF',
  canvas: 'F4F6FC',
  hairline: 'E3E7F3',
  statusScaled: '27AE60',
  statusScaling: 'E67E22',
  statusPilot: '3498DB',
  statusStudy: '95A5A6',
} as const;

export const SODEXO_FONT = {
  heading: 'Calibri',
  body: 'Calibri',
} as const;

export const SODEXO_FOOTER = 'Sodexo Experience Catalogue · Sodexo Digital & AI Innovation';

/** Sodexo logotype, embedded so the PPT stays intact offline. */
export const SODEXO_LOGO_PATH = '/images/catalogue/assets/brand/sodexo-logotype-2021.jpg';

export function statusColor(status: string): string {
  if (status === 'Scaled') return SODEXO.statusScaled;
  if (status === 'Scaling') return SODEXO.statusScaling;
  if (status === 'Pilot') return SODEXO.statusPilot;
  return SODEXO.statusStudy;
}

/**
 * Fetch a PNG/JPEG/SVG asset from the same origin and convert to a
 * pptxgenjs-compatible data URL. Keeps imagery embedded in the file.
 */
export async function fetchAsDataUrl(src: string): Promise<string | undefined> {
  try {
    const res = await fetch(src);
    if (!res.ok) return undefined;
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  } catch {
    return undefined;
  }
}

/** Filesystem-safe slug used in downloaded filenames. */
export function safeFilename(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}
