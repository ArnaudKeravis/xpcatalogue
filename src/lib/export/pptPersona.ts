'use client';

import PptxGenJS from 'pptxgenjs';
import type { AreaConfig, Persona } from '@/lib/data/types';
import { resolvePersonaImage } from '@/lib/data/personaImageResolve';
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

/**
 * Persona one-pager aligned with the PersonaProfile UI: eyebrow, portrait,
 * quote, then Workplace → Professional goals → Motivations → Pains → Needs.
 */
export async function exportPersonaToPptx(
  persona: Persona,
  area?: AreaConfig,
): Promise<void> {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.title = `${persona.fullName} — ${area?.label ?? persona.area}`;
  pptx.author = 'Sodexo Digital & AI Innovation';
  pptx.company = 'Sodexo';
  pptx.subject = 'Experience Catalogue — Persona';

  const [logo, portrait] = await Promise.all([
    fetchAsDataUrl(SODEXO_LOGO_PATH),
    fetchAsDataUrl(resolvePersonaImage('full', persona.id, persona.photo)),
  ]);

  const slide = pptx.addSlide();
  slide.background = { color: SODEXO.canvas };

  const eyebrow = persona.profileEyebrow ?? persona.name;

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
    `Persona · ${area?.label ?? persona.area.toUpperCase()}`,
    {
      x: 0.45,
      y: 0.3,
      w: 9,
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

  /* ── Portrait card (left column) ─────────────────────────────────── */
  const leftX = 0.45;
  const leftW = 3.8;
  const portraitY = 0.95;
  const portraitH = 4.1;

  slide.addShape('roundRect', {
    x: leftX,
    y: portraitY,
    w: leftW,
    h: portraitH,
    rectRadius: 0.18,
    fill: { color: 'EEF1FB' },
    line: { color: SODEXO.hairline, width: 1 },
  });
  if (portrait) {
    slide.addImage(
      imageContainInBox({
        data: portrait,
        x: leftX + 0.35,
        y: portraitY + 0.25,
        w: leftW - 0.7,
        h: portraitH - 0.5,
      }),
    );
  } else {
    slide.addText(persona.emoji, {
      x: leftX,
      y: portraitY,
      w: leftW,
      h: portraitH,
      fontSize: 140,
      align: 'center',
      valign: 'middle',
    });
  }

  slide.addShape('roundRect', {
    x: leftX,
    y: portraitY + portraitH + 0.15,
    w: leftW,
    h: 1.55,
    rectRadius: 0.14,
    fill: { color: SODEXO.white },
    line: { color: SODEXO.hairline, width: 1 },
  });
  slide.addText(`"${persona.quote}"`, {
    x: leftX + 0.25,
    y: portraitY + portraitH + 0.28,
    w: leftW - 0.5,
    h: 1.25,
    fontFace: SODEXO_FONT.body,
    fontSize: 11,
    color: SODEXO.navy,
    italic: true,
    valign: 'middle',
    wrap: true,
    ...FIT,
  });

  /* ── Right column: eyebrow + title + cards (same order as PersonaProfile) ─ */
  const rightX = 4.5;
  const rightW = 8.4;

  slide.addText(eyebrow.toUpperCase(), {
    x: rightX,
    y: 0.95,
    w: rightW,
    h: 0.28,
    fontFace: SODEXO_FONT.heading,
    fontSize: 10,
    color: SODEXO.textMuted,
    bold: true,
    charSpacing: 6,
    ...FIT,
  });
  slide.addText(persona.fullName, {
    x: rightX,
    y: 1.22,
    w: rightW,
    h: 0.82,
    fontFace: SODEXO_FONT.heading,
    fontSize: 34,
    color: SODEXO.navy,
    bold: true,
    ...FIT,
  });
  slide.addText(persona.role, {
    x: rightX,
    y: 2.05,
    w: rightW,
    h: 0.38,
    fontFace: SODEXO_FONT.heading,
    fontSize: 15,
    color: SODEXO.teal,
    bold: true,
    ...FIT,
  });

  type CardTone = 'white' | 'navy' | 'amber';
  const cards: Array<{ title: string; items: string[]; tone: CardTone }> = [];
  if (persona.workplaceStats?.length) {
    cards.push({ title: 'Workplace', items: persona.workplaceStats, tone: 'navy' });
  }
  if (persona.professionalGoals?.length) {
    cards.push({ title: 'Professional goals', items: persona.professionalGoals, tone: 'amber' });
  }
  cards.push(
    { title: 'Motivations', items: persona.motivations, tone: 'white' },
    { title: 'Pain points', items: persona.pains, tone: 'white' },
    { title: 'Key needs', items: persona.needs, tone: 'white' },
  );

  const cardsY = 2.58;
  const maxBottom = 7.05;
  const availableH = maxBottom - cardsY;
  const gap = 0.22;

  let cols = 2;
  let rows = Math.ceil(cards.length / cols);
  let cardH = (availableH - (rows - 1) * 0.18) / rows;

  if (cardH < 0.88 && cards.length > 3) {
    cols = 3;
    rows = Math.ceil(cards.length / cols);
    cardH = (availableH - (rows - 1) * 0.18) / rows;
  }

  cardH = Math.max(0.82, Math.min(1.38, cardH));
  const cardW = (rightW - gap * (cols - 1)) / cols;

  cards.forEach((c, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = rightX + col * (cardW + gap);
    const y = cardsY + row * (cardH + 0.18);
    const fill =
      c.tone === 'navy' ? SODEXO.navy : c.tone === 'amber' ? SODEXO.amber : SODEXO.white;
    const titleColor = c.tone === 'navy' ? 'FFFFFF' : SODEXO.navy;
    const bulletColor = c.tone === 'navy' ? 'FFFFFF' : SODEXO.textBody;

    slide.addShape('roundRect', {
      x,
      y,
      w: cardW,
      h: cardH,
      rectRadius: 0.12,
      fill: { color: fill },
      line: { color: SODEXO.hairline, width: 1 },
    });
    slide.addText(c.title.toUpperCase(), {
      x: x + 0.18,
      y: y + 0.12,
      w: cardW - 0.36,
      h: 0.28,
      fontFace: SODEXO_FONT.heading,
      fontSize: 9,
      color: titleColor,
      bold: true,
      charSpacing: 4,
      ...FIT,
    });
    slide.addText(
      c.items.map((it) => ({
        text: it,
        options: { bullet: { code: '25CF' }, color: bulletColor },
      })),
      {
        x: x + 0.18,
        y: y + 0.4,
        w: cardW - 0.36,
        h: cardH - 0.48,
        fontFace: SODEXO_FONT.body,
        fontSize: 9.5,
        valign: 'top',
        paraSpaceAfter: 2,
        wrap: true,
        ...FIT,
      },
    );
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
    ...FIT,
  });

  await pptx.writeFile({
    fileName: `Sodexo-Persona-${safeFilename(persona.name)}.pptx`,
  });
}
