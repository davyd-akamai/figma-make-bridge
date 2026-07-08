// Figma: core_container [not coded], node 41:2135 —
// https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=41-2135
// The node itself is an empty, non-auto-layout box (no children, no padding/radius data exposed
// via get_design_context/get_variable_defs) — background/border are the only values the Figma MCP
// tools could resolve on it. Padding (24px horizontal / 16px vertical) was confirmed directly by
// the design owner rather than read off the node, mapped to the existing s24/s16 spacing scale.
// A Container always spans the full available width of its parent grid/content area regardless of
// its children's size — it never sizes to content — so width is fixed to 100% rather than left to
// the default block-level "auto" (which would shrink-to-fit if a consumer ever placed it inside a
// flex/grid row without an explicit stretch).

import type { HTMLAttributes, ReactNode } from "react";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Container({ children, className, ...rest }: ContainerProps) {
  return (
    <div
      className={`box-border w-full border border-solid bg-[var(--component-container-background,#FFFFFF)] border-[var(--component-container-border,#D6D6DD)] px-[var(--global-spacing-s24,24px)] py-[var(--global-spacing-s16,16px)] ${className ?? ""}`}
      {...rest}
    >
      {children}
    </div>
  );
}
