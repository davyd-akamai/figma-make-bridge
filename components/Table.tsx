// Figma: core_table-column, node 47:4956 —
// https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=47-4956
// Internal breakdown ("Table details"), node 47:6961 —
// https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=47-6961
//   - core_header-table, node 47:5374 (Header type=White|Grey x Icon only=Yes|No, + sort/info/
//     select-all-checkbox slots)
//   - core_cells-table, node 47:5271 (row cell-type variants: Text only, Link, Text & icon,
//     Expandable text, Checkbox/Radio with icon & text, Action icons, Action menu, plus
//     Status/Badge/Button/Switcher/Select/Empty state, and one explicitly-flagged "[Don't use]
//     Checkbox & text")
//
// "[not coded]" on several cell-type variants (Status, Empty state, Badge, Button, Switcher,
// Select) means "no Angular (ng-akamai-core) equivalent for this pattern *inside a table cell*" —
// confirmed via each variant's own Figma component description, which links out to the
// *standalone* component's own Angular docs (core_button/core_switch/core_badge each separately
// exist and are coded elsewhere). It does NOT mean the visual itself is unspecified — every one of
// those swatches renders a real, fully-styled cell. This is a different meaning of "[not coded]"
// than Container's node ("core_container [not coded]"), which really was a bare/empty layer —
// worth checking per-instance rather than assuming from the tag alone. The one real exclusion is
// "[Don't use] Checkbox & text" (checkbox+text with no icon), explicitly flagged as a pattern not
// to use, and not implemented here — use the 'custom' cellType for anything this component doesn't
// model directly (Button/Switch/Select/Checkbox+text/Radio+text cells all fall under this escape
// hatch rather than getting a dedicated cellType each).
//
// No composed "Table" instance (with toolbar/pagination/search) exists anywhere in this Figma
// file — confirmed via a full-page metadata search, only these header/cell primitives exist. This
// matches the roadmap's own note ("Table owns its own bordered wrapper, do not compose it inside
// Container") and the precedent set by Container/TabsHorizontal: this component stays scoped to
// header+body rows, no pagination footer invented. Consumers compose pagination/search/toolbar
// around it.
//
// Cell content is data-driven via `TableColumn.accessor`/`render`, never hardcoded JSX — cellType
// picks Figma's structural treatment (layout/text color), `accessor` supplies the value. Sorting is
// fully controlled: Table only tracks/displays sort state and calls `onSortChange`, it never
// reorders `rows` itself, since Figma doesn't specify default sort semantics for every value shape
// (e.g. how a 'badge' column would sort). Row selection (`selectable`) and row expansion
// (`expandable`) both inject into the FIRST column's cell only — checkbox then expand-caret, in
// that order — matching CDS's cds-table-cell/-header-cell behaviour (`selectable`/`expandable`
// props both target the first cell), since Figma's isolated per-cell-type swatches can't show
// whole-row structure. The sort icon rotates 180deg on desc and switches to the header's `active`
// icon color when a column is actively sorted — also CDS-sourced: Figma's `core_header-table`
// exposes a `sortType` override slot but ships no distinct asset for the sorted state, so the same
// glyph is reused (rotated) rather than inventing an unspecified one.
//
// Row hover highlight (`component.table.row.background.hover`, described in the token file itself
// as "table row hover") is a plain `:hover` CSS class, always on — same precedent as TextField/
// Checkbox's hover handling, no JS-tracked state.
//
// Row/select-all checkboxes are always size="small" (16px) — per user decision, tables are exactly
// the dense-list case `Checkbox`'s own `size` doc already calls out as small's intended use, not a
// one-off override.
//
// LAYOUT IS CSS GRID, NOT NESTED FLEXBOX ROWS — this was a real bug fix, not a style preference.
// An earlier flexbox draft gave every row (header, each body row) its own independent `flex`
// container, so a "hug width" column's `flex: 0 0 auto` was auto-computed separately per row from
// that row's own content — and the header's text label ("Action icons") has a different intrinsic
// width than the body's icon buttons, so each row split its equal-share (`flex: 1 1 0%`) columns
// differently, drifting the header and body out of alignment by a few px per column, compounding
// across the row. CSS Grid fixes this at the root: one `grid-template-columns` track list is
// shared by every row (header cells and every body row's cells are all direct children of the same
// grid container, via `display: contents` "row" wrapper divs that keep `role="row"` for ARIA
// without participating in the box/grid-item tree themselves), so a `max-content` track's width is
// computed once from *every* cell assigned to it — guaranteed identical in the header and every row.
// Column sizing per `buildGridTemplateColumns`: explicit `column.width` wins outright; no `header`
// label (icon-only) gets Figma's fixed 36px (matches the isolated "Icon only" cell swatch, and
// avoids `max-content` ambiguity for a column with no real content to measure); `actionIcons`/
// `actionMenu` (labeled or not) get `max-content` (hugs the wider of the header label or the actual
// icon buttons, never stretches); everything else gets `1fr` (equal flexible share, matching CDS's
// own `flex: 1 1 0%` default — Figma's isolated per-column swatches don't demonstrate real
// multi-column layout, so this follows CDS instead). Whole-row hover highlighting under this model
// uses Tailwind's `group`/`group-hover:` pair on the `display: contents` row wrapper rather than a
// plain `:hover` class, since a `display: contents` element has no box of its own to hover.
//
// `bordered` (default true) controls the outer wrapper's border/rounded-corner/background — set to
// false when nesting a `Table` inside another `Table`'s `renderExpandedContent`, so the nested
// table doesn't paint a second, redundant outline right next to the outer expanded-row's own
// border. A nested table should also always use the default `headerVariant="filled"` (grey) rather
// than `outlined` — per user decision, this is what nested tables should look like.
//
// The row action menu's dropdown is rendered via `createPortal` into `document.body`, positioned
// from the trigger button's `getBoundingClientRect()`, rather than as a plain CSS-`absolute` child
// of the trigger. The outer table wrapper needs `overflow-hidden` to clip its own rounded corners
// (unlike TabsHorizontal's overflow-menu bug, where `overflow-hidden` turned out unnecessary and
// was simply removed, Table's corner-clipping is a real, load-bearing need) — so the dropdown has
// to escape that ancestor by portaling out of the DOM tree entirely, the standard fix for "popover
// clipped by a legitimately-needed `overflow: hidden` ancestor" (same root cause as the
// already-documented TabsHorizontal/docs-site overflow-clipping gotchas, different fix because this
// time the `overflow-hidden` itself can't just be deleted).
//
// Row action menu items are all one uniform text color, Delete included — per user decision, no
// destructive-red highlighting for now (an earlier draft's "danger" treatment also had a real bug:
// it referenced the `row-text-link` CSS var with a red fallback, but that var *is* defined globally
// as blue, so the fallback silently never applied and the item rendered blue instead of red).
//
// "Empty state" here is per-CELL (a column's accessor returning nothing renders Figma's literal
// "No data" placeholder inside that one cell) — matches how Figma's own "Empty state [not coded]"
// swatch is modeled as a sub-variant of the "Text only" cell type, not a whole-table state. A
// whole-table "no rows at all" empty state is a different, not-yet-designed feature — intentionally
// not built here per user direction, revisit once that design exists.
//
// `zebra` is forced off whenever `expandable` is true — a UX restriction per user decision, not a
// visual bug: alternating row shading reads ambiguously once rows can expand to variable heights.

