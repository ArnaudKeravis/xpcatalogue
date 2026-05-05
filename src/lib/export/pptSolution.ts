'use client';

import PptxGenJS from 'pptxgenjs';
import type { Module, Solution } from '@/lib/data/types';
import { COLLECTION_META } from '@/lib/data/collections';
import {
  SODEXO,
  SODEXO_FONT,
  SODEXO_FOOTER,
  SODEXO_LOGO_PATH,
  fetchAsDataUrl,
  safeFilename,
  statusColor,
} from './brand';
import { imageContainInBox, TEXT_SHRINK } from './pptHelpers';

const FIT = TEXT_SHRINK;

const AREA_LABEL: Record<string, string> = {
  work: 'Work',
  learn: 'Learn',
  heal: 'Heal',
  play: 'Play',
};

export interface SolutionExportOptions {
  module?: Module;
  /** Total solutions in the current module rail (sidebar). */
  siblingCount?: number;
}

function addStandardHeader(
  slide: PptxGenJS.Slide,
  eyebrow: string,
  subtitle: string,
  logo: string | undefined,
): void {
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.62,
    fill: { color: SODEXO.navy },
    line: { color: SODEXO.navy, width: 0 },
  });
  slide.addText(eyebrow, {
    x: 0.45,
    y: 0.08,
    w: 6,
    h: 0.22,
    fontFace: SODEXO_FONT.heading,
    fontSize: 9,
    color: 'FFFFFF',
    bold: true,
    charSpacing: 4,
    ...FIT,
  });
  slide.addText(subtitle, {
    x: 0.45,
    y: 0.3,
    w: 9,
    h: 0.26,
    fontFace: SODEXO_FONT.body,
    fontSize: 11,
    color: 'FFFFFF',
    bold: true,
    ...FIT,
  });
  if (logo) {
    slide.addImage(imageContainInBox({ data: logo, x: 11.88, y: 0.12, w: 1.1, h: 0.38 }));
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
  slide.addShape('rect', {
    x: 0,
    y: 0.62,
    w: 13.333,
    h: 0.06,
    fill: { color: SODEXO.teal },
    line: { color: SODEXO.teal, width: 0 },
  });
}

function addStandardFooter(slide: PptxGenJS.Slide, rightLine?: string): void {
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
    w: rightLine ? 7.5 : 12.4,
    h: 0.26,
    fontFace: SODEXO_FONT.body,
    fontSize: 9,
    color: 'FFFFFF',
    valign: 'middle',
    ...FIT,
  });
  if (rightLine) {
    slide.addText(rightLine, {
      x: 5.2,
      y: 7.22,
      w: 7.7,
      h: 0.26,
      fontFace: SODEXO_FONT.body,
      fontSize: 9,
      color: 'FFFFFF',
      align: 'right',
      valign: 'middle',
      ...FIT,
    });
  }
}

/**
 * Render a solution as a Sodexo-branded deck (16:9): overview slide + metrics slide so
 * nothing from the solution detail UI is omitted (KPIs, hero, collections, URL, …).
 */
