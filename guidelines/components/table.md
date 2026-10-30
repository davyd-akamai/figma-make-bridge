# Table

Data table with typed cells, sorting, row selection and row expansion.

## When to use / when not to use

- Use for rows of data.
- Scope is the table only. There is no toolbar, search or whole-table empty state. Compose those around it.
- Pagination is the exception. It is the table's last row, so pass it through the `pagination` prop. Never render `<Pagination>` as a separate element under a table (see components/pagination.md).
- Do NOT wrap it in a `Container`. It owns its bordered wrapper.

## Import

```tsx
import { Table, type TableProps, type TableColumn, type TableRowData, type TableAction, type TableSortDirection } from "figma-make-bridge";
```

## Props

| Prop | Type | Default | Allowed values |
|---|---|---|---|
| `columns` | `TableColumn[]` | demo columns | Always pass |
| `rows` | `TableRowData[]` | demo rows | Always pass. Each row has a unique string `id` |
| `headerVariant` | `TableHeaderVariant` | `"filled"` | `"filled"`, `"outlined"` |
| `zebra` | `boolean` | `false` | |
| `bordered` | `boolean` | `true` | |
| `pagination` | `ReactNode` | none | A `<Pagination />`. Rendered inside the table's border as its last row |
| `selectable` | `boolean` | `false` | |
| `selectedRowIds` / `defaultSelectedRowIds` | `string[]` | unset / `[]` | |
| `onSelectedRowIdsChange` | `(ids: string[]) => void` | none | |
| `expandable` | `boolean` | `false` | |
| `renderExpandedContent` | `(row, rowIndex) => ReactNode` | none | |
| `expandedRowIds` / `defaultExpandedRowIds` | `string[]` | unset / `[]` | |
| `onExpandedRowIdsChange` | `(ids: string[]) => void` | none | |
| `sortColumnKey` | `string` | none | |
| `sortDirection` | `TableSortDirection` | none | `"asc"`, `"desc"` |
| `onSortChange` | `(columnKey: string, direction: TableSortDirection) => void` | none | |
| `aria-label` / `className` | `string` | none | |

`TableColumn`:

| Field | Type | Notes |
|---|---|---|
| `key` | `string` | Required |
| `header` | `string` | Omit for an icon-only header. Never pass `""` |
| `headerIcon`, `infoIcon`, `infoText` | `ReactNode`, `boolean`, `string` | Optional. `infoIcon` shows a `Tooltip` with `infoText` on hover or keyboard focus; always pass `infoText` |
| `sortable` | `boolean` | Makes the header clickable |
| `width` | `string` | CSS grid track, e.g. `"160px"`. Omit for an equal share |
| `cellType` | `TableCellType` | Default `"text"` |
| `accessor` | `(row, rowIndex) => unknown` | Raw cell value per `cellType` |
| `render` | `(row, rowIndex) => ReactNode` | Required for `"custom"` |
| `actions` | `TableAction[]` | For `"actionIcons"` and `"actionMenu"` |

`TableAction`: `{ label: string; icon?: ReactNode; onClick: (row, rowIndex) => void; disabled?: boolean | ((row) => boolean) }`. `icon` is required for `actionIcons`.

## Valid values

| `cellType` | `accessor` returns |
|---|---|
| `"text"` | `string` |
| `"link"` | `{ label; href?; onClick?; icon? }` |
| `"iconText"` | `{ label; icon }` (status with a colored icon) |
| `"badge"` | `{ label; type?; color? }` (same values as `Badge`, see components/badge.md) |
| `"actionIcons"` | none: bare icon buttons from `actions` |
| `"actionMenu"` | none: "..." row menu from `actions` |
| `"custom"` | none: use `render` |

- Invalid or non-existent: `headerVariant="nested"`, `cellType="button"`, `"select"`, `"switch"`, `"checkbox"`, `"status"`, an action `variant` or `danger` flag.

## Correct

```tsx
<Table columns={columns} rows={rows} sortColumnKey={sort.key} sortDirection={sort.dir}
  onSortChange={(key, dir) => setSort({ key, dir })} />
```

## Incorrect

```tsx
<Container><Table columns={columns} rows={rows} sortable zebra expandable headerVariant="nested" /></Container>
```

## Known footguns

- All cell text truncates on one line with an ellipsis. Never write custom truncation or wrapping per column.
- Pagination always goes through the `pagination` prop. It acts as the last row of the table. Never place `<Pagination>` below the table. Never wrap it in your own container, border or margin.
- When converting a design that has pagination under a table, move it into the `pagination` prop and delete its wrapper.
- Pagination under a table goes in `pagination={<Pagination ... />}`, never next to the table. In the slot there is no gap and exactly one border between the last row and the pagination bar. Placed separately you get a gap and a double border. You still slice `rows` yourself for the current page.
- A bordered table draws no extra line under its last row (the table border is the bottom edge). Do not add your own bottom border or margin under it.
- **Sorting is fully controlled. `Table` never reorders `rows`.** On `onSortChange`, you re-sort your rows and pass back `sortColumnKey` and `sortDirection` so the header shows the active state.
- A `Button`, `Checkbox`, `RadioButton`, `Select` or `Switch` in a cell goes through `cellType: "custom"` with `render`. There is no dedicated cell type. In a cell, use `<Switch size="small" aria-label="..." />`.
- A `text` cell with `undefined`, `null` or `""` shows a placeholder-colored "No data". Do not pre-fill empty cells with dashes.
- `selectable` adds a checkbox and a select-all to the first column. `expandable` adds a caret to the first column and renders `renderExpandedContent`. Built-in checkboxes are already `size="small"`.
- **`zebra` is ignored whenever `expandable` is true.** Do not combine them expecting stripes.
- Columns share the row equally. A column with no `header` gets a fixed narrow width. `actionIcons` and `actionMenu` columns size to content and never stretch.
- All actions render in the same default style. There is no destructive styling.
- Nested table: render a second `Table` in `renderExpandedContent` with `bordered={false}` and the default `headerVariant`.

## Custom UI

- Links have no underline in any state.
- Interactive elements use `cursor-pointer`.
