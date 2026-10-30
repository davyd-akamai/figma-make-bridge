// Figma: Numeric spinner, node 158:8448 — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=158-8448
// Figma demos Label=No label/Top label/Left label x State=Default/Hover/Focus/Selected/Disabled/
// Read only/Error. Like TextField, most of it collapses onto CSS: Hover is `:hover`, Focus is
// `focus-within:`, Default vs Selected (filled) is the browser's own placeholder-vs-value rendering.
// Behavior (min/max/step, Arrow/Home/End keys, hold-to-repeat chevrons, input sanitizing) is ported
// from CDS's `cds-numeric-spinner` (Lit); Figma only shows static swatches. The chevrons reuse
// `ChevronUpIcon`/`ChevronDownIcon` at 12px (same glyph as Figma's 12px assets, scaled 0.75).

import { useEffect, useId, useRef, useState, type ChangeEvent, type InputHTMLAttributes, type KeyboardEvent } from "react";
import { ChevronDownIcon, ChevronUpIcon, InfoIcon } from "./icons";
import Tooltip from "./Tooltip";

export type NumericSpinnerLabelPosition = "top" | "left";

export interface NumericSpinnerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "min" | "max" | "step" | "type"> {
  /** Field label text. Omit to render no label (Figma's "Label=No label"). */
  label?: string;
  /** Placement of `label` relative to the field. Ignored when `label` is omitted. */
  labelPosition?: NumericSpinnerLabelPosition;
  /** Current number; `null` is an empty field. Omit for uncontrolled. */
  value?: number | null;
  defaultValue?: number | null;
  /** Fires with the new number, or `null` when the field is emptied/unparseable. */
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  /** Amount added/removed by the chevrons and Arrow keys. Must be > 0, default 1. */
  step?: number;
  /** Supplementary guidance below the field. Hidden while `errorText` is shown. */
  helperText?: string;
  /** Error message shown below the field; also switches the field into its error/red-border state. */
  errorText?: string;
  /** Shows a small info icon right after the label text (Figma's `Label info icon`). Ignored without `label`. */
  labelInfoIcon?: boolean;
  /** Tooltip content for `labelInfoIcon`. */
  infoText?: string;
  className?: string;
}

// Hover/focus are mutually exclusive with focus winning — see TextField's BOX_INTERACTIVE note.
const BOX_INTERACTIVE =
  "border-[var(--component-numericspinner-default-border,#83838C)] [&:hover:not(:focus-within)]:border-[var(--component-numericspinner-hover-border,#3D3D42)] focus-within:border-[var(--component-numericspinner-focus-border,#0174BC)]";

const BOX_ERROR = "border-[var(--component-numericspinner-error-border,#D63C42)]";

const BOX_DISABLED =
  "cursor-not-allowed border-[var(--component-numericspinner-disabled-border,#C2C2CA)] bg-[var(--component-numericspinner-disabled-background,#EDEDF2)]";

const REPEAT_DELAY_MS = 500;
const REPEAT_INTERVAL_MS = 100;

function decimalsOf(n: number): number {
  const s = String(n);
  return s.includes("e") ? 0 : (s.split(".")[1]?.length ?? 0);
}

// Keep only digits, one leading minus and one dot ("." / "-." get a leading 0), as CDS does.
function sanitize(raw: string): string {
  let out = raw.replace(/[^0-9.-]/g, "");
  const negative = out.startsWith("-");
  out = out.replace(/-/g, "");
  const dot = out.indexOf(".");
  if (dot >= 0) out = out.slice(0, dot + 1) + out.slice(dot + 1).replace(/\./g, "");
  if (out.startsWith(".")) out = `0${out}`;
  return negative ? `-${out}` : out;
}

function parse(raw: string): number | null {
  if (raw === "") return null;
  const n = Number(raw);
  return Number.isNaN(n) ? null : n;
}

