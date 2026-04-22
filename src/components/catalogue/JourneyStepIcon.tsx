import { cn } from '@/lib/utils/cn';
import { pickJourneyStepVisual } from '@/lib/data/journeyStepVisuals';
import type { JourneyStep } from '@/lib/data/types';

interface Props {
  step: Pick<JourneyStep, 'id' | 'label'> | null | undefined;
  /** Outer tile side in px. The glyph is sized to ~55% of this. */
  size?: number;
  /** Tint for background + glyph. Defaults to persona accent at 14% alpha + accent glyph. */
  accent?: string;
  /** Extra classes for the outer tile (e.g. shape override). */
  className?: string;
}

/**
 * Small rounded tile that displays a journey step's Phosphor icon, tinted
 * with the persona / area accent. Replaces every `{step.icon}` emoji render
 * across timelines, moment pages and search suggestions.
 */
export function JourneyStepIcon({
  step,
  size = 32,
  accent = 'var(--blue-primary)',
  className,
}: Props) {
  const { Icon, weight } = pickJourneyStepVisual(step ?? undefined);
  const glyph = Math.round(size * 0.55);
  const radius = Math.max(8, Math.round(size * 0.28));

  return (
    <span
      aria-hidden
      className={cn('inline-flex flex-shrink-0 items-center justify-center', className)}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: `${accent}1f`,
        color: accent,
      }}
    >
      <Icon size={glyph} weight={weight} />
    </span>
  );
}
