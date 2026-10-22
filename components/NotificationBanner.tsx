// Figma: Notification banner, node 123:5210 — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=123-5210
// Variant set: Type=Info/Warning/Success/Error/Secondary, with optional action button and dismiss (×).
// Width: fills its parent, clamped to 240px min / 1000px max (design-owner constraint, not in Figma).
// Status icon color comes from the mode-aware `statusicon` tokens (alias.content.icon.*) via currentColor;
// only the warning icon's "!" is a fixed dark.
// Figma draws a 1px border on all sides (CDS's 4px left accent bar was not ported). Dismissal is
// fully controlled: the banner never hides itself, the consumer reacts to `onDismiss` (no CDS
// auto-dismiss timer — Figma doesn't show one).

import type { ReactNode } from "react";
import { CloseIcon, FailureFilledIcon, InfoFilledIcon, SuccessFilledIcon, WarningFilledIcon } from "./icons";

export type NotificationBannerType = "info" | "warning" | "success" | "error" | "secondary";

export interface NotificationBannerProps {
  /** Message text. */
  children: ReactNode;
  /** Status type — picks the colors and the status icon. */
  type?: NotificationBannerType;
  /** Show the × button. Fires `onDismiss` on click; the consumer removes the banner. */
  dismissible?: boolean;
  onDismiss?: () => void;
  /** Optional action, right-aligned before the ×. Compose with `<Button variant="link">`. */
  action?: ReactNode;
  className?: string;
}

// One fully-spelled-out literal string per type — Tailwind's scanner can't see interpolated class names.
const TYPE_CLASSES: Record<NotificationBannerType, { container: string; icon: string }> = {
  info: {
    container:
      "bg-[var(--component-notificationbanner-informative-background,#E6EDFE)] border-[var(--component-notificationbanner-informative-border,#4067E5)]",
    icon: "text-[color:var(--component-notificationbanner-informative-statusicon,#4067E5)]",
  },
  warning: {
    container:
      "bg-[var(--component-notificationbanner-warning-background,#FFECBC)] border-[var(--component-notificationbanner-warning-border,#FECB34)]",
    icon: "text-[color:var(--component-notificationbanner-warning-statusicon,#FECB34)]",
  },
  success: {
    container:
      "bg-[var(--component-notificationbanner-success-background,#DFF3DF)] border-[var(--component-notificationbanner-success-border,#00B050)]",
    icon: "text-[color:var(--component-notificationbanner-success-statusicon,#00B050)]",
  },
  error: {
    container:
      "bg-[var(--component-notificationbanner-error-background,#FFE5E5)] border-[var(--component-notificationbanner-error-border,#D63C42)]",
    icon: "text-[color:var(--component-notificationbanner-error-statusicon,#D63C42)]",
  },
  secondary: {
    container:
      "bg-[var(--component-notificationbanner-secondary-background,#E5E5EA)] border-[var(--component-notificationbanner-secondary-border,#A3A3AB)]",
    icon: "text-[color:var(--component-notificationbanner-secondary-statusicon,#696970)]",
  },
};

const STATUS_ICONS: Record<NotificationBannerType, ReactNode> = {
  info: <InfoFilledIcon />,
  warning: <WarningFilledIcon />,
  success: <SuccessFilledIcon />,
  error: <FailureFilledIcon />,
  secondary: <InfoFilledIcon />,
};

export default function NotificationBanner({
  children,
  type = "info",
  dismissible = true,
  onDismiss,
  action,
  className,
}: NotificationBannerProps) {
  const classes = TYPE_CLASSES[type];
  return (
    <div
      role={type === "error" || type === "warning" ? "alert" : "status"}
      className={`flex w-full min-w-[240px] max-w-[1000px] items-stretch border border-solid pr-[var(--global-spacing-s12,12px)] ${classes.container} ${className ?? ""}`}
    >
      <div className={`flex shrink-0 items-start pl-[var(--global-spacing-s12,12px)] pt-[10px] ${classes.icon}`} aria-hidden="true">
        {STATUS_ICONS[type]}
      </div>
      <div className="flex min-w-px flex-1 items-center gap-[var(--global-spacing-s24,24px)]">
        <p className="type-label-semibold-s m-0 min-w-px flex-1 break-words py-[var(--global-spacing-s12,12px)] pl-[var(--global-spacing-s8,8px)] text-[color:var(--component-notificationbanner-text,#343438)]">
          {children}
        </p>
        {action && <div className="flex shrink-0 items-center">{action}</div>}
      </div>
      {dismissible && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className="flex shrink-0 cursor-pointer items-start border-none bg-transparent py-[var(--global-spacing-s12,12px)] pl-[var(--global-spacing-s12,12px)] pr-0 text-[color:var(--component-notificationbanner-icon,#3D3D42)]"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
}
