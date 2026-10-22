// Figma: Modal, node 123:4666 — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=123-4666
// Single "Basic modal" swatch (459px: title + close, description, right-aligned actions) — no size
// variants exist in the file, so there is no `size` prop (CDS's small/medium were not ported).
// The Figma node has no backdrop; `overlay` resolves to `alias.background.overlay`, the same dimming
// token Drawer uses. Behavior (focus trap, ESC/overlay close, body scroll lock, restore focus) follows
// CDS's modal.element.ts, same hand-rolled pattern as Drawer.

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { CloseIcon } from "./icons";

export interface ModalProps {
  /** Controlled open state — this component never manages its own visibility. */
  open: boolean;
  onClose: () => void;
  title?: string;
  /** Optional leading icon before the title. */
  icon?: ReactNode;
  /** Body content (Figma's "Description"). Plain text is styled as Body/Regular. */
  children?: ReactNode;
  /** Actions slot, right-aligned (Figma shows a Secondary + Primary `Button`). */
  footer?: ReactNode;
  /** Backdrop dimming behind the panel. */
  overlay?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

const FOCUSABLE_SELECTOR =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

export default function Modal({
  open,
  onClose,
  title = "Basic modal",
  icon,
  children,
  footer,
  overlay = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: ModalProps) {
  const [hasOpenedOnce, setHasOpenedOnce] = useState(open);
  const panelRef = useRef<HTMLDivElement>(null);
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
          if (document.activeElement === first || document.activeElement === panelRef.current) {
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
    <div
      className={`fixed inset-0 z-[1000] flex items-center justify-center p-4 ${open ? "" : "pointer-events-none"}`}
    >
      {overlay && (
        <div
          onClick={closeOnOverlayClick ? onClose : undefined}
          aria-hidden="true"
          className={`absolute inset-0 bg-[var(--component-modal-overlay,rgba(35,35,38,0.24))] transition-opacity duration-200 ease-in-out ${
            open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        />
      )}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy ?? (ariaLabel ? undefined : titleId)}
        tabIndex={-1}
        className={`relative box-border flex flex-col w-[459px] max-w-full max-h-full overflow-y-auto outline-none bg-[var(--component-modal-background,#FFFFFF)] shadow-[var(--component-modal-elevation,0px_16px_32px_0px_rgba(58,59,63,0.18),0px_4px_8px_0px_rgba(58,59,63,0.08))] pt-[var(--global-spacing-s24,24px)] px-[var(--global-spacing-s32,32px)] pb-[var(--global-spacing-s32,32px)] gap-[var(--global-spacing-s24,24px)] transition-opacity duration-200 ease-in-out ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        } ${className ?? ""}`}
      >
        <div className="flex gap-4 items-start shrink-0 w-full">
          <div className="flex flex-1 min-w-0 gap-2 items-start">
            {icon && (
              <span
                aria-hidden="true"
                className="shrink-0 size-6 inline-flex items-center justify-center text-[color:var(--component-modal-icon,#3D3D42)]"
              >
                {icon}
              </span>
            )}
            <h2
              id={titleId}
              className="type-heading-m flex-1 min-w-0 [word-break:break-word] text-[color:var(--component-modal-text-default,#343438)]"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 size-5 inline-flex items-center justify-center cursor-pointer text-[color:var(--component-modal-icon,#3D3D42)] hover:opacity-80"
          >
            <CloseIcon size={20} />
          </button>
        </div>
        {children != null && children !== false && (
          <div className="type-body-regular [word-break:break-word] text-[color:var(--component-modal-text-default,#343438)]">
            {children}
          </div>
        )}
        {footer && <div className="flex items-center justify-end gap-3 shrink-0">{footer}</div>}
      </div>
    </div>
  );
}
