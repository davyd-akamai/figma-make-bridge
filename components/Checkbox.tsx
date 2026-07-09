// Figma: core_checkbox, node 58:4716 "Checkbox" — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=58-4716
// Internal breakdown (Small/Large box states, node 58:4359 ".base-checkbox") — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=58-4359
//
// The composed "Checkbox" component (with label) only exposes size="Large" — its own generated
// code hardcodes the value, no size prop. But the internal ".base-checkbox" primitive it's built
// from has fully-specified Small (16px) *and* Large (20px) swatches for every state, and CDS's own
// Lit `cds-checkbox` ships a real `size: 'small' | 'medium'` property backed by the same tokens —
// so Small is treated here as a real, supported variant, not an unused internal artifact.
//
// State mapping: Figma labels the 5 states Default/Hover/Focus/Disabled/Read-Only, but the
// underlying token/variable names for the third state are all "active" (e.g.
// component/checkbox/empty/active/border), not "focus" — the token bucket, not the state name, is
// what's inconsistent (mirrors Button's Figma-says-"Active" naming quirk, just flipped). CDS's own
// Lit implementation resolves this by using the same "active" tokens for both real `:active`
// (mouse press) and `:focus-visible` (keyboard focus ring) — `peer-focus-visible:` below follows
// that precedent, since there's no separate token for a true keyboard-only focus ring.
//
// Hover/focus-visible are plain CSS pseudo-classes via Tailwind's `peer-*` variants targeting the
// visually-hidden native input — no JS-tracked interaction state, same approach as TextField's
// hover/focus. Disabled and Read-Only both remove the input from the tab order (matches CDS's
// `?disabled=${this.disabled || this.readonly}`) since neither state is meant to be interactive;
// they render distinct (not just `:disabled`-styled) box classes because their token values differ
// structurally, not just by opacity.

import { useEffect, useId, useRef, useState, type ChangeEvent, type InputHTMLAttributes } from "react";
import { CheckIcon, InfoIcon, MinusIcon } from "./icons";

export type CheckboxSize = "small" | "large";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "checked" | "defaultChecked" | "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  /** Renders the dash icon regardless of `checked`. Purely visual — like the native DOM property,
   * it does not affect `checked`'s value and isn't cleared automatically on click. */
  indeterminate?: boolean;
  /** Checkbox label text. Omit to render an unlabeled checkbox (needs an explicit `aria-label`). */
  label?: string;
  size?: CheckboxSize;
  /** Shows the info icon next to the checkbox. Same Tooltip-basement treatment as TextField's
   * `infoIcon` — see that component's header comment. */
  infoIcon?: boolean;
  infoText?: string;
  onInfoIconClick?: () => void;
  className?: string;
}

const BOX_SIZE_CLASSES: Record<CheckboxSize, string> = {
  large: "size-[20px] p-[var(--global-spacing-s4,4px)]",
  small: "size-[16px] p-[var(--global-spacing-s2,2px)]",
};

// One fully-spelled-out literal string per (kind, interactivity) combo rather than an interpolated
// template — Tailwind's JIT scanner only matches complete class strings in source, per the gotcha
// documented on Button's VARIANT_STATE_CLASSES.
const BOX_INTERACTIVE_CLASSES = {
  empty:
    "border-[var(--component-checkbox-empty-default-border,#83838C)] bg-[var(--component-checkbox-empty-default-background,#FFFFFF)] peer-hover:border-[var(--component-checkbox-empty-hover-border,#009CDE)] peer-focus-visible:border-[var(--component-checkbox-empty-active-border,#0174BC)]",
  checked:
    "border-[var(--component-checkbox-checked-default-background,#0174BC)] bg-[var(--component-checkbox-checked-default-background,#0174BC)] peer-hover:border-[var(--component-checkbox-checked-hover-background,#009CDE)] peer-hover:bg-[var(--component-checkbox-checked-hover-background,#009CDE)] peer-focus-visible:border-[var(--component-checkbox-checked-active-background,#0174BC)] peer-focus-visible:bg-[var(--component-checkbox-checked-active-background,#0174BC)]",
  indeterminated:
    "border-[var(--component-checkbox-indeterminated-default-background,#0174BC)] bg-[var(--component-checkbox-indeterminated-default-background,#0174BC)] peer-hover:border-[var(--component-checkbox-indeterminated-hover-background,#009CDE)] peer-hover:bg-[var(--component-checkbox-indeterminated-hover-background,#009CDE)] peer-focus-visible:border-[var(--component-checkbox-indeterminated-active-background,#0174BC)] peer-focus-visible:bg-[var(--component-checkbox-indeterminated-active-background,#0174BC)]",
};

