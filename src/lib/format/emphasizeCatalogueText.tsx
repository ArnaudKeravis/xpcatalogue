import { Fragment, type ReactNode } from 'react';
import type { Solution } from '@/lib/data/types';

const STOPWORDS = new Set(
  [
    'the',
    'and',
    'for',
    'with',
    'from',
    'this',
    'that',
    'are',
    'was',
    'has',
    'have',
    'our',
    'their',
    'your',
    'into',
    'than',
    'then',
    'only',
    'such',
    'also',
    'most',
    'more',
    'some',
    'what',
    'when',
    'where',
    'which',
    'while',
    'about',
    'after',
    'before',
    'between',
    'through',
    'during',
    'under',
    'over',
    'again',
    'against',
    'among',
    'within',
    'without',
    'using',
    'based',
    'across',
    'around',
    'service',
    'services',
    'solution',
    'solutions',
    'sodexo',
    'client',
    'clients',
    'customer',
    'customers',
    'digital',
    'business',
    'management',
    'platform',
    'system',
    'systems',
    'global',
    'local',
    'data',
    'offer',
    'offers',
    'will',
    'been',
    'were',
    'they',
    'them',
    'these',
    'those',
    'each',
    'other',
    'both',
    'such',
    'very',
    'just',
    'also',
    'able',
    'used',
    'using',
    'including',
    'included',
    'provides',
    'provide',
    'enables',
    'enable',
    'allows',
    'allow',
    'helps',
    'help',
    'support',
    'supports',
  ].map((w) => w.toLowerCase()),
);

function buildHighlightTerms(solution: Solution): Set<string> {
  const s = new Set<string>();
  for (const h of solution.hashtags) {
    const t = h.replace(/^#/, '').trim().toLowerCase();
    if (t.length >= 2) s.add(t);
  }
  for (const raw of solution.name.split(/[^a-zA-Z0-9]+/)) {
    const t = raw.trim().toLowerCase();
    if (t.length >= 4) s.add(t);
  }
  if (solution.catalogueTag) {
    for (const raw of solution.catalogueTag.split(/[^a-zA-Z0-9]+/)) {
      const t = raw.trim().toLowerCase();
      if (t.length >= 3) s.add(t);
    }
  }
  return s;
}

function shouldEmphasizeWord(raw: string, terms: Set<string>): boolean {
  const w = raw.replace(/^['"([{]+|['")\]}]+$/g, '');
  if (w.length < 3) return false;
  const lower = w.toLowerCase();
  if (STOPWORDS.has(lower)) return false;
  if (terms.has(lower)) return true;
  if (/^\d+(?:[.,]\d+)?%?$/.test(w)) return true;
  if (w.length >= 2 && w === w.toUpperCase() && /[A-Z]/.test(w)) return true;
  if (w.length >= 5 && /^[A-Z][a-z]+/.test(w) && /[a-z]/.test(w)) return true;
  return false;
}

/** Split a line into alternating plain / word-ish segments (keeps punctuation attached for display). */
function segmentLine(line: string): { text: string; isWord: boolean }[] {
  const out: { text: string; isWord: boolean }[] = [];
  const re = /(\s+)|([0-9]+(?:[.,][0-9]+)?(?:\s*%)?)|([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'&-]*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) {
      out.push({ text: line.slice(last, m.index), isWord: false });
    }
    const space = m[1];
    const num = m[2];
    const word = m[3];
    if (space) out.push({ text: space, isWord: false });
    else if (num) out.push({ text: num, isWord: true });
    else if (word) out.push({ text: word, isWord: true });
    last = re.lastIndex;
  }
  if (last < line.length) out.push({ text: line.slice(last), isWord: false });
  return out;
}

/**
 * Lightweight editorial emphasis for catalogue prose: numbers, ALL CAPS tokens,
 * TitleCase words, hashtags, and significant tokens from the solution name / tag.
 * Not NLP — deterministic heuristics only.
 */
export function emphasizeCatalogueText(text: string, solution: Solution): ReactNode {
  const terms = buildHighlightTerms(solution);
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, lineIdx) => (
        <Fragment key={lineIdx}>
          {lineIdx > 0 ? <br /> : null}
          {segmentLine(line).map((seg, i) => {
            const k = `L${lineIdx}-S${i}`;
            if (!seg.isWord) return <Fragment key={k}>{seg.text}</Fragment>;
            const emphasize = shouldEmphasizeWord(seg.text, terms);
            if (!emphasize) return <Fragment key={k}>{seg.text}</Fragment>;
            return (
              <strong
                key={k}
                className="font-semibold text-[var(--blue)]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {seg.text}
              </strong>
            );
          })}
        </Fragment>
      ))}
    </>
  );
}
