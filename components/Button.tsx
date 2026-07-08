// Figma: core_button, node 44:2128 — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=44-2128
// Scoped to the 4 types with fully rendered swatches in that frame: Primary/Secondary/Link/Danger,
// each x Large/Small x Default/Hover/Active/Disabled/Loading. Figma's component description also
// lists Tertiary and Launch as types and CDS's ButtonVariant additionally has "icon" — none of those
// have rendered Figma swatches to verify against, so they're intentionally left out (see GUIDELINES.md).
// Figma's "Active" state maps to this file's "active" (CDS/tokens/button.json call it "pressed").

import { cloneElement, isValidElement, type ButtonHTMLAttributes, type ReactElement, type ReactNode } from "react";
import { SpinnerIcon } from "./icons";

export type ButtonVariant = "primary" | "secondary" | "link" | "danger";
export type ButtonSize = "large" | "small";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Loading/async state — keeps the button's size, hides its content, and overlays a spinner. */
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  children: ReactNode;
}

const BASE_CLASSES =
  "relative box-border inline-flex shrink-0 items-center justify-center gap-[var(--global-spacing-s4,4px)] whitespace-nowrap text-center transition-colors";

const SIZE_CLASSES: Record<ButtonSize, string> = {
  large: "h-[34px] px-[var(--global-spacing-s12,12px)] py-[var(--global-spacing-s8,8px)] type-label-semibold-s",
  small: "h-[26px] px-[var(--global-spacing-s8,8px)] py-[var(--global-spacing-s4,4px)] type-label-semibold-xs",
};

// Link has no fixed height/padding/border/background — text-only, matches CDS's `button.link`.
const LINK_SIZE_CLASSES: Record<ButtonSize, string> = {
  large: "h-auto p-0 type-label-semibold-s",
  small: "h-auto p-0 type-label-semibold-xs",
};

type VariantState = "default" | "loading" | "disabled";

