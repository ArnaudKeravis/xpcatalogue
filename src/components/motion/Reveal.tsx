'use client';

/**
 * Reveal — fade + translate when the element scrolls into view.
 *
 * Uses framer-motion's `whileInView` so long pages come alive progressively
 * without blocking initial paint. `once` defaults to true (reveal once, then
 * stay). Respects `prefers-reduced-motion`.
 *
 * Usage:
 *   <Reveal>
 *     <section>…long-form content…</section>
 *   </Reveal>
 */

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

const EASE_OUT_QUINT: [number, number, number, number] = [0.23, 1, 0.32, 1];

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
  once = true,
}: Props) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration: 0.45, ease: EASE_OUT_QUINT, delay }}
    >
      {children}
    </motion.div>
  );
}
