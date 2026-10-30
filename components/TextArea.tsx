// Figma: Text area, node 140:6170 — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=140-6170
// Figma demos an 8-state x 3-label-position matrix (Default/Placeholder/Hover/Focus/Filled/Disabled/
// Error/Read only x No label/Top label/Left label). Same collapse onto native behavior as TextField:
// Hover is `:hover`, Focus is `focus-within:`, Placeholder-vs-Filled is the browser's own placeholder
// rendering; only `value` is React state (controlled/uncontrolled), to know when to show the clear button.
// Resize: a native `resize: vertical` textarea with the browser's grabber hidden and Figma's exact
// handle vector (`ResizeIcon`) overlaid — same technique as CDS's `cds-text-area`. Default 3 rows = the
// 76px field in Figma. Info icons: `infoIcon` is the same placeholder for a future Tooltip that TextField
// has (sibling outside the box); `labelInfoIcon` is the Figma-only 16px icon right after the label text.

import { useEffect, useId, useRef, useState, type ChangeEvent, type TextareaHTMLAttributes } from "react";
import { CloseIcon, InfoIcon, ResizeIcon } from "./icons";
import Tooltip from "./Tooltip";

export type TextAreaLabelPosition = "top" | "left";

export interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "defaultValue" | "onChange"> {
  /** Field label text. Omit to render no label (Figma's "Label=No label"). */
  label?: string;
  /** Placement of `label` relative to the field. Ignored when `label` is omitted. */
  labelPosition?: TextAreaLabelPosition;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Supplementary guidance below the field. Hidden while `errorText` is shown. */
  helperText?: string;
  /** Error message shown below the field; also switches the field into its error/red-border state. */
  errorText?: string;
  /** Shows the info icon beside the field (outside the box). See the file header note on the Tooltip basement. */
  infoIcon?: boolean;
  /** Shows a small info icon right after the label text. Ignored when `label` is omitted. */
  labelInfoIcon?: boolean;
  infoText?: string;
  onInfoIconClick?: () => void;
  /** Hides the clear (×) button even when the field has a value. Default true (button shows). */
  clearable?: boolean;
  /** Visible lines of text, which sets the initial height (Figma's 76px field is 3). */
  rows?: number;
  className?: string;
}

// Hover/focus are mutually exclusive with focus winning — see TextField's BOX_INTERACTIVE note.
const BOX_INTERACTIVE =
  "border-[var(--component-textarea-default-border,#83838C)] [&:hover:not(:focus-within)]:border-[var(--component-textarea-hoverempty-border,#3D3D42)] focus-within:border-[var(--component-textarea-focus-border,#0174BC)]";

const BOX_ERROR = "border-[var(--component-textarea-error-border,#D63C42)]";

const BOX_DISABLED =
  "cursor-not-allowed border-[var(--component-textarea-disabled-border,#C2C2CA)] bg-[var(--component-textarea-disabled-background,#EDEDF2)]";

