import { cn } from '@/lib/utils/cn';

/** Three overlapping rounded squares — Sodexo Spark brand mark. */
export function SparkMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden
    >
      <rect
        x="4"
        y="10"
        width="28"
        height="28"
        rx="5"
        stroke="#b9975b"
        strokeWidth="2"
        transform="rotate(-8 18 24)"
      />
      <rect
        x="12"
        y="6"
        width="28"
        height="28"
        rx="5"
        stroke="#5dade2"
        strokeWidth="2"
        transform="rotate(4 26 20)"
      />
      <rect
        x="18"
        y="12"
        width="28"
        height="28"
        rx="5"
        stroke="var(--blue)"
        strokeWidth="2.5"
        transform="rotate(12 32 26)"
      />
    </svg>
  );
}
