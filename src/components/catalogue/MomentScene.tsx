'use client';

/**
 * MomentScene — a zoomed "lens" into the journey isometric at a specific hotspot.
 *
 * Why this exists
 * ---------------
 * Each moment (Commute, Workplace, Wellbeing, F&B…) lives visually inside the
 * persona's isometric journey artwork. Rather than painting the moment page
 * with an abstract icon on a tinted tile, we crop and zoom into the exact
 * region of the journey illustration where that moment happens. This gives
 * every moment its own hand-illustrated scene **for free**, keeps thematic
 * continuity with the journey map, and removes the cognitive break between
 * "journey map" and "moment detail".
 *
 * How it works
 * ------------
 * Uses CSS `background-size` + `background-position` to render the journey
 * image at a larger zoom inside a fixed-aspect frame, then computes the exact
 * `background-position %` needed to place the hotspot at the frame's center.
 *
 * Given an image zoom `z` (= image size / container size) and hotspot at
 * `Lx%`, `Ly%` of the image:
 *   p = (z · L − 50) / (z − 1)
 * centers that hotspot within the container. We clamp to [0, 100] because
 * hotspots near the edge don't have enough image "bleed" to truly center —
 * in that case we show the image edge, which is fine and natural.
 *
 * Accessibility: the crop is purely decorative — the moment label is
 * rendered separately, so the image carries empty alt text.
 */

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface Props {
  /** Full journey artwork (1920×1080 isometric). */
  imageSrc: string;
  /** Hotspot left position, as a percent of the image width (0–100). */
  hotspotLeftPct: number;
  /** Hotspot top position, as a percent of the image height (0–100). */
  hotspotTopPct: number;
  /**
   * Zoom factor, i.e. rendered image size relative to container size.
   * `2.4` gives a comfortable mid-range crop — tight enough to feel like a
   * scene, loose enough to keep nearby figures readable and convey context.
   */
  zoom?: number;
  /**
   * Aspect ratio of the lens tile. Defaults to `16 / 9` to match the journey
   * artwork, which keeps the horizontal + vertical zoom factors identical and
   * avoids distortion of the isometric projection.
   */
  aspect?: string;
  /**
   * Accent color (usually the area or persona color) used for a soft vignette
   * ring and the corner badge. Defaults to the brand blue.
   */
  accent?: string;
  /** Optional small label shown as an overlay chip in the bottom-left. */
  label?: string;
  /** Optional overlay node rendered on top (icon, number, etc). */
  overlay?: React.ReactNode;
  className?: string;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function computeBgPosition(Lx: number, z: number): number {
  // p = (z · L − 50) / (z − 1) — centers hotspot at frame center when possible,
  // clamped to [0, 100] when the hotspot is too close to an image edge.
  if (z <= 1) return Lx; // defensive: no zoom → just align the percentage
  return clamp((z * Lx - 50) / (z - 1), 0, 100);
}

export function MomentScene({
  imageSrc,
  hotspotLeftPct,
  hotspotTopPct,
  zoom = 2.4,
  aspect = '16 / 9',
  accent = 'var(--blue)',
  label,
  overlay,
  className,
}: Props) {
  const reduceMotion = useReducedMotion();
  const bgX = computeBgPosition(hotspotLeftPct, zoom);
  const bgY = computeBgPosition(hotspotTopPct, zoom);

  return (
    <motion.div
      className={cn(
        'relative w-full overflow-hidden rounded-brand-lg',
        'ring-1 ring-[var(--grey-border)]',
        className,
      )}
      style={{ aspectRatio: aspect }}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* The isometric artwork, rendered as a CSS background so we can zoom
          and position it precisely. A slow, very subtle Ken Burns (~1% scale
          over 18s) keeps the scene feeling alive without ever calling
          attention to itself. Skipped for reduced-motion preference. */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: `${zoom * 100}% auto`,
          backgroundPosition: `${bgX}% ${bgY}%`,
          backgroundRepeat: 'no-repeat',
        }}
        animate={reduceMotion ? undefined : { scale: [1, 1.025, 1] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 18, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop' }
        }
        aria-hidden
      />

      {/* Soft tint wash in the accent color — sits over the art to unify it
          with the moment's persona/area palette. Kept very subtle (~8%). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${accent}14 0%, transparent 45%, ${accent}0d 100%)`,
        }}
      />

      {/* Edge vignette to anchor the crop and draw the eye inward. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.45), inset 0 -40px 80px -40px rgba(0,12,60,0.18)`,
        }}
      />

      {/* Optional overlay content (e.g. a moment number or custom node) */}
      {overlay ? (
        <div className="pointer-events-none absolute inset-0">{overlay}</div>
      ) : null}

      {/* Optional label chip — bottom-left, tiny eyebrow */}
      {label ? (
        <span
          className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-pill bg-white/90 px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--blue)] shadow-[var(--shadow-sm)] backdrop-blur-sm"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
          {label}
        </span>
      ) : null}
    </motion.div>
  );
}
