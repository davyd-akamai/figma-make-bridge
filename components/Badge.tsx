// Figma: node 76:4205 "Badge" — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=76-4205
// General-purpose status/label badge: Type=Subtle|Accent x Color=7 options, an optional leading
// dot icon, and free-form label text. Not to be confused with the older, fixed-content
// `SystemBadge` (NEW/BETA only, components/SystemBadge.tsx) — that component kept its own name
// once this one took over the canonical "Badge" name.
import { DotIcon } from "./icons";

export type BadgeType = "subtle" | "accent";
// Prop values are Figma's own literal Color variant names (Ultramarine/Purple/Pink/Neutral/Amber/
// Green/Red), not the semantic token buckets those colors resolve through (informative/important/
// pink/neutral/warning/positive/negative) — same intentional divergence core-design-system's
// cds-badge documents for its own `BadgeColor`, and it's the reason this file's className lookup
// table below is keyed by these literal names while src/tokens.css's CSS vars are keyed by the
// semantic ones.
export type BadgeColor = "ultramarine" | "purple" | "pink" | "neutral" | "amber" | "green" | "red";

export interface BadgeProps {
  type?: BadgeType;
  color?: BadgeColor;
  /** Shows a small leading dot matching the badge's text color. Default false. */
  icon?: boolean;
  label?: string;
  className?: string;
}

const CLASSES: Record<BadgeType, Record<BadgeColor, string>> = {
  subtle: {
    ultramarine:
      "bg-[var(--component-badge-informative-subtle-background,rgba(52,81,178,0.12))] text-[color:var(--component-badge-informative-subtle-text,#3451B2)]",
    purple:
      "bg-[var(--component-badge-important-subtle-background,rgba(117,59,189,0.12))] text-[color:var(--component-badge-important-subtle-text,#753BBD)]",
    pink: "bg-[var(--component-badge-pink-subtle-background,rgba(205,29,141,0.12))] text-[color:var(--component-badge-pink-subtle-text,#CD1D8D)]",
    neutral:
      "bg-[var(--component-badge-neutral-subtle-background,rgba(81,81,87,0.12))] text-[color:var(--component-badge-neutral-subtle-text,#515157)]",
    amber:
      "bg-[var(--component-badge-warning-subtle-background,rgba(194,93,5,0.12))] text-[color:var(--component-badge-warning-subtle-text,#C25D05)]",
    green:
      "bg-[var(--component-badge-positive-subtle-background,rgba(19,130,70,0.12))] text-[color:var(--component-badge-positive-subtle-text,#138246)]",
    red: "bg-[var(--component-badge-negative-subtle-background,rgba(184,35,41,0.12))] text-[color:var(--component-badge-negative-subtle-text,#B82329)]",
  },
  accent: {
    ultramarine:
      "bg-[var(--component-badge-informative-accent-background,#3451B2)] text-[color:var(--component-badge-informative-accent-text,#FFFFFF)]",
    purple:
      "bg-[var(--component-badge-important-accent-background,#753BBD)] text-[color:var(--component-badge-important-accent-text,#FFFFFF)]",
    pink: "bg-[var(--component-badge-pink-accent-background,#CD1D8D)] text-[color:var(--component-badge-pink-accent-text,#FFFFFF)]",
    neutral:
      "bg-[var(--component-badge-neutral-accent-background,#515157)] text-[color:var(--component-badge-neutral-accent-text,#FFFFFF)]",
    amber:
      "bg-[var(--component-badge-warning-accent-background,#C25D05)] text-[color:var(--component-badge-warning-accent-text,#FFFFFF)]",
    green:
      "bg-[var(--component-badge-positive-accent-background,#138246)] text-[color:var(--component-badge-positive-accent-text,#FFFFFF)]",
    red: "bg-[var(--component-badge-negative-accent-background,#B82329)] text-[color:var(--component-badge-negative-accent-text,#FFFFFF)]",
  },
};

export default function Badge({
  type = "subtle",
  color = "ultramarine",
  icon = false,
  label = "Badge",
  className,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-[var(--global-spacing-s2,2px)] rounded-[4px] px-[var(--global-spacing-s6,6px)] py-[var(--global-spacing-s4,4px)] h-5 min-w-6 box-border font-bold text-[12px] leading-[12px] tracking-[0.12px] whitespace-nowrap ${CLASSES[type][color]} ${className ?? ""}`}
    >
      {icon && <DotIcon size={12} className="shrink-0" />}
      {label}
    </span>
  );
}
