'use client';

import PptxGenJS from 'pptxgenjs';
import type { JourneyStep, Persona, AreaConfig } from '@/lib/data/types';
import {
  SODEXO,
  SODEXO_FONT,
  SODEXO_FOOTER,
  SODEXO_LOGO_PATH,
  fetchAsDataUrl,
  safeFilename,
} from './brand';

interface ExportJourneyOptions {
  persona: Persona;
  area?: AreaConfig;
  steps: JourneyStep[];
  imageUrl: string;
}

/**
 * Export the isometric journey map as a Sodexo-branded slide, with the
 * ordered moment list underneath it so the deck can stand on its own.
 *
 *   [ header ]
 *   ┌─────────────────────────────────────────────────────────────────┐
 *   │                                                                 │
 *   │            isometric journey image (fills ~70% of slide)        │
 *   │                                                                 │
 *   └─────────────────────────────────────────────────────────────────┘
 *   · morning rush · breakfast · deep work · lunch …   (wrapped line)
 *   [ footer ]
 */
export async function exportJourneyToPptx({
  persona,
  area,
  steps,
  imageUrl,
}: ExportJourneyOptions): Promise<void> {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.title = `${persona.fullName} — Journey`;
  pptx.author = 'Sodexo Digital & AI Innovation';
  pptx.company = 'Sodexo';
  pptx.subject = 'Experience Catalogue — Persona journey';

  const [logo, journey] = await Promise.all([
    fetchAsDataUrl(SODEXO_LOGO_PATH),
    fetchAsDataUrl(imageUrl),
  ]);

  const slide = pptx.addSlide();
  slide.background = { color: SODEXO.canvas };

  /* ── Header ──────────────────────────────────────────────────────── */
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.62,
    fill: { color: SODEXO.navy },
    line: { color: SODEXO.navy, width: 0 },
  });
  slide.addText('EXPERIENCE CATALOGUE', {
    x: 0.45,
    y: 0.08,
    w: 5,
    h: 0.22,
    fontFace: SODEXO_FONT.heading,
    fontSize: 9,
    color: 'FFFFFF',
    bold: true,
    charSpacing: 4,
  });
  slide.addText(
    `Journey · ${persona.fullName} · ${area?.label ?? persona.area.toUpperCase()}`,
    {
      x: 0.45,
      y: 0.3,
      w: 10,
      h: 0.26,
      fontFace: SODEXO_FONT.body,
      fontSize: 11,
      color: 'FFFFFF',
      bold: true,
    },
  );
  if (logo) {
    slide.addImage({ data: logo, x: 11.88, y: 0.12, w: 1.1, h: 0.38 });
  }
  slide.addShape('rect', {
    x: 0,
    y: 0.62,
    w: 13.333,
    h: 0.06,
    fill: { color: SODEXO.teal },
    line: { color: SODEXO.teal, width: 0 },
  });

  /* ── Title line ──────────────────────────────────────────────────── */
  slide.addText(`A day in the life of ${persona.fullName}`, {
    x: 0.45,
    y: 0.85,
    w: 12.5,
    h: 0.5,
    fontFace: SODEXO_FONT.heading,
    fontSize: 24,
    color: SODEXO.navy,
    bold: true,
  });

  /* ── Journey image ───────────────────────────────────────────────── */
  const imgX = 0.45;
  const imgY = 1.5;
  const imgW = 12.45;
  const imgH = 4.8;

  slide.addShape('roundRect', {
    x: imgX - 0.06,
    y: imgY - 0.06,
    w: imgW + 0.12,
    h: imgH + 0.12,
    rectRadius: 0.18,
    fill: { color: SODEXO.white },
    line: { color: SODEXO.hairline, width: 1 },
  });
  if (journey) {
    slide.addImage({
      data: journey,
      x: imgX,
      y: imgY,
      w: imgW,
      h: imgH,
      sizing: { type: 'contain', w: imgW, h: imgH },
    });
  } else {
    slide.addText('Journey image unavailable', {
      x: imgX,
      y: imgY,
      w: imgW,
      h: imgH,
      fontFace: SODEXO_FONT.body,
      fontSize: 14,
      color: SODEXO.textMuted,
      align: 'center',
      valign: 'middle',
    });
  }

  /* ── Moment strip under the image ────────────────────────────────── */
  const stepLine = steps
    .map((s, i) => `${String(i + 1).padStart(2, '0')} · ${s.label}`)
    .join('     ');
  slide.addText(stepLine, {
    x: 0.45,
    y: 6.45,
    w: 12.45,
    h: 0.6,
    fontFace: SODEXO_FONT.body,
    fontSize: 11,
    color: SODEXO.navy,
    bold: true,
    valign: 'top',
  });

  /* ── Footer ──────────────────────────────────────────────────────── */
  slide.addShape('rect', {
    x: 0,
    y: 7.2,
    w: 13.333,
    h: 0.3,
    fill: { color: SODEXO.navy },
    line: { color: SODEXO.navy, width: 0 },
  });
  slide.addText(SODEXO_FOOTER, {
    x: 0.45,
    y: 7.22,
    w: 12.4,
    h: 0.26,
    fontFace: SODEXO_FONT.body,
    fontSize: 9,
    color: 'FFFFFF',
    valign: 'middle',
  });

  await pptx.writeFile({
    fileName: `Sodexo-Journey-${safeFilename(persona.name)}.pptx`,
  });
}
