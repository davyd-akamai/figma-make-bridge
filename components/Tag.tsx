// Figma: Tag item, node 140:6272 — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=140-6272
// (the per-tag breakdown shown next to "Tag input", node 140:8688; TagInput instantiates it for every chip).
// Figma's State axis (Default/Hover/Focus/Disabled/Error/Read only/Show more) collapses onto CSS + props:
// Hover is a plain `:hover` (border only — background/text are identical to Default), Focus is
// `:focus-visible` on the tag itself (a tag is a focusable chip so TagInput can arrow between them),
// Error is `invalid`, Disabled/Read only are real props, Show more is `more` (the "+N" chip, no cross).
// Figma's `showCross` boolean is `removable` (default true) and `showIcon` is the `icon` slot (Figma
// demos it with a 12px lock; plain ReactNode here, same "no forced default" treatment as Drawer's `icon`).
// Read-only has no fill in Figma (border only), so `--component-tag-readonly-background` goes unused.
// The remove button is a sibling of the label inside the chip, never nested in another interactive element.
// Pill radius is round-by-definition (12px on a 24px chip), the same exception Switch tracks make to the square-corners rule.

import { forwardRef, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { Close12Icon } from "./icons";

export interface TagProps {
  /** Chip text. For `more`, the overflow count text, e.g. "+7". */
  label: ReactNode;
  /** Optional 12px leading icon (Figma's `showIcon`, a lock). Not shown for `more`. */
  icon?: ReactNode;
  /** Shows the × remove button (Figma's `showCross`). Default true; ignored for `disabled`/`readOnly`/`more`. */
  removable?: boolean;
  /** Fires when × is clicked, or Backspace/Delete is pressed on the focused tag. The tag never removes itself. */
  onRemove?: () => void;
  /** Red error styling (Figma's State=Error) for a tag whose value failed validation. */
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /** The "+N" overflow chip (Figma's State=Show more): default look, no × and no icon. */
  more?: boolean;
  /** Makes the chip a button (meant for `more`). */
  onClick?: () => void;
  /** Accessible name for the remove button. Defaults to "Remove <label>" when `label` is a string. */
  removeLabel?: string;
  id?: string;
  className?: string;
  tabIndex?: number;
  "data-tag-index"?: number;
}

const BASE =
  "type-label-semibold-xs box-border inline-flex h-[24px] max-w-full shrink-0 items-center gap-[var(--global-spacing-s4,4px)] whitespace-nowrap rounded-[12px] border border-solid px-[var(--global-spacing-s8,8px)] py-px outline-none";

// One fully-spelled-out literal per state (Tailwind's scanner can't see interpolated var names).
const STATE_CLASSES = {
  default:
    "border-[var(--component-tag-default-border,#83838C)] bg-[var(--component-tag-default-background,#F7F7FA)] text-[color:var(--component-tag-default-text,#343438)] [&:hover:not(:focus-visible)]:border-[var(--component-tag-hover-border,#3D3D42)] focus-visible:border-[var(--component-tag-focus-border,#0174BC)] focus-visible:bg-[var(--component-tag-focus-background,#EDF8FF)]",
  invalid:
    "border-[var(--component-tag-error-border,#D63C42)] bg-[var(--component-tag-error-background,#FFE5E5)] text-[color:var(--component-tag-error-text,#343438)] focus-visible:border-[var(--component-tag-focus-border,#0174BC)]",
  disabled:
    "cursor-not-allowed border-[var(--component-tag-disabled-border,#C2C2CA)] bg-[var(--component-tag-disabled-background,#EDEDF2)] text-[color:var(--component-tag-disabled-text,#A3A3AB)]",
  readOnly:
    "border-[var(--component-tag-readonly-border,#C2C2CA)] text-[color:var(--component-tag-readonly-text,#343438)]",
} as const;

const ICON_CLASSES = {
  default:
    "text-[color:var(--component-tag-default-icon-default,#3D3D42)] hover:text-[color:var(--component-tag-default-icon-hover,#009CDE)] active:text-[color:var(--component-tag-default-icon-active,#0174BC)]",
  invalid:
    "text-[color:var(--component-tag-error-icon-default,#3D3D42)] hover:text-[color:var(--component-tag-error-icon-hover,#009CDE)] active:text-[color:var(--component-tag-error-icon-active,#0174BC)]",
} as const;

const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  {
    label,
    icon,
    removable = true,
    onRemove,
    invalid = false,
    disabled = false,
    readOnly = false,
    more = false,
    onClick,
    removeLabel,
    id,
    className,
    tabIndex,
    "data-tag-index": dataTagIndex,
  },
  ref,
) {
  const interactive = !disabled && !readOnly && !more;
  const showRemove = interactive && removable;
  const state = disabled ? "disabled" : readOnly ? "readOnly" : invalid && !more ? "invalid" : "default";
  const clickable = Boolean(onClick) && !disabled;

  function handleKeyDown(e: KeyboardEvent<HTMLSpanElement>) {
    if (e.target !== e.currentTarget) return;
    if (showRemove && (e.key === "Backspace" || e.key === "Delete")) {
      e.preventDefault();
      onRemove?.();
    } else if (clickable && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick?.();
    }
  }

  function handleRemove(e: MouseEvent) {
    e.stopPropagation();
    onRemove?.();
  }

  return (
    <span
      ref={ref}
      id={id}
      role={clickable ? "button" : undefined}
      tabIndex={tabIndex ?? (showRemove || clickable ? 0 : undefined)}
      aria-disabled={disabled || undefined}
      aria-invalid={invalid || undefined}
      data-tag-index={dataTagIndex}
      onKeyDown={handleKeyDown}
      onClick={clickable ? onClick : undefined}
      className={`${BASE} ${STATE_CLASSES[state]} ${clickable ? "cursor-pointer" : ""} ${className ?? ""}`}
    >
      {icon && !more && <span className="inline-flex size-3 shrink-0 items-center justify-center">{icon}</span>}
      <span className="min-w-0 truncate">{label}</span>
      {showRemove && (
        <button
          type="button"
          tabIndex={-1}
          onClick={handleRemove}
          onMouseDown={(e) => e.preventDefault()}
          aria-label={removeLabel ?? (typeof label === "string" ? `Remove ${label}` : "Remove")}
          className={`inline-flex size-3 shrink-0 cursor-pointer items-center justify-center ${ICON_CLASSES[state === "invalid" ? "invalid" : "default"]}`}
        >
          <Close12Icon />
        </button>
      )}
    </span>
  );
});

export default Tag;