export default function NumericSpinner({
  label,
  labelPosition = "top",
  value,
  defaultValue = null,
  onChange,
  min,
  max,
  step = 1,
  placeholder = "0",
  helperText,
  errorText,
  labelInfoIcon = false,
  infoText,
  disabled = false,
  readOnly = false,
  id,
  className,
  ...rest
}: NumericSpinnerProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const stepSize = step > 0 ? step : 1;
  const [internalValue, setInternalValue] = useState<number | null>(defaultValue);
  const [raw, setRaw] = useState<string | null>(null);
  const currentValue = value !== undefined ? value : internalValue;
  const error = Boolean(errorText);

  const decimals = Math.max(decimalsOf(stepSize), currentValue == null ? 0 : decimalsOf(currentValue));
  const formatted = currentValue == null || !Number.isFinite(currentValue) ? "" : currentValue.toFixed(decimals);
  // While typing, show the raw text ("1." or "-" must survive) as long as it still describes the value.
  const display = raw !== null && parse(raw) === currentValue ? raw : formatted;

  function commit(next: number | null) {
    setInternalValue(next);
    onChange?.(next);
  }

  function clamp(n: number): number {
    if (min != null) n = Math.max(min, n);
    if (max != null) n = Math.min(max, n);
    return n;
  }

  // Mirrors CDS's _increment/_decrement: an empty field starts at 0 (clamped); an out-of-range value
  // snaps to the nearest bound first; a step that would leave the range is ignored.
  function stepBy(direction: 1 | -1) {
    if (disabled || readOnly) return;
    const round = (n: number) => Number(n.toFixed(Math.max(decimalsOf(stepSize), currentValue == null ? 0 : decimalsOf(currentValue))));
    let next: number | null = currentValue;
    if (currentValue == null) {
      next = clamp(0);
    } else if (direction === 1 && min != null && min > currentValue) {
      next = min;
    } else if (direction === -1 && max != null && max < currentValue) {
      next = max;
    } else {
      const candidate = round(currentValue + direction * stepSize);
      if ((direction === 1 ? max == null || candidate <= max : min == null || candidate >= min)) next = candidate;
    }
    if (next !== currentValue) {
      setRaw(null);
      commit(next);
    }
  }

  // Hold-to-repeat reads the latest `stepBy` so the value keeps advancing across re-renders.
  const stepByRef = useRef(stepBy);
  stepByRef.current = stepBy;
  const repeatTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repeatInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  function stopRepeating() {
    if (repeatTimer.current != null) clearTimeout(repeatTimer.current);
    if (repeatInterval.current != null) clearInterval(repeatInterval.current);
    repeatTimer.current = null;
    repeatInterval.current = null;
  }

  function startRepeating(direction: 1 | -1) {
    if (disabled || readOnly) return;
    stepByRef.current(direction);
    repeatTimer.current = setTimeout(() => {
      repeatInterval.current = setInterval(() => stepByRef.current(direction), REPEAT_INTERVAL_MS);
    }, REPEAT_DELAY_MS);
  }

  useEffect(() => stopRepeating, []);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const sanitized = sanitize(event.target.value);
    setRaw(sanitized);
    commit(parse(sanitized));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      stepBy(event.key === "ArrowUp" ? 1 : -1);
    } else if (event.key === "Home" && min != null) {
      event.preventDefault();
      setRaw(null);
      commit(min);
    } else if (event.key === "End" && max != null) {
      event.preventDefault();
      setRaw(null);
      commit(max);
    }
  }

  const labelContent = label && (
    <>
      {label}
      {labelInfoIcon && (
        <Tooltip content={infoText}>
          {/* A focusable span, not a button: this sits inside the <label>, where a button would steal the label's click. */}
          <span
            tabIndex={0}
            role="img"
            aria-label={infoText ?? "More information"}
            className="inline-flex cursor-default text-[color:var(--component-numericspinner-labelinfoicon,#696970)]"
          >
            <InfoIcon size={16} />
          </span>
        </Tooltip>
      )}
    </>
  );
  const labelClasses = `type-label-bold-s shrink-0 text-[color:var(--component-numericspinner-label,#343438)] ${
    labelPosition === "left" ? "flex h-[34px] items-center gap-[var(--global-spacing-s4,4px)]" : "flex items-center gap-[var(--global-spacing-s4,4px)] pb-[var(--global-spacing-s8,8px)]"
  }`;
  const rowClasses = `flex w-full items-start ${labelPosition === "left" ? "gap-[var(--global-spacing-s12,12px)]" : "flex-col"} ${className ?? ""}`;

  if (readOnly) {
    return (
      <div className={rowClasses}>
        {label && <span className={labelClasses}>{labelContent}</span>}
        <div className="flex h-[34px] w-full items-center">
          <span
            className="type-label-regular-s min-w-0 flex-1 truncate pl-[var(--global-spacing-s12,12px)] pr-[var(--global-spacing-s8,8px)] text-[color:var(--component-numericspinner-readonly-text,#343438)]"
            aria-label={label}
          >
            {formatted}
          </span>
        </div>
      </div>
    );
  }

  const messageId = `${inputId}-message`;
  const describedBy = error || helperText ? messageId : undefined;
  const chevronClasses = `flex h-[12px] w-[12px] items-center justify-center ${
    disabled ? "cursor-not-allowed" : "cursor-pointer"
  } ${
    disabled ? "text-[color:var(--component-numericspinner-disabled-icon,#A3A3AB)]" : "text-[color:var(--component-numericspinner-default-icon,#3D3D42)]"
  }`;

  return (
    <div className={rowClasses}>
      {label && (
        <label htmlFor={inputId} className={labelClasses}>
          {labelContent}
        </label>
      )}
      <div className={labelPosition === "left" ? "min-w-0 flex-1" : "w-full"}>
        <div
          className={`box-border flex h-[34px] w-full min-w-0 items-center gap-[var(--global-spacing-s8,8px)] border border-solid bg-[var(--component-numericspinner-default-background,#FFFFFF)] pl-[var(--global-spacing-s12,12px)] pr-[var(--global-spacing-s8,8px)] ${
            disabled ? BOX_DISABLED : error ? BOX_ERROR : BOX_INTERACTIVE
          }`}
        >
          <input
            id={inputId}
            type="text"
            inputMode="decimal"
            role="spinbutton"
            value={display}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={() => setRaw(null)}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={describedBy}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={currentValue ?? undefined}
            className="type-label-regular-s h-[16px] min-w-0 flex-1 border-none bg-transparent p-0 text-[color:var(--component-numericspinner-filled-text,#343438)] outline-none placeholder:italic placeholder:text-[color:var(--component-numericspinner-default-text,#696970)] disabled:cursor-not-allowed disabled:text-[color:var(--component-numericspinner-disabled-text,#A3A3AB)] disabled:placeholder:text-[color:var(--component-numericspinner-disabled-text,#A3A3AB)]"
            {...rest}
          />
          {/* The chevrons are a pointer affordance only; the keyboard uses Arrow Up/Down on the input. */}
          <span
            className="flex shrink-0 flex-col"
            aria-hidden="true"
          >
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled}
              onPointerDown={(e) => {
                e.preventDefault();
                startRepeating(1);
              }}
              onPointerUp={stopRepeating}
              onPointerLeave={stopRepeating}
              onPointerCancel={stopRepeating}
              className={chevronClasses}
            >
              <ChevronUpIcon size={12} />
            </button>
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled}
              onPointerDown={(e) => {
                e.preventDefault();
                startRepeating(-1);
              }}
              onPointerUp={stopRepeating}
              onPointerLeave={stopRepeating}
              onPointerCancel={stopRepeating}
              className={chevronClasses}
            >
              <ChevronDownIcon size={12} />
            </button>
          </span>
        </div>
        {error && errorText && (
          <p id={messageId} className="type-label-semibold-xs w-full pt-[var(--global-spacing-s4,4px)] text-[color:var(--component-numericspinner-error-hinttext,#B82329)]">
            {errorText}
          </p>
        )}
        {!error && helperText && (
          <p id={messageId} className="type-label-semibold-xs w-full pt-[var(--global-spacing-s4,4px)] text-[color:var(--component-numericspinner-default-hinttext,#696970)]">
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
}
