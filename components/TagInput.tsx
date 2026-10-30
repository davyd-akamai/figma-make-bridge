// Figma: Tag input, node 140:8688 — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=140-8688
// Per-tag breakdown (Tag item, node 140:6272) is the shared `Tag` component (components/Tag.tsx).
// Figma demos a 9-state x 3-label-position matrix (Default/Placeholder/Hover/Focus/Filled/Filled multiline/
// Error/Disabled/Read only x No label/Left label/Top label). Most of it collapses onto the same precedent
// TextField/Select set: Hover is a plain `:hover`, Focus is `focus-within:`, Placeholder vs Default/Filled is
// just whether there are tags, "No label" is omitting `label`, Filled multiline is tags wrapping (box grows to
// a 100px max-height, then the tag area scrolls — design-owner decision). Real React state: the tag list
// (controlled/uncontrolled, same `x ?? internalX` split as SideNavigation), the search text and `open`.
// Scope decided via explicit user questions: (1) `options` + `creatable` — typing filters `options`
// (case-insensitive substring, never-selected options only); Figma's `+ "app"` row is shown whenever the typed
// text isn't already a tag/option (unlike Select it appears *alongside* matching options), and Enter/comma commit
// free text. The component never mutates `options`; it only reports the new tag list via `onChange`.
// (2) Tags are the shared `Tag`. (3) No collapse into a "+N" chip — the Show-more chip isn't used inside any Tag
// input swatch. (4) Invalid tags are decided by the consumer (`TagInputTag.invalid`); `errorText` turns the box red.
// Disabled shows only the (disabled) tags — Figma's disabled swatch has no chevron/clear. Read-only drops the box
// entirely, like TextField/Select. Chevron reuses ChevronDownIcon/ChevronUpIcon scaled to 20px (Select's finding).
// The × (clear all) is the existing CloseIcon at 16px; the create row's + is the existing 16px PlusIcon.
// Only Figma's `labelInfoIcon` exists here (no field-side info icon, unlike TextField/TextArea).