export default function TextArea({
  label,
  labelPosition = "top",
  value,
  defaultValue = "",
  onChange,
  placeholder,
  helperText,
  errorText,
  infoIcon = false,
  labelInfoIcon = false,
  infoText,
  onInfoIconClick,
  clearable = true,
  rows = 3,
  disabled = false,
  readOnly = false,
  id,
  className,
  ...rest
}: TextAreaProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;
  const error = Boolean(errorText);
  const hasValue = currentValue.length > 0;
  const ref = useRef<HTMLTextAreaElement>(null);
  const [scrollbarVisible, setScrollbarVisible] = useState(false);
  const left = labelPosition === "left";

  // The clear button shifts left while the textarea's vertical scrollbar is showing (CDS's
  // `scrollbar-spacing`), so it doesn't sit on top of the scrollbar.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setScrollbarVisible(el.scrollHeight > el.clientHeight);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [currentValue, rows, readOnly]);

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setInternalValue(event.target.value);
    onChange?.(event.target.value);
  }

  function handleClear() {
    setInternalValue("");
    onChange?.("");
    ref.current?.focus();
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
            className="inline-flex cursor-default text-[color:var(--component-textarea-default-infoicon,#696970)]"
          >
            <InfoIcon size={16} />
          </span>
        </Tooltip>
      )}
    </>
  );
  // Left: the label sits on the first text line (8px top inset); top: 8px below it. Read-only left has no inset.
  const labelClasses = `type-label-bold-s flex shrink-0 items-center gap-[var(--global-spacing-s4,4px)] text-[color:var(--component-textarea-label,#343438)] ${
    left ? (readOnly ? "" : "pt-[var(--global-spacing-s8,8px)]") : "pb-[var(--global-spacing-s8,8px)]"
  }`;

  const infoIconButton = infoIcon && (
    <Tooltip content={infoText} className="shrink-0 items-start">
      <button
        type="button"
        onClick={onInfoIconClick}
        aria-label={infoText ?? "More information"}
        className="flex shrink-0 cursor-pointer items-start pt-[var(--global-spacing-s4,4px)] text-[color:var(--component-textarea-default-infoicon,#696970)]"
      >
        <InfoIcon size={20} />
      </button>
    </Tooltip>
  );

  const messageId = `${fieldId}-message`;
  const message = error ? (
    <p id={messageId} className="type-label-semibold-xs w-full pt-[var(--global-spacing-s4,4px)] pr-[var(--global-spacing-s24,24px)] text-[color:var(--component-textarea-error-hinttext,#B82329)]">
      {errorText}
    </p>
  ) : helperText ? (
    <p id={messageId} className="type-label-semibold-xs w-full pt-[var(--global-spacing-s4,4px)] pr-[var(--global-spacing-s24,24px)] text-[color:var(--component-textarea-default-hinttext,#696970)]">
      {helperText}
    </p>
  ) : null;

  const wrapperClasses = `flex w-full items-start ${left ? "gap-[var(--global-spacing-s12,12px)]" : "flex-col"} ${className ?? ""}`;
  const fieldColumn = left ? "min-w-0 flex-1" : "w-full";

  // Read-only renders plain text, no box/textarea (Figma drops border and the left inset; CDS's
  // `readonly-container`). The label becomes a plain span since there's no control left to label.
  if (readOnly) {
    return (
      <div className={wrapperClasses}>
        {label && <span className={labelClasses}>{labelContent}</span>}
        <div className={fieldColumn}>
          <div className="flex w-full items-start gap-[var(--global-spacing-s8,8px)]">
            <span
              role="textbox"
              aria-readonly="true"
              aria-label={label}
              className={`type-body-regular min-w-0 flex-1 whitespace-pre-line break-words text-[color:var(--component-textarea-readonly-text,#343438)] ${
                left ? "pb-[var(--global-spacing-s8,8px)]" : label ? "pt-[var(--global-spacing-s4,4px)] pb-[var(--global-spacing-s8,8px)]" : "py-[var(--global-spacing-s8,8px)]"
              } pr-[var(--global-spacing-s8,8px)]`}
            >
              {currentValue}
            </span>
            {infoIconButton}
          </div>
          {message}
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={fieldId} className={labelClasses}>
          {labelContent}
        </label>
      )}
      <div className={fieldColumn}>
        <div className="flex w-full items-start gap-[var(--global-spacing-s8,8px)]">
          <div
            className={`relative box-border min-w-0 flex-1 border border-solid bg-[var(--component-textarea-default-background,#FFFFFF)] ${
              disabled ? BOX_DISABLED : error ? BOX_ERROR : BOX_INTERACTIVE
            }`}
          >
            <textarea
              ref={ref}
              id={fieldId}
              rows={rows}
              value={currentValue}
              onChange={handleChange}
              placeholder={placeholder}
              disabled={disabled}
              aria-invalid={error || undefined}
              aria-describedby={message ? messageId : undefined}
              className="type-body-regular block min-h-[36px] w-full resize-y appearance-none border-none bg-transparent py-[var(--global-spacing-s8,8px)] pl-[var(--global-spacing-s12,12px)] pr-[40px] text-[color:var(--component-textarea-filled-text,#343438)] outline-none [&::-webkit-resizer]:opacity-0 placeholder:italic placeholder:text-[color:var(--component-textarea-placeholder-text,#696970)] disabled:cursor-not-allowed disabled:text-[color:var(--component-textarea-disabled-text,#A3A3AB)] disabled:placeholder:text-[color:var(--component-textarea-disabled-text,#A3A3AB)]"
              {...rest}
            />
            {clearable && hasValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear field"
                className={`absolute top-[var(--global-spacing-s8,8px)] flex cursor-pointer items-center justify-center text-[color:var(--component-textarea-filled-icon-default,#3D3D42)] hover:text-[color:var(--component-textarea-filled-icon-hover,#009CDE)] active:text-[color:var(--component-textarea-filled-icon-active,#0174BC)] ${
                  scrollbarVisible ? "right-[16px]" : "right-[var(--global-spacing-s8,8px)]"
                }`}
              >
                <CloseIcon size={16} />
              </button>
            )}
            <span className="pointer-events-none absolute bottom-[2px] right-[2px] text-[color:var(--component-textarea-resizeicon,#696970)]" aria-hidden="true">
              <ResizeIcon />
            </span>
          </div>
          {infoIconButton}
        </div>
        {message}
      </div>
    </div>
  );
}
