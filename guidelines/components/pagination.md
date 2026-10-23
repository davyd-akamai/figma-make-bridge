# Pagination

40px bar for paging through a large set of items: total count, page-size picker, "1 - 20 of 50" range and previous/next chevrons. It has a "list selected" mode with Select / Deselect / "Selected only" actions.

## When to use / when not to use

- Use under a `Table` or a list that shows only part of a bigger data set (`variant="table"` or `"list"`).
- Use `selectable` on a list (not a table) to select every item in that list and filter it down to the selected ones.
- Pagination only displays state and fires callbacks. It never slices your data, never stores the selection and never filters anything. You do all three.
- There are no numbered page buttons, no jump-to-page input and no first/last buttons.

## Import

```tsx
import { Pagination, DEFAULT_PAGE_SIZE_OPTIONS, type PaginationProps } from "figma-make-bridge";
```

## Props

```ts
type PaginationVariant = "table" | "list";

interface PaginationProps {
  variant?: PaginationVariant;                 // default "table"
  length?: number;                             // total items, default 50
  pageIndex?: number;                          // 1-based, controlled
  defaultPageIndex?: number;                   // default 1
  onPageChange?: (pageIndex: number) => void;
  pageSize?: number;                           // controlled
  defaultPageSize?: number;                    // default 20
  pageSizeOptions?: number[];                  // default [10, 20, 50, 100]
  onPageSizeChange?: (pageSize: number, pageIndex: number) => void;
  itemsLabel?: string;                         // default "Items:"
  pageSizeLabel?: string;                      // default "Page size:"
  ofLabel?: string;                            // default "of"
  disabled?: boolean;
  selectable?: boolean;                        // list variant only
  selectedCount?: number;                      // default 0
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  selectedOnly?: boolean;                      // controlled "Selected only" checkbox
  defaultSelectedOnly?: boolean;               // default false
  onSelectedOnlyChange?: (selectedOnly: boolean) => void;
  className?: string;
}
```

## Valid values

- `variant`: `"table"` (item counter on the left) or `"list"` (page-size picker on the left).
- Invalid or non-existent: `page`, `count`, `total`, `totalItems`, `totalPages`, `onChange`, `onPageSizeChanged`, `pageSizes`, `showSizeChanger`, `hideControls`, `size`, `compact`.

## Correct

```tsx
const [page, setPage] = useState(1);
const [size, setSize] = useState(20);

<Table rows={rows.slice((page - 1) * size, page * size)} columns={columns} />
<Pagination
  length={rows.length}
  pageIndex={page}
  onPageChange={setPage}
  pageSize={size}
  onPageSizeChange={(s, p) => { setSize(s); setPage(p); }}
/>
```

Selection mode on a list:

```tsx
<Pagination
  variant="list"
  selectable
  length={items.length}
  selectedCount={selected.length}
  onSelectAll={() => setSelected(items.map((i) => i.id))}
  onDeselectAll={() => setSelected([])}
  selectedOnly={selectedOnly}
  onSelectedOnlyChange={setSelectedOnly}
/>
{(selectedOnly ? items.filter((i) => selected.includes(i.id)) : items).map(renderItem)}
```

## Incorrect

```tsx
<Pagination page={2} total={200} onChange={setPage} pageSizes={[10, 25]} />
```

`page`, `total`, `onChange` and `pageSizes` do not exist. Use `pageIndex`, `length`, `onPageChange` and `pageSizeOptions`.

## Known footguns

- "Items: N" and "of N" both show `length`, the total number of items.
- `length` defaults to 50 and `pageSize` to 20 as sample data. Always pass your real `length`.
- The page is clamped to the last page when `length` or `pageSize` shrinks, but `onPageChange` is not fired for that clamp. Reset your own page state when you filter or reload the data.
- `onPageSizeChange` receives the new size AND the page that keeps the first visible item on screen (page 2 of 10 becomes page 3 of 5). Set both. The prev/next chevrons fire only `onPageChange`.
- With `pageIndex` (or `pageSize`) set and no matching callback, the chevrons (or the picker) appear to do nothing. Pass both or neither.
- `selectable` only works with `variant="list"`; it is ignored on `"table"` (a dev warning is logged). In selection mode the page-size picker, range and chevrons are NOT shown, so the list should not be paged.
- "Select: N" fires `onSelectAll` and always shows `length`; "Deselect" and "Selected only" are disabled while `selectedCount` is 0. If the count drops to 0 while "Selected only" is on, it is switched off and `onSelectedOnlyChange(false)` fires.
- The page-size menu opens above the picker when there is no room below it.
- Use it full width, directly under the content it pages. It is always 40px tall.