import { useId, useLayoutEffect, useRef, useState, type ChangeEvent, type ClipboardEvent, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { ChevronDownIcon, ChevronUpIcon, CloseIcon, InfoIcon, PlusIcon } from "./icons";
import Popover from "./internal/Popover";
import Tag from "./Tag";
import Tooltip from "./Tooltip";

export type TagInputLabelPosition = "top" | "left";

export interface TagInputTag {
  /** Unique identity of the tag (compared case-insensitively to avoid duplicates). */
  value: string;
  /** Chip text. Defaults to `value`. */
  label?: string;
  /** Optional 12px leading icon, e.g. `<LockIcon />` (Figma's tag `showIcon`). */
  icon?: ReactNode;
  /** Hides the tag's × (and Backspace/Delete removal). Default true (removable). */
  removable?: boolean;
  /** Red error styling for this tag (Figma's tag State=Error). The consumer decides validity. */
  invalid?: boolean;
}

export interface TagInputOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TagInputProps {
  /** Controlled tags. */
  tags?: TagInputTag[];
  defaultTags?: TagInputTag[];
  /** Fires with the full new tag list after an add, remove or clear. */
  onChange?: (tags: TagInputTag[]) => void;
  /** Suggestions shown while typing / via the chevron. Options already used as a tag are hidden. */
  options?: TagInputOption[];
  placeholder?: string;
  /** Field label text. Omit to render no label (Figma's "No label"). */
  label?: string;
  /** Placement of `label` relative to the field. Ignored when `label` is omitted. */
  labelPosition?: TagInputLabelPosition;
  /** Shows Figma's 16px info icon right after the label text. Same "Tooltip basement" pattern as TextField. */
  labelInfoIcon?: boolean;
  /** Native tooltip (`title`) for the label info icon — a future Tooltip component can replace it. */
  labelInfoText?: string;
  /** Supplementary guidance below the field. Hidden while `errorText` is shown. */
  helperText?: string;
  /** Error message below the field; also switches the box into its red error state. */
  errorText?: string;
  /** Hides the clear-all (×) button even when there are tags. Default true (button shows). */
  clearable?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /** Shows the `+ "typed"` row and lets Enter / comma add free text. Default true; false = options-only. */
  creatable?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
}

const FIELD_PADDING_EMPTY =
  "gap-[var(--global-spacing-s12,12px)] pl-[var(--global-spacing-s12,12px)] pr-[var(--global-spacing-s8,8px)] py-[var(--global-spacing-s6,6px)]";
const FIELD_PADDING_TAGS =
  "gap-[var(--global-spacing-s12,12px)] pl-[var(--global-spacing-s4,4px)] pr-[var(--global-spacing-s8,8px)] py-[var(--global-spacing-s4,4px)]";

// hover/focus-within are separate utilities with equal specificity, so hover is guarded with
// :not(:focus-within) to make focus win deterministically (TextField's established pattern).
const BOX_INTERACTIVE =
  "border-[var(--component-taginput-default-border,#83838C)] [&:hover:not(:focus-within)]:border-[var(--component-taginput-hover-border,#3D3D42)] focus-within:border-[var(--component-taginput-focus-border,#0174BC)]";
const BOX_OPEN = "border-[var(--component-taginput-focus-border,#0174BC)]";
const BOX_ERROR = "border-[var(--component-taginput-error-border,#D63C42)]";
const BOX_DISABLED =
  "cursor-not-allowed border-[var(--component-taginput-disabled-border,#C2C2CA)] bg-[var(--component-taginput-disabled-background,#EDEDF2)] p-[var(--global-spacing-s4,4px)]";

const ICON_COLOR = "text-[color:var(--component-taginput-filled-icon,#3D3D42)]";

function tagLabel(tag: TagInputTag): string {
  return tag.label ?? tag.value;
}

function sameText(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export default function TagInput({
  tags,
  defaultTags = [],
  onChange,
  options = [],
  placeholder = "Add tag",
  label,
  labelPosition = "top",
  labelInfoIcon = false,
  labelInfoText,
  helperText,
  errorText,
  clearable = true,
  disabled = false,
  readOnly = false,
  creatable = true,
  id,
  className,
  "aria-label": ariaLabel,
}: TagInputProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const listboxId = `${fieldId}-listbox`;

  const [internalTags, setInternalTags] = useState(defaultTags);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const currentTags = tags ?? internalTags;
  const hasTags = currentTags.length > 0;
  const error = Boolean(errorText);
  const query = searchTerm.trim();
  const left = label !== undefined && labelPosition === "left";

  const usedValues = currentTags.map((t) => t.value);
  const availableOptions = options.filter((o) => !usedValues.some((v) => sameText(v, o.value)));
  const filteredOptions = query ? availableOptions.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())) : availableOptions;
  const alreadyKnown =
    currentTags.some((t) => sameText(tagLabel(t), query) || sameText(t.value, query)) ||
    options.some((o) => sameText(o.label, query));
  const showCreateRow = creatable && query !== "" && !alreadyKnown;
  const rowCount = filteredOptions.length + (showCreateRow ? 1 : 0);
  const dropdownOpen = open && rowCount > 0;

  useLayoutEffect(() => {
    if (dropdownOpen && highlightedIndex >= 0) {
      listRef.current?.querySelector(`[data-index="${highlightedIndex}"]`)?.scrollIntoView({ block: "nearest" });
    }
  }, [dropdownOpen, highlightedIndex]);

  function emit(next: TagInputTag[]) {
    if (tags === undefined) setInternalTags(next);
    onChange?.(next);
  }

  function closeDropdown() {
    setOpen(false);
    setHighlightedIndex(-1);
  }

  function resetQuery() {
    setSearchTerm("");
    closeDropdown();
  }

  function addTag(tag: TagInputTag) {
    if (!currentTags.some((t) => sameText(t.value, tag.value))) emit([...currentTags, tag]);
    resetQuery();
  }

  function addOption(option: TagInputOption) {
    if (option.disabled) return;
    addTag({ value: option.value, label: option.label });
  }

  function addTyped(text: string) {
    const typed = text.trim();
    if (!typed) return;
    const match = options.find((o) => sameText(o.label, typed) && !o.disabled);
    if (match) addOption(match);
    else if (creatable) addTag({ value: typed });
    else resetQuery();
  }

  function removeAt(index: number) {
    emit(currentTags.filter((_, i) => i !== index));
    inputRef.current?.focus();
  }

  function handleClear(e: MouseEvent) {
    e.stopPropagation();
    emit([]);
    resetQuery();
    inputRef.current?.focus();
  }

  function focusTag(index: number) {
    boxRef.current?.querySelector<HTMLElement>(`[data-tag-index="${index}"]`)?.focus();
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    if (/[,;]/.test(next)) {
      commitDelimited(next, true);
      return;
    }
    setSearchTerm(next);
    setOpen(true);
    const nextQuery = next.trim();
    setHighlightedIndex(nextQuery ? 0 : -1);
  }

  function moveHighlight(delta: 1 | -1) {
    if (rowCount === 0) return;
    setOpen(true);
    setHighlightedIndex((i) => (i < 0 ? (delta > 0 ? 0 : rowCount - 1) : (i + delta + rowCount) % rowCount));
  }

  function activateRow(index: number) {
    if (index < filteredOptions.length) addOption(filteredOptions[index]);
    else if (showCreateRow) addTag({ value: query });
  }

  // Splits on , ; (and newlines for paste), committing every complete part as a tag; `keepTail` leaves the
  // text after the last delimiter in the input (typing "a,b" commits "a", keeps "b"). Handled on change rather
  // than keydown so mobile/IME keyboards, which don't send a reliable `key`, behave the same.
  function commitDelimited(text: string, keepTail: boolean) {
    const parts = text.split(/[,;\n]/);
    const tail = keepTail ? parts.pop() ?? "" : "";
    const next = [...currentTags];
    for (const part of parts) {
      const typed = part.trim();
      if (!typed || next.some((t) => sameText(t.value, typed) || sameText(tagLabel(t), typed))) continue;
      const match = options.find((o) => sameText(o.label, typed) && !o.disabled);
      if (match) next.push({ value: match.value, label: match.label });
      else if (creatable) next.push({ value: typed });
    }
    if (next.length !== currentTags.length) emit(next);
    setSearchTerm(tail);
    setHighlightedIndex(tail.trim() ? 0 : -1);
    if (!tail.trim()) setOpen(false);
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text");
    if (!/[,;\n]/.test(text)) return;
    e.preventDefault();
    commitDelimited(searchTerm + text, false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (disabled || readOnly) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        moveHighlight(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        moveHighlight(-1);
        break;
      case "Enter":
        e.preventDefault();
        if (dropdownOpen && highlightedIndex >= 0) activateRow(highlightedIndex);
        else addTyped(searchTerm);
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          closeDropdown();
        }
        break;
      case "Tab":
        closeDropdown();
        break;
      case "Backspace":
        if (searchTerm === "" && hasTags) {
          const last = currentTags.length - 1;
          if (currentTags[last].removable !== false) {
            e.preventDefault();
            emit(currentTags.slice(0, last));
          }
        }
        break;
      case "ArrowLeft":
        if (searchTerm === "" && hasTags && inputRef.current?.selectionStart === 0) {
          e.preventDefault();
          focusTag(currentTags.length - 1);
        }
        break;
    }
  }

  function handleTagKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const target = (e.target as HTMLElement).closest<HTMLElement>("[data-tag-index]");
    if (!target || e.target !== target) return;
    const index = Number(target.dataset.tagIndex);
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusTag(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (index < currentTags.length - 1) focusTag(index + 1);
      else inputRef.current?.focus();
    }
  }

  function handleBoxClick(e: MouseEvent<HTMLDivElement>) {
    if (disabled || readOnly) return;
    if ((e.target as HTMLElement).closest("button, [data-tag-index]")) return;
    inputRef.current?.focus();
    if (options.length > 0) setOpen(true);
  }

  const errorId = error ? `${fieldId}-message` : undefined;
  const helperId = !error && helperText ? `${fieldId}-message` : undefined;
  const messageNode = error ? (
    <p id={errorId} className="type-label-semibold-xs w-full pt-[var(--global-spacing-s4,4px)] pr-[var(--global-spacing-s24,24px)] text-[color:var(--component-taginput-error-hinttext,#B82329)]">
      {errorText}
    </p>
  ) : helperText ? (
    <p id={helperId} className="type-label-semibold-xs w-full pt-[var(--global-spacing-s4,4px)] pr-[var(--global-spacing-s24,24px)] text-[color:var(--component-taginput-default-hinttext,#696970)]">
      {helperText}
    </p>
  ) : null;

  const labelContent = label && (
    <>
      {label}
      {labelInfoIcon && (
        <Tooltip content={labelInfoText}>
          {/* A focusable span, not a button: this sits inside the <label>, where a button would steal the label's click. */}
          <span
            tabIndex={0}
            role="img"
            aria-label={labelInfoText ?? "More information"}
            className="inline-flex cursor-default text-[color:var(--component-taginput-labelinfoicon,#696970)]"
          >
            <InfoIcon size={16} />
          </span>
        </Tooltip>
      )}
    </>
  );
  const labelClasses = `type-label-bold-s flex shrink-0 items-center gap-[var(--global-spacing-s4,4px)] text-[color:var(--component-taginput-label,#343438)] ${
    left ? "h-[34px]" : "pb-[var(--global-spacing-s8,8px)]"
  }`;
  const wrapperClasses = `flex w-full items-start ${left ? "gap-[var(--global-spacing-s12,12px)]" : "flex-col"} ${className ?? ""}`;
  const fieldColumn = left ? "min-w-0 flex-1" : "w-full";

  if (readOnly) {
    return (
      <div className={wrapperClasses}>
        {label && <span className={labelClasses}>{labelContent}</span>}
        <div className={fieldColumn}>
          <div role="list" aria-label={label ?? ariaLabel} className="flex min-h-[34px] w-full flex-wrap items-center gap-[var(--global-spacing-s4,4px)] px-[var(--global-spacing-s4,4px)] py-[5px]">
            {currentTags.map((tag) => (
              <span role="listitem" key={tag.value} className="inline-flex max-w-full">
                <Tag label={tagLabel(tag)} icon={tag.icon} readOnly />
              </span>
            ))}
          </div>
          {messageNode}
        </div>
      </div>
    );
  }

  const boxClasses = disabled ? BOX_DISABLED : `${hasTags ? FIELD_PADDING_TAGS : FIELD_PADDING_EMPTY} ${error ? BOX_ERROR : dropdownOpen ? BOX_OPEN : BOX_INTERACTIVE}`;

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={fieldId} className={labelClasses}>
          {labelContent}
        </label>
      )}
      <div className={fieldColumn}>
        <div
          ref={boxRef}
          onClick={handleBoxClick}
          onKeyDown={handleTagKeyDown}
          className={`box-border flex max-h-[100px] w-full min-w-0 items-start border border-solid bg-[var(--component-taginput-default-background,#FFFFFF)] ${boxClasses} ${disabled ? "" : "cursor-text"}`}
        >
          {disabled ? (
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-[var(--global-spacing-s4,4px)]">
              {hasTags ? (
                currentTags.map((tag) => (
                  <Tag key={tag.value} label={tagLabel(tag)} icon={tag.icon} disabled />
                ))
              ) : (
                <span className="type-label-regular-placeholder px-[var(--global-spacing-s8,8px)] italic text-[color:var(--component-tag-disabled-text,#A3A3AB)]">{placeholder}</span>
              )}
            </div>
          ) : (
            <>
              <div className="flex min-h-0 min-w-0 flex-1 flex-wrap content-start items-center gap-[var(--global-spacing-s4,4px)] self-stretch overflow-y-auto">
                {currentTags.map((tag, index) => (
                  <Tag
                    key={tag.value}
                    data-tag-index={index}
                    tabIndex={-1}
                    label={tagLabel(tag)}
                    icon={tag.icon}
                    invalid={tag.invalid}
                    removable={tag.removable}
                    onRemove={() => removeAt(index)}
                  />
                ))}
                <input
                  ref={inputRef}
                  id={fieldId}
                  type="text"
                  role="combobox"
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                  aria-controls={listboxId}
                  aria-autocomplete="list"
                  aria-activedescendant={dropdownOpen && highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined}
                  aria-invalid={error || undefined}
                  aria-describedby={errorId ?? helperId}
                  aria-label={ariaLabel ?? (label ? undefined : placeholder)}
                  value={searchTerm}
                  placeholder={hasTags ? undefined : placeholder}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                  className={`type-label-regular-s min-w-[48px] flex-1 basis-[48px] border-none bg-transparent p-0 text-[color:var(--component-taginput-focus-text,#343438)] outline-none placeholder:italic placeholder:text-[color:var(--component-taginput-placeholder-text,#696970)] ${
                    hasTags ? "h-[24px] pl-[var(--global-spacing-s4,4px)]" : "h-[16px]"
                  }`}
                />
              </div>
              <span className={`flex shrink-0 items-center gap-[var(--global-spacing-s4,4px)] ${hasTags ? "pt-[var(--global-spacing-s2,2px)]" : ""} ${ICON_COLOR}`}>
                {clearable && hasTags && (
                  <button
                    type="button"
                    tabIndex={-1}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleClear}
                    aria-label="Clear all tags"
                    className="inline-flex cursor-pointer items-center justify-center"
                  >
                    <CloseIcon size={16} />
                  </button>
                )}
                <button
                  type="button"
                  tabIndex={-1}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (open) closeDropdown();
                    else setOpen(true);
                    inputRef.current?.focus();
                  }}
                  aria-label={dropdownOpen ? "Close options" : "Open options"}
                  className="inline-flex cursor-pointer items-center justify-center"
                >
                  {dropdownOpen ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
                </button>
              </span>
            </>
          )}
        </div>
        {messageNode}

        <Popover open={dropdownOpen} onClose={closeDropdown} anchorRef={boxRef} align="start" matchAnchorWidth>
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
                aria-selected={false}
                aria-disabled={option.disabled || undefined}
                onMouseEnter={() => !option.disabled && setHighlightedIndex(index)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => addOption(option)}
                className={`type-label-regular-s flex items-center gap-[var(--global-spacing-s8,8px)] px-[var(--global-spacing-s12,12px)] py-[var(--global-spacing-s8,8px)] ${
                  option.disabled
                    ? "cursor-not-allowed text-[color:var(--component-dropdown-text-disabled,#A3A3AB)]"
                    : `cursor-pointer text-[color:var(--component-dropdown-text-default,#343438)] ${
                        index === highlightedIndex ? "bg-[var(--component-dropdown-background-hover,#EDF8FF)]" : ""
                      }`
                }`}
              >
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
              </li>
            ))}
            {showCreateRow && (
              <li
                id={`${listboxId}-option-${filteredOptions.length}`}
                data-index={filteredOptions.length}
                role="option"
                aria-selected={false}
                onMouseEnter={() => setHighlightedIndex(filteredOptions.length)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => addTag({ value: query })}
                className={`type-label-regular-s flex cursor-pointer items-center gap-[var(--global-spacing-s8,8px)] px-[var(--global-spacing-s12,12px)] py-[var(--global-spacing-s8,8px)] text-[color:var(--component-dropdown-text-default,#343438)] ${
                  highlightedIndex === filteredOptions.length ? "bg-[var(--component-dropdown-background-hover,#EDF8FF)]" : ""
                }`}
              >
                <span className="inline-flex size-4 shrink-0 items-center justify-center text-[color:var(--component-taginput-filled-icon,#3D3D42)]" aria-hidden="true">
                  <PlusIcon />
                </span>
                <span className="min-w-0 flex-1 truncate">&ldquo;{query}&rdquo;</span>
              </li>
            )}
          </ul>
        </Popover>
      </div>
    </div>
  );
}
