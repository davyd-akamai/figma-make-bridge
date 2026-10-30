// Figma: Progress bar, node 150:7570 — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=150-7570
// Variant set: Size=L/S x Type=Line only/With title x State=Empty/In progress/Success/Error.
// CDS reference: `cds-progress-bar` (Lit).
//
// API (design-owner decisions; Figma only shows static swatches):
// - `value`/`max` (default 0/100) drive the fill; `state` is derived from them when omitted
//   (<= 0 empty, >= max success, otherwise in-progress). `error` is always set explicitly. Success
//   and error fill the whole line; empty fills nothing.
// - Figma's Type axis is the presence of content: no `title`/`meta`/`description`/`link` is "Line
//   only" (a 16px row with the line centred), any of them is "With title". Nothing is rendered by
//   default, Figma's sample copy ("Property deploying...") lives in the preview and docs demos only.
// - `meta` is the right-aligned text beside the title ("Est. 1 minute left"); like Figma it is only
//   shown while the bar is empty or in progress. `link` is a slot (consumer passes an <a>/<button>),
//   coloured with the link token.
//
// Geometry: line 8px (large) / 4px (small) on the `statusLine.default` track; title row 16px
// (Label/Bold S + Label/Regular S), description Body/Regular 14/20, 8px between line, title row and
// description, 12px before the link. Large with title/description/link measures 92px, small 88px.
// The in-progress fill is the `global.color.gradient.default` token (blue to green across the filled
// part), width animated 250ms ease-out as in CDS. While in progress a light band sweeps across the fill
// (`.fmb-progress-shimmer` in src/library.css, 1.6s loop, off under prefers-reduced-motion): motion was
// requested by the design owner, Figma and CDS show a static fill.

import type { HTMLAttributes, ReactNode } from "react";

export type ProgressBarSize = "small" | "large";
export type ProgressBarState = "empty" | "in-progress" | "success" | "error";

export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Current progress, 0 to `max`. Default 0. Clamped to the range. */
  value?: number;
  /** Value that counts as 100%. Default 100. */
  max?: number;
  /** Omit to derive from `value`/`max`; set `"error"` to show a failure (fills the line in red). */
  state?: ProgressBarState;
  size?: ProgressBarSize;
  /** Bold title above the description, also the accessible name unless `aria-label` is passed. */
  title?: ReactNode;
  /** Right-aligned text beside the title (e.g. "Est. 1 minute left"). Hidden in success and error. */
  meta?: ReactNode;
  /** Regular text under the title. */
  description?: ReactNode;
  /** Optional link or button rendered under the description, styled with the link color. */
  link?: ReactNode;
  className?: string;
}

const LINE_HEIGHT_CLASSES: Record<ProgressBarSize, string> = {
  large: "h-[var(--global-spacing-s8,8px)]",
  small: "h-[var(--global-spacing-s4,4px)]",
};

// One fully-spelled-out literal string per state — see Button's VARIANT_STATE_CLASSES for why these
// can't be interpolated. `[background:...]` (not `bg-[...]`) because the in-progress token is a gradient.
const FILL_CLASSES: Record<ProgressBarState, string> = {
  empty: "[background:var(--component-progressbar-statusline-inprogress,linear-gradient(270deg,#00B050_0%,#12A594_51%,#009CDE_100%))]",
  "in-progress": "[background:var(--component-progressbar-statusline-inprogress,linear-gradient(270deg,#00B050_0%,#12A594_51%,#009CDE_100%))]",
  success: "[background:var(--component-progressbar-statusline-success,#00B050)]",
  error: "[background:var(--component-progressbar-statusline-error,#D63C42)]",
};

function deriveState(value: number, max: number): ProgressBarState {
  if (value <= 0) return "empty";
  if (value >= max) return "success";
  return "in-progress";
}

export default function ProgressBar({
  value = 0,
  max = 100,
  state,
  size = "large",
  title,
  meta,
  description,
  link,
  className,
  "aria-label": ariaLabel,
  ...rest
}: ProgressBarProps) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const safeValue = Number.isFinite(value) ? Math.min(Math.max(value, 0), safeMax) : 0;
  const resolvedState = state ?? deriveState(safeValue, safeMax);
  const percent =
    resolvedState === "success" || resolvedState === "error"
      ? 100
      : resolvedState === "empty"
        ? 0
        : (safeValue / safeMax) * 100;

  const showMeta = meta != null && meta !== false && (resolvedState === "empty" || resolvedState === "in-progress");
  const hasTitleRow = (title != null && title !== false) || showMeta;
  const hasDescription = description != null && description !== false;
  const hasLink = link != null && link !== false;
  const withContent = hasTitleRow || hasDescription || hasLink;

  const line = (
    <div className={`w-full bg-[var(--component-progressbar-statusline-default,#E5E5EA)] ${LINE_HEIGHT_CLASSES[size]}`}>
      <div
        className={`relative h-full overflow-hidden transition-[width,background] duration-[250ms] ease-out ${FILL_CLASSES[resolvedState]}`}
        style={{ width: `${percent}%` }}
      >
        {resolvedState === "in-progress" && <span className="fmb-progress-shimmer" aria-hidden="true" />}
      </div>
    </div>
  );

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={safeValue}
      aria-label={ariaLabel ?? (typeof title === "string" ? title : undefined)}
      {...rest}
      className={className ?? `flex w-full flex-col ${withContent ? "gap-[var(--global-spacing-s12,12px)]" : "h-[16px] justify-center"}`}
    >
      {withContent ? (
        <>
          <div className="flex w-full flex-col gap-[var(--global-spacing-s8,8px)]">
            {line}
            {hasTitleRow && (
              <div className="flex w-full items-start gap-[var(--global-spacing-s12,12px)] text-[color:var(--component-progressbar-text-default,#343438)]">
                <p className="type-label-bold-s min-w-0 flex-1 truncate">{title}</p>
                {showMeta && <p className="type-label-regular-s shrink-0 text-right">{meta}</p>}
              </div>
            )}
            {hasDescription && (
              <p className="type-body-regular w-full text-[color:var(--component-progressbar-text-default,#343438)]">{description}</p>
            )}
          </div>
          {hasLink && (
            <div className="type-body-regular w-full text-[color:var(--component-progressbar-text-link-default,#0174BC)] hover:text-[color:var(--component-progressbar-text-link-hover,#009CDE)] [&_a]:text-inherit [&_button]:cursor-pointer [&_button]:text-inherit [&_a]:no-underline">
              {link}
            </div>
          )}
        </>
      ) : (
        line
      )}
    </div>
  );
}
