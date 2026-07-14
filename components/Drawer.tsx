// Figma: Drawer, node 47:8675 — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=47-8675
// (main component, `core_drawer` per its own description; Size=Default/Small/Flexible variant set,
// no Position property/variant exists — every rendered swatch slides in from the right, so this
// only implements the right-hand slide-in, matching the single elevation token that's wired up).
// Interactions/states reference: node 47:13856 ("Drawer examples") — overlay dimming, sticky footer,
// dark mode. `overlay` resolves to `alias.background.overlay` (confirmed via node 47:13869, the
// realistic in-context example) — the "Grey10 - 40%" dimming shown on the Small/Flexible examples
// comes from a separate "[not coded]" placeholder instance in that same frame, not a real token.
// Per user decision, the Figma `scrollbar` boolean (a static decorative thumb graphic in a
// non-scrolling mockup) isn't ported as a prop — the content area always auto-scrolls on overflow
// with the branded scrollbar, same treatment SideNavigation's menu list already established.

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { CloseIcon } from "./icons";

export type DrawerSize = "default" | "small" | "flexible";

export interface DrawerProps {
  /** Controlled open state — this component never manages its own visibility. */
  open: boolean;
  onClose: () => void;
  title?: string;
  /** Optional leading icon before the title (Figma's own hidden "star" placeholder demos this slot). */
  icon?: ReactNode;
  size?: DrawerSize;
  /** Sticky footer content — up to 3 action buttons in Figma's spec, composed by the consumer. */
  footer?: ReactNode;
  /** Backdrop overlay behind the panel. */
  overlay?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  children?: ReactNode;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

const SIZE_CLASSES: Record<DrawerSize, string> = {
  default: "w-[480px] max-w-full",
  small: "w-[300px] max-w-full",
  flexible: "min-w-[300px] w-[600px] max-w-[90vw]",
};

const FOCUSABLE_SELECTOR =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

export default function Drawer({
  open,
  onClose,
  title = "Header title",
  icon,
  size = "default",
  footer,
  overlay = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  children,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: DrawerProps) {
  const [hasOpenedOnce, setHasOpenedOnce] = useState(open);
  const panelRef = useRef<HTMLElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (open) setHasOpenedOnce(true);
  }, [open]);

  // Focus management + body scroll lock, active only while open.
  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const raf = requestAnimationFrame(() => panelRef.current?.focus({ preventScroll: true }));
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = originalOverflow;
      previouslyFocused.current?.focus?.({ preventScroll: true });
    };
  }, [open]);

  // ESC-to-close + Tab focus trap, active only while open.
  useEffect(() => {
    if (!open) return;
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape" && closeOnEsc) {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const focusable = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKeydown, true);
    return () => document.removeEventListener("keydown", handleKeydown, true);
  }, [open, closeOnEsc, onClose]);

  if (!hasOpenedOnce) return null;

  return (
    <div className={`fixed inset-0 z-[1000] ${open ? "" : "pointer-events-none"}`}>
      {overlay && (
        <div
          onClick={closeOnOverlayClick ? onClose : undefined}
          aria-hidden="true"
          className={`absolute inset-0 bg-[var(--component-drawer-overlay,rgba(35,35,38,0.24))] transition-opacity duration-200 ease-in-out ${
            open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        />
      )}
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy ?? (ariaLabel ? undefined : titleId)}
        tabIndex={-1}
        className={`absolute right-0 top-0 h-full box-border flex flex-col bg-[var(--component-drawer-background,#FFFFFF)] shadow-[var(--component-drawer-elevation-right,-16px_0px_32px_0px_rgba(61,61,66,0.18))] transition-[transform,opacity] duration-300 ease-out ${
          open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        } ${SIZE_CLASSES[size]} ${className ?? ""}`}
      >
        <div className="drawer-scroll flex-1 min-h-0 flex flex-col gap-[var(--global-spacing-s24,24px)] p-[var(--global-spacing-s24,24px)] overflow-y-auto">
          <div className="flex gap-4 items-start shrink-0 w-full">
            <div className="flex flex-1 min-w-0 gap-2 items-center">
              {icon && (
                <span aria-hidden="true" className="shrink-0 size-6 inline-flex items-center justify-center text-[color:var(--component-drawer-icon-default,#3D3D42)]">
                  {icon}
                </span>
              )}
              <h2
                id={titleId}
                className="type-heading-m flex-1 min-w-0 [word-break:break-word] text-[color:var(--component-drawer-text,#343438)]"
              >
                {title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="shrink-0 size-5 inline-flex items-center justify-center text-[color:var(--component-drawer-icon-default,#3D3D42)] hover:opacity-80"
            >
              <CloseIcon size={20} />
            </button>
          </div>
          {children}
        </div>
        {footer && (
          <div className="shrink-0 flex items-center justify-end gap-3 px-[var(--global-spacing-s24,24px)] py-[var(--global-spacing-s16,16px)] border-t border-solid border-[var(--component-drawer-border,#D6D6DD)] bg-[var(--component-drawer-background,#FFFFFF)]">
            {footer}
          </div>
        )}
      </aside>
    </div>
  );
}
