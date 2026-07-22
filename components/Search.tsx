// Figma: Search-field, node 91:3834 — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=91-3834
// Interactions/states reference: node 91:3990 ("Search field variants").
// 7 states: Default/Hover/Focus/Focus (w/ options)/Filled/Disabled/Error — no label-position axis
// exists anywhere in this component (unlike TextField/Select's 8-state x 3-label matrix), so unlike
// those two, Search has no `label` prop at all; it's a standalone, unlabeled search input.
// This is the first component in this library with a real leading icon inside a bordered text box —
// per the roadmap note (2026-07-10), TextField deliberately never got a leading-icon prop specifically
// so Search would own this pattern, after a real swap-in left a search bar's icon overlay unconverted.
//
// State collapse, same precedent TextField/Select already set: Hover is a plain `:hover`, Disabled
// is a real `disabled` attribute, Filled vs Default/Hover is just whether the input has a value
// (solid text vs italic placeholder — verified identical border/background between e.g. `hover` and
// `filled` in tokens/search.json, only text style differs). The one state needing real React state is
// the suggestions dropdown (Figma's "Focus (w/ options)" / "no results" swatches).
//
// Suggestions dropdown is opt-in via the `suggestions` prop (undefined = feature off, plain search
// box with no dropdown ever — matches CDS's own `cds-search-field` "filter mode"). Passing an array
// (even empty, once a live query has actually run and returned zero matches) enables it — matches
// this repo's "plain optional slot, no forced default" precedent (TabsHorizontal's tab `icon`,
// Drawer's `icon`). Filtering is a local case-insensitive substring match against the current value,
// same `matches()` helper Select already uses — CDS's own `cds-select` reference confirms this is the
// right default (`defaultFilterFn`), and Figma's own "DNS" -> "DNS"/"DNS servers"/"DNS locales" demo
// data is consistent with a plain substring match. The dropdown only opens once there's a non-empty
// query (matches the plain "Focus" swatch showing no dropdown at all while empty) — reopening after a
// manual chevron-collapse happens by refocusing the field, same as Select's click-to-reopen.
// No separate "selected value" state exists like Select has — the input's own text *is* the query,
// always visible and editable in place (no icon-overlay technique needed, since Figma's dropdown items
// here are plain text, no per-item icon slot).
// Close (x) button appears whenever the field has a value (not just when a dropdown is open) and
// isn't disabled — confirmed via get_design_context, the Filled/Error swatches show close with no
// chevron at all; the chevron only renders in the two dropdown-open swatches. There is no closed-state
// chevron affordance anywhere in the file, so opening only ever happens via typing or refocusing, not
// via a chevron click (the chevron is exposed purely to collapse the panel while keeping the query).
// Icons: SearchIcon (existing, from GlobalHeader) at 20px for the leading glyph, CloseIcon/
// ChevronUpIcon/InfoIcon (existing, from TextField/Select) — no new icons needed for this component.
// Suggestions dropdown reuses the same shared `tokens/dropdown.json` tokens/classes Select's own
// dropdown already established (background/hover/text/description/elevation), same "no results" copy
// and InfoIcon treatment as Select's empty-state row — Figma's own literal copy here is "No items
// found" (node 91:3811), used verbatim as the default `noResultsMessage`.
// Popover positioning reuses the shared `components/internal/Popover.tsx` primitive (portal +
// `position: fixed`, extracted during Select's build) rather than a new hand-rolled popover.
// No `readOnly` state exists anywhere in this component's Figma file (unlike TextField/Select) — not
// implemented here, consistent with only building what's evidenced.

import { useId, useRef, useState, type ChangeEvent, type KeyboardEvent, type MouseEvent } from "react";
import { ChevronUpIcon, CloseIcon, InfoIcon, SearchIcon } from "./icons";
import Popover from "./internal/Popover";

export interface SearchProps {
  /** Controlled search query. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Fires on Enter when no suggestion is actively highlighted — the raw-query submit event. */
  onSearch?: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  /** Error message shown below the field; also switches the field into its error/red-border state. */
  errorText?: string;
  disabled?: boolean;
  /** Hides the clear (×) button even when the field has a value. Default true (button shows). */
  clearable?: boolean;
  /** Enables the suggestions dropdown (Figma's "Focus (w/ options)"/"no results" states). Omit
   * entirely for a plain search field with no dropdown ever — pass an array (even empty) once a real
   * query has run and matched nothing, so `noResultsMessage` can render. */
  suggestions?: string[];
  onSelectSuggestion?: (suggestion: string) => void;
  /** Shown when the query matches no suggestion. Figma's own literal copy (node 91:3811). */
  noResultsMessage?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
}

function matches(suggestion: string, query: string): boolean {
  return suggestion.toLowerCase().includes(query.toLowerCase());
}

