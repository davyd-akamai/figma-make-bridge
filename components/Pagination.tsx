// Figma: Pagination, node 128:4563 — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=128-4563&m=dev
// Variants: Table (128:4561 — "Items: N" left, page-size picker + range + chevrons right), List (128:4562 —
// page-size picker left, range + chevrons right) and List selected (128:4560 — "Items: N | Select: N |
// Deselect: N" + a "Selected only N" checkbox, no page controls). All three are a 40px bar with a 1px
// top/bottom border and 12px left padding. CDS reference: cds-pagination (Lit) — the page-size/page-index
// arithmetic and the "keep the first visible item on screen when the size changes" rule come from there.
//
// Design-owner decisions (Figma only shows static swatches):
//  - `variant` is "table" | "list"; the third Figma variant is opt-in selection mode on the list variant
//    (`selectable`). It belongs to a list that is NOT paged: Select/Deselect act on the `length` items shown in
//    that list, and the page-size picker/range/chevrons are not rendered in that mode.
//  - "Items: N" is the total item count (`length`), same as CDS — the same number as the "of N" in the range.
//  - Pagination never slices data or tracks the selection itself; it fires callbacks and the consumer owns both.
//  - The page-size picker is a small shared-Popover menu (10/20/50/100 by default), not the `Select` component.

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import Checkbox from "./Checkbox";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "./icons";
import Popover from "./internal/Popover";

export type PaginationVariant = "table" | "list";

export interface PaginationProps {
  /** "table" shows the item counter on the left; "list" shows the page-size picker there. Default "table". */
  variant?: PaginationVariant;
  /** Total number of items. Default 50. */
  length?: number;
  /** Current page, 1-based. Controlled. */
  pageIndex?: number;
  /** Initial page when uncontrolled. Default 1. */
  defaultPageIndex?: number;
  /** Fired by the prev/next chevrons with the new 1-based page. */
  onPageChange?: (pageIndex: number) => void;
  /** Items per page. Controlled. */
  pageSize?: number;
  /** Initial page size when uncontrolled. Default 20. */
  defaultPageSize?: number;
  /** Choices in the page-size menu. Default [10, 20, 50, 100]. */
  pageSizeOptions?: number[];
  /** Fired when a size is picked. `pageIndex` is the page that keeps the previously-first visible item on screen. */
  onPageSizeChange?: (pageSize: number, pageIndex: number) => void;
  /** Text before the total count. Default "Items:". */
  itemsLabel?: string;
  /** Text before the page-size picker. Default "Page size:". */
  pageSizeLabel?: string;
  /** Word between range and total ("1 - 20 of 50"). Default "of". */
  ofLabel?: string;
  /** Greys out and disables every control. */
  disabled?: boolean;
  /** List variant only: swaps the page controls for the Select / Deselect / "Selected only" bar. */
  selectable?: boolean;
  /** Number of currently selected items (shown after "Deselect:" and "Selected only"). Default 0. */
  selectedCount?: number;
  /** Fired by "Select: N" — the consumer selects every item in the list. */
  onSelectAll?: () => void;
  /** Fired by "Deselect: N" — the consumer clears the selection. */
  onDeselectAll?: () => void;
  /** Controlled "Selected only" filter state. */
  selectedOnly?: boolean;
  /** Initial "Selected only" state when uncontrolled. Default false. */
  defaultSelectedOnly?: boolean;
  /** Fired when the "Selected only" checkbox toggles (the consumer hides unselected items). */
  onSelectedOnlyChange?: (selectedOnly: boolean) => void;
  className?: string;
}

export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alias-interaction-border-focus,#0174BC)]";

const ICON_BUTTON_ENABLED =
  "cursor-pointer text-[color:var(--component-pagination-icon-default,#3D3D42)] hover:text-[color:var(--component-pagination-icon-hover,#009CDE)] active:text-[color:var(--component-pagination-icon-active,#0174BC)]";
const ICON_BUTTON_DISABLED = "cursor-not-allowed text-[color:var(--component-pagination-icon-disabled,#A3A3AB)]";

const MENU_ROW_HEIGHT = 36;

function ChevronButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "previous" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "previous" ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <button
      type="button"
      aria-label={direction === "previous" ? "Previous page" : "Next page"}
      disabled={disabled}
      onClick={onClick}
      className={`flex size-[20px] shrink-0 items-center justify-center ${disabled ? ICON_BUTTON_DISABLED : ICON_BUTTON_ENABLED} ${FOCUS_RING}`}
    >
      <Icon />
    </button>
  );
}

