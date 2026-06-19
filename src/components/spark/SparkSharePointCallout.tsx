import { ArrowSquareOut } from '@phosphor-icons/react/dist/ssr';
import { SharePointMark } from '@/components/spark/SharePointMark';
import { SPARK_SHAREPOINT_LABEL, SPARK_SHAREPOINT_URL } from '@/lib/sparkSharePoint';
import { cn } from '@/lib/utils/cn';

interface SparkSharePointCalloutProps {
  /** `banner` = full-width strip on `/standard-offer`; `inline` = compact block on solution detail. */
  variant?: 'banner' | 'inline';
  /** When set, copy references this solution name on the detail page. */
  solutionName?: string;
  className?: string;
}

export function SparkSharePointCallout({
  variant = 'banner',
  solutionName,
  className,
}: SparkSharePointCalloutProps) {
  const isInline = variant === 'inline';

  const title = solutionName
    ? `Full content for ${solutionName} is on SharePoint`
    : 'Visit the Sodexo Spark site on SharePoint';

  const body = solutionName ? (
    <>
      Positioning decks, KPIs, benefits and sales enablement for{' '}
      <strong className="text-[var(--blue)]">{solutionName}</strong> live on the{' '}
      <strong className="text-[var(--blue)]">{SPARK_SHAREPOINT_LABEL}</strong> hub — alongside the
      full Spark Offer IQ&nbsp;/&nbsp;OS&nbsp;/&nbsp;XP narrative.
    </>
  ) : (
    <>
      The full <strong className="text-[var(--blue)]">{SPARK_SHAREPOINT_LABEL}</strong> hub —
      positioning decks, IQ&nbsp;/&nbsp;OS&nbsp;/&nbsp;XP narrative, sales enablement and segment
      playbooks. Your starting point before you shortlist solutions in the catalogue below.
    </>
  );

  const wrapperClass = isInline
    ? cn('mx-auto w-full max-w-3xl', className)
    : cn('mx-auto max-w-[1200px]', className);

  const cardClass = isInline
    ? 'group relative flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--grey-border)] bg-white shadow-[var(--shadow-panel)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#038387] sm:flex-row sm:items-stretch'
    : 'group relative flex flex-col overflow-hidden rounded-[var(--radius-xl)] shadow-[var(--shadow-panel)] transition-[transform,box-shadow] duration-[var(--motion-base)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#038387] md:flex-row md:items-stretch';

  const pictoPanelClass = isInline
    ? 'relative flex shrink-0 items-center justify-center px-6 py-8 sm:w-[140px] sm:py-10'
    : 'relative flex shrink-0 items-center justify-center px-8 py-10 md:w-[220px] md:py-12';

  const pictoSize = isInline ? 'h-14 w-14 sm:h-16 sm:w-16' : 'h-20 w-20 md:h-24 md:w-24';

  const contentClass = isInline
    ? 'flex flex-1 flex-col justify-center gap-2.5 border-t border-[var(--grey-border)] px-5 py-6 sm:border-l sm:border-t-0 sm:px-7 sm:py-8'
    : 'flex flex-1 flex-col justify-center gap-3 border-t border-[var(--grey-border)] bg-white px-6 py-8 md:border-l md:border-t-0 md:px-10 md:py-10';

  const headingId = isInline ? 'spark-sharepoint-solution-heading' : 'spark-sharepoint-heading';

  return (
    <section
      aria-labelledby={headingId}
      className={isInline ? undefined : 'border-b border-[var(--grey-border)] bg-[var(--surface)] px-4 py-8 md:px-8 md:py-10'}
    >
      <div className={wrapperClass}>
        <a href={SPARK_SHAREPOINT_URL} target="_blank" rel="noopener noreferrer" className={cardClass}>
          <div
            className={pictoPanelClass}
            style={{
              background: 'linear-gradient(160deg, #038387 0%, #025661 55%, #014451 100%)',
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                background:
                  'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35) 0%, transparent 55%)',
              }}
            />
            <SharePointMark
              className={cn(
                'relative drop-shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-transform duration-[var(--motion-base)] group-hover:scale-105',
                pictoSize,
              )}
            />
          </div>

          <div className={contentClass}>
            <span
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e6f7f8] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#038387]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <SharePointMark className="h-4 w-4" />
              SharePoint hub
            </span>
            <h2
              id={headingId}
              className={cn(
                'font-extrabold leading-snug text-[var(--blue)]',
                isInline
                  ? 'text-lg md:text-xl'
                  : 'text-[clamp(1.35rem,2.8vw,1.85rem)]',
              )}
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {title}
            </h2>
            <p
              className="max-w-2xl text-sm leading-relaxed text-[var(--blue)]/75"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {body}
            </p>
            <span
              className="mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-[#038387] px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-sm)] transition-[background-color,transform] group-hover:translate-x-0.5 group-hover:bg-[#025661]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Open SharePoint
              <ArrowSquareOut size={18} weight="bold" aria-hidden />
            </span>
          </div>
        </a>
      </div>
    </section>
  );
}
