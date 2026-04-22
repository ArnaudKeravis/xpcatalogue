'use client';

import PptxGenJS from 'pptxgenjs';
import type { Module, Solution } from '@/lib/data/types';
import {
  SODEXO,
  SODEXO_FONT,
  SODEXO_FOOTER,
  SODEXO_LOGO_PATH,
  fetchAsDataUrl,
  safeFilename,
  statusColor,
} from './brand';

/**
 * Render a single solution as a Sodexo-branded one-pager (16:9) and trigger
 * a download. Slide layout:
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │ navy header · eyebrow   ·   module name    /    Sodexo logo         │
 * │                                                                      │
 * │  {solution name — huge}                                             │
 * │  {hashtags / chips}                                                 │
 * │                                                                      │
 * │  CONTEXT          │  KPI grid                                        │
 * │  DESCRIPTION      │  BENEFITS (Client / Consumer / Sodexo)           │
 * │                   │  CONTACT + STATUS + TYPE                         │
 * │                                                                      │
 * │  footer · curated by Sodexo Digital & AI Innovation                 │
 * └──────────────────────────────────────────────────────────────────────┘
 */
export async function exportSolutionToPptx(
  solution: Solution,
  moduleInfo?: Module,
): Promise<void> {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.title = `${solution.name} — ${solution.module}`;
  pptx.author = 'Sodexo Digital & AI Innovation';
  pptx.company = 'Sodexo';
  pptx.subject = 'Experience Catalogue — Solution one-pager';

  const logo = await fetchAsDataUrl(SODEXO_LOGO_PATH);

  const slide = pptx.addSlide();
  slide.background = { color: SODEXO.canvas };

  /* ── Header strip ───────────────────────────────────────────────── */
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
  slide.addText(`Module · ${solution.module}`, {
    x: 0.45,
    y: 0.3,
    w: 8,
    h: 0.26,
    fontFace: SODEXO_FONT.body,
    fontSize: 11,
    color: 'FFFFFF',
    bold: true,
  });
  if (logo) {
    slide.addImage({ data: logo, x: 11.88, y: 0.12, w: 1.1, h: 0.38 });
  } else {
    slide.addText('SODEXO', {
      x: 11.5,
      y: 0.12,
      w: 1.5,
      h: 0.38,
      fontFace: SODEXO_FONT.heading,
      fontSize: 16,
      color: 'FFFFFF',
      bold: true,
      align: 'right',
    });
  }

  /* ── Accent bar under header (module gradient → flat navy bar) ─── */
  slide.addShape('rect', {
    x: 0,
    y: 0.62,
    w: 13.333,
    h: 0.06,
    fill: { color: SODEXO.teal },
    line: { color: SODEXO.teal, width: 0 },
  });

  /* ── Title + type / status chips ────────────────────────────────── */
  slide.addText(solution.name, {
    x: 0.45,
    y: 0.85,
    w: 9,
    h: 0.9,
    fontFace: SODEXO_FONT.heading,
    fontSize: 40,
    color: SODEXO.navy,
    bold: true,
  });

  // type + status chips
  const chipY = 1.82;
  slide.addShape('roundRect', {
    x: 0.45,
    y: chipY,
    w: 1.2,
    h: 0.34,
    rectRadius: 0.17,
    fill: { type: 'solid', color: SODEXO.white },
    line: { color: SODEXO.navy, width: 1 },
  });
  slide.addText(solution.type, {
    x: 0.45,
    y: chipY,
    w: 1.2,
    h: 0.34,
    fontFace: SODEXO_FONT.body,
    fontSize: 10,
    color: SODEXO.teal,
    bold: true,
    align: 'center',
    valign: 'middle',
  });
  slide.addShape('roundRect', {
    x: 1.75,
    y: chipY,
    w: 1.2,
    h: 0.34,
    rectRadius: 0.17,
    fill: { type: 'solid', color: SODEXO.white },
    line: { color: statusColor(solution.status), width: 1 },
  });
  slide.addText(solution.status, {
    x: 1.75,
    y: chipY,
    w: 1.2,
    h: 0.34,
    fontFace: SODEXO_FONT.body,
    fontSize: 10,
    color: statusColor(solution.status),
    bold: true,
    align: 'center',
    valign: 'middle',
  });

  // hashtag run (first 4 to keep the line clean)
  if (solution.hashtags.length) {
    const tags = solution.hashtags.slice(0, 4).join('   ');
    slide.addText(tags, {
      x: 3.05,
      y: chipY,
      w: 9.8,
      h: 0.34,
      fontFace: SODEXO_FONT.body,
      fontSize: 10,
      color: SODEXO.textMuted,
      valign: 'middle',
    });
  }

  /* ── Two-column content layout ─────────────────────────────────── */
  const colAx = 0.45;
  const colAw = 6.2;
  const colBx = 7.0;
  const colBw = 5.88;
  const bodyY = 2.45;

  // Context
  sectionHeader(slide, colAx, bodyY, 'CONTEXT');
  slide.addText(solution.context || '—', {
    x: colAx,
    y: bodyY + 0.32,
    w: colAw,
    h: 1.3,
    fontFace: SODEXO_FONT.body,
    fontSize: 11,
    color: SODEXO.textBody,
    valign: 'top',
    paraSpaceAfter: 4,
  });

  // Description
  sectionHeader(slide, colAx, bodyY + 1.75, 'WHAT IT IS');
  slide.addText(solution.description || '—', {
    x: colAx,
    y: bodyY + 2.07,
    w: colAw,
    h: 1.7,
    fontFace: SODEXO_FONT.body,
    fontSize: 11,
    color: SODEXO.textBody,
    valign: 'top',
    paraSpaceAfter: 4,
  });

  // KPI grid (up to 4 in a 2×2)
  sectionHeader(slide, colBx, bodyY, 'DEPLOYMENT & KPIs');
  const kpis = solution.kpis.slice(0, 4);
  const kpiW = (colBw - 0.2) / 2;
  const kpiH = 0.72;
  kpis.forEach((k, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = colBx + col * (kpiW + 0.2);
    const y = bodyY + 0.32 + row * (kpiH + 0.15);
    slide.addShape('roundRect', {
      x,
      y,
      w: kpiW,
      h: kpiH,
      rectRadius: 0.08,
      fill: { color: 'E8EEFF' },
      line: { color: 'E8EEFF', width: 0 },
    });
    slide.addText(k.v, {
      x: x + 0.18,
      y: y + 0.06,
      w: kpiW - 0.2,
      h: 0.36,
      fontFace: SODEXO_FONT.heading,
      fontSize: 20,
      color: SODEXO.bluePrimary,
      bold: true,
    });
    slide.addText(k.l, {
      x: x + 0.18,
      y: y + 0.4,
      w: kpiW - 0.2,
      h: 0.28,
      fontFace: SODEXO_FONT.body,
      fontSize: 9,
      color: SODEXO.textMuted,
    });
  });

  // Benefits (3-up)
  sectionHeader(slide, colBx, bodyY + 2.2, 'BENEFITS');
  const benY = bodyY + 2.52;
  const benW = (colBw - 0.3) / 3;
  const benefits = [
    { label: 'Client', body: solution.benefits.client },
    { label: 'Consumer', body: solution.benefits.consumer },
    { label: 'Sodexo', body: solution.benefits.sodexo },
  ];
  benefits.forEach((b, i) => {
    const x = colBx + i * (benW + 0.15);
    slide.addShape('roundRect', {
      x,
      y: benY,
      w: benW,
      h: 1.3,
      rectRadius: 0.1,
      fill: { color: SODEXO.white },
      line: { color: SODEXO.hairline, width: 1 },
    });
    slide.addText(b.label, {
      x: x + 0.15,
      y: benY + 0.1,
      w: benW - 0.3,
      h: 0.3,
      fontFace: SODEXO_FONT.heading,
      fontSize: 11,
      color: SODEXO.navy,
      bold: true,
    });
    slide.addText(b.body ?? '—', {
      x: x + 0.15,
      y: benY + 0.42,
      w: benW - 0.3,
      h: 0.85,
      fontFace: SODEXO_FONT.body,
      fontSize: 9.5,
      color: SODEXO.textBody,
      valign: 'top',
    });
  });

  /* ── Footer strip ──────────────────────────────────────────────── */
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
    w: 9,
    h: 0.26,
    fontFace: SODEXO_FONT.body,
    fontSize: 9,
    color: 'FFFFFF',
    valign: 'middle',
  });

  const contactLine = [
    solution.contact ? `Contact · ${solution.contact}` : null,
    solution.flags?.length ? `Regions · ${solution.flags.join(' ')}` : null,
  ]
    .filter(Boolean)
    .join('   ');
  if (contactLine) {
    slide.addText(contactLine, {
      x: 4.0,
      y: 7.22,
      w: 8.9,
      h: 0.26,
      fontFace: SODEXO_FONT.body,
      fontSize: 9,
      color: 'FFFFFF',
      align: 'right',
      valign: 'middle',
    });
  }

  void moduleInfo; // reserved for future enrichment (gradient strip, icon)

  await pptx.writeFile({
    fileName: `Sodexo-Solution-${safeFilename(solution.name)}.pptx`,
  });
}

function sectionHeader(
  slide: PptxGenJS.Slide,
  x: number,
  y: number,
  label: string,
): void {
  slide.addShape('rect', {
    x,
    y: y + 0.22,
    w: 0.32,
    h: 0.06,
    fill: { color: SODEXO.teal },
    line: { color: SODEXO.teal, width: 0 },
  });
  slide.addText(label, {
    x: x + 0.4,
    y,
    w: 5,
    h: 0.3,
    fontFace: SODEXO_FONT.heading,
    fontSize: 9,
    color: SODEXO.navy,
    bold: true,
    charSpacing: 4,
  });
}