import { Fragment, type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CaretIcon, DeleteIcon, DownloadIcon, EditIcon, InfoIcon, MoreIcon, SortIcon, StatusAlertIcon } from "./icons";
import Checkbox from "./Checkbox";
import Badge, { type BadgeColor, type BadgeType } from "./Badge";

export type TableHeaderVariant = "filled" | "outlined";
export type TableSortDirection = "asc" | "desc";
export type TableCellType = "text" | "link" | "iconText" | "badge" | "actionIcons" | "actionMenu" | "custom";

export interface TableRowData {
  id: string;
  [key: string]: unknown;
}

export interface TableLinkValue {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

export interface TableIconTextValue {
  label: string;
  icon: ReactNode;
}

export interface TableBadgeValue {
  label: string;
  type?: BadgeType;
  color?: BadgeColor;
}

export interface TableAction<T extends TableRowData = TableRowData> {
  label: string;
  /** Required for 'actionIcons' cells (bare icon button); optional leading icon for 'actionMenu'
   * items. */
  icon?: ReactNode;
  onClick: (row: T, rowIndex: number) => void;
  disabled?: boolean | ((row: T) => boolean);
}

export interface TableColumn<T extends TableRowData = TableRowData> {
  key: string;
  /** Column header label. Omit entirely for an icon-only header column (e.g. an actions column) —
   * it defaults to empty, which also gives the column a fixed width instead of stretching. */
  header?: string;
  headerIcon?: ReactNode;
  infoIcon?: boolean;
  infoText?: string;
  sortable?: boolean;
  /** CSS grid track value (e.g. "160px"). Omit for an equal flexible share of the row (`1fr`) —
   * matches CDS's own `flex: 1 1 0%` default. `actionIcons`/`actionMenu` columns ignore this in
   * favor of `max-content` sizing (see the header comment above). */
  width?: string;
  cellType?: TableCellType;
  /** Reads this column's raw cell value from a row — `string` for 'text', `TableLinkValue` for
   * 'link', `TableIconTextValue` for 'iconText', `TableBadgeValue` for 'badge'. Unused for
   * 'actionIcons'/'actionMenu' (use `actions` instead) and for 'custom' (use `render` instead). */
  accessor?: (row: T, rowIndex: number) => unknown;
  /** Required for cellType 'custom' — full escape hatch for anything not modeled directly (Button/
   * Switch/Select/Checkbox+text/Radio+text cells all fall under this). */
  render?: (row: T, rowIndex: number) => ReactNode;
  actions?: TableAction<T>[];
}

export interface TableProps<T extends TableRowData = TableRowData> {
  columns?: TableColumn<T>[];
  rows?: T[];
  headerVariant?: TableHeaderVariant;
  /** Alternating row background shading. Default false, matching CDS's own opt-in `zebra`. */
  zebra?: boolean;
  /** Outer border/rounded-corner/background. Default true — set false when nesting a `Table`
   * inside another `Table`'s `renderExpandedContent`, so it doesn't paint a redundant outline. */
  bordered?: boolean;
  selectable?: boolean;
  selectedRowIds?: string[];
  defaultSelectedRowIds?: string[];
  onSelectedRowIdsChange?: (ids: string[]) => void;
  expandable?: boolean;
  renderExpandedContent?: (row: T, rowIndex: number) => ReactNode;
  expandedRowIds?: string[];
  defaultExpandedRowIds?: string[];
  onExpandedRowIdsChange?: (ids: string[]) => void;
  sortColumnKey?: string;
  sortDirection?: TableSortDirection;
  onSortChange?: (columnKey: string, direction: TableSortDirection) => void;
  "aria-label"?: string;
  className?: string;
}

const DEFAULT_TABLE_COLUMNS: TableColumn[] = [
  {
    key: "name",
    header: "Name",
    sortable: true,
    cellType: "link",
    accessor: (row) => ({ label: String(row.name), href: "#" }) satisfies TableLinkValue,
  },
  {
    key: "status",
    header: "Status",
    cellType: "iconText",
    accessor: (row) =>
      ({
        label: String(row.statusLabel),
        icon: <StatusAlertIcon size={20} />,
      }) satisfies TableIconTextValue,
  },
  {
    key: "region",
    header: "Region",
    cellType: "text",
    accessor: (row) => row.region,
  },
  {
    key: "actions",
    width: "84px",
    cellType: "actionIcons",
    actions: [
      { label: "Edit", icon: <EditIcon size={20} />, onClick: () => {} },
      { label: "Download", icon: <DownloadIcon size={20} />, onClick: () => {} },
      { label: "Delete", icon: <DeleteIcon size={20} />, onClick: () => {} },
    ],
  },
];

const DEFAULT_TABLE_ROWS: TableRowData[] = [
  { id: "1", name: "web-server-01", statusLabel: "Running", region: "us-east" },
  { id: "2", name: "web-server-02", statusLabel: "Running", region: "us-east" },
  { id: "3", name: "db-primary", statusLabel: "Running", region: "eu-west" },
];

const HEADER_VARIANT_CLASSES: Record<
  TableHeaderVariant,
  { bg: string; text: string; border: string; iconDefault: string; iconGroupHover: string; iconActive: string }
> = {
  filled: {
    bg: "bg-[var(--component-table-headerfilled-background,#E5E5EA)]",
    text: "text-[color:var(--component-table-headerfilled-text,#343438)]",
    border: "border-[var(--component-table-headerfilled-border,#A3A3AB)]",
    iconDefault: "text-[color:var(--component-table-headerfilled-icon-default,#696970)]",
    iconGroupHover: "group-hover:text-[color:var(--component-table-headerfilled-icon-hover,#009CDE)]",
    iconActive: "text-[color:var(--component-table-headerfilled-icon-active,#0174BC)]",
  },
  outlined: {
    bg: "bg-white",
    text: "text-[color:var(--component-table-headeroutlined-text,#343438)]",
    border: "border-[var(--component-table-headeroutlined-border,#A3A3AB)]",
    iconDefault: "text-[color:var(--component-table-headeroutlined-icon-default,#696970)]",
    iconGroupHover: "group-hover:text-[color:var(--component-table-headeroutlined-icon-hover,#009CDE)]",
    iconActive: "text-[color:var(--component-table-headeroutlined-icon-active,#0174BC)]",
  },
};

const ROW_BORDER = "border-[var(--component-table-row-border,#D6D6DD)]";
const ROW_BG_DEFAULT = "bg-[var(--component-table-row-background-default,#FFFFFF)]";
const ROW_BG_ZEBRA = "bg-[var(--component-table-row-background-zebra,#F7F7FA)]";
const ROW_HOVER_GROUP = "group-hover:bg-[var(--component-table-row-background-hover,#EDF8FF)]";
const ROW_TEXT_DEFAULT = "text-[color:var(--component-table-row-text-default,#343438)]";
const ROW_ICON_DEFAULT = "text-[color:var(--component-table-row-icon-default,#3D3D42)]";
const ROW_ICON_HOVER = "hover:text-[color:var(--component-table-row-icon-hover,#009CDE)]";
const ROW_ICON_DISABLED = "disabled:text-[color:var(--component-table-row-icon-disabled,#A3A3AB)]";

function buildGridTemplateColumns<T extends TableRowData>(columns: TableColumn<T>[]): string {
  return columns
    .map((column) => {
      if (column.width) return column.width;
      if (!column.header) return "36px";
      if (column.cellType === "actionIcons" || column.cellType === "actionMenu") return "max-content";
      return "1fr";
    })
    .join(" ");
}

function HeaderCell<T extends TableRowData>({
  column,
  isFirst,
  variant,
  selectable,
  allSelected,
  someSelected,
  onToggleSelectAll,
  sorted,
  onSort,
}: {
  column: TableColumn<T>;
  isFirst: boolean;
  variant: TableHeaderVariant;
  selectable: boolean;
  allSelected: boolean;
  someSelected: boolean;
  onToggleSelectAll: () => void;
  sorted?: TableSortDirection;
  onSort?: () => void;
}) {
  const c = HEADER_VARIANT_CLASSES[variant];
  const iconOnly = !column.header;

  if (iconOnly) {
    return (
      <div
        role="columnheader"
        className={`flex min-w-0 items-center justify-center gap-[var(--global-spacing-s16,16px)] px-[var(--global-spacing-s8,8px)] py-[var(--global-spacing-s10,10px)] border-b border-solid ${c.bg} ${c.border} ${c.iconDefault}`}
      >
        {column.headerIcon}
      </div>
    );
  }

  return (
    <div
      role="columnheader"
      onClick={column.sortable ? onSort : undefined}
      onKeyDown={
        column.sortable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSort?.();
              }
            }
          : undefined
      }
      tabIndex={column.sortable ? 0 : undefined}
      className={`group flex min-w-0 items-center gap-[var(--global-spacing-s8,8px)] py-[var(--global-spacing-s12,12px)] pl-[var(--global-spacing-s12,12px)] pr-[var(--global-spacing-s16,16px)] first:pl-[var(--global-spacing-s24,24px)] last:pr-[var(--global-spacing-s24,24px)] border-b border-solid ${c.bg} ${c.border} ${column.sortable ? "cursor-pointer select-none" : ""}`}
    >
      {isFirst && selectable && (
        <span onClick={(e) => e.stopPropagation()}>
          <Checkbox
            size="small"
            aria-label="Select all rows"
            checked={allSelected}
            indeterminate={someSelected}
            onChange={onToggleSelectAll}
          />
        </span>
      )}
      <span className={`type-label-bold-s truncate ${c.text}`}>{column.header}</span>
      {column.infoIcon && <InfoIcon size={16} className={`shrink-0 ${c.iconDefault}`} aria-label={column.infoText} />}
      {column.sortable && (
        <SortIcon size={16} className={`shrink-0 ${sorted ? c.iconActive : `${c.iconDefault} ${c.iconGroupHover}`} ${sorted === "desc" ? "rotate-180" : ""}`} />
      )}
    </div>
  );
}