function PageSizePicker({
  label,
  value,
  options,
  disabled,
  flush,
  onSelect,
}: {
  label: string;
  value: number;
  options: number[];
  disabled: boolean;
  /** List variant: the picker is the leftmost item, so it takes no left padding (Figma's "Left: Page Size"). */
  flush: boolean;
  onSelect: (size: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  function toggle() {
    if (open) return setOpen(false);
    const rect = triggerRef.current?.getBoundingClientRect();
    // Pagination usually sits at the bottom of a page, so flip above the trigger when the menu wouldn't fit below.
    setOpenUp(rect ? window.innerHeight - rect.bottom < options.length * MENU_ROW_HEIGHT + 16 : false);
    setOpen(true);
  }

  function onMenuKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]'));
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    const next = e.key === "ArrowDown" ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
    items[next]?.focus();
  }

  return (
    <div
      className={`flex shrink-0 items-center gap-[var(--global-spacing-s4,4px)] py-[var(--global-spacing-s8,8px)] pr-[var(--global-spacing-s8,8px)] ${
        flush ? "" : "pl-[var(--global-spacing-s8,8px)]"
      }`}
    >
      <span>{label}</span>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`${label} ${value}`}
        onClick={toggle}
        className={`type-label-semibold-s flex items-center ${
          disabled
            ? "cursor-not-allowed text-[color:var(--component-pagination-text-disabled,#A3A3AB)]"
            : "cursor-pointer text-[color:var(--component-pagination-text-link,#0174BC)] hover:text-[color:var(--component-pagination-text-hover,#009CDE)]"
        } ${FOCUS_RING}`}
      >
        {value}
        <ChevronDownIcon
          size={20}
          className={disabled ? "text-[color:var(--component-pagination-icon-disabled,#A3A3AB)]" : "text-[color:var(--component-pagination-icon-default,#3D3D42)]"}
        />
      </button>
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={triggerRef}
        placement={openUp ? "top" : "bottom"}
        id={menuId}
        role="menu"
        aria-label={label}
        className="flex min-w-[80px] flex-col items-stretch bg-[var(--component-dropdown-background-default,#FFFFFF)] py-[var(--global-spacing-s4,4px)] shadow-[var(--component-dropdown-elevation-s,0px_2px_8px_0px_rgba(58,59,63,0.18))]"
      >
        <div onKeyDown={onMenuKeyDown} className="flex flex-col items-stretch">
          {options.map((size) => (
            <button
              key={size}
              type="button"
              role="menuitemradio"
              aria-checked={size === value}
              autoFocus={size === value}
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
                if (size !== value) onSelect(size);
              }}
              className={`${size === value ? "type-label-semibold-s" : "type-label-regular-s"} h-[36px] cursor-pointer px-[var(--global-spacing-s12,12px)] text-left text-[color:var(--component-dropdown-text-default,#343438)] hover:bg-[var(--component-dropdown-background-hover,#EDF8FF)] ${FOCUS_RING}`}
            >
              {size}
            </button>
          ))}
        </div>
      </Popover>
    </div>
  );
}

