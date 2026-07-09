// Figma: Radio-button, node 58:5044 — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=58-5044
// (local component published in "Internal ADS library" — the Code Connect mapping target)
// Internal breakdown (Small/Large dot states, node 58:4700 ".Radio") — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=58-4700
//
// The composed "RadioButton" component (with label) only exposes size="Large" — its own generated
// code hardcodes the value, no size prop. But the internal ".base-radio" primitive it's built from
// has fully-specified Small (16px) *and* Large (20px) swatches for every state, and CDS's own Lit
// `cds-radio-button` shares the same size-scaled token set — same evidence bar Checkbox's `size`
// prop was justified on, so it's included here too.
//
// Unlike Checkbox, the "dot" isn't a separate icon layered on top of the box — inspecting the raw
// exported SVGs (and confirming against CDS's `radio-button.styles.ts`) showed every swatch is a
// single circle: unselected is a 1px stroke at any size, selected is the *same* circle with its
// stroke fattened to size/4 (5px at 20px, 4px at 16px), fill staying white throughout. That's just
// a CSS `border` whose width changes with `:checked`, no inner element needed.
//
// Selected-state styling is driven entirely by the hidden input's real `:checked` pseudo-class
// (`peer-checked:`), not a JS-computed prop — this matters because a native `<input type="radio">`
// group (shared `name`) is mutually-exclusive purely via browser DOM state: clicking one radio
// unchecks its siblings without firing a React event on them. Deriving the visual from a JS prop
// per-instance (the way Checkbox's `indeterminate` does) would desync from the DOM the moment two
// uncontrolled RadioButtons share a `name`. Reading `:checked` directly sidesteps that entirely.
//
// State mapping: Figma's composed component names the third state "Focus", but (same quirk as
// Checkbox and Button) the underlying token/variable names are all "active" — there's no separate
// mouse-press-only state in the file, and CDS's Lit source resolves both real `:active` and
// `:focus-visible` through the same token, which `peer-focus-visible:` below follows.
//
// Read-only explicitly resolves to a *white* background (not transparent) in both
// `tokens/radioButton.json` and CDS's `radio-button.styles.ts` — different from Checkbox's
// read-only (which has no background token at all and renders transparent). Not a copy-paste of
// that precedent; each component's own token file/CDS reference wins.

import { type ChangeEvent, type InputHTMLAttributes, useId } from "react";
import { InfoIcon } from "./icons";

export type RadioButtonSize = "small" | "large";

export interface RadioButtonProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "checked" | "defaultChecked" | "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  /** Fires when this radio becomes selected (native radio `change` only fires on select, never on
   * deselect) — unlike Checkbox's `onChange`, this takes no argument since it's always `true`. */
  onChange?: () => void;
  /** Radio label text. Omit to render an unlabeled radio (needs an explicit `aria-label`). */
  label?: string;
  size?: RadioButtonSize;
  /** Shows the info icon next to the radio. Same Tooltip-basement treatment as Checkbox/TextField's
   * `infoIcon` — see those components' header comments. */
  infoIcon?: boolean;
  infoText?: string;
  onInfoIconClick?: () => void;
  className?: string;
}

const CIRCLE_SIZE_CLASSES: Record<RadioButtonSize, string> = {
  large: "size-[20px]",
  small: "size-[16px]",
};

// Border width toggles with `:checked` alone (independent of disabled/read-only, per CDS's
// `:host([checked])` rule) — kept as its own dictionary rather than folded into the color classes
// below since it varies by size, not by interactivity branch.
const SELECTED_BORDER_WIDTH_CLASSES: Record<RadioButtonSize, string> = {
  large: "peer-checked:border-[5px]",
  small: "peer-checked:border-[4px]",
};

// One fully-spelled-out literal string per interactivity branch rather than an interpolated
// template — Tailwind's JIT scanner only matches complete class strings in source, per the gotcha
// documented on Button's VARIANT_STATE_CLASSES. Each string covers both inactive and active (via
// `peer-checked:`) since the underlying token file gives every state its own inactive/active pair.
const CIRCLE_INTERACTIVE_CLASSES =
  "border-[var(--component-radiobutton-inactive-default-border,#83838C)] bg-[var(--component-radiobutton-inactive-default-background,#FFFFFF)] peer-checked:border-[var(--component-radiobutton-active-default-border,#0174BC)] peer-checked:bg-[var(--component-radiobutton-active-default-background,#FFFFFF)] peer-hover:border-[var(--component-radiobutton-inactive-hover-border,#009CDE)] peer-checked:peer-hover:border-[var(--component-radiobutton-active-hover-border,#009CDE)] peer-focus-visible:border-[var(--component-radiobutton-inactive-active-border,#0174BC)] peer-checked:peer-focus-visible:border-[var(--component-radiobutton-active-active-border,#0174BC)]";

const CIRCLE_DISABLED_CLASSES =
  "border-[var(--component-radiobutton-inactive-disabled-border,#C2C2CA)] bg-[var(--component-radiobutton-inactive-disabled-background,#E5E5EA)] peer-checked:border-[var(--component-radiobutton-active-disabled-border,#AFDEF8)] peer-checked:bg-[var(--component-radiobutton-active-disabled-background,#FFFFFF)]";

const CIRCLE_READONLY_CLASSES =
  "border-[var(--component-radiobutton-inactive-readonly-border,#C2C2CA)] bg-[var(--component-radiobutton-inactive-readonly-background,#FFFFFF)] peer-checked:border-[var(--component-radiobutton-active-readonly-border,#C2C2CA)] peer-checked:bg-[var(--component-radiobutton-active-readonly-background,#FFFFFF)]";

const TEXT_DEFAULT_CLASS = "text-[color:var(--component-radiobutton-inactive-default-text,#343438)]";
const TEXT_DISABLED_CLASS = "text-[color:var(--component-radiobutton-inactive-disabled-text,#A3A3AB)]";

export default function RadioButton({
  checked,
  defaultChecked = false,
  onChange,
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
}: RadioButtonProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const nonInteractive = disabled || readOnly;
  const checkedProps = checked !== undefined ? { checked } : { defaultChecked };

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.checked) {
      onChange?.();
    }
  }

  const circleClasses = readOnly ? CIRCLE_READONLY_CLASSES : disabled ? CIRCLE_DISABLED_CLASSES : CIRCLE_INTERACTIVE_CLASSES;
  const textClasses = disabled ? TEXT_DISABLED_CLASS : TEXT_DEFAULT_CLASS;

  return (
    <div className={`flex items-start gap-[var(--global-spacing-s4,4px)] ${className ?? ""}`}>
      <label
        htmlFor={inputId}
        className={`flex items-start gap-[var(--global-spacing-s8,8px)] ${nonInteractive ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className="relative inline-flex shrink-0 items-center">
          <input
            id={inputId}
            type="radio"
            onChange={handleChange}
            disabled={nonInteractive}
            aria-readonly={readOnly || undefined}
            className="peer sr-only"
            {...checkedProps}
            {...rest}
          />
          <span
            aria-hidden="true"
            className={`box-border shrink-0 rounded-full border border-solid ${CIRCLE_SIZE_CLASSES[size]} ${SELECTED_BORDER_WIDTH_CLASSES[size]} ${circleClasses}`}
          />
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