export default function Search({
  value,
  defaultValue = "",
  onChange,
  onSearch,
  placeholder = "Search",
  helperText,
  errorText,
  disabled = false,
  clearable = true,
  suggestions,
  onSelectSuggestion,
  noResultsMessage = "No items found",
  id,
  className,
  "aria-label": ariaLabel,
}: SearchProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  const currentValue = value !== undefined ? value : internalValue;
  const query = currentValue.trim();
  const error = Boolean(errorText);
  const suggestionsEnabled = suggestions !== undefined;
  const filteredSuggestions = suggestionsEnabled && query ? suggestions.filter((s) => matches(s, query)) : [];
  const showDropdown = open && suggestionsEnabled && query !== "";
  const showNoResults = showDropdown && filteredSuggestions.length === 0;

  function setValue(next: string) {
    if (value === undefined) setInternalValue(next);
    onChange?.(next);
  }

  function openDropdown() {
    if (!suggestionsEnabled || disabled || query === "") return;
    setOpen(true);
  }

  function closeDropdown() {
    setOpen(false);
    setHighlightedIndex(-1);
  }

  function selectSuggestion(suggestion: string) {
    setValue(suggestion);
    onSelectSuggestion?.(suggestion);
    closeDropdown();
  }

  function handleClear(e: MouseEvent) {
    e.stopPropagation();
    setValue("");
    closeDropdown();
    inputRef.current?.focus();
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setValue(next);
    if (suggestionsEnabled && next.trim() !== "") {
      setOpen(true);
      setHighlightedIndex(-1);
    } else {
      setOpen(false);
    }
  }

  function moveHighlight(delta: 1 | -1) {
    const list = filteredSuggestions;
    if (list.length === 0) return;
    const idx = highlightedIndex < 0 ? (delta > 0 ? 0 : list.length - 1) : (highlightedIndex + delta + list.length) % list.length;
    setHighlightedIndex(idx);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (disabled) return;
    if (e.key === "Escape" && open) {
      e.preventDefault();
      closeDropdown();
      return;
    }
    if (!showDropdown) {
      if (e.key === "Enter") {
        e.preventDefault();
        onSearch?.(currentValue);
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
        if (filteredSuggestions.length > 0) setHighlightedIndex(0);
        break;
      case "End":
        e.preventDefault();
        if (filteredSuggestions.length > 0) setHighlightedIndex(filteredSuggestions.length - 1);
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) {
          selectSuggestion(filteredSuggestions[highlightedIndex]);
        } else {
          onSearch?.(currentValue);
        }
        break;
    }
  }

  const errorId = error ? `${fieldId}-message` : undefined;
  const helperId = !error && helperText ? `${fieldId}-message` : undefined;
  const listboxId = `${fieldId}-listbox`;

  const stateKey = disabled ? "disabled" : error ? "error" : showDropdown ? "focus" : open ? "focusempty" : query !== "" ? "filled" : "default";

  const BOX_CLASSES: Record<string, string> = {
    default: "border-[var(--component-search-default-border,#83838C)] hover:border-[var(--component-search-hover-border,#3D3D42)] bg-[var(--component-search-default-background,#FFFFFF)]",
    focusempty: "border-[var(--component-search-focusempty-border,#0174BC)] bg-[var(--component-search-focusempty-background,#FFFFFF)]",
    filled: "border-[var(--component-search-filled-border,#83838C)] hover:border-[var(--component-search-hover-border,#3D3D42)] bg-[var(--component-search-filled-background,#FFFFFF)]",
    focus: "border-[var(--component-search-focus-border,#0174BC)] bg-[var(--component-search-focus-background,#FFFFFF)]",
    disabled: "cursor-not-allowed border-[var(--component-search-disabled-border,#C2C2CA)] bg-[var(--component-search-disabled-background,#EDEDF2)]",
    error: "border-[var(--component-search-error-border,#D63C42)] bg-[var(--component-search-error-background,#FFFFFF)]",
  };

  const TEXT_CLASSES: Record<string, string> = {
    default: "text-[color:var(--component-search-default-text,#696970)]",
    focusempty: "text-[color:var(--component-search-focusempty-text,#696970)]",
    filled: "text-[color:var(--component-search-filled-text,#343438)]",
    focus: "text-[color:var(--component-search-focus-text,#343438)]",
    disabled: "text-[color:var(--component-search-disabled-text,#A3A3AB)]",
    error: "text-[color:var(--component-search-error-text,#343438)]",
  };

  const PLACEHOLDER_CLASSES: Record<string, string> = {
    default: "placeholder:text-[color:var(--component-search-default-text,#696970)]",
    focusempty: "placeholder:text-[color:var(--component-search-focusempty-text,#696970)]",
    filled: "placeholder:text-[color:var(--component-search-filled-text,#343438)]",
    focus: "placeholder:text-[color:var(--component-search-focus-text,#343438)]",
    disabled: "placeholder:text-[color:var(--component-search-disabled-text,#A3A3AB)]",
    error: "placeholder:text-[color:var(--component-search-error-text,#343438)]",
  };

  const SEARCH_ICON_CLASSES: Record<string, string> = {
    default: "text-[color:var(--component-search-default-searchicon,#696970)]",
    focusempty: "text-[color:var(--component-search-focusempty-searchicon,#696970)]",
    filled: "text-[color:var(--component-search-filled-searchicon,#696970)]",
    focus: "text-[color:var(--component-search-focus-searchicon,#696970)]",
    disabled: "text-[color:var(--component-search-disabled-searchicon,#A3A3AB)]",
    error: "text-[color:var(--component-search-error-searchicon,#696970)]",
  };

  const ICON_CLASSES: Record<string, string> = {
    default: "text-[color:var(--component-search-default-icon,#3D3D42)]",
    focusempty: "text-[color:var(--component-search-focusempty-icon,#3D3D42)]",
    filled: "text-[color:var(--component-search-filled-icon,#3D3D42)]",
    focus: "text-[color:var(--component-search-focus-icon,#3D3D42)]",
    disabled: "text-[color:var(--component-search-disabled-icon,#A3A3AB)]",
    error: "text-[color:var(--component-search-error-icon,#3D3D42)]",
  };

  const showClear = clearable && !disabled && query !== "";

  return (
    <div className={className ?? "w-full"}>
      <div
        ref={fieldRef}
        className={`box-border flex h-[34px] w-full min-w-0 items-center gap-[var(--global-spacing-s8,8px)] border border-solid px-[var(--global-spacing-s8,8px)] py-[var(--global-spacing-s6,6px)] ${BOX_CLASSES[stateKey]}`}
      >
        <span className={`inline-flex shrink-0 items-center justify-center ${SEARCH_ICON_CLASSES[stateKey]}`}>
          <SearchIcon size={20} />
        </span>
        <input
          ref={inputRef}
          id={fieldId}
          type="text"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={showDropdown && highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined}
          aria-invalid={error || undefined}
          aria-describedby={errorId ?? helperId}
          aria-label={ariaLabel ?? placeholder}
          disabled={disabled}
          value={currentValue}
          placeholder={placeholder}
          onChange={handleInputChange}
          onFocus={openDropdown}
          onKeyDown={handleKeyDown}
          className={`type-label-regular-s h-[16px] w-full min-w-0 border-none bg-transparent p-0 outline-none placeholder:italic disabled:cursor-not-allowed ${TEXT_CLASSES[stateKey]} ${PLACEHOLDER_CLASSES[stateKey]}`}
        />
        {(showClear || showDropdown) && (
          <span className="flex shrink-0 items-center gap-[var(--global-spacing-s4,4px)]">
            {showClear && (
              <button
                type="button"
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleClear}
                aria-label="Clear search"
                className={`inline-flex cursor-pointer items-center justify-center ${ICON_CLASSES[stateKey]}`}
              >
                <CloseIcon size={16} />
              </button>
            )}
            {showDropdown && (
              <button
                type="button"
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()}
                onClick={closeDropdown}
                aria-label="Hide suggestions"
                className={`inline-flex cursor-pointer items-center justify-center ${ICON_CLASSES[stateKey]}`}
              >
                <ChevronUpIcon size={20} />
              </button>
            )}
          </span>
        )}
      </div>

      <Popover open={showDropdown} onClose={closeDropdown} anchorRef={fieldRef} align="start" matchAnchorWidth>
        <ul
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel ?? placeholder}
          className="max-h-[300px] overflow-y-auto bg-[var(--component-dropdown-background-default,#FFFFFF)] py-[var(--global-spacing-s4,4px)] shadow-[var(--component-dropdown-elevation-s,0px_2px_8px_0px_rgba(58,59,63,0.18))]"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              id={`${listboxId}-option-${index}`}
              role="option"
              aria-selected={index === highlightedIndex}
              onMouseEnter={() => setHighlightedIndex(index)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectSuggestion(suggestion)}
              className={`type-label-regular-s cursor-pointer px-[var(--global-spacing-s12,12px)] py-[var(--global-spacing-s8,8px)] text-[color:var(--component-dropdown-text-default,#343438)] ${
                index === highlightedIndex ? "bg-[var(--component-dropdown-background-hover,#EDF8FF)]" : ""
              }`}
            >
              {suggestion}
            </li>
          ))}
          {showNoResults && (
            <li className="flex items-center gap-[var(--global-spacing-s8,8px)] px-[var(--global-spacing-s12,12px)] py-[var(--global-spacing-s8,8px)]">
              <span className="shrink-0 text-[color:var(--component-dropdown-text-description,#696970)]" aria-hidden="true">
                <InfoIcon size={16} />
              </span>
              <span className="type-label-regular-s min-w-0 flex-1 truncate text-[color:var(--component-dropdown-text-description,#696970)]">{noResultsMessage}</span>
            </li>
          )}
        </ul>
      </Popover>

      {error && errorText && (
        <p id={errorId} className="type-label-semibold-xs w-full pt-[var(--global-spacing-s4,4px)] pr-[var(--global-spacing-s24,24px)] text-[color:var(--component-search-error-hinttext,#B82329)]">
          {errorText}
        </p>
      )}
      {!error && helperText && (
        <p id={helperId} className="type-label-semibold-xs w-full pt-[var(--global-spacing-s4,4px)] text-[color:var(--component-search-default-hinttext,#696970)]">
          {helperText}
        </p>
      )}
    </div>
  );
}
