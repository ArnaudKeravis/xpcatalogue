'use client';

import PptxGenJS from 'pptxgenjs';
import type { AreaConfig, Persona } from '@/lib/data/types';
import { PERSONA_PORTRAIT_URL } from '@/lib/data/personaPortraits';
import {
  SODEXO,
  SODEXO_FONT,
  SODEXO_FOOTER,
  SODEXO_LOGO_PATH,
  fetchAsDataUrl,
  safeFilename,
} from './brand';

/**
 * Persona one-pager. Layout:
 *
 *   [ navy header ]  eyebrow · area    ·    Sodexo logo
 *   ┌─────────────┬────────────────────────────────────┐
 *   │ portrait    │ Full name (huge)                   │
 *   │             │ role (teal)                        │
 *   │             │ "quote" …                          │
 *   │             │                                    │
 *   │ (quote card)│ MOTIVATIONS · PAINS · NEEDS grid   │
 *   └─────────────┴────────────────────────────────────┘
 *   footer
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
    fetchAsDataUrl(persona.photo ?? PERSONA_PORTRAIT_URL[persona.id] ?? ''),
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
    `Persona · ${area?.label ?? persona.area.toUpperCase()}`,
    {
      x: 0.45,
      y: 0.3,
      w: 8,
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
    // Contain portrait inside card with some top padding.
    slide.addImage({
      data: portrait,
      x: leftX + 0.35,
      y: portraitY + 0.25,
      w: leftW - 0.7,
      h: portraitH - 0.5,
      sizing: { type: 'contain', w: leftW - 0.7, h: portraitH - 0.5 },
    });
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

  // Quote card under portrait
  slide.addShape('roundRect', {
    x: leftX,
    y: portraitY + portraitH + 0.15,
    w: leftW,
    h: 1.4,
    rectRadius: 0.14,
    fill: { color: SODEXO.white },
    line: { color: SODEXO.hairline, width: 1 },
  });
  slide.addText(`"${persona.quote}"`, {
    x: leftX + 0.25,
    y: portraitY + portraitH + 0.3,
    w: leftW - 0.5,
    h: 1.1,
    fontFace: SODEXO_FONT.body,
    fontSize: 11,
    color: SODEXO.navy,
    italic: true,
    valign: 'middle',
  });

  /* ── Right column: title + grid ──────────────────────────────────── */
  const rightX = 4.5;
  const rightW = 8.4;

  slide.addText(persona.name.toUpperCase(), {
    x: rightX,
    y: 0.95,
    w: rightW,
    h: 0.28,
    fontFace: SODEXO_FONT.heading,
    fontSize: 10,
    color: SODEXO.textMuted,
    bold: true,
    charSpacing: 6,
  });
  slide.addText(persona.fullName, {
    x: rightX,
    y: 1.22,
    w: rightW,
    h: 0.85,
    fontFace: SODEXO_FONT.heading,
    fontSize: 38,
    color: SODEXO.navy,
    bold: true,
  });
  slide.addText(persona.role, {
    x: rightX,
    y: 2.05,
    w: rightW,
    h: 0.36,
    fontFace: SODEXO_FONT.heading,
    fontSize: 16,
    color: SODEXO.teal,
    bold: true,
  });

  /* Info cards: Motivations / Pains / Needs (and optional Goals) ─── */
  type CardTone = 'white' | 'amber';
  const cards: Array<{ title: string; items: string[]; tone: CardTone }> = [
    { title: 'Motivations', items: persona.motivations, tone: 'white' },
    { title: 'Pain points', items: persona.pains, tone: 'white' },
    { title: 'Key needs', items: persona.needs, tone: 'white' },
  ];
  if (persona.professionalGoals?.length) {
    cards.push({
      title: 'Professional goals',
      items: persona.professionalGoals,
      tone: 'amber',
    });
  }

  const cardsY = 2.6;
  const rows = cards.length <= 3 ? 1 : 2;
  const cols = cards.length <= 3 ? cards.length : 2;
  const cardW = (rightW - 0.25 * (cols - 1)) / cols;
  const cardH = rows === 1 ? 2.9 : 1.4;

  cards.forEach((c, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = rightX + col * (cardW + 0.25);
    const y = cardsY + row * (cardH + 0.2);
    const fill = c.tone === 'amber' ? SODEXO.amber : SODEXO.white;
    const titleColor = SODEXO.navy;
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
      x: x + 0.2,
      y: y + 0.15,
      w: cardW - 0.4,
      h: 0.3,
      fontFace: SODEXO_FONT.heading,
      fontSize: 10,
      color: titleColor,
      bold: true,
      charSpacing: 5,
    });
    slide.addText(
      c.items.map((it) => ({
        text: it,
        options: { bullet: { code: '25CF' } },
      })),
      {
        x: x + 0.2,
        y: y + 0.5,
        w: cardW - 0.4,
        h: cardH - 0.6,
        fontFace: SODEXO_FONT.body,
        fontSize: 10.5,
        color: SODEXO.textBody,
        valign: 'top',
        paraSpaceAfter: 3,
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
  });

  await pptx.writeFile({
    fileName: `Sodexo-Persona-${safeFilename(persona.name)}.pptx`,
  });
}