function SelectionAction({
  label,
  count,
  disabled,
  onClick,
}: {
  label: string;
  count: number;
  disabled: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex shrink-0 items-center gap-[var(--global-spacing-s4,4px)] p-[var(--global-spacing-s8,8px)] whitespace-nowrap ${
        disabled
          ? "cursor-not-allowed text-[color:var(--component-pagination-text-disabled,#A3A3AB)]"
          : "cursor-pointer text-[color:var(--component-pagination-text-link,#0174BC)] hover:text-[color:var(--component-pagination-text-hover,#009CDE)]"
      } ${FOCUS_RING}`}
    >
      <span>{label}</span>
      <span>{count}</span>
    </button>
  );
}

function Divider() {
  return <span aria-hidden="true" className="h-[24px] w-px shrink-0 bg-[var(--component-pagination-divider-border,#D6D6DD)]" />;
}

export default function Pagination({
  variant = "table",
  length = 50,
  pageIndex,
  defaultPageIndex = 1,
  onPageChange,
  pageSize,
  defaultPageSize = 20,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onPageSizeChange,
  itemsLabel = "Items:",
  pageSizeLabel = "Page size:",
  ofLabel = "of",
  disabled = false,
  selectable = false,
  selectedCount = 0,
  onSelectAll,
  onDeselectAll,
  selectedOnly,
  defaultSelectedOnly = false,
  onSelectedOnlyChange,
  className,
}: PaginationProps) {
  const [internalPage, setInternalPage] = useState(defaultPageIndex);
  const [internalSize, setInternalSize] = useState(defaultPageSize);
  const [internalSelectedOnly, setInternalSelectedOnly] = useState(defaultSelectedOnly);

  const size = Math.max(1, pageSize ?? internalSize);
  const lastPage = Math.max(1, Math.ceil(length / size));
  const page = Math.min(Math.max(1, pageIndex ?? internalPage), lastPage);
  const isSelectedOnly = selectedOnly ?? internalSelectedOnly;
  const inSelectionMode = selectable && variant === "list";

  // Dev-only footgun warning, once per mount (not per render).
  const warned = useRef(false);
  useEffect(() => {
    if (warned.current) return;
    if (selectable && variant !== "list" && import.meta.env?.DEV) {
      warned.current = true;
      console.warn('[Pagination] `selectable` only applies to variant="list"; it is ignored on variant="table".');
    }
  }, [selectable, variant]);

  function setSelectedOnly(next: boolean) {
    setInternalSelectedOnly(next);
    onSelectedOnlyChange?.(next);
  }

  // "Selected only" can't stay on once nothing is selected (its checkbox is disabled at 0).
  useEffect(() => {
    if (inSelectionMode && selectedCount === 0 && isSelectedOnly) setSelectedOnly(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inSelectionMode, selectedCount, isSelectedOnly]);

  function goTo(next: number) {
    setInternalPage(next);
    onPageChange?.(next);
  }

  function changeSize(nextSize: number) {
    // Keep the first item that was visible on screen: e.g. page 2 of size 10 → page 3 of size 5.
    const nextPage = Math.floor(((page - 1) * size) / nextSize) + 1;
    setInternalSize(nextSize);
    setInternalPage(nextPage);
    onPageSizeChange?.(nextSize, nextPage);
  }

  const start = length > 0 ? (page - 1) * size + 1 : 0;
  const end = Math.min(page * size, length);
  const rangeLabel = length > 0 ? `${start} - ${end} ${ofLabel} ${length}` : `0 ${ofLabel} 0`;

  const rootClass = `type-label-regular-s box-border flex h-[40px] w-full items-center border-y border-solid border-[var(--component-pagination-border,#D6D6DD)] bg-[var(--component-pagination-background,#FFFFFF)] pl-[var(--global-spacing-s12,12px)] text-[color:var(--component-pagination-text-default,#343438)] whitespace-nowrap ${className ?? ""}`;

  if (inSelectionMode) {
    return (
      <div className={`${rootClass} gap-[var(--global-spacing-s24,24px)]`}>
        <div className="flex shrink-0 items-center">
          <div className="flex shrink-0 items-center gap-[var(--global-spacing-s4,4px)] py-[var(--global-spacing-s8,8px)] pr-[var(--global-spacing-s8,8px)]">
            <span>{itemsLabel}</span>
            <span>{length}</span>
          </div>
          <Divider />
          <SelectionAction label="Select:" count={length} disabled={disabled || length === 0} onClick={onSelectAll} />
          <Divider />
          <SelectionAction label="Deselect:" count={selectedCount} disabled={disabled || selectedCount === 0} onClick={onDeselectAll} />
        </div>
        <Checkbox
          label={`Selected only ${selectedCount}`}
          checked={isSelectedOnly}
          onChange={setSelectedOnly}
          disabled={disabled || selectedCount === 0}
        />
      </div>
    );
  }

  const pageSizePicker = (
    <PageSizePicker label={pageSizeLabel} value={size} options={pageSizeOptions} disabled={disabled} flush={variant === "list"} onSelect={changeSize} />
  );

  const pageControls = (
    <div className="flex shrink-0 items-center justify-end gap-[var(--global-spacing-s8,8px)] py-[var(--global-spacing-s8,8px)]">
      <ChevronButton direction="previous" disabled={disabled || page <= 1} onClick={() => goTo(page - 1)} />
      <span aria-live="polite" className="text-center">
        {rangeLabel}
      </span>
      <ChevronButton direction="next" disabled={disabled || page * size >= length} onClick={() => goTo(page + 1)} />
    </div>
  );

  if (variant === "list") {
    return (
      <div className={rootClass}>
        <div className="flex min-w-0 flex-1 items-center">{pageSizePicker}</div>
        {pageControls}
      </div>
    );
  }

  return (
    <div className={rootClass}>
      <div className="flex min-w-0 flex-1 items-center gap-[var(--global-spacing-s4,4px)] py-[var(--global-spacing-s8,8px)] pr-[var(--global-spacing-s8,8px)]">
        <span>{itemsLabel}</span>
        <span>{length}</span>
      </div>
      <div className="flex shrink-0 items-center gap-[var(--global-spacing-s16,16px)]">
        {pageSizePicker}
        {pageControls}
      </div>
    </div>
  );
}
