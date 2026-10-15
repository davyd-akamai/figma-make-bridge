# Composition examples

Copy these patterns. They use only valid props. Read the matching component file before changing them.

## Basic page

Defaults cover almost every case. `DefaultCmPageTemplate` supplies header, side navigation and footer (composition/page-shell.md).

```tsx
import { Container, DefaultCmPageTemplate } from "@make-kits/ads-components";

export default function Page() {
  return (
    <DefaultCmPageTemplate>
      <h1 className="type-heading-xxl" style={{ margin: 0 }}>Page title</h1>
      <div style={{ marginTop: "var(--global-spacing-s16)" }}>
        <Container>
          <p className="type-body-regular" style={{ margin: 0 }}>Page content</p>
        </Container>
      </div>
    </DefaultCmPageTemplate>
  );
}
```

## Real multi-page navigation

Selection is controlled and wired to the content that is shown.

```tsx
import { useState } from "react";
import { DefaultCmPageTemplate } from "@make-kits/ads-components";

export default function App() {
  const [pageId, setPageId] = useState("linodes");
  return (
    <DefaultCmPageTemplate sideNavProps={{ selectedPageId: pageId, onSelectPage: (id) => setPageId(id) }}>
      <h1 className="type-heading-xxl" style={{ margin: 0 }}>{pageId}</h1>
    </DefaultCmPageTemplate>
  );
}
```

## Adding a product to an existing section, with a badge

```tsx
import { DEFAULT_SIDE_NAV_SECTIONS, DefaultCmPageTemplate, type SideNavSection } from "@make-kits/ads-components";

const sections: SideNavSection[] = DEFAULT_SIDE_NAV_SECTIONS.map((section) =>
  section.id === "compute"
    ? {
        ...section,
        pages: [...section.pages, { id: "gpu-instances", label: "GPU Instances", badge: { type: "new" } }],
      }
    : section
);

export default function Page() {
  return <DefaultCmPageTemplate sideNavProps={{ sections }}>{/* page content */}</DefaultCmPageTemplate>;
}
```

## Frozen rail for an isolated preview

A narrow escape hatch, not the default (components/side-navigation.md).

```tsx
import { SideNavigation } from "@make-kits/ads-components";

<SideNavigation menu="mini" />;
```

## Controlled Table with sorting

The consumer sorts the rows (components/table.md).

```tsx
import { useState } from "react";
import { Table, type TableColumn, type TableRowData, type TableSortDirection } from "@make-kits/ads-components";

const columns: TableColumn[] = [
  { key: "name", header: "Name", sortable: true, accessor: (row) => row.name },
  { key: "region", header: "Region", accessor: (row) => row.region },
];

export default function Instances({ data }: { data: TableRowData[] }) {
  const [sort, setSort] = useState<{ key: string; dir: TableSortDirection }>({ key: "name", dir: "asc" });
  const rows = [...data].sort((a, b) =>
    String(a[sort.key]).localeCompare(String(b[sort.key])) * (sort.dir === "asc" ? 1 : -1)
  );
  return (
    <Table
      columns={columns}
      rows={rows}
      sortColumnKey={sort.key}
      sortDirection={sort.dir}
      onSortChange={(key, dir) => setSort({ key, dir })}
    />
  );
}
```

## Drawer opened from a Button

```tsx
import { useState } from "react";
import { Button, Drawer } from "@make-kits/ads-components";

export default function EditPanel() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Edit</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Edit instance"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </>
        }
      >
        <p className="type-body-regular">Drawer content</p>
      </Drawer>
    </>
  );
}
```
