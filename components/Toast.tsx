// Figma: Notification toast, node 123:5295 — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=123-5295
// Variant set: Type=Info/Warning/Error/Success — a colored 48px icon block, one line of text and a ×.
// Figma only shows the static toast. Behavior is a design-owner decision: fixed to the bottom-right of the
// viewport, auto-dismisses after 5000ms (CDS's default), and the × dismisses immediately. Visibility is
// controlled (`open` + `onClose`, same as Modal/Drawer): the timer and × only call `onClose`. A single toast
// only — no stack, queue or global service (CDS's toast list/service were not ported).
// Status icons inherit `currentColor` from the per-type `statusicon` tokens (white; warning is dark).

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CloseIcon, FailureOutlineIcon, InfoOutlineIcon, SuccessOutlineIcon, WarningOutlineIcon } from "./icons";

export type ToastType = "info" | "warning" | "error" | "success";

export interface ToastProps {
  /** Controlled visibility — the toast never hides itself; the timer and × call `onClose`. */
  open: boolean;
  /** Fired by the × and by the auto-dismiss timer. The consumer sets `open` to false. */
  onClose: () => void;
  /** Message text (one short line). */
  children: ReactNode;
  /** Status type — picks the colors and the status icon. */
  type?: ToastType;
  /** Auto-dismiss delay in ms, counted from when the toast opens. `0` disables the timer. */
  duration?: number;
  className?: string;
}

export const DEFAULT_TOAST_DURATION = 5000;

// One fully-spelled-out literal string per type — Tailwind's scanner can't see interpolated class names.
const TYPE_CLASSES: Record<ToastType, { container: string; indicator: string }> = {
  info: {
    container: "bg-[var(--component-notificationtoast-informative-background,#E6EDFE)]",
    indicator:
      "bg-[var(--component-notificationtoast-informative-iconbackground,#4067E5)] text-[color:var(--component-notificationtoast-informative-statusicon,#FFFFFF)]",
  },
  warning: {
    container: "bg-[var(--component-notificationtoast-warning-background,#FFECBC)]",
    indicator:
      "bg-[var(--component-notificationtoast-warning-iconbackground,#FECB34)] text-[color:var(--component-notificationtoast-warning-statusicon,#3D3D42)]",
  },
  error: {
    container: "bg-[var(--component-notificationtoast-error-background,#FFE5E5)]",
    indicator:
      "bg-[var(--component-notificationtoast-error-iconbackground,#D63C42)] text-[color:var(--component-notificationtoast-error-statusicon,#FFFFFF)]",
  },
  success: {
    container: "bg-[var(--component-notificationtoast-success-background,#DFF3DF)]",
    indicator:
      "bg-[var(--component-notificationtoast-success-iconbackground,#00B050)] text-[color:var(--component-notificationtoast-success-statusicon,#FFFFFF)]",
  },
};

const STATUS_ICONS: Record<ToastType, ReactNode> = {
  info: <InfoOutlineIcon />,
  warning: <WarningOutlineIcon />,
  error: <FailureOutlineIcon />,
  success: <SuccessOutlineIcon />,
};

export default function Toast({
  open,
  onClose,
  children,
  type = "info",
  duration = DEFAULT_TOAST_DURATION,
  className,
}: ToastProps) {
  const [hasOpenedOnce, setHasOpenedOnce] = useState(open);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (open) setHasOpenedOnce(true);
  }, [open]);

  // Auto-dismiss: starts when the toast opens, cleared on close/unmount.
  useEffect(() => {
    if (!open || duration <= 0) return;
    const id = window.setTimeout(() => onCloseRef.current(), duration);
    return () => window.clearTimeout(id);
  }, [open, duration]);

  // Never opened: render nothing rather than a hidden fixed element (same as Drawer/Modal).
  if (!hasOpenedOnce) return null;

  const classes = TYPE_CLASSES[type];
  return (
    <div
      role={type === "error" || type === "warning" ? "alert" : "status"}
      aria-hidden={open ? undefined : true}
      className={`fixed bottom-[var(--global-spacing-s24,24px)] right-[var(--global-spacing-s24,24px)] z-[1100] flex max-w-[400px] min-w-[200px] items-start shadow-[var(--component-notificationtoast-elevation-s,0px_2px_8px_0px_rgba(58,59,63,0.18))] transition-[transform,opacity,visibility] ${classes.container} ${open ? "visible translate-x-0 opacity-100 duration-300 ease-out" : "pointer-events-none invisible translate-x-6 opacity-0 duration-[250ms] ease-in"} ${className ?? ""}`}
    >
      <div className={`flex shrink-0 items-start justify-center self-stretch p-[var(--global-spacing-s12,12px)] ${classes.indicator}`} aria-hidden="true">
        {STATUS_ICONS[type]}
      </div>
      <div className="flex min-w-px flex-1 items-start gap-[var(--global-spacing-s12,12px)] px-[var(--global-spacing-s12,12px)] py-[var(--global-spacing-s16,16px)]">
        <p className="type-label-semibold-s m-0 min-w-[100px] max-w-[300px] flex-1 break-words text-[color:var(--component-notificationtoast-text,#343438)]">
          {children}
        </p>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          tabIndex={open ? 0 : -1}
          className="flex shrink-0 cursor-pointer items-center justify-center border-none bg-transparent p-0 text-[color:var(--component-notificationtoast-icon,#3D3D42)]"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}
