/** Microsoft SharePoint mark — simplified Fluent-style icon, local SVG only. */
export function SharePointMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle cx="28" cy="28" r="28" fill="#038387" />
      <circle cx="38" cy="18" r="10" fill="#1a9ba1" fillOpacity="0.95" />
      <circle cx="40" cy="38" r="8" fill="#37c6d0" fillOpacity="0.9" />
      <path
        d="M18 16h14c4.4 0 8 3.6 8 8v18c0 4.4-3.6 8-8 8H18c-4.4 0-8-3.6-8-8V24c0-4.4 3.6-8 8-8z"
        fill="#ffffff"
        fillOpacity="0.95"
      />
      <path
        d="M22 28.5h10M22 33h7M22 24h10"
        stroke="#038387"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
