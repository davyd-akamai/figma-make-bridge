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
      "bg-[var(--alias-accent-info-secondary,rgba(52,81,178,0.12))] text-[color:var(--alias-accent-info-primary,#3451B2)]",
    purple:
      "bg-[var(--alias-accent-important-secondary,rgba(117,59,189,0.12))] text-[color:var(--alias-accent-important-primary,#753BBD)]",
    pink: "bg-[var(--alias-accent-pink-secondary,rgba(205,29,141,0.12))] text-[color:var(--alias-accent-pink-primary,#CD1D8D)]",
    neutral:
      "bg-[var(--alias-accent-neutral-secondary,rgba(81,81,87,0.12))] text-[color:var(--alias-accent-neutral-primary,#515157)]",
    amber:
      "bg-[var(--alias-accent-warning-secondary,rgba(206,154,0,0.12))] text-[color:var(--alias-accent-warning-primary,#C25D05)]",
    green:
      "bg-[var(--alias-accent-positive-secondary,rgba(19,130,70,0.12))] text-[color:var(--alias-accent-positive-primary,#138246)]",
    red: "bg-[var(--alias-accent-negative-secondary,rgba(184,35,41,0.12))] text-[color:var(--alias-accent-negative-primary,#B82329)]",
  },
  accent: {
    ultramarine:
      "bg-[var(--alias-accent-info-primary,#3451B2)] text-[color:var(--alias-content-text-base,#FFFFFF)]",
    purple:
      "bg-[var(--alias-accent-important-primary,#753BBD)] text-[color:var(--alias-content-text-base,#FFFFFF)]",
    pink: "bg-[var(--alias-accent-pink-primary,#CD1D8D)] text-[color:var(--alias-content-text-base,#FFFFFF)]",
    neutral:
      "bg-[var(--alias-accent-neutral-primary,#515157)] text-[color:var(--alias-content-text-base,#FFFFFF)]",
    amber:
      "bg-[var(--alias-accent-warning-primary,#C25D05)] text-[color:var(--alias-content-text-base,#FFFFFF)]",
    green:
      "bg-[var(--alias-accent-positive-primary,#138246)] text-[color:var(--alias-content-text-base,#FFFFFF)]",
    red: "bg-[var(--alias-accent-negative-primary,#B82329)] text-[color:var(--alias-content-text-base,#FFFFFF)]",
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
