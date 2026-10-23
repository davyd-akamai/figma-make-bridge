// Figma: Switch, node 129:5474 — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=129-5474
// Internal breakdown (.base-switch track + knob, Size x Active x State) — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=129-5136
//
// Same skeleton as Checkbox/RadioButton: a native `<input type="checkbox" role="switch">` visually
// hidden (`sr-only`) inside a `<label>`, with the custom-drawn track as its sibling — real
// keyboard/click/form semantics for free. Unlike a checkbox, the track's children (knob, check) need
// to know `checked`, so the checked visual is driven from the `checked ?? internalChecked` value
// (same controlled/uncontrolled split as Checkbox); hover / focus-visible / press are plain
// `peer-*` pseudo-classes on the hidden input.
//
// State mapping: Figma's four states are Default/Hover/Selected/Disabled. "Selected" resolves
// through token keys named `focus` (`component/switch/*/focus/*`); like Checkbox/RadioButton, it is
// applied for both real `:active` (press) and `:focus-visible` (keyboard focus), as CDS's
// `switch.styles.ts` does. Note the focus background equals the default background in Figma
// (#0174BC on / #83838C off), so keyboard focus is not visually distinct — that is what the file
// specifies, no extra ring was invented.
//
// Geometry (all from .base-switch): Large = 48x24 track / 20px knob, Small = 40x20 / 16px knob,
// 2px inset, 8px gap to the label. The checkmark is the existing shared 12px `CheckIcon` (the glyph
// in Figma is the identical path), centered in the free space left of the knob (8px from the track
// edge on Large, 6px on Small). The knob's drop shadow is Figma's Shadow S on every non-disabled
// state; disabled knobs are 50% white with no shadow.
//
// No readOnly (Figma has no swatch; CDS's is just disabled visuals) and no label-position prop —
// the label is always to the right, as in every swatch.

import { useId, useState, type ChangeEvent, type InputHTMLAttributes } from "react";
import { CheckIcon } from "./icons";

export type SwitchSize = "small" | "large";

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "role" | "checked" | "defaultChecked" | "onChange" | "readOnly"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  /** Label text, shown to the right of the switch. Omit for a bare switch (needs an explicit `aria-label`). */
  label?: string;
  size?: SwitchSize;
  className?: string;
}

const TRACK_SIZE_CLASSES: Record<SwitchSize, string> = {
  large: "h-[24px] w-[48px]",
  small: "h-[20px] w-[40px]",
};

const KNOB_SIZE_CLASSES: Record<SwitchSize, { off: string; on: string }> = {
  large: { off: "size-[20px] translate-x-0", on: "size-[20px] translate-x-[24px]" },
  small: { off: "size-[16px] translate-x-0", on: "size-[16px] translate-x-[20px]" },
};

const CHECK_POSITION_CLASSES: Record<SwitchSize, string> = {
  large: "left-[8px]",
  small: "left-[6px]",
};

const LABEL_PADDING_CLASSES: Record<SwitchSize, string> = {
  large: "py-[var(--global-spacing-s4,4px)]",
  small: "py-[var(--global-spacing-s2,2px)]",
};

// One fully-spelled-out literal string per (checked, interactivity) combo — see Button's
// VARIANT_STATE_CLASSES for why these can't be interpolated.
const TRACK_INTERACTIVE_CLASSES = {
  off: "bg-[var(--component-switch-inactive-default-background,#83838C)] peer-hover:bg-[var(--component-switch-inactive-hover-background,#A3A3AB)] peer-focus-visible:bg-[var(--component-switch-inactive-focus-background,#83838C)] peer-active:bg-[var(--component-switch-inactive-focus-background,#83838C)]",
  on: "bg-[var(--component-switch-active-default-background,#0174BC)] peer-hover:bg-[var(--component-switch-active-hover-background,#009CDE)] peer-focus-visible:bg-[var(--component-switch-active-focus-background,#0174BC)] peer-active:bg-[var(--component-switch-active-focus-background,#0174BC)]",
};