// Fully literal class strings (no interpolated CSS var names) so Tailwind's static JIT scanner can
// find them — a template literal like `bg-[var(--component-button-${variant}-...)]` would silently
// produce no CSS.
const VARIANT_STATE_CLASSES: Record<ButtonVariant, Record<VariantState, string>> = {
  primary: {
    default:
      "cursor-pointer border border-solid bg-[var(--component-button-primary-default-background,#0174BC)] border-[var(--component-button-primary-default-border,#0174BC)] text-[color:var(--component-button-primary-default-text,#FFFFFF)] hover:bg-[var(--component-button-primary-hover-background,#009CDE)] hover:border-[var(--component-button-primary-hover-border,#009CDE)] hover:text-[color:var(--component-button-primary-hover-text,#FFFFFF)] active:bg-[var(--component-button-primary-active-background,#0174BC)] active:border-[var(--component-button-primary-active-border,#0174BC)] active:text-[color:var(--component-button-primary-active-text,#FFFFFF)]",
    loading:
      "cursor-not-allowed border border-solid text-transparent bg-[var(--component-button-primary-loading-background,#0174BC)] border-[var(--component-button-primary-loading-border,#0174BC)]",
    disabled:
      "cursor-not-allowed border border-solid bg-[var(--component-button-primary-disabled-background,#E5E5EA)] border-[var(--component-button-primary-disabled-border,#E5E5EA)] text-[color:var(--component-button-primary-disabled-text,#A3A3AB)]",
  },
  secondary: {
    default:
      "cursor-pointer border border-solid bg-[var(--component-button-secondary-default-background,#FFFFFF)] border-[var(--component-button-secondary-default-border,#0174BC)] text-[color:var(--component-button-secondary-default-text,#0174BC)] hover:bg-[var(--component-button-secondary-hover-background,#EDF8FF)] hover:border-[var(--component-button-secondary-hover-border,#009CDE)] hover:text-[color:var(--component-button-secondary-hover-text,#0174BC)] active:bg-[var(--component-button-secondary-active-background,#FFFFFF)] active:border-[var(--component-button-secondary-active-border,#0174BC)] active:text-[color:var(--component-button-secondary-active-text,#0174BC)]",
    loading:
      "cursor-not-allowed border border-solid text-transparent bg-[var(--component-button-secondary-loading-background,#FFFFFF)] border-[var(--component-button-secondary-loading-border,#0174BC)]",
    disabled:
      "cursor-not-allowed border border-solid bg-[var(--component-button-secondary-disabled-background,#FFFFFF)] border-[var(--component-button-secondary-disabled-border,#C2C2CA)] text-[color:var(--component-button-secondary-disabled-text,#A3A3AB)]",
  },
  link: {
    default:
      "cursor-pointer border-none bg-transparent text-[color:var(--component-button-link-default-text,#0174BC)] hover:text-[color:var(--component-button-link-hover-text,#009CDE)] active:text-[color:var(--component-button-link-active-text,#0174BC)]",
    loading: "cursor-not-allowed border-none bg-transparent text-transparent",
    disabled: "cursor-not-allowed border-none bg-transparent text-[color:var(--component-button-link-disabled-text,#A3A3AB)]",
  },
  danger: {
    default:
      "cursor-pointer border border-solid bg-[var(--component-button-danger-default-background,#B82329)] border-[var(--component-button-danger-default-border,#B82329)] text-[color:var(--component-button-danger-default-text,#FFFFFF)] hover:bg-[var(--component-button-danger-hover-background,#D63C42)] hover:border-[var(--component-button-danger-hover-border,#D63C42)] hover:text-[color:var(--component-button-danger-hover-text,#FFFFFF)] active:bg-[var(--component-button-danger-active-background,#B82329)] active:border-[var(--component-button-danger-active-border,#B82329)] active:text-[color:var(--component-button-danger-active-text,#FFFFFF)]",
    loading:
      "cursor-not-allowed border border-solid text-transparent bg-[var(--component-button-danger-loading-background,#B82329)] border-[var(--component-button-danger-loading-border,#B82329)]",
    disabled:
      "cursor-not-allowed border border-solid bg-[var(--component-button-danger-disabled-background,#F9C6C6)] border-[var(--component-button-danger-disabled-border,#F9C6C6)] text-[color:var(--component-button-danger-disabled-text,#A3A3AB)]",
  },
};

// Matches which buttons got which spinner treatment in Figma: solid-fill buttons (primary/danger)
// got the white spinner, outline/text buttons (secondary/link) got the green->blue gradient one.
const SPINNER_VARIANT: Record<ButtonVariant, "white" | "gradient"> = {
  primary: "white",
  danger: "white",
  secondary: "gradient",
  link: "gradient",
};

function sizedIcon(icon: ReactNode, size: number): ReactNode {
  if (isValidElement<{ size?: number }>(icon)) {
    return cloneElement(icon as ReactElement<{ size?: number }>, { size: icon.props.size ?? size });
  }
  return icon;
}

export default function Button({
  variant = "primary",
  size = "large",
  loading = false,
  disabled = false,
  startIcon,
  endIcon,
  children,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  const state: VariantState = disabled ? "disabled" : loading ? "loading" : "default";
  const sizeClasses = variant === "link" ? LINK_SIZE_CLASSES[size] : SIZE_CLASSES[size];
  const iconSize = size === "small" ? 12 : 16;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${BASE_CLASSES} ${sizeClasses} ${VARIANT_STATE_CLASSES[variant][state]} ${className ?? ""}`}
      {...rest}
    >
      {startIcon && (
        <span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center">
          {sizedIcon(startIcon, iconSize)}
        </span>
      )}
      <span>{children}</span>
      {endIcon && (
        <span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center">
          {sizedIcon(endIcon, iconSize)}
        </span>
      )}
      {loading && (
        <span aria-hidden="true" className="absolute inset-0 m-auto flex items-center justify-center">
          <SpinnerIcon variant={SPINNER_VARIANT[variant]} size={iconSize} />
        </span>
      )}
    </button>
  );
}
