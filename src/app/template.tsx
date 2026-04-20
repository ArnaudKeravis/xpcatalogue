import type { ReactNode } from 'react';
import { PageTransition } from '@/components/motion/PageTransition';

/**
 * template.tsx runs on every navigation (unlike layout.tsx). It's the right
 * place for subtle route-change animation that gives every screen a sense of
 * arrival without blocking interactivity.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
