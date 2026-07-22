// Figma: Select, node 47:7683 — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=47-7683
// (the composed component actually instantiated in this file's own "Select variants" interactions
// section, node 47:14330 — confirmed via `data-name`, which sits alongside a separate `core_select`
// instance there; this build follows `Select`, not `core_select`, same "check what's actually
// instantiated" rule this doc's Badge/Container entries already established).
// Figma demos an 8-state x 3-label-position matrix (Default/Hover/Selected/Focus/
// Disabled (placeholder)/Disabled (selected)/Read only/Error x Without label/Label left/Label top).
// Most of it collapses onto the same precedent TextField already set: Hover is a plain `:hover`,
// Disabled (placeholder) vs Disabled (selected) is just whether a value is set, and Selected is the
// same visual as Default plus solid (non-italic) text — none of that needs its own boolean. The one
// state that needs real React state is `open` (Figma's "Focus"), since it renders an actual dropdown
// of `options`, not a native <select>.
// Real usage examples (node 47:14330) all show `labelPosition="top"` — same call TextField made,
// "top" is the default here despite Figma's own generated-code default being "Without label".
// Chevron reuses the existing ChevronDownIcon/ChevronUpIcon (already in the shared pack, natively
// 16px) scaled to 20px rather than a new asset — download_assets on Select's own chevron confirmed
// the same path shape at a 1.25x scale, just re-exported with cubic-bezier control points instead of
// straight segments. Close (clear) and info icons reuse the existing CloseIcon/InfoIcon verbatim.
// Per user decision (2026-07-22): scoped to single-select with an optional per-option leading `icon`
// slot (covers Dropdown's "With icon"/"Checkbox with a flag" item types, minus the checkbox) — multi
// select checkboxes, categorized/two-level lists (Dropdown, node 77:4363, flagged in the kickoff as
// "could be used outside a select component") are out of scope for this build, same scoping
// precedent as Table (no pagination) / TabsHorizontal (no content panel).
//
// Typing/filtering added 2026-07-22 (per user follow-up): every Select is always type-to-filter, no
// opt-out prop — matching CDS's own `cds-select` behavior except CDS defaults `autocomplete` off;
// here it's unconditional. The field is a real `<input>` (not a `div[role=combobox]`, which the
// first draft used specifically to legally nest the clear button) — CDS's own `select.element.ts`
// solves the same nesting problem the same way TextField already does in this repo: the input, the
// clear button, and the chevron are flex siblings inside one bordered box, not nested inside each
// other, so `<label for>` also works normally again (no `aria-labelledby` workaround needed).
// The per-option `icon` slot can't render inside a plain `<input>`, so the closed/display state uses
// CDS's own overlay technique (`selectedItemTemplateFn`/`showSelectedOverlay` in `select.element.ts`):
// the real input value stays in the DOM (color: transparent) while a `pointer-events-none` absolute
// overlay span shows the icon + label on top — only while closed, since once typing starts the raw
// search text needs to be visible/editable, matching CDS exactly.
// "Create" (node 91:4126, `.dropdown-item` breakdown) and "Empty state" (node 91:4101) are the two
// Figma-evidenced outcomes when a search matches nothing — `creatable` (default false) picks between
// them. The plus-icon "New item" variant (node 91:4131) is explicitly named "[Don't use] New item
// (w/o search)" in Figma and is not implemented. `onCreateOption(query)` only fires a callback —
// Select does not mutate its own `options` list, matching this repo's consumer-composes-the-rest
// precedent (Table, TabsHorizontal). The empty-state icon is the existing `InfoIcon`, confirmed via
// this repo's own Code Connect mapping auto-substituting it into `get_design_context`'s output for
// node 91:4101 — no new asset needed.
// Popover positioning was extracted into `components/internal/Popover.tsx` (a portal + `position:
// fixed` popover, same technique Table's `RowActionMenu` already used) once TabsHorizontal's
// `OverflowMenu` and Table's `RowActionMenu` needed the exact same open/close/outside-click/Escape
// logic Select's own dropdown does — see that file's header comment.
// Cursor: the bordered box shows `cursor-pointer` while closed (signals "click to open", matching
// the ask that hovering the field itself should show a pointer) and switches to the input's native
// `cursor-text` once open (typing is genuinely text entry) — the clear/info/chevron buttons are
// always `cursor-pointer` regardless of open state.

