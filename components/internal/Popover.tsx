// Shared floating-panel primitive, not part of the public package surface (not re-exported from
// index.ts) — used by every trigger-anchored popover in this repo: Select's own listbox,
// TabsHorizontal's tab-overflow menu, and Table's per-row action menu. Extracted so the same
// portal/positioning/outside-click/Escape logic isn't hand-rolled three times, and so every
// consumer gets the fix Table's own `RowActionMenu` had already found the hard way: an ancestor
// `overflow-hidden` (needed for e.g. a table's own rounded corners, or Select's bordered field)
// clips any `position: absolute` popover nested inside it, so this portals into `document.body`
// with `position: fixed`, computed from the anchor's own `getBoundingClientRect()` and recalculated
// on scroll/resize while open — TabsHorizontal's `OverflowMenu` and Select's first draft both used
// a plain `position: absolute` popover before this extraction, same starting point Table's own
// `RowActionMenu` took before its portal fix.

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";

export interface PopoverProps {
  open: boolean;
  onClose: () => void;
  /** Element the popover is positioned against and excluded from outside-click detection. */
  anchorRef: RefObject<HTMLElement | null>;
  /** "start" aligns the popover's left edge with the anchor's left edge (Select's listbox);
   * "end" aligns the popover's right edge with the anchor's right edge (TabsHorizontal/Table's
   * right-aligned menus). Default "start". */
  align?: "start" | "end";
  /** Match the popover's width to the anchor's width (Select's listbox only). */
  matchAnchorWidth?: boolean;
  role?: string;
  "aria-label"?: string;
  id?: string;
  className?: string;
  children: ReactNode;
}

export default function Popover({
  open,
  onClose,
  anchorRef,
  align = "start",
  matchAnchorWidth = false,
  role,
  "aria-label": ariaLabel,
  id,
  className,
  children,
}: PopoverProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties | null>(null);

  useLayoutEffect(() => {
    if (!open) return;
    function updatePosition() {
      const anchor = anchorRef.current;
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      setStyle({
        position: "fixed",
        top: rect.bottom,
        left: align === "start" ? rect.left : undefined,
        right: align === "end" ? window.innerWidth - rect.right : undefined,
        width: matchAnchorWidth ? rect.width : undefined,
        zIndex: 1000,
      });
    }
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, anchorRef, align, matchAnchorWidth]);

  useEffect(() => {
    if (!open) return;
    function onOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (anchorRef.current?.contains(target)) return;
      if (contentRef.current?.contains(target)) return;
      onClose();
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open, onClose, anchorRef]);

  if (!open || !style) return null;

  return createPortal(
    <div ref={contentRef} id={id} role={role} aria-label={ariaLabel} style={style} className={className}>
      {children}
    </div>,
    document.body,
  );
}