const TRACK_DISABLED_CLASSES = {
  off: "bg-[var(--component-switch-inactive-disabled-background,#E5E5EA)]",
  on: "bg-[var(--component-switch-active-disabled-background,#AFDEF8)]",
};

const KNOB_INTERACTIVE_CLASSES = {
  off: "bg-[var(--component-switch-inactive-default-circle,#FFFFFF)] shadow-[var(--component-switch-elevation-s,0px_2px_8px_0px_rgba(58,59,63,0.18))]",
  on: "bg-[var(--component-switch-active-default-circle,#FFFFFF)] shadow-[var(--component-switch-elevation-s,0px_2px_8px_0px_rgba(58,59,63,0.18))]",
};

const KNOB_DISABLED_CLASSES = {
  off: "bg-[var(--component-switch-inactive-disabled-circle,rgba(255,255,255,0.5))]",
  on: "bg-[var(--component-switch-active-disabled-circle,rgba(255,255,255,0.5))]",
};

const CHECK_CLASSES = {
  interactive: "text-[color:var(--component-switch-active-default-icon,#FFFFFF)]",
  disabled: "text-[color:var(--component-switch-active-disabled-icon,#A3A3AB)]",
};

const TEXT_CLASSES = {
  off: "text-[color:var(--component-switch-inactive-default-text,#343438)]",
  on: "text-[color:var(--component-switch-active-default-text,#343438)]",
  offDisabled: "text-[color:var(--component-switch-inactive-disabled-text,#A3A3AB)]",
  onDisabled: "text-[color:var(--component-switch-active-disabled-text,#A3A3AB)]",
};

export default function Switch({
  checked,
  defaultChecked = false,
  onChange,
  label,
  size = "large",
  disabled = false,
  id,
  className,
  ...rest
}: SwitchProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = checked ?? internalChecked;
  const kind = isChecked ? "on" : "off";

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.checked;
    setInternalChecked(next);
    onChange?.(next);
  }

  const trackColor = disabled ? TRACK_DISABLED_CLASSES[kind] : TRACK_INTERACTIVE_CLASSES[kind];
  const knobColor = disabled ? KNOB_DISABLED_CLASSES[kind] : KNOB_INTERACTIVE_CLASSES[kind];
  const textColor = disabled ? (isChecked ? TEXT_CLASSES.onDisabled : TEXT_CLASSES.offDisabled) : TEXT_CLASSES[kind];

  return (
    <label
      htmlFor={inputId}
      className={`inline-flex items-start gap-[var(--global-spacing-s8,8px)] ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${className ?? ""}`}
    >
      <span className="relative inline-flex shrink-0 items-center">
        <input
          id={inputId}
          type="checkbox"
          role="switch"
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          className="peer sr-only"
          {...rest}
        />
        <span
          aria-hidden="true"
          className={`relative inline-block shrink-0 rounded-full transition-colors duration-150 ease-in-out ${TRACK_SIZE_CLASSES[size]} ${trackColor}`}
        >
          <CheckIcon
            size={12}
            className={`absolute top-1/2 -translate-y-1/2 transition-opacity duration-150 ease-in-out ${CHECK_POSITION_CLASSES[size]} ${isChecked ? "opacity-100" : "opacity-0"} ${disabled ? CHECK_CLASSES.disabled : CHECK_CLASSES.interactive}`}
          />
          <span
            className={`absolute left-[2px] top-[2px] rounded-full transition-[transform,background-color] duration-150 ease-in-out ${KNOB_SIZE_CLASSES[size][kind]} ${knobColor}`}
          />
        </span>
      </span>
      {label && (
        <span className={`type-label-regular-s ${LABEL_PADDING_CLASSES[size]} ${textColor}`}>{label}</span>
      )}
    </label>
  );
}
