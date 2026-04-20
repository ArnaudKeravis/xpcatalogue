'use client';

/**
 * PageTransition — app-wide route fade-up used via Next.js `template.tsx`.
 * Templates re-mount on every navigation (unlike layouts), so this runs on
 * every route change. Kept subtle: opacity + 6px translate, 260ms.
 */

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

const EASE_OUT_QUINT: [number, number, number, number] = [0.23, 1, 0.32, 1];

export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26, ease: EASE_OUT_QUINT }}
    >
      {children}
    </motion.div>
  );
}