import { useId, useLayoutEffect, useRef, useState, type ChangeEvent, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { ChevronDownIcon, ChevronUpIcon, CloseIcon, InfoIcon } from "./icons";
import Popover from "./internal/Popover";

export type SelectLabelPosition = "top" | "left";

export interface SelectOption {
  value: string;
  label: string;
  /** Optional leading visual (icon or flag) — matches Dropdown's "With icon"/flag item types. */
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  options?: SelectOption[];
  /** Controlled selected value. Pass `null` to represent no selection. */
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null, option: SelectOption | null) => void;
  placeholder?: string;
  /** Field label text. Omit to render no label (Figma's "Label position=Without label"). */
  label?: string;
  /** Placement of `label` relative to the field. Ignored when `label` is omitted. */
  labelPosition?: SelectLabelPosition;
  /** Supplementary guidance below the field. Hidden while `errorText` is shown. */
  helperText?: string;
  /** Error message shown below the field; also switches the field into its error/red-border state. */
  errorText?: string;
  /** Shows the info icon next to the field. Same "Tooltip basement" pattern as TextField/Checkbox. */
  infoIcon?: boolean;
  infoText?: string;
  onInfoIconClick?: () => void;
  /** Hides the clear (×) button even when a value is selected. Default true (button shows). */
  clearable?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /** Enables the `Create "<query>"` row (node 91:4126) when the typed text matches no option.
   * Default false — no matches then render `emptyMessage` instead (node 91:4101). */
  creatable?: boolean;
  /** Fires when the "Create" row is activated. Select never mutates its own `options` — the
   * consumer adds the new option (and selects it) on their end. */
  onCreateOption?: (query: string) => void;
  /** Shown when typed text matches no option and `creatable` is false. */
  emptyMessage?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
}

const DEFAULT_OPTIONS: SelectOption[] = [
  { value: "item-1", label: "Item 1" },
  { value: "item-2", label: "Item 2" },
  { value: "item-3", label: "Item 3" },
];

const FIELD_PADDING =
  "gap-[var(--global-spacing-s16,16px)] pl-[var(--global-spacing-s12,12px)] pr-[var(--global-spacing-s8,8px)] py-[var(--global-spacing-s6,6px)]";

const BOX_INTERACTIVE =
  "border-[var(--component-select-default-border,#83838C)] hover:border-[var(--component-select-hover-border,#3D3D42)]";

const BOX_ERROR = "border-[var(--component-select-error-border,#D63C42)]";

const BOX_DISABLED =
  "cursor-not-allowed border-[var(--component-select-disabled-border,#C2C2CA)] bg-[var(--component-select-disabled-background,#EDEDF2)]";

const BOX_OPEN = "border-[var(--component-select-focus-border,#0174BC)]";

function matches(option: SelectOption, query: string): boolean {
  return option.label.toLowerCase().includes(query.toLowerCase());
}

