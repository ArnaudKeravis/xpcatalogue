'use client';

/**
 * Stagger — grid entrance choreography.
 *
 * Drop-in wrappers around framer-motion that animate children in sequence.
 * Timing follows the Emil Kowalski recipe (220ms enter, ease-out-quint).
 * Automatically collapses to instant render under `prefers-reduced-motion`.
 *
 * Usage:
 *   <Stagger as="ul" className="grid grid-cols-3 gap-4">
 *     {items.map(item => (
 *       <StaggerItem key={item.id} as="li">…</StaggerItem>
 *     ))}
 *   </Stagger>
 */

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ComponentProps, ElementType, ReactNode } from 'react';

const EASE_OUT_QUINT: [number, number, number, number] = [0.23, 1, 0.32, 1];

const containerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: EASE_OUT_QUINT },
  },
};

type MotionProps<T extends ElementType> = Omit<
  ComponentProps<typeof motion.div>,
  'as' | 'children'
> & { as?: T; children: ReactNode; className?: string };

export function Stagger<T extends ElementType = 'div'>({
  as,
  children,
  className,
  ...rest
}: MotionProps<T>) {
  const reduce = useReducedMotion();
  const Tag = (motion[(as ?? 'div') as keyof typeof motion] ?? motion.div) as typeof motion.div;
  return (
    <Tag
      className={className}
      variants={reduce ? undefined : containerVariants}
      initial={reduce ? false : 'hidden'}
      animate="visible"
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem<T extends ElementType = 'div'>({
  as,
  children,
  className,
  ...rest
}: MotionProps<T>) {
  const reduce = useReducedMotion();
  const Tag = (motion[(as ?? 'div') as keyof typeof motion] ?? motion.div) as typeof motion.div;
  return (
    <Tag
      className={className}
      variants={reduce ? undefined : itemVariants}
      {...rest}
    >
      {children}
    </Tag>
  );
}