function RowActionMenu<T extends TableRowData>({
  actions,
  row,
  rowIndex,
}: {
  actions: TableAction<T>[];
  row: T;
  rowIndex: number;
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; right: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onReposition = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom, right: window.innerWidth - rect.right });
    };
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown", onEscape);
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("keydown", onEscape);
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition);
    };
  }, [open]);

  function handleToggle() {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom, right: window.innerWidth - rect.right });
    }
    setOpen((v) => !v);
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="More actions"
        onClick={handleToggle}
        className={`flex shrink-0 items-center justify-center ${ROW_ICON_DEFAULT} ${ROW_ICON_HOVER}`}
      >
        <MoreIcon size={20} />
      </button>
      {open &&
        position &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label="More actions"
            style={{ position: "fixed", top: position.top, right: position.right }}
            className="z-50 flex min-w-[160px] flex-col items-stretch py-[var(--global-spacing-s4,4px)] bg-white shadow-[0px_2px_8px_0px_rgba(58,59,63,0.18)]"
          >
            {actions.map((action) => {
              const disabled = typeof action.disabled === "function" ? action.disabled(row) : action.disabled;
              return (
                <button
                  key={action.label}
                  type="button"
                  role="menuitem"
                  disabled={disabled}
                  onClick={() => {
                    if (disabled) return;
                    action.onClick(row, rowIndex);
                    setOpen(false);
                  }}
                  className={`type-label-regular-s flex items-center gap-[var(--global-spacing-s8,8px)] py-[var(--global-spacing-s8,8px)] pl-[var(--global-spacing-s12,12px)] pr-[var(--global-spacing-s8,8px)] text-left disabled:cursor-not-allowed disabled:text-[color:var(--component-table-row-icon-disabled,#A3A3AB)] ${
                    disabled ? "" : `${ROW_TEXT_DEFAULT} hover:bg-[var(--component-table-row-background-hover,#EDF8FF)]`
                  }`}
                >
                  {action.icon}
                  {action.label}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}

function renderCellContent<T extends TableRowData>(column: TableColumn<T>, row: T, rowIndex: number): ReactNode {
  const type = column.cellType ?? "text";

  if (type === "custom") return column.render?.(row, rowIndex);

  if (type === "actionIcons") {
    return (
      <div className="flex items-center gap-[var(--global-spacing-s16,16px)]">
        {column.actions?.map((action) => {
          const disabled = typeof action.disabled === "function" ? action.disabled(row) : action.disabled;
          return (
            <button
              key={action.label}
              type="button"
              disabled={disabled}
              onClick={() => action.onClick(row, rowIndex)}
              aria-label={action.label}
              title={action.label}
              className={`flex shrink-0 items-center justify-center ${ROW_ICON_DEFAULT} ${ROW_ICON_HOVER} ${ROW_ICON_DISABLED} disabled:cursor-not-allowed`}
            >
              {action.icon}
            </button>
          );
        })}
      </div>
    );
  }

  if (type === "actionMenu") {
    return <RowActionMenu actions={column.actions ?? []} row={row} rowIndex={rowIndex} />;
  }

  const value = column.accessor?.(row, rowIndex);

  if (type === "link") {
    const v = value as TableLinkValue | undefined;
    if (!v) return null;
    return (
      <a
        href={v.href}
        onClick={v.onClick}
        className="flex min-w-0 items-center gap-[var(--global-spacing-s8,8px)] text-[color:var(--component-table-row-text-link,#0174BC)] hover:underline"
      >
        {v.icon}
        <span className="type-body-regular truncate">{v.label}</span>
      </a>
    );
  }

  if (type === "iconText") {
    const v = value as TableIconTextValue | undefined;
    if (!v) return null;
    return (
      <span className="flex min-w-0 items-center gap-[var(--global-spacing-s8,8px)]">
        <span className={`shrink-0 ${ROW_ICON_DEFAULT}`}>{v.icon}</span>
        <span className={`type-body-regular truncate ${ROW_TEXT_DEFAULT}`}>{v.label}</span>
      </span>
    );
  }

  if (type === "badge") {
    const v = value as TableBadgeValue | undefined;
    if (!v) return null;
    return <Badge type={v.type} color={v.color} label={v.label} />;
  }

  // 'text' (default) — matches Figma's "Text only" cell family, which also models the per-cell
  // "Empty state" swatch as one of its own sub-variants (not a whole-table state): an
  // empty/missing accessor value renders the literal placeholder-colored "No data" text.
  const text = value === undefined || value === null || value === "" ? undefined : String(value);
  if (!text) {
    return (
      <span className="type-body-regular truncate text-[color:var(--component-table-row-text-placeholder,#696970)]">
        No data
      </span>
    );
  }
  return <span className={`type-body-regular truncate ${ROW_TEXT_DEFAULT}`}>{text}</span>;
}

export default function Table<T extends TableRowData = TableRowData>({
  columns = DEFAULT_TABLE_COLUMNS as TableColumn<T>[],
  rows = DEFAULT_TABLE_ROWS as T[],
  headerVariant = "filled",
  zebra = false,
  bordered = true,
  selectable = false,
  selectedRowIds,
  defaultSelectedRowIds = [],
  onSelectedRowIdsChange,
  expandable = false,
  renderExpandedContent,
  expandedRowIds,
  defaultExpandedRowIds = [],
  onExpandedRowIdsChange,
  sortColumnKey,
  sortDirection,
  onSortChange,
  className,
  "aria-label": ariaLabel,
}: TableProps<T>) {
  if (import.meta.env?.DEV && zebra && expandable) {
    console.warn(
      "Table: `zebra` is ignored while `expandable` is true — alternating row shading is a UX restriction on expandable tables, rows always render on the default background instead.",
    );
  }

  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>(defaultSelectedRowIds);
  const effectiveSelectedIds = new Set(selectedRowIds ?? internalSelectedIds);

  const [internalExpandedIds, setInternalExpandedIds] = useState<string[]>(defaultExpandedRowIds);
  const effectiveExpandedIds = new Set(expandedRowIds ?? internalExpandedIds);

  function setSelected(ids: string[]) {
    if (selectedRowIds === undefined) setInternalSelectedIds(ids);
    onSelectedRowIdsChange?.(ids);
  }

  function setExpanded(ids: string[]) {
    if (expandedRowIds === undefined) setInternalExpandedIds(ids);
    onExpandedRowIdsChange?.(ids);
  }

  function toggleSelectAll() {
    setSelected(allSelected ? [] : rows.map((r) => r.id));
  }

  function toggleRowSelected(rowId: string) {
    const next = effectiveSelectedIds.has(rowId)
      ? [...effectiveSelectedIds].filter((id) => id !== rowId)
      : [...effectiveSelectedIds, rowId];
    setSelected(next);
  }

  function toggleRowExpanded(rowId: string) {
    const next = effectiveExpandedIds.has(rowId)
      ? [...effectiveExpandedIds].filter((id) => id !== rowId)
      : [...effectiveExpandedIds, rowId];
    setExpanded(next);
  }

  function handleSort(columnKey: string) {
    const direction: TableSortDirection = sortColumnKey === columnKey && sortDirection === "asc" ? "desc" : "asc";
    onSortChange?.(columnKey, direction);
  }

  const allSelected = rows.length > 0 && rows.every((r) => effectiveSelectedIds.has(r.id));
  const someSelected = !allSelected && rows.some((r) => effectiveSelectedIds.has(r.id));

  return (
    <div
      role="table"
      aria-label={ariaLabel}
      style={{ gridTemplateColumns: buildGridTemplateColumns(columns) }}
      className={`grid ${bordered ? `border border-solid ${ROW_BORDER} rounded-[4px] overflow-hidden` : ""} ${className ?? ""}`}
    >
      <div role="row" className="contents">
        {columns.map((column, i) => (
          <HeaderCell
            key={column.key}
            column={column}
            isFirst={i === 0}
            variant={headerVariant}
            selectable={selectable}
            allSelected={allSelected}
            someSelected={someSelected}
            onToggleSelectAll={toggleSelectAll}
            sorted={sortColumnKey === column.key ? sortDirection : undefined}
            onSort={() => handleSort(column.key)}
          />
        ))}
      </div>
      {rows.map((row, rowIndex) => {
        const isSelected = effectiveSelectedIds.has(row.id);
        const isExpanded = effectiveExpandedIds.has(row.id);
        const rowBg = !expandable && zebra && rowIndex % 2 === 1 ? ROW_BG_ZEBRA : ROW_BG_DEFAULT;
        return (
          <Fragment key={row.id}>
            <div role="row" className="group contents">
              {columns.map((column, colIndex) => (
                <div
                  key={column.key}
                  role="cell"
                  className={`flex h-[40px] min-w-0 items-center gap-[var(--global-spacing-s8,8px)] px-[var(--global-spacing-s12,12px)] py-[var(--global-spacing-s10,10px)] first:pl-[var(--global-spacing-s24,24px)] last:pr-[var(--global-spacing-s24,24px)] border-b border-solid ${ROW_BORDER} ${rowBg} ${ROW_HOVER_GROUP}`}
                >
                  {colIndex === 0 && selectable && (
                    <Checkbox
                      size="small"
                      aria-label={`Select row ${rowIndex + 1}`}
                      checked={isSelected}
                      onChange={() => toggleRowSelected(row.id)}
                      className="shrink-0"
                    />
                  )}
                  {colIndex === 0 && expandable && (
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-label={isExpanded ? "Collapse row" : "Expand row"}
                      onClick={() => toggleRowExpanded(row.id)}
                      className={`flex shrink-0 items-center justify-center transition-transform duration-200 ${isExpanded ? "rotate-90" : ""} ${ROW_ICON_DEFAULT} ${ROW_ICON_HOVER}`}
                    >
                      <CaretIcon size={20} />
                    </button>
                  )}
                  <div className="min-w-0 flex-1">{renderCellContent(column, row, rowIndex)}</div>
                </div>
              ))}
            </div>
            {expandable && isExpanded && (
              <div role="row" className="contents">
                <div
                  role="cell"
                  style={{ gridColumn: "1 / -1" }}
                  className={`flex px-[var(--global-spacing-s24,24px)] py-[var(--global-spacing-s16,16px)] border-b border-solid ${ROW_BORDER} ${rowBg}`}
                >
                  {renderExpandedContent?.(row, rowIndex)}
                </div>
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
