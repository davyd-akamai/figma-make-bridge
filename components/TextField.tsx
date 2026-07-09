// Figma: core_text-field, node 47:7385 — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=47-7385
// Figma demos an 8-state x 3-label-position matrix (Default/Placeholder/Hover/Focus/Filled/
// Disabled/Error/Read only x None/Top/Left), but most of it collapses onto native browser/CSS
// behavior instead of JS-tracked state: Hover is a plain `:hover`, Focus is `focus-within:` on the
// wrapper, and Placeholder/Filled are just the browser's own placeholder-vs-value rendering. Only
// `value` needs real React state (controlled/uncontrolled, same split as SideNavigation's
// `selectedPageId`), to know whether to show the clear button.
// Info icon is a placeholder for a future Tooltip component (not built yet, see roadmap) — it
// renders the icon plus a native `title` (from `infoText`) and an `onInfoIconClick` callback for
// now, so a real tooltip trigger can be swapped in later without changing this prop surface.

import { useId, useState, type ChangeEvent, type InputHTMLAttributes } from "react";
import { CloseIcon, InfoIcon } from "./icons";

export type TextFieldLabelPosition = "top" | "left";

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange"> {
  /** Field label text. Omit to render no label (Figma's "Label position=None"). */
  label?: string;
  /** Placement of `label` relative to the field. Ignored when `label` is omitted. */
  labelPosition?: TextFieldLabelPosition;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Supplementary guidance below the field. Hidden while `errorText` is shown. */
  helperText?: string;
  /** Error message shown below the field; also switches the field into its error/red-border state. */
  errorText?: string;
  /** Shows the info icon next to the field. See the file header note on the Tooltip basement. */
  infoIcon?: boolean;
  infoText?: string;
  onInfoIconClick?: () => void;
  /** Hides the clear (×) button even when the field has a value. Default true (button shows). */
  clearable?: boolean;
  className?: string;
}

const FIELD_PADDING =
  "gap-[var(--global-spacing-s12,12px)] pl-[var(--global-spacing-s12,12px)] pr-[var(--global-spacing-s8,8px)] py-[var(--global-spacing-s8,8px)]";

// `hover:` and `focus-within:` are separate utilities with equal specificity, so whichever one
// Tailwind happens to emit later in the stylesheet wins when both apply at once (mouse resting on
// a focused field) — the compound `:hover:not(:focus-within)` selector below has higher specificity
// than `:focus-within` alone and simply doesn't match while focused, so focus always wins instead of
// depending on generation order.
const BOX_INTERACTIVE =
  "border-[var(--component-textfield-border-default,#83838C)] [&:hover:not(:focus-within)]:border-[var(--component-textfield-border-hover,#3D3D42)] focus-within:border-[var(--component-textfield-border-focus,#0174BC)]";

const BOX_ERROR = "border-[var(--component-textfield-border-error,#D63C42)]";

const BOX_DISABLED =
  "cursor-not-allowed border-[var(--component-textfield-border-disabled,#C2C2CA)] bg-[var(--component-textfield-background-disabled,#EDEDF2)]";

