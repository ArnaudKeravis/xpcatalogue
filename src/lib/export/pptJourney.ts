'use client';

import PptxGenJS from 'pptxgenjs';
import type { JourneyHotspot, JourneyStep, Persona, AreaConfig } from '@/lib/data/types';
import {
  SODEXO,
  SODEXO_FONT,
  SODEXO_FOOTER,
  SODEXO_LOGO_PATH,
  fetchAsDataUrl,
  safeFilename,
} from './brand';
import { imageContainInBox, TEXT_SHRINK } from './pptHelpers';

const FIT = TEXT_SHRINK;

interface ExportJourneyOptions {
  persona: Persona;
  area?: AreaConfig;
  steps: JourneyStep[];
  imageUrl: string;
  /** Percent-based hotspots — same coordinates as `JourneyMap` on the site. */
  journeyHotspots?: JourneyHotspot[];
}

function routeCenters(steps: JourneyStep[], hotspots?: JourneyHotspot[]): { x: number; y: number }[] {
  if (!hotspots?.length) return [];
  const boxFor = (stepId: string) => hotspots.find((h) => h.stepId === stepId);
  return steps
    .map((step) => {
      const box = boxFor(step.id);
      if (!box) return null;
      return {
        x: box.left + (box.w ?? 0) / 2,
        y: box.top + (box.h ?? 0) / 2,
      };
    })
    .filter((p): p is { x: number; y: number } => p !== null);
}

function pinPositionPercent(box: JourneyHotspot): { left: number; top: number } {
  return {
    left: box.left + (box.w ?? 0) / 2,
    top: Math.max(box.top - 6, 4),
  };
}

function pctToSlide(
  px: number,
  py: number,
  imgX: number,
  imgY: number,
  imgW: number,
  imgH: number,
): { x: number; y: number } {
  return {
    x: imgX + (px / 100) * imgW,
    y: imgY + (py / 100) * imgH,
  };
}

/**
 * Journey map export: same image framing (contain) as the site, optional route + pins
 * from `journeyHotspots`, legend at bottom-left, ordered moment list with room to wrap.
 */
export async function exportJourneyToPptx({
  persona,
  area,
  steps,
  imageUrl,
  journeyHotspots,
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
    w: 6,
    h: 0.22,
    fontFace: SODEXO_FONT.heading,
    fontSize: 9,
    color: 'FFFFFF',
    bold: true,
    charSpacing: 4,
    ...FIT,
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
      ...FIT,
    },
  );
  if (logo) {
    slide.addImage(imageContainInBox({ data: logo, x: 11.88, y: 0.12, w: 1.1, h: 0.38 }));
  }
  slide.addShape('rect', {
    x: 0,
    y: 0.62,
    w: 13.333,
    h: 0.06,
    fill: { color: SODEXO.teal },
    line: { color: SODEXO.teal, width: 0 },
  });

  slide.addText(`A day in the life of ${persona.fullName}`, {
    x: 0.45,
    y: 0.85,
    w: 12.5,
    h: 0.5,
    fontFace: SODEXO_FONT.heading,
    fontSize: 22,
    color: SODEXO.navy,
    bold: true,
    ...FIT,
  });

  const imgX = 0.45;
  const imgY = 1.42;
  const imgW = 12.45;
  const imgH = 4.42;

  slide.addShape('roundRect', {
    x: imgX - 0.06,
    y: imgY - 0.06,
    w: imgW + 0.12,
    h: imgH + 0.12,
    rectRadius: 0.18,
    fill: { color: 'E8EEFB' },
    line: { color: SODEXO.hairline, width: 1 },
  });

  if (journey) {
    slide.addImage(imageContainInBox({ data: journey, x: imgX, y: imgY, w: imgW, h: imgH }));
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

  const centers = routeCenters(steps, journeyHotspots);
  if (centers.length >= 2 && journey) {
    for (let i = 0; i < centers.length - 1; i++) {
      const a = pctToSlide(centers[i].x, centers[i].y, imgX, imgY, imgW, imgH);
      const b = pctToSlide(centers[i + 1].x, centers[i + 1].y, imgX, imgY, imgW, imgH);
      const minX = Math.min(a.x, b.x);
      const minY = Math.min(a.y, b.y);
      const w = Math.max(0.03, Math.abs(b.x - a.x));
      const h = Math.max(0.03, Math.abs(b.y - a.y));
      slide.addShape('line', {
        x: minX,
        y: minY,
        w,
        h,
        line: {
          color: SODEXO.bluePrimary,
          width: 1.5,
          dashType: 'dash',
        },
      });
    }
  }

  if (journeyHotspots?.length && journey) {
    steps.forEach((step, i) => {
      const box = journeyHotspots.find((h) => h.stepId === step.id);
      if (!box) return;
      const { left, top } = pinPositionPercent(box);
      const p = pctToSlide(left, top, imgX, imgY, imgW, imgH);
      const pinR = 0.14;
      slide.addShape('ellipse', {
        x: p.x - pinR,
        y: p.y - pinR,
        w: pinR * 2,
        h: pinR * 2,
        fill: { color: SODEXO.blue },
        line: { color: SODEXO.white, width: 1 },
      });
      slide.addText(String(i + 1), {
        x: p.x - pinR,
        y: p.y - pinR * 0.85,
        w: pinR * 2,
        h: pinR * 2,
        fontFace: SODEXO_FONT.body,
        fontSize: 8,
        color: 'FFFFFF',
        bold: true,
        align: 'center',
        valign: 'middle',
      });
    });
  }

  /* Legend — bottom-left inside the map frame (matches JourneyMap desktop legend). */
  const legW = 3.35;
  const legH = 0.38;
  const legX = imgX + 0.14;
  const legY = imgY + imgH - legH - 0.12;
  slide.addShape('roundRect', {
    x: legX,
    y: legY,
    w: legW,
    h: legH,
    rectRadius: legH / 2,
    fill: { color: 'FFFFFF' },
    line: { color: SODEXO.hairline, width: 1 },
  });
  slide.addText('Physical ●    Digital ●    ——— Route', {
    x: legX + 0.2,
    y: legY + 0.06,
    w: legW - 0.4,
    h: legH - 0.12,
    fontFace: SODEXO_FONT.body,
    fontSize: 9,
    color: SODEXO.navy,
    bold: true,
    valign: 'middle',
    ...FIT,
  });

  const momentLines = steps
    .map((s, i) => {
      const label = `${String(i + 1).padStart(2, '0')} · ${s.label}`;
      return s.description ? `${label}\n${s.description}` : label;
    })
    .join('\n\n');

  slide.addText(momentLines, {
    x: 0.45,
    y: imgY + imgH + 0.18,
    w: 12.45,
    h: 1.08,
    fontFace: SODEXO_FONT.body,
    fontSize: 10,
    color: SODEXO.navy,
    bold: false,
    valign: 'top',
    wrap: true,
    lineSpacing: 14,
    ...FIT,
  });

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
    ...FIT,
  });

  await pptx.writeFile({
    fileName: `Sodexo-Journey-${safeFilename(persona.name)}.pptx`,
  });
}
