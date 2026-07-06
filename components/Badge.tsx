// Figma: node 29:3416 "cm_global-badge" — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=29-3416
// This is the badge actually used inline next to labels (side nav pages, header account, etc.) —
// not to be confused with "core_badge-reserved" (node 29:2248), a larger, differently-specced
// component. Fixed label text and fixed colors, limited to Beta/New — not a generic customizable
// badge. Treat as a controlled component and do not add a prop to override the label text.

export interface BadgeProps {
  type: "beta" | "new";
  className?: string;
}

export default function Badge({ type, className }: BadgeProps) {
  const isNew = type === "new";
  return (
    <span
      className={
        className ??
        `inline-flex shrink-0 items-center rounded px-[var(--global-spacing-s4,4px)] py-[var(--global-spacing-s2,2px)] text-[11px] font-extrabold uppercase tracking-[0.22px] text-[color:var(--component-badge-text,#FFFFFF)] ${
          isNew ? "bg-[var(--component-badge-new-background,#7259D6)]" : "bg-[var(--component-badge-beta-background,#696970)]"
        }`
      }
    >
      {isNew ? "NEW" : "BETA"}
    </span>
  );
}