const BOX_DISABLED_CLASSES = {
  empty: "border-[var(--component-checkbox-empty-disabled-border,#C2C2CA)] bg-[var(--component-checkbox-empty-disabled-background,#E5E5EA)]",
  checked: "border-[var(--component-checkbox-checked-disabled-background,#AFDEF8)] bg-[var(--component-checkbox-checked-disabled-background,#AFDEF8)]",
  indeterminated: "border-[var(--component-checkbox-indeterminated-disabled-background,#AFDEF8)] bg-[var(--component-checkbox-indeterminated-disabled-background,#AFDEF8)]",
};

const BOX_READONLY_CLASSES = {
  empty: "border-[var(--component-checkbox-empty-readonly-border,#C2C2CA)] bg-transparent",
  checked: "border-[var(--component-checkbox-checked-readonly-border,#C2C2CA)] bg-transparent",
  indeterminated: "border-[var(--component-checkbox-indeterminated-readonly-border,#C2C2CA)] bg-transparent",
};

const ICON_INTERACTIVE_CLASSES = {
  checked: "text-[color:var(--component-checkbox-checked-default-icon,#FFFFFF)]",
  indeterminated: "text-[color:var(--component-checkbox-indeterminated-default-icon,#FFFFFF)]",
};

const ICON_DISABLED_CLASSES = {
  checked: "text-[color:var(--component-checkbox-checked-disabled-icon,#FFFFFF)]",
  indeterminated: "text-[color:var(--component-checkbox-indeterminated-disabled-icon,#FFFFFF)]",
};

const ICON_READONLY_CLASSES = {
  checked: "text-[color:var(--component-checkbox-checked-readonly-icon,#A3A3AB)]",
  indeterminated: "text-[color:var(--component-checkbox-indeterminated-readonly-icon,#A3A3AB)]",
};

const TEXT_DEFAULT_CLASSES = {
  empty: "text-[color:var(--component-checkbox-empty-default-text,#343438)]",
  checked: "text-[color:var(--component-checkbox-checked-default-text,#343438)]",
  indeterminated: "text-[color:var(--component-checkbox-indeterminated-default-text,#343438)]",
};

const TEXT_DISABLED_CLASSES = {
  empty: "text-[color:var(--component-checkbox-empty-disabled-text,#A3A3AB)]",
  checked: "text-[color:var(--component-checkbox-checked-disabled-text,#A3A3AB)]",
  indeterminated: "text-[color:var(--component-checkbox-indeterminated-disabled-text,#A3A3AB)]",
};

export default function Checkbox({
  checked,
  defaultChecked = false,
  onChange,
  indeterminate = false,
  label,
  size = "large",
  disabled = false,
  readOnly = false,
  infoIcon = false,
  infoText,
  onInfoIconClick,
  id,
  className,
  ...rest
}: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = checked ?? internalChecked;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.checked;
    setInternalChecked(next);
    onChange?.(next);
  }

  const kind: "empty" | "checked" | "indeterminated" = indeterminate ? "indeterminated" : isChecked ? "checked" : "empty";
  const nonInteractive = disabled || readOnly;

  const boxClasses = readOnly
    ? BOX_READONLY_CLASSES[kind]
    : disabled
      ? BOX_DISABLED_CLASSES[kind]
      : BOX_INTERACTIVE_CLASSES[kind];

  const iconClasses = kind !== "empty" ? (readOnly ? ICON_READONLY_CLASSES[kind] : disabled ? ICON_DISABLED_CLASSES[kind] : ICON_INTERACTIVE_CLASSES[kind]) : "";

  const textClasses = disabled ? TEXT_DISABLED_CLASSES[kind] : TEXT_DEFAULT_CLASSES[kind];

  return (
    <div className={`flex items-start gap-[var(--global-spacing-s4,4px)] ${className ?? ""}`}>
      <label
        htmlFor={inputId}
        className={`flex items-start gap-[var(--global-spacing-s8,8px)] ${nonInteractive ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className="relative inline-flex shrink-0 items-center">
          <input
            ref={inputRef}
            id={inputId}
            type="checkbox"
            checked={isChecked}
            onChange={handleChange}
            disabled={nonInteractive}
            aria-readonly={readOnly || undefined}
            className="peer sr-only"
            {...rest}
          />
          <span
            aria-hidden="true"
            className={`box-border flex shrink-0 items-center justify-center border border-solid ${BOX_SIZE_CLASSES[size]} ${boxClasses}`}
          >
            {kind === "checked" && <CheckIcon size={12} className={iconClasses} />}
            {kind === "indeterminated" && <MinusIcon size={12} className={iconClasses} />}
          </span>
        </span>
        {label && (
          <span className={`type-label-regular-s pt-[var(--global-spacing-s2,2px)] ${textClasses}`}>{label}</span>
        )}
      </label>
      {infoIcon && (
        <button
          type="button"
          onClick={onInfoIconClick}
          title={infoText}
          aria-label={infoText ?? "More information"}
          className="flex shrink-0 items-center justify-center text-[color:var(--component-textfield-info-icon,#696970)]"
        >
          <InfoIcon size={20} />
        </button>
      )}
    </div>
  );
}
