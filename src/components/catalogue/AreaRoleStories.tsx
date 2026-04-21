import type { ElementType } from 'react';
import {
  Confetti,
  GraduationCap,
  Handshake,
  Heart,
  UserCircle,
  Wrench,
} from '@phosphor-icons/react/dist/ssr';
import type { Area, AreaConfig, AreaRoleStories as Stories } from '@/lib/data/types';

interface Props {
  areaConfig: AreaConfig;
  stories: Stories;
}

type RoleKey = 'client' | 'employee' | 'operator';

interface RoleRow {
  key: RoleKey;
  label: string;
  icon: ElementType;
  quote: string;
}

/**
 * Default first-person labels, shown unless overridden via
 * `AreaRoleStories.labels`. `employee` is the end-user bucket — in WORK
 * that's literally an employee, but in HEAL/LEARN/PLAY it becomes patient,
 * student, or guest.
 */
const DEFAULT_LABELS: Record<RoleKey, string> = {
  client: 'As a Client',
  employee: 'As an Employee',
  operator: 'As an Operator',
};

/**
 * Picks the icon for the end-user ("employee") voice based on area, so the
 * glyph reflects the actual person speaking:
 *   HEAL  → Heart          (patient recovery, emotional care)
 *   PLAY  → Confetti       (guest at an event, celebration, emotion)
 *   LEARN → GraduationCap  (student, learning, growth)
 *   WORK  → UserCircle     (default — an employee at the workplace)
 */
function getEmployeeIcon(area: Area): ElementType {
  if (area === 'heal') return Heart;
  if (area === 'play') return Confetti;
  if (area === 'learn') return GraduationCap;
  return UserCircle;
}

/**
 * Three-voice narrative band for the single-area page. Renders below the
 * persona grid when the area has `roleStories` copy. Structure:
 *
 *   [ intro — centered editorial sentence ]
 *
 *   CLIENT            EMPLOYEE          OPERATOR
 *   [icon]            [icon]            [icon]
 *   "I see…"          "I feel…"         "I take pride…"
 *
 * The area's brand colour threads through the icon chips and the thin rail
 * above each column so the band feels native to the area it describes.
 */
export function AreaRoleStories({ areaConfig, stories }: Props) {
  const labels = { ...DEFAULT_LABELS, ...(stories.labels ?? {}) };
  const rows: RoleRow[] = [
    { key: 'client', label: labels.client, icon: Handshake, quote: stories.client },
    {
      key: 'employee',
      label: labels.employee,
      icon: getEmployeeIcon(areaConfig.id),
      quote: stories.employee,
    },
    { key: 'operator', label: labels.operator, icon: Wrench, quote: stories.operator },
  ];

  return (
    <section
      aria-label={`${areaConfig.label} — three voices`}
      className="relative isolate border-t border-[var(--grey-border)] bg-[var(--surface-card)] px-6 py-14 md:px-10 md:py-20"
    >
      {/* Very soft area-tinted wash so the band reads as part of the area, not
          a generic footer block. Fades out at the bottom. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-48"
        style={{
          background: `linear-gradient(180deg, ${areaConfig.color}0f 0%, transparent 100%)`,
        }}
      />

      <div className="mx-auto max-w-[1200px]">
        {/* ── Intro ──────────────────────────────────────────────── */}
        <div className="mx-auto max-w-3xl text-center">
          <p
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em]"
            style={{ color: areaConfig.color, fontFamily: 'var(--font-body)' }}
          >
            <span
              aria-hidden
              className="h-px w-8"
              style={{ background: areaConfig.color }}
            />
            Three voices · one experience
          </p>
          <p
            className="mt-4 text-[clamp(1.25rem,2.4vw,1.875rem)] font-semibold leading-tight text-[var(--blue)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {stories.intro}
          </p>
        </div>

        {/* ── Three-voice grid ───────────────────────────────────── */}
        <ul className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
          {rows.map(({ key, label, icon: Icon, quote }) => (
            <li
              key={key}
              className="relative flex flex-col items-start gap-4 pt-5 md:border-l md:border-[var(--grey-border)] md:pl-8 md:first:border-l-0 md:first:pl-0"
            >
              {/* Thin coloured rail above each column (on top) so the area's
                  brand colour is felt even when the icon chip is muted */}
              <span
                aria-hidden
                className="absolute left-0 top-0 h-0.5 w-12 rounded-full md:left-8 md:first:left-0"
                style={{ background: areaConfig.color }}
              />
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{
                  background: `${areaConfig.color}14`,
                  color: areaConfig.color,
                }}
                aria-hidden
              >
                <Icon size={24} weight="duotone" />
              </div>
              <p
                className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--blue)]/60"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {label}
              </p>
              <blockquote
                className="text-[clamp(0.95rem,1.3vw,1.0625rem)] leading-relaxed text-[var(--blue)]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {quote}
              </blockquote>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