export default function Select({
  options = DEFAULT_OPTIONS,
  value,
  defaultValue = null,
  onChange,
  placeholder = "Select",
  label,
  labelPosition = "top",
  helperText,
  errorText,
  infoIcon = false,
  infoText,
  onInfoIconClick,
  clearable = true,
  disabled = false,
  readOnly = false,
  creatable = false,
  onCreateOption,
  emptyMessage = "No options available",
  id,
  className,
  "aria-label": ariaLabel,
}: SelectProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const listboxId = `${fieldId}-listbox`;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const currentValue = value !== undefined ? value : internalValue;
  const selectedOption = options.find((o) => o.value === currentValue) ?? null;
  const error = Boolean(errorText);
  const query = searchTerm.trim();

  const filteredOptions = query ? options.filter((o) => matches(o, query)) : options;
  const showCreateRow = open && creatable && query !== "" && filteredOptions.length === 0;
  const showEmptyRow = open && !creatable && query !== "" && filteredOptions.length === 0;

  useLayoutEffect(() => {
    if (open && highlightedIndex >= 0) {
      listRef.current?.querySelector(`[data-index="${highlightedIndex}"]`)?.scrollIntoView({ block: "nearest" });
    }
  }, [open, highlightedIndex]);

  function firstEnabledIndex(list: SelectOption[]): number {
    return list.findIndex((o) => !o.disabled);
  }

  function openDropdown() {
    if (disabled || readOnly) return;
    setSearchTerm("");
    const selectedIdx = options.findIndex((o) => o.value === currentValue);
    setHighlightedIndex(selectedIdx >= 0 ? selectedIdx : -1);
    setOpen(true);
  }

  function closeDropdown() {
    setOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
  }

  function selectOption(option: SelectOption) {
    if (option.disabled) return;
    if (value === undefined) setInternalValue(option.value);
    onChange?.(option.value, option);
    closeDropdown();
  }

  function handleCreate() {
    if (!query) return;
    onCreateOption?.(query);
    closeDropdown();
  }

  function handleClear(e: MouseEvent) {
    e.stopPropagation();
    if (value === undefined) setInternalValue(null);
    onChange?.(null, null);
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setSearchTerm(next);
    setOpen(true);
    const nextQuery = next.trim();
    const nextFiltered = nextQuery ? options.filter((o) => matches(o, nextQuery)) : options;
    setHighlightedIndex(firstEnabledIndex(nextFiltered));
  }

  function moveHighlight(delta: 1 | -1) {
    const list = filteredOptions;
    if (list.length === 0) return;
    let idx = highlightedIndex < 0 ? (delta > 0 ? -1 : 0) : highlightedIndex;
    for (let step = 0; step < list.length; step++) {
      idx = (idx + delta + list.length) % list.length;
      if (!list[idx].disabled) {
        setHighlightedIndex(idx);
        return;
      }
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (disabled || readOnly) return;
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
        e.preventDefault();
        openDropdown();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        moveHighlight(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        moveHighlight(-1);
        break;
      case "Home":
        e.preventDefault();
        setHighlightedIndex(firstEnabledIndex(filteredOptions));
        break;
      case "End":
        e.preventDefault();
        for (let i = filteredOptions.length - 1; i >= 0; i--) {
          if (!filteredOptions[i].disabled) {
            setHighlightedIndex(i);
            break;
          }
        }
        break;
      case "Enter":
        e.preventDefault();
        if (filteredOptions.length > 0) {
          if (highlightedIndex >= 0) selectOption(filteredOptions[highlightedIndex]);
        } else if (showCreateRow) {
          handleCreate();
        }
        break;
      case "Escape":
        e.preventDefault();
        closeDropdown();
        break;
      case "Tab":
        closeDropdown();
        break;
    }
  }

  const errorId = error ? `${fieldId}-message` : undefined;
  const helperId = !error && helperText ? `${fieldId}-message` : undefined;

  const iconColor = disabled
    ? "text-[color:var(--component-select-disabled-icon,#A3A3AB)]"
    : "text-[color:var(--component-select-default-icon,#3D3D42)]";

  // While closed, the overlay stands in for a selected option's icon (an `<input>` can't render
  // inline children) — see file header for why this mirrors CDS's own `selectedItemTemplateFn`.
  const showSelectedOverlay = !open && Boolean(selectedOption?.icon);
  const displayValue = open ? searchTerm : (selectedOption?.label ?? "");
  const inputTextClass = showSelectedOverlay
    ? "text-transparent"
    : disabled
      ? "text-[color:var(--component-select-disabled-text,#A3A3AB)]"
      : selectedOption && !open
        ? "text-[color:var(--component-select-filled-text,#343438)]"
        : "";
  const placeholderColorClass = disabled
    ? "placeholder:text-[color:var(--component-select-disabled-text,#A3A3AB)]"
    : "placeholder:text-[color:var(--component-select-default-text,#696970)]";
  const cursorClass = disabled ? "" : open ? "cursor-text" : "cursor-pointer";

  // Figma keeps the info icon as a sibling *outside* the bordered field box, matching the pattern
  // TextField/Checkbox already established for this same slot.
  const infoIconButton = infoIcon && (
    <button
      type="button"
      onClick={onInfoIconClick}
      title={infoText}
      aria-label={infoText ?? "More information"}
      className="flex h-[34px] shrink-0 cursor-pointer items-center justify-center px-[var(--global-spacing-s8,8px)] text-[color:var(--component-select-default-infoicon,#696970)]"
    >
      <InfoIcon size={20} />
    </button>
  );

  const labelNode = label && (
    <label
      htmlFor={fieldId}
      className={`type-label-bold-s shrink-0 text-[color:var(--component-select-label,#343438)] ${
        labelPosition === "left" ? "flex h-[34px] items-center" : "block pb-[var(--global-spacing-s8,8px)]"
      }`}
    >
      {label}
    </label>
  );

  if (readOnly) {
    return (
      <div className={`flex w-full items-start ${labelPosition === "left" ? "gap-[var(--global-spacing-s12,12px)]" : "flex-col"} ${className ?? ""}`}>
        {label && (
          <span className={`type-label-bold-s shrink-0 text-[color:var(--component-select-label,#343438)] ${labelPosition === "left" ? "flex h-[34px] items-center" : "block pb-[var(--global-spacing-s8,8px)]"}`}>
            {label}
          </span>
        )}
        <div className="flex h-[34px] w-full items-center">
          <span className="type-label-regular-s min-w-0 flex-1 truncate text-[color:var(--component-select-readonly-text,#343438)]" aria-label={label}>
            {selectedOption?.label ?? ""}
          </span>
          {infoIconButton}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex w-full items-start ${labelPosition === "left" ? "gap-[var(--global-spacing-s12,12px)]" : "flex-col"} ${className ?? ""}`}>
      {labelNode}
      <div className={labelPosition === "left" ? "min-w-0 flex-1" : "w-full"}>
        <div className="flex w-full items-start">
          <div
            ref={fieldRef}
            className={`box-border flex h-[34px] w-full min-w-0 items-center border border-solid bg-[var(--component-select-default-background,#FFFFFF)] ${FIELD_PADDING} ${cursorClass} ${
              disabled ? BOX_DISABLED : error ? BOX_ERROR : open ? BOX_OPEN : BOX_INTERACTIVE
            }`}
          >
            <span className="relative flex min-w-0 flex-1 items-center">
              <input
                ref={inputRef}
                id={fieldId}
                type="text"
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listboxId}
                aria-autocomplete="list"
                aria-activedescendant={open && highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined}
                aria-invalid={error || undefined}
                aria-describedby={errorId ?? helperId}
                aria-label={ariaLabel ?? (label ? undefined : placeholder)}
                disabled={disabled}
                value={displayValue}
                placeholder={placeholder}
                onChange={handleInputChange}
                onClick={() => {
                  if (!open) openDropdown();
                }}
                onKeyDown={handleKeyDown}
                className={`type-label-regular-s h-[16px] w-full min-w-0 border-none bg-transparent p-0 outline-none placeholder:italic disabled:cursor-not-allowed ${placeholderColorClass} ${inputTextClass} ${cursorClass}`}
              />
              {showSelectedOverlay && (
                <span className="pointer-events-none absolute inset-0 flex items-center gap-[var(--global-spacing-s8,8px)]">
                  <span className="inline-flex size-4 shrink-0 items-center justify-center">{selectedOption!.icon}</span>
                  <span className={`type-label-regular-s min-w-0 flex-1 truncate ${disabled ? "text-[color:var(--component-select-disabled-text,#A3A3AB)]" : "text-[color:var(--component-select-filled-text,#343438)]"}`}>
                    {selectedOption!.label}
                  </span>
                </span>
              )}
            </span>
            <span className="flex shrink-0 items-center gap-[var(--global-spacing-s4,4px)]">
              {clearable && selectedOption && !disabled && (
                <button
                  type="button"
                  tabIndex={-1}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleClear}
                  aria-label="Clear selection"
                  className={`inline-flex cursor-pointer items-center justify-center ${iconColor}`}
                >
                  <CloseIcon size={16} />
                </button>
              )}
              <button
                type="button"
                tabIndex={-1}
                disabled={disabled}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  if (open) closeDropdown();
                  else openDropdown();
                  inputRef.current?.focus();
                }}
                aria-label={open ? "Close options" : "Open options"}
                className={`inline-flex items-center justify-center ${iconColor} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                {open ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
              </button>
            </span>
          </div>
          {infoIconButton}

          <Popover open={open} onClose={closeDropdown} anchorRef={fieldRef} align="start" matchAnchorWidth>
            <ul
              ref={listRef}
              id={listboxId}
              role="listbox"
              aria-label={label ?? placeholder}
              className="max-h-[300px] overflow-y-auto bg-[var(--component-dropdown-background-default,#FFFFFF)] py-[var(--global-spacing-s4,4px)] shadow-[var(--component-dropdown-elevation-s,0px_2px_8px_0px_rgba(58,59,63,0.18))]"
            >
              {filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  id={`${listboxId}-option-${index}`}
                  data-index={index}
                  role="option"
                  aria-selected={option.value === currentValue}
                  aria-disabled={option.disabled || undefined}
                  onMouseEnter={() => !option.disabled && setHighlightedIndex(index)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectOption(option)}
                  className={`type-label-regular-s flex items-center gap-[var(--global-spacing-s8,8px)] px-[var(--global-spacing-s12,12px)] py-[var(--global-spacing-s8,8px)] ${
                    option.disabled
                      ? "cursor-not-allowed text-[color:var(--component-dropdown-text-disabled,#A3A3AB)]"
                      : `cursor-pointer text-[color:var(--component-dropdown-text-default,#343438)] ${
                          index === highlightedIndex ? "bg-[var(--component-dropdown-background-hover,#EDF8FF)]" : ""
                        }`
                  }`}
                >
                  {option.icon && <span className="inline-flex size-4 shrink-0 items-center justify-center">{option.icon}</span>}
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                </li>
              ))}
              {showCreateRow && (
                <li
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleCreate}
                  className="flex cursor-pointer items-center gap-[var(--global-spacing-s4,4px)] px-[var(--global-spacing-s12,12px)] py-[var(--global-spacing-s8,8px)] hover:bg-[var(--component-dropdown-background-hover,#EDF8FF)]"
                >
                  <span className="type-label-semibold-s text-[color:var(--component-dropdown-text-default,#343438)]">Create</span>
                  <span className="type-label-regular-placeholder min-w-0 flex-1 truncate text-[color:var(--component-dropdown-text-default,#343438)]">&ldquo;{query}&rdquo;</span>
                </li>
              )}
              {showEmptyRow && (
                <li className="flex items-center gap-[var(--global-spacing-s8,8px)] px-[var(--global-spacing-s12,12px)] py-[var(--global-spacing-s8,8px)]">
                  <span className="shrink-0 text-[color:var(--component-dropdown-text-description,#696970)]" aria-hidden="true">
                    <InfoIcon size={16} />
                  </span>
                  <span className="type-label-regular-s min-w-0 flex-1 truncate text-[color:var(--component-dropdown-text-description,#696970)]">{emptyMessage}</span>
                </li>
              )}
            </ul>
          </Popover>
        </div>
        {error && errorText && (
          <p id={errorId} className="type-label-semibold-xs w-full pt-[var(--global-spacing-s4,4px)] pr-[var(--global-spacing-s24,24px)] text-[color:var(--component-select-error-hinttext,#B82329)]">
            {errorText}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="type-label-semibold-xs w-full pt-[var(--global-spacing-s4,4px)] pr-[var(--global-spacing-s24,24px)] text-[color:var(--component-select-default-hinttext,#696970)]">
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
}