export default function TextField({
  label,
  labelPosition = "top",
  value,
  defaultValue = "",
  onChange,
  placeholder,
  helperText,
  errorText,
  infoIcon = false,
  infoText,
  onInfoIconClick,
  clearable = true,
  disabled = false,
  readOnly = false,
  id,
  className,
  type = "text",
  ...rest
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;
  const error = Boolean(errorText);
  const hasValue = currentValue.length > 0;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setInternalValue(event.target.value);
    onChange?.(event.target.value);
  }

  function handleClear() {
    setInternalValue("");
    onChange?.("");
  }

  // Figma keeps the info icon as a sibling *outside* the bordered field box (its own `shrink-0`
  // slot in the "Field & info icon" row, node 47:14252), not nested inside the box next to the
  // input/clear button — see node-id=47-14252 for the dedicated variants callout. Its own px-8
  // padding is the only spacing between it and the box; the row itself carries no extra gap.
  const infoIconButton = infoIcon && (
    <button
      type="button"
      onClick={onInfoIconClick}
      title={infoText}
      aria-label={infoText ?? "More information"}
      className="flex h-[34px] shrink-0 items-center justify-center px-[var(--global-spacing-s8,8px)] text-[color:var(--component-textfield-info-icon,#696970)]"
    >
      <InfoIcon size={20} />
    </button>
  );

  if (readOnly) {
    return (
      <div className={`flex w-full items-start ${labelPosition === "left" ? "gap-[var(--global-spacing-s12,12px)]" : "flex-col"} ${className ?? ""}`}>
        {label && (
          <span className={`type-label-bold-s shrink-0 text-[color:var(--component-textfield-label,#343438)] ${labelPosition === "left" ? "flex h-[34px] items-center" : "block pb-[var(--global-spacing-s8,8px)]"}`}>
            {label}
          </span>
        )}
        <div className="flex h-[34px] w-full items-center">
          <span className="type-label-regular-s min-w-0 flex-1 truncate text-[color:var(--component-textfield-text,#343438)]" aria-label={label}>
            {currentValue}
          </span>
          {infoIconButton}
        </div>
      </div>
    );
  }

  const errorId = error ? `${inputId}-message` : undefined;
  const helperId = !error && helperText ? `${inputId}-message` : undefined;

  return (
    <div className={`flex w-full items-start ${labelPosition === "left" ? "gap-[var(--global-spacing-s12,12px)]" : "flex-col"} ${className ?? ""}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`type-label-bold-s shrink-0 text-[color:var(--component-textfield-label,#343438)] ${labelPosition === "left" ? "flex h-[34px] items-center" : "block pb-[var(--global-spacing-s8,8px)]"}`}
        >
          {label}
        </label>
      )}
      <div className={labelPosition === "left" ? "min-w-0 flex-1" : "w-full"}>
        <div className="flex w-full items-start">
          <div
            className={`box-border flex h-[34px] min-w-0 flex-1 items-center border border-solid bg-[var(--component-textfield-background,#FFFFFF)] ${FIELD_PADDING} ${
              disabled ? BOX_DISABLED : error ? BOX_ERROR : BOX_INTERACTIVE
            }`}
          >
            <input
              id={inputId}
              type={type}
              value={currentValue}
              onChange={handleChange}
              placeholder={placeholder}
              disabled={disabled}
              aria-invalid={error || undefined}
              aria-describedby={errorId ?? helperId}
              className="type-label-regular-s h-[16px] min-w-0 flex-1 border-none bg-transparent p-0 text-[color:var(--component-textfield-text,#343438)] outline-none placeholder:italic placeholder:text-[color:var(--component-textfield-text-placeholder,#696970)] disabled:cursor-not-allowed disabled:text-[color:var(--component-textfield-text-disabled,#A3A3AB)]"
              {...rest}
            />
            {clearable && hasValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear field"
                className="flex shrink-0 items-center justify-center text-[color:var(--component-textfield-icon,#3D3D42)] hover:text-[color:var(--component-textfield-icon-hover,#009CDE)] active:text-[color:var(--component-textfield-icon-active,#0174BC)]"
              >
                <CloseIcon size={16} />
              </button>
            )}
          </div>
          {infoIconButton}
        </div>
        {error && errorText && (
          <p id={errorId} className="type-label-semibold-xs w-full pt-[var(--global-spacing-s4,4px)] pr-[var(--global-spacing-s24,24px)] text-[color:var(--component-textfield-hint-error,#B82329)]">
            {errorText}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="type-label-semibold-xs w-full pt-[var(--global-spacing-s4,4px)] pr-[var(--global-spacing-s24,24px)] text-[color:var(--component-textfield-hint,#696970)]">
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
}