export async function exportSolutionToPptx(
  solution: Solution,
  opts?: SolutionExportOptions,
): Promise<void> {
  const moduleInfo = opts?.module;
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.title = `${solution.name} — ${solution.module}`;
  pptx.author = 'Sodexo Digital & AI Innovation';
  pptx.company = 'Sodexo';
  pptx.subject = 'Experience Catalogue — Solution one-pager';

  const logo = await fetchAsDataUrl(SODEXO_LOGO_PATH);
  const heroData = solution.heroImage ? await fetchAsDataUrl(solution.heroImage) : undefined;

  const collectionsLine =
    solution.collections?.length ?
      solution.collections.map((c) => COLLECTION_META[c].label).join(' · ')
    : '';

  const areasLine = solution.areas.map((a) => AREA_LABEL[a] ?? a).join(' · ');
  const regionsLine = solution.flags?.length ? solution.flags.join(' ') : '';

  const footerRight = [
    solution.contact ? `Contact · ${solution.contact}` : null,
    regionsLine ? `Regions · ${regionsLine}` : null,
  ]
    .filter(Boolean)
    .join('   ');

  /* ── Slide 1 · Overview + narrative + hero ───────────────────────── */
  const slide1 = pptx.addSlide();
  slide1.background = { color: SODEXO.canvas };
  addStandardHeader(
    slide1,
    'EXPERIENCE CATALOGUE',
    `Solution · ${solution.module}${moduleInfo?.name ? ` · ${moduleInfo.name}` : ''}`,
    logo,
  );

  slide1.addText(solution.name, {
    x: 0.45,
    y: 0.85,
    w: 11.5,
    h: 0.95,
    fontFace: SODEXO_FONT.heading,
    fontSize: 34,
    color: SODEXO.navy,
    bold: true,
    ...FIT,
  });

  const chipY = 1.82;
  slide1.addShape('roundRect', {
    x: 0.45,
    y: chipY,
    w: 1.25,
    h: 0.34,
    rectRadius: 0.17,
    fill: { color: SODEXO.white },
    line: { color: SODEXO.navy, width: 1 },
  });
  slide1.addText(solution.type, {
    x: 0.45,
    y: chipY,
    w: 1.25,
    h: 0.34,
    fontFace: SODEXO_FONT.body,
    fontSize: 10,
    color: SODEXO.teal,
    bold: true,
    align: 'center',
    valign: 'middle',
    ...FIT,
  });
  slide1.addShape('roundRect', {
    x: 1.82,
    y: chipY,
    w: 1.25,
    h: 0.34,
    rectRadius: 0.17,
    fill: { color: SODEXO.white },
    line: { color: statusColor(solution.status), width: 1 },
  });
  slide1.addText(solution.status, {
    x: 1.82,
    y: chipY,
    w: 1.25,
    h: 0.34,
    fontFace: SODEXO_FONT.body,
    fontSize: 10,
    color: statusColor(solution.status),
    bold: true,
    align: 'center',
    valign: 'middle',
    ...FIT,
  });

  let chipX = 3.18;
  if (collectionsLine) {
    slide1.addShape('roundRect', {
      x: chipX,
      y: chipY,
      w: 4.2,
      h: 0.34,
      rectRadius: 0.17,
      fill: { color: 'E8F8F6' },
      line: { color: SODEXO.teal, width: 1 },
    });
    slide1.addText(collectionsLine, {
      x: chipX + 0.12,
      y: chipY,
      w: 3.96,
      h: 0.34,
      fontFace: SODEXO_FONT.body,
      fontSize: 9,
      color: SODEXO.navy,
      bold: true,
      align: 'center',
      valign: 'middle',
      ...FIT,
    });
    chipX += 4.35;
  }

  if (solution.hashtags.length) {
    slide1.addText(solution.hashtags.join('     '), {
      x: 0.45,
      y: 2.28,
      w: 12.4,
      h: 0.65,
      fontFace: SODEXO_FONT.body,
      fontSize: 10,
      color: SODEXO.textMuted,
      valign: 'top',
      wrap: true,
      ...FIT,
    });
  }

  slide1.addText(`Areas · ${areasLine}`, {
    x: 0.45,
    y: 2.98,
    w: 12.4,
    h: 0.28,
    fontFace: SODEXO_FONT.body,
    fontSize: 10,
    color: SODEXO.textBody,
    bold: true,
    ...FIT,
  });

  const colAx = 0.45;
  const colAw = 6.35;
  const colBx = 7.05;
  const colBw = 5.85;
  const bodyTop = 3.35;

  sectionHeader(slide1, colAx, bodyTop, 'CONTEXT');
  slide1.addText(solution.context || '—', {
    x: colAx,
    y: bodyTop + 0.32,
    w: colAw,
    h: 1.35,
    fontFace: SODEXO_FONT.body,
    fontSize: 11,
    color: SODEXO.textBody,
    valign: 'top',
    wrap: true,
    paraSpaceAfter: 4,
    ...FIT,
  });

  sectionHeader(slide1, colAx, bodyTop + 1.85, 'WHAT IT IS');
  slide1.addText(solution.description || '—', {
    x: colAx,
    y: bodyTop + 2.17,
    w: colAw,
    h: 2.05,
    fontFace: SODEXO_FONT.body,
    fontSize: 11,
    color: SODEXO.textBody,
    valign: 'top',
    wrap: true,
    paraSpaceAfter: 4,
    ...FIT,
  });

  /* Hero + module summary — right column */
  slide1.addShape('roundRect', {
    x: colBx,
    y: bodyTop,
    w: colBw,
    h: 3.55,
    rectRadius: 0.14,
    fill: { color: SODEXO.white },
    line: { color: SODEXO.hairline, width: 1 },
  });

  if (moduleInfo) {
    slide1.addShape('rect', {
      x: colBx,
      y: bodyTop,
      w: colBw,
      h: 0.38,
      fill: { color: SODEXO.bluePrimary },
      line: { width: 0 },
    });
    slide1.addText(moduleInfo.name ?? solution.module, {
      x: colBx + 0.2,
      y: bodyTop + 0.06,
      w: colBw - 0.4,
      h: 0.28,
      fontFace: SODEXO_FONT.body,
      fontSize: 11,
      color: 'FFFFFF',
      bold: true,
      ...FIT,
    });
  }

  const heroTop = bodyTop + (moduleInfo ? 0.45 : 0.15);
  const heroBox = {
    x: colBx + 0.2,
    y: heroTop,
    w: colBw - 0.4,
    h: 2.35,
  };

  if (heroData) {
    slide1.addImage(imageContainInBox({ data: heroData, ...heroBox }));
  } else {
    slide1.addText(solution.img, {
      x: heroBox.x,
      y: heroBox.y,
      w: heroBox.w,
      h: heroBox.h,
      fontSize: 72,
      align: 'center',
      valign: 'middle',
    });
  }

  const modDescY = heroTop + 2.42;
  slide1.addText(moduleInfo?.description ?? '', {
    x: colBx + 0.2,
    y: modDescY,
    w: colBw - 0.4,
    h: 1.05,
    fontFace: SODEXO_FONT.body,
    fontSize: 9,
    color: SODEXO.textMuted,
    valign: 'top',
    wrap: true,
    ...FIT,
  });

  if (opts?.siblingCount && opts.siblingCount > 1) {
    slide1.addText(`${opts.siblingCount} solutions in this module`, {
      x: colBx + 0.2,
      y: bodyTop + 3.15,
      w: colBw - 0.4,
      h: 0.28,
      fontFace: SODEXO_FONT.body,
      fontSize: 9,
      color: SODEXO.textMuted,
      italic: true,
      ...FIT,
    });
  }

  addStandardFooter(slide1, footerRight || undefined);

  /* ── Slide 2 · KPIs, benefits, contact, URL ─────────────────────── */
  const slide2 = pptx.addSlide();
  slide2.background = { color: SODEXO.canvas };
  addStandardHeader(slide2, 'EXPERIENCE CATALOGUE', `${solution.name} · metrics & benefits`, logo);

  slide2.addText('Deployment & KPIs', {
    x: 0.45,
    y: 0.85,
    w: 8,
    h: 0.35,
    fontFace: SODEXO_FONT.heading,
    fontSize: 14,
    color: SODEXO.navy,
    bold: true,
    ...FIT,
  });

  const kpis = solution.kpis;
  const kpiGapX = 0.18;
  const kpiGapY = 0.12;
  const gridLeft = 0.45;
  const gridTop = 1.22;
  const gridW = 12.45;
  const kpiCols = kpis.length > 6 ? 3 : 2;
  const kpiW = (gridW - kpiGapX * (kpiCols - 1)) / kpiCols;
  const rows = Math.max(1, Math.ceil(kpis.length / kpiCols));
  /** Keep KPI block + benefits + contact inside slide safe area above footer */
  const maxKpiBlockH = 3.35;
  let kpiH = (maxKpiBlockH - (rows - 1) * kpiGapY) / rows;
  kpiH = Math.max(0.48, Math.min(0.92, kpiH));

  kpis.forEach((k, i) => {
    const row = Math.floor(i / kpiCols);
    const col = i % kpiCols;
    const x = gridLeft + col * (kpiW + kpiGapX);
    const y = gridTop + row * (kpiH + kpiGapY);
    slide2.addShape('roundRect', {
      x,
      y,
      w: kpiW,
      h: kpiH,
      rectRadius: 0.08,
      fill: { color: 'E8EEFF' },
      line: { color: 'E8EEFF', width: 0 },
    });
    slide2.addText(k.v, {
      x: x + 0.16,
      y: y + 0.08,
      w: kpiW - 0.28,
      h: kpiH * 0.48,
      fontFace: SODEXO_FONT.heading,
      fontSize: 18,
      color: SODEXO.bluePrimary,
      bold: true,
      ...FIT,
    });
    slide2.addText(k.l, {
      x: x + 0.16,
      y: y + kpiH * 0.52,
      w: kpiW - 0.28,
      h: kpiH * 0.4,
      fontFace: SODEXO_FONT.body,
      fontSize: 9,
      color: SODEXO.textMuted,
      ...FIT,
    });
  });

  const benefitsTop = gridTop + rows * (kpiH + kpiGapY) + 0.35;
  sectionHeader(slide2, 0.45, benefitsTop - 0.32, 'BENEFITS');
  const benY = benefitsTop;
  const benW = (12.45 - 0.3) / 3;
  const benefits = [
    { label: 'Client', body: solution.benefits.client },
    { label: 'Consumer', body: solution.benefits.consumer },
    { label: 'Sodexo', body: solution.benefits.sodexo },
  ];
  benefits.forEach((b, i) => {
    const x = 0.45 + i * (benW + 0.15);
    slide2.addShape('roundRect', {
      x,
      y: benY,
      w: benW,
      h: 1.45,
      rectRadius: 0.1,
      fill: { color: SODEXO.white },
      line: { color: SODEXO.hairline, width: 1 },
    });
    slide2.addText(b.label, {
      x: x + 0.15,
      y: benY + 0.1,
      w: benW - 0.3,
      h: 0.32,
      fontFace: SODEXO_FONT.heading,
      fontSize: 11,
      color: SODEXO.navy,
      bold: true,
      ...FIT,
    });
    slide2.addText(b.body ?? '—', {
      x: x + 0.15,
      y: benY + 0.44,
      w: benW - 0.3,
      h: 0.95,
      fontFace: SODEXO_FONT.body,
      fontSize: 9.5,
      color: SODEXO.textBody,
      valign: 'top',
      wrap: true,
      ...FIT,
    });
  });

  const contactY = benY + 1.65;
  sectionHeader(slide2, 0.45, contactY - 0.32, 'CONTACT');
  slide2.addText(solution.contact || '—', {
    x: 0.45,
    y: contactY,
    w: 6,
    h: 0.45,
    fontFace: SODEXO_FONT.body,
    fontSize: 12,
    color: SODEXO.navy,
    bold: true,
    ...FIT,
  });

  if (solution.url) {
    slide2.addText(solution.url.replace(/^https?:\/\//i, ''), {
      x: 6.8,
      y: contactY,
      w: 6.1,
      h: 0.45,
      fontFace: SODEXO_FONT.body,
      fontSize: 11,
      color: SODEXO.bluePrimary,
      valign: 'middle',
      hyperlink: { url: solution.url, tooltip: solution.url },
      ...FIT,
    });
  }

  slide2.addText('Content synced from Notion · Experience Catalogue', {
    x: 0.45,
    y: contactY + 0.55,
    w: 12.4,
    h: 0.35,
    fontFace: SODEXO_FONT.body,
    fontSize: 9,
    color: SODEXO.textMuted,
    italic: true,
    ...FIT,
  });

  addStandardFooter(slide2, footerRight || undefined);

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
    w: 6,
    h: 0.3,
    fontFace: SODEXO_FONT.heading,
    fontSize: 9,
    color: SODEXO.navy,
    bold: true,
    charSpacing: 4,
    ...FIT,
  });
}
