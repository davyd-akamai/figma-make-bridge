import { useState, type ReactNode } from "react";
import GlobalHeader from "../components/GlobalHeader";
import GlobalFooter from "../components/GlobalFooter";
import SideNavigation from "../components/SideNavigation";
import Button, { type ButtonVariant } from "../components/Button";
import Checkbox from "../components/Checkbox";
import RadioButton from "../components/RadioButton";
import Container from "../components/Container";
import TextField from "../components/TextField";
import Badge, { type BadgeType, type BadgeColor } from "../components/Badge";
import SystemBadge from "../components/SystemBadge";
import TabsHorizontal, { type TabsHorizontalTab } from "../components/TabsHorizontal";
import Drawer, { type DrawerSize } from "../components/Drawer";
import Table, { type TableColumn, type TableRowData, type TableSortDirection } from "../components/Table";
import DefaultCmPageTemplate from "../templates/DefaultCmPageTemplate";
import {
  ArrowLeftIcon,
  BellIcon,
  BucketIcon,
  CaretIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  CommunityIcon,
  ComputeIcon,
  DeleteIcon,
  DotIcon,
  DownloadIcon,
  EditIcon,
  HelpCircleIcon,
  InfoIcon,
  MenuIcon,
  MinusIcon,
  MonitorIcon,
  MoreIcon,
  NetworkIcon,
  PinIcon,
  PlusIcon,
  SearchIcon,
  ServerIcon,
  SortIcon,
  StatusAlertIcon,
  UserIcon,
} from "../components/icons";

// Internal preview/demo harness only — not part of the shipped component library.
// Keep this in sync with every export from components/icons (minus SpinnerIcon, which needs a
// dark/colored background to be visible and is previewed in the Button section instead) — it
// doubles as a visual regression check whenever a new icon is added.
const ALL_ICONS = [
  ArrowLeftIcon,
  BellIcon,
  BucketIcon,
  CaretIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  CommunityIcon,
  ComputeIcon,
  DeleteIcon,
  DotIcon,
  DownloadIcon,
  EditIcon,
  HelpCircleIcon,
  InfoIcon,
  MenuIcon,
  MinusIcon,
  MonitorIcon,
  MoreIcon,
  NetworkIcon,
  PinIcon,
  PlusIcon,
  SearchIcon,
  ServerIcon,
  SortIcon,
  StatusAlertIcon,
  UserIcon,
];

function PreviewSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <h2 className="type-heading-m" style={{ margin: 0 }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function LongPlaceholderContent() {
  return (
    <>
      {Array.from({ length: 150 }).map((_, i) => (
        <p key={i} className="type-body-regular">
          Placeholder page content block {i + 1}. This paragraph exists only to give the page enough
          height to scroll, so the shell's sticky/scroll behavior can be verified.
        </p>
      ))}
    </>
  );
}

function ShortPlaceholderContent() {
  return <p className="type-body-regular">Just one short paragraph of placeholder content.</p>;
}

// Rendered in isolation via ?frame=template&variant=..., one level down inside each iframe in
// BreakpointPreview below. Tailwind's desktop:/tablet: breakpoints are real viewport media queries,
// not container queries, so a width-constrained <div> in the main page can't trigger GlobalHeader/
// SideNavigation/GlobalFooter's mobile/tablet layouts — only an iframe gives that subtree its own
// independent viewport width to key off of.
function TemplateFrame({ variant }: { variant: "long" | "short" }) {
  const [selectedPageId, setSelectedPageId] = useState("linodes");
  const [pinned, setPinned] = useState(true);
  return (
    <DefaultCmPageTemplate
      sideNavProps={{ selectedPageId, onSelectPage: setSelectedPageId, pinned, onPinToggle: setPinned }}
    >
      {variant === "long" ? <LongPlaceholderContent /> : <ShortPlaceholderContent />}
    </DefaultCmPageTemplate>
  );
}

function BreakpointPreview({
  title,
  width,
  height,
  variant,
}: {
  title: string;
  width: number;
  height: number;
  variant: "long" | "short";
}) {
  return (
    <div>
      <p className="type-body-regular" style={{ margin: "0 0 8px" }}>
        {title} ({width}px)
      </p>
      <iframe
        src={`?frame=template&variant=${variant}`}
        width={width}
        height={height}
        style={{ border: "1px solid #E5E5EA", display: "block", maxWidth: "100%" }}
        title={`${title} preview`}
      />
    </div>
  );
}

// Native CSS `resize` on the wrapper, with the iframe filling it at 100%/100% — dragging the
// bottom-right handle changes the iframe's own viewport width/height live, so GlobalHeader/
// SideNavigation/GlobalFooter's real breakpoints react in real time instead of only showing fixed
// snapshots.
function ResizableTemplatePreview({ title, variant }: { title: string; variant: "long" | "short" }) {
  return (
    <div>
      <p className="type-body-regular" style={{ margin: "0 0 8px" }}>
        {title} — drag the bottom-right corner to resize and watch the layout respond live.
      </p>
      <div
        style={{
          resize: "both",
          overflow: "hidden",
          border: "1px solid #E5E5EA",
          width: 1280,
          height: 800,
          maxWidth: "100%",
          minWidth: 320,
          minHeight: 300,
        }}
      >
        <iframe
          src={`?frame=template&variant=${variant}`}
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
          title={`${title} preview`}
        />
      </div>
    </div>
  );
}

function TextFieldSection() {
  const [controlledValue, setControlledValue] = useState("Input text");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24, padding: 12, border: "1px solid #E5E5EA" }}>
      <div style={{ width: 260 }}>
        <TextField label="Label" placeholder="Placeholder" />
      </div>
      <div style={{ width: 260 }}>
        <TextField label="Label" value={controlledValue} onChange={setControlledValue} helperText="Hint text" />
      </div>
      <div style={{ width: 320 }}>
        <TextField label="Label" labelPosition="left" defaultValue="Input text" />
      </div>
      <div style={{ width: 260 }}>
        <TextField label="Label" defaultValue="Input text" errorText="Warning text" />
      </div>
      <div style={{ width: 260 }}>
        <TextField label="Label" defaultValue="Input text" disabled helperText="Hint text" />
      </div>
      <div style={{ width: 260 }}>
        <TextField label="Label" defaultValue="Input text" readOnly infoIcon infoText="More information about this field" />
      </div>
      <div style={{ width: 260 }}>
        <TextField placeholder="No label, no info icon" />
      </div>
      <div style={{ width: 260 }}>
        <TextField label="Label" placeholder="With info icon" infoIcon infoText="More information about this field" />
      </div>
    </div>
  );
}

function CheckboxSection() {
  const [controlledChecked, setControlledChecked] = useState(true);
  const [items, setItems] = useState([true, false, false]);
  const allChecked = items.every(Boolean);
  const someChecked = items.some(Boolean);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: 12, border: "1px solid #E5E5EA" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        <Checkbox label="Unchecked" defaultChecked={false} />
        <Checkbox label="Checked" defaultChecked={true} />
        <Checkbox label="Indeterminate" indeterminate />
        <Checkbox
          label={`Controlled (${controlledChecked ? "checked" : "unchecked"})`}
          checked={controlledChecked}
          onChange={setControlledChecked}
        />
        <Checkbox label="Disabled unchecked" disabled />
        <Checkbox label="Disabled checked" defaultChecked disabled />
        <Checkbox label="Read-only unchecked" readOnly />
        <Checkbox label="Read-only checked" defaultChecked readOnly />
        <Checkbox label="With info icon" infoIcon infoText="More information about this option" />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 24 }}>
        <span className="type-body-regular">Small size:</span>
        <Checkbox size="small" label="Unchecked" />
        <Checkbox size="small" label="Checked" defaultChecked />
        <Checkbox size="small" label="Indeterminate" indeterminate />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span className="type-body-regular">Select-all pattern (indeterminate driven by children):</span>
        <Checkbox
          label="Select all"
          checked={allChecked}
          indeterminate={someChecked && !allChecked}
          onChange={(checked) => {
            setItems(items.map(() => checked));
          }}
        />
        <div style={{ display: "flex", gap: 16, paddingLeft: 24 }}>
          {items.map((checked, i) => (
            <Checkbox
              key={i}
              label={`Item ${i + 1}`}
              checked={checked}
              onChange={(next) => {
                setItems(items.map((v, idx) => (idx === i ? next : v)));
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function RadioButtonSection() {
  const [plan, setPlan] = useState("basic");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: 12, border: "1px solid #E5E5EA" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        <RadioButton name="static-demo" label="Unselected" />
        <RadioButton name="static-demo-2" label="Selected" defaultChecked />
        <RadioButton name="static-demo" label="Disabled unselected" disabled />
        <RadioButton name="static-demo-2" label="Disabled selected" defaultChecked disabled />
        <RadioButton name="static-demo" label="Read-only unselected" readOnly />
        <RadioButton name="static-demo-2" label="Read-only selected" defaultChecked readOnly />
        <RadioButton label="With info icon" infoIcon infoText="More information about this option" />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 24 }}>
        <span className="type-body-regular">Small size:</span>
        <RadioButton size="small" name="static-demo-small" label="Unselected" />
        <RadioButton size="small" name="static-demo-small" label="Selected" defaultChecked />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span className="type-body-regular">Controlled group (shared state, current: {plan}):</span>
        <div style={{ display: "flex", gap: 16 }}>
          <RadioButton
            name="plan"
            label="Basic"
            checked={plan === "basic"}
            onChange={() => setPlan("basic")}
          />
          <RadioButton
            name="plan"
            label="Pro"
            checked={plan === "pro"}
            onChange={() => setPlan("pro")}
          />
          <RadioButton
            name="plan"
            label="Enterprise"
            checked={plan === "enterprise"}
            onChange={() => setPlan("enterprise")}
          />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span className="type-body-regular">Uncontrolled group (native `name` grouping, no state wiring):</span>
        <div style={{ display: "flex", gap: 16 }}>
          <RadioButton name="uncontrolled-demo" label="Option A" defaultChecked />
          <RadioButton name="uncontrolled-demo" label="Option B" />
          <RadioButton name="uncontrolled-demo" label="Option C" />
        </div>
      </div>
    </div>
  );
}

const BADGE_COLORS: BadgeColor[] = ["ultramarine", "purple", "pink", "neutral", "amber", "green", "red"];
const BADGE_TYPES: BadgeType[] = ["subtle", "accent"];

function BadgeSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: 12, border: "1px solid #E5E5EA" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span className="type-body-regular">All type &times; color combinations:</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {BADGE_TYPES.map((type) => (
            <div key={type} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
              {BADGE_COLORS.map((color) => (
                <Badge key={color} type={type} color={color} label={`${type} / ${color}`} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
        <span className="type-body-regular">With icon:</span>
        <Badge type="subtle" color="green" icon label="Active" />
        <Badge type="accent" color="red" icon label="Failed" />
        <Badge type="subtle" color="amber" icon label="Pending" />
      </div>
    </div>
  );
}

const TABS_WITH_EXTRAS: TabsHorizontalTab[] = [
  { id: "overview", label: "Overview", icon: <ArrowLeftIcon size={16} /> },
  { id: "configuration", label: "Configuration", badge: "New" },
  { id: "monitoring", label: "Monitoring" },
  { id: "activity", label: "Activity log" },
  { id: "access", label: "Access control", disabled: true },
  { id: "tags", label: "Tags" },
];

function TabsHorizontalSection() {
  const [largeSelected, setLargeSelected] = useState("overview");
  const [smallSelected, setSmallSelected] = useState("overview");
  const [overflowSelected, setOverflowSelected] = useState("overview");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: 12, border: "1px solid #E5E5EA" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span className="type-body-regular">Large — icon, badge, and disabled tab:</span>
        <TabsHorizontal
          size="large"
          tabs={TABS_WITH_EXTRAS}
          selectedTabId={largeSelected}
          onSelectTab={setLargeSelected}
          aria-label="Large tabs example"
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span className="type-body-regular">Small:</span>
        <TabsHorizontal
          size="small"
          tabs={TABS_WITH_EXTRAS}
          selectedTabId={smallSelected}
          onSelectTab={setSmallSelected}
          aria-label="Small tabs example"
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span className="type-body-regular">
          Collapsible: container is too narrow for every tab, so trailing tabs move into the "..."
          overflow menu (selected: {overflowSelected}):
        </span>
        <div style={{ width: 320 }}>
          <TabsHorizontal
            size="large"
            selectedTabId={overflowSelected}
            onSelectTab={setOverflowSelected}
            aria-label="Collapsible tabs example"
          />
        </div>
      </div>
    </div>
  );
}

interface InstanceRow extends TableRowData {
  name: string;
  status: "running" | "stopped" | "error";
  plan: string;
  region: string;
  tags: string[];
}

const STATUS_COLOR: Record<InstanceRow["status"], string> = {
  running: "#138246",
  stopped: "#696970",
  error: "#B82329",
};

const STATUS_LABEL: Record<InstanceRow["status"], string> = {
  running: "Running",
  stopped: "Stopped",
  error: "Error",
};

const INSTANCE_ROWS: InstanceRow[] = [
  { id: "1", name: "web-server-01", status: "running", plan: "Dedicated 4GB", region: "us-east", tags: ["prod", "web"] },
  { id: "2", name: "web-server-02", status: "running", plan: "Dedicated 4GB", region: "us-east", tags: ["prod", "web"] },
  { id: "3", name: "db-primary", status: "running", plan: "High Memory 16GB", region: "eu-west", tags: ["prod", "db"] },
  { id: "4", name: "db-replica", status: "stopped", plan: "High Memory 16GB", region: "eu-west", tags: ["prod", "db", "replica"] },
  { id: "5", name: "batch-worker-01", status: "error", plan: "Shared 2GB", region: "ap-south", tags: ["batch"] },
];

const INSTANCE_COLUMNS: TableColumn<InstanceRow>[] = [
  {
    key: "name",
    header: "Name",
    sortable: true,
    cellType: "link",
    accessor: (row) => ({ label: row.name, href: "#" }),
  },
  {
    key: "status",
    header: "Status",
    cellType: "iconText",
    accessor: (row) => ({
      label: STATUS_LABEL[row.status],
      icon: <DotIcon size={20} style={{ color: STATUS_COLOR[row.status] }} />,
    }),
  },
  {
    key: "plan",
    header: "Plan",
    cellType: "badge",
    accessor: (row) => ({ label: row.plan, type: "subtle", color: "ultramarine" }),
  },
  { key: "region", header: "Region", sortable: true, cellType: "text", accessor: (row) => row.region },
  {
    key: "tags",
    header: "Tags",
    cellType: "custom",
    render: (row) => (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {row.tags.map((tag) => (
          <Badge key={tag} type="subtle" color="neutral" label={tag} />
        ))}
      </div>
    ),
  },
  {
    key: "actions",
    cellType: "actionMenu",
    actions: [
      { label: "Edit", onClick: (row) => alert(`Edit ${row.name}`) },
      { label: "Restart", onClick: (row) => alert(`Restart ${row.name}`) },
      { label: "Delete", onClick: (row) => alert(`Delete ${row.name}`) },
    ],
  },
];

const COMPACT_COLUMNS: TableColumn<InstanceRow>[] = [
  { key: "name", header: "Name", cellType: "text", accessor: (row) => row.name },
  { key: "region", header: "Region", cellType: "text", accessor: (row) => row.region },
  {
    key: "quick-actions",
    header: "Actions",
    cellType: "actionIcons",
    actions: [
      { label: "Edit", icon: <EditIcon size={20} />, onClick: (row) => alert(`Edit ${row.name}`) },
      { label: "Download", icon: <DownloadIcon size={20} />, onClick: (row) => alert(`Download ${row.name}`) },
      {
        label: "Delete",
        icon: <DeleteIcon size={20} />,
        disabled: (row) => row.status === "running",
        onClick: (row) => alert(`Delete ${row.name}`),
      },
    ],
  },
];

// Last row's `region` is intentionally blank — demonstrates the per-cell empty state (Figma's
// "Empty state" cell type is a sub-variant of "Text only", not a whole-table state).
const ROWS_WITH_MISSING_DATA: InstanceRow[] = [
  ...INSTANCE_ROWS,
  { id: "6", name: "web-server-03", status: "stopped", plan: "Dedicated 4GB", region: "", tags: [] },
];

function TableFullFeaturedSection() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["1"]);
  const [expandedIds, setExpandedIds] = useState<string[]>(["3"]);
  const [sortColumnKey, setSortColumnKey] = useState<string | undefined>("name");
  const [sortDirection, setSortDirection] = useState<TableSortDirection | undefined>("asc");

  const sortedRows = [...INSTANCE_ROWS].sort((a, b) => {
    if (!sortColumnKey) return 0;
    const dir = sortDirection === "desc" ? -1 : 1;
    const av = String(a[sortColumnKey as keyof InstanceRow]);
    const bv = String(b[sortColumnKey as keyof InstanceRow]);
    return av.localeCompare(bv) * dir;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 12, border: "1px solid #E5E5EA" }}>
      <span className="type-body-regular">
        Sortable (client-sorts `sortedRows` from the `onSortChange` callback — Table itself never
        reorders data), selectable, expandable. No zebra here — striping is a UX restriction on
        expandable tables, `Table` forces it off (with a dev console warning) whenever both are set:
      </span>
      <Table
        columns={INSTANCE_COLUMNS}
        rows={sortedRows}
        selectable
        selectedRowIds={selectedIds}
        onSelectedRowIdsChange={setSelectedIds}
        expandable
        expandedRowIds={expandedIds}
        onExpandedRowIdsChange={setExpandedIds}
        sortColumnKey={sortColumnKey}
        sortDirection={sortDirection}
        onSortChange={(key, direction) => {
          setSortColumnKey(key);
          setSortDirection(direction);
        }}
        renderExpandedContent={(row) => (
          <p className="type-body-regular" style={{ margin: 0 }}>
            Expanded details for {row.name}: {row.tags.join(", ")} — this content is fully
            consumer-composed via `renderExpandedContent`.
          </p>
        )}
        aria-label="Instances table"
      />
      <span className="type-body-regular">
        Selected: {selectedIds.join(", ") || "none"} · Expanded: {expandedIds.join(", ") || "none"}
      </span>
    </div>
  );
}

function TableCompactSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: 12, border: "1px solid #E5E5EA" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span className="type-body-regular">
          Outlined header, zebra-striped, bare action-icon buttons (Delete disabled while running).
          The "Actions" column carries a real text label but still hugs its content instead of
          stretching — `actionIcons`/`actionMenu` columns never compete for row width, labeled or not:
        </span>
        <Table columns={COMPACT_COLUMNS} rows={INSTANCE_ROWS} headerVariant="outlined" zebra aria-label="Compact instances table" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span className="type-body-regular">Bare usage — no props, default dataset:</span>
        <Table aria-label="Default table example" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span className="type-body-regular">
          Per-cell empty state (last row's Region is blank) — not a whole-table empty state, which
          is a separate, not-yet-designed feature:
        </span>
        <Table columns={COMPACT_COLUMNS} rows={ROWS_WITH_MISSING_DATA} aria-label="Table with missing cell data" />
      </div>
    </div>
  );
}

interface VolumeRow extends TableRowData {
  name: string;
  size: string;
}

const VOLUMES_BY_INSTANCE: Record<string, VolumeRow[]> = {
  "1": [
    { id: "v1", name: "boot-disk", size: "25 GB" },
    { id: "v2", name: "data-disk", size: "100 GB" },
  ],
  "3": [{ id: "v3", name: "boot-disk", size: "50 GB" }],
};

const VOLUME_COLUMNS: TableColumn<VolumeRow>[] = [
  { key: "name", header: "Volume", cellType: "text", accessor: (row) => row.name },
  { key: "size", header: "Size", cellType: "text", accessor: (row) => row.size },
];

function TableNestedSection() {
  const [expandedIds, setExpandedIds] = useState<string[]>(["1"]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 12, border: "1px solid #E5E5EA" }}>
      <span className="type-body-regular">
        An expanded row rendering a second `Table` via `renderExpandedContent` — nesting is just
        ordinary composition, `Table` has no special-cased "nested" mode. Per design decision, a
        nested table always keeps the default filled (grey) header and passes `bordered={false}` —
        it sits inside the outer expanded row's own border, so it shouldn't paint a second outline:
      </span>
      <Table
        columns={INSTANCE_COLUMNS}
        rows={INSTANCE_ROWS}
        expandable
        expandedRowIds={expandedIds}
        onExpandedRowIdsChange={setExpandedIds}
        renderExpandedContent={(row) => {
          const volumes = VOLUMES_BY_INSTANCE[row.id];
          return volumes ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
              <span className="type-label-semibold-xs">Volumes</span>
              <Table columns={VOLUME_COLUMNS} rows={volumes} bordered={false} aria-label={`${row.name} volumes`} />
            </div>
          ) : (
            <p className="type-body-regular" style={{ margin: 0 }}>
              No volumes attached.
            </p>
          );
        }}
        aria-label="Nested table example"
      />
    </div>
  );
}

interface ShowcaseRow extends TableRowData {
  name: string;
}

const SHOWCASE_ROWS: ShowcaseRow[] = [{ id: "1", name: "Row 1" }];

// One column per cell type Figma's `core_cells-table` breakdown demonstrates. "Checkbox with icon &
// text" / "Radio with icon & text" / "Button" compose the real Checkbox/RadioButton/Button
// components via cellType="custom" rather than a dedicated cell type each — see Table.tsx's header
// comment for why. "Select [not coded]" and "Switcher [not coded]" are deliberately not shown: no
// Select or Switch component exists in this library yet (Select is still open on the roadmap), and
// this repo doesn't fabricate a placeholder for a component that isn't real. "[Don't use] Checkbox &
// text" is Figma's own explicit "don't use" variant and is also deliberately excluded. The first
// column ("Text only") doubles as the "Expandable text" demo via the table's own `expandable` prop
// below — Figma's expand caret is part of that cell's content, not a separate column.
const CELL_TYPE_COLUMNS: TableColumn<ShowcaseRow>[] = [
  { key: "text", header: "Text only", cellType: "text", accessor: () => "Text" },
  { key: "link", header: "Link", cellType: "link", accessor: () => ({ label: "Link", href: "#" }) },
  {
    key: "textIcon",
    header: "Text & icon",
    cellType: "iconText",
    accessor: () => ({ label: "Text", icon: <StatusAlertIcon size={20} /> }),
  },
  {
    key: "status",
    header: "Status",
    cellType: "iconText",
    accessor: () => ({ label: "Success", icon: <DotIcon size={20} style={{ color: "#138246" }} /> }),
  },
  { key: "badge", header: "Badge", cellType: "badge", accessor: () => ({ label: "Badge" }) },
  {
    key: "checkboxIconText",
    header: "Checkbox with icon & text",
    cellType: "custom",
    render: () => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Checkbox size="small" aria-label="Option" />
        <CaretIcon size={20} />
        <span className="type-body-regular">Text</span>
      </div>
    ),
  },
  {
    key: "radioIconText",
    header: "Radio with icon & text",
    cellType: "custom",
    render: () => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <RadioButton size="small" name="cell-type-showcase-radio" aria-label="Option" />
        <CaretIcon size={20} />
        <span className="type-body-regular">Text</span>
      </div>
    ),
  },
  {
    key: "button",
    header: "Button",
    cellType: "custom",
    render: () => (
      <Button variant="secondary" size="small">
        Button
      </Button>
    ),
  },
  {
    key: "actionIcons",
    header: "Action icons",
    cellType: "actionIcons",
    actions: [
      { label: "Edit", icon: <EditIcon size={20} />, onClick: () => {} },
      { label: "Download", icon: <DownloadIcon size={20} />, onClick: () => {} },
      { label: "Delete", icon: <DeleteIcon size={20} />, onClick: () => {} },
    ],
  },
  {
    key: "actionMenu",
    cellType: "actionMenu",
    actions: [
      { label: "Edit", onClick: () => {} },
      { label: "Delete", onClick: () => {} },
    ],
  },
];

function TableCellTypesSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 12, border: "1px solid #E5E5EA" }}>
      <span className="type-body-regular">
        One example of every cell type Figma's breakdown demonstrates (see the code comment above
        for what's deliberately excluded and why):
      </span>
      <Table
        columns={CELL_TYPE_COLUMNS}
        rows={SHOWCASE_ROWS}
        expandable
        defaultExpandedRowIds={["1"]}
        renderExpandedContent={() => (
          <p className="type-body-regular" style={{ margin: 0 }}>
            Expanded content for the "Expandable text" cell type — the row-level expand affordance
            from `expandable` lands on the first column's cell.
          </p>
        )}
        aria-label="Table cell types showcase"
      />
    </div>
  );
}

const HEADER_VARIATION_NAME_COLUMN: TableColumn<ShowcaseRow>[] = [
  { key: "name", header: "Name", sortable: true, infoIcon: true, infoText: "More information", cellType: "text", accessor: (row) => row.name },
];

const HEADER_VARIATION_ACTIONS_COLUMN: TableColumn<ShowcaseRow>[] = [
  { key: "actions", cellType: "actionMenu", actions: [{ label: "Edit", onClick: () => {} }] },
];

const HEADER_VARIATION_SELECTABLE_COLUMN: TableColumn<ShowcaseRow>[] = [
  { key: "name", header: "Name", cellType: "text", accessor: (row) => row.name },
];

function TableHeaderVariationsSection() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24, padding: 12, border: "1px solid #E5E5EA" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 260 }}>
        <span className="type-body-regular">Filled, sortable, info icon:</span>
        <Table columns={HEADER_VARIATION_NAME_COLUMN} rows={SHOWCASE_ROWS} headerVariant="filled" aria-label="Filled header example" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 260 }}>
        <span className="type-body-regular">Outlined, sortable, info icon:</span>
        <Table columns={HEADER_VARIATION_NAME_COLUMN} rows={SHOWCASE_ROWS} headerVariant="outlined" aria-label="Outlined header example" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 160 }}>
        <span className="type-body-regular">Filled, icon-only:</span>
        <Table columns={HEADER_VARIATION_ACTIONS_COLUMN} rows={SHOWCASE_ROWS} headerVariant="filled" aria-label="Filled icon-only header example" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 160 }}>
        <span className="type-body-regular">Outlined, icon-only:</span>
        <Table columns={HEADER_VARIATION_ACTIONS_COLUMN} rows={SHOWCASE_ROWS} headerVariant="outlined" aria-label="Outlined icon-only header example" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 260 }}>
        <span className="type-body-regular">Select-all checkbox in header:</span>
        <Table columns={HEADER_VARIATION_SELECTABLE_COLUMN} rows={SHOWCASE_ROWS} selectable aria-label="Selectable header example" />
      </div>
    </div>
  );
}

function TableTabContent() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <PreviewSection title="Cell types">
        <TableCellTypesSection />
      </PreviewSection>
      <PreviewSection title="Header variations">
        <TableHeaderVariationsSection />
      </PreviewSection>
      <PreviewSection title="Nested table">
        <TableNestedSection />
      </PreviewSection>
      <PreviewSection title="Sortable, selectable, expandable">
        <TableFullFeaturedSection />
      </PreviewSection>
      <PreviewSection title="Compact, zebra, bare usage, per-cell empty state">
        <TableCompactSection />
      </PreviewSection>
    </div>
  );
}

const BUTTON_VARIANTS: ButtonVariant[] = ["primary", "secondary", "link", "danger"];

function ButtonVariantRow({ variant }: { variant: ButtonVariant }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <p className="type-body-regular" style={{ margin: 0, textTransform: "capitalize" }}>
        {variant}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
        <Button variant={variant} size="large">
          Button
        </Button>
        <Button variant={variant} size="large" startIcon={<PlusIcon />}>
          Button
        </Button>
        <Button variant={variant} size="large" loading>
          Button
        </Button>
        <Button variant={variant} size="large" disabled>
          Button
        </Button>
        <Button variant={variant} size="small">
          Button
        </Button>
        <Button variant={variant} size="small" startIcon={<PlusIcon />}>
          Button
        </Button>
        <Button variant={variant} size="small" loading>
          Button
        </Button>
        <Button variant={variant} size="small" disabled>
          Button
        </Button>
      </div>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="type-label-semibold-s"
      style={{
        padding: "8px 16px",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
        background: active ? "#232326" : "transparent",
        color: active ? "#FFFFFF" : "#232326",
      }}
    >
      {label}
    </button>
  );
}

// Each size demos a different footer composition on purpose — the footer is a plain `footer?`
// slot, not a fixed 3-button schema, so which buttons appear (and whether a Link button is even
// present) is a per-drawer designer decision, not something the component enforces.
const DRAWER_DEMOS: { size: DrawerSize; label: string; footer: "all-three" | "no-link" | "single" }[] = [
  { size: "default", label: "Default (480px)", footer: "all-three" },
  { size: "small", label: "Small (300px)", footer: "no-link" },
  { size: "flexible", label: "Flexible (min 300px)", footer: "single" },
];

function DrawerLongContent() {
  return (
    <>
      {Array.from({ length: 20 }).map((_, i) => (
        <p key={i} className="type-body-regular" style={{ margin: 0 }}>
          Content block {i + 1}. This paragraph exists only to give the drawer enough content
          height to overflow the panel, so the two footer-button placements below can be compared.
        </p>
      ))}
    </>
  );
}

function DrawerSection() {
  const [openSize, setOpenSize] = useState<DrawerSize | null>(null);
  const [noFooterOpen, setNoFooterOpen] = useState(false);
  const [stickyFooterOpen, setStickyFooterOpen] = useState(false);
  const [inlineFooterOpen, setInlineFooterOpen] = useState(false);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {DRAWER_DEMOS.map(({ size, label }) => (
        <Button key={size} variant="secondary" onClick={() => setOpenSize(size)}>
          Open {label}
        </Button>
      ))}
      <Button variant="secondary" onClick={() => setNoFooterOpen(true)}>
        Open without footer/icon
      </Button>
      <Button variant="secondary" onClick={() => setStickyFooterOpen(true)}>
        Open long content — sticky footer
      </Button>
      <Button variant="secondary" onClick={() => setInlineFooterOpen(true)}>
        Open long content — buttons after content
      </Button>

      {DRAWER_DEMOS.map(({ size, label, footer }) => (
        <Drawer
          key={size}
          open={openSize === size}
          onClose={() => setOpenSize(null)}
          size={size}
          title="Header title"
          icon={<HelpCircleIcon size={24} />}
          footer={
            footer === "all-three" ? (
              <>
                <Button variant="link" onClick={() => setOpenSize(null)}>
                  Button
                </Button>
                <Button variant="secondary" onClick={() => setOpenSize(null)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setOpenSize(null)}>
                  Apply
                </Button>
              </>
            ) : footer === "no-link" ? (
              <>
                <Button variant="secondary" onClick={() => setOpenSize(null)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setOpenSize(null)}>
                  Apply
                </Button>
              </>
            ) : (
              <Button variant="primary" onClick={() => setOpenSize(null)}>
                Done
              </Button>
            )
          }
        >
          <p className="type-body-regular" style={{ margin: 0 }}>
            {label} drawer content goes here. This slot is fully consumer-composed — the drawer only
            owns the header, optional footer, and scroll behavior around it. The footer buttons
            shown here are just one example composition — how many buttons, and whether a Link
            button is included at all, is a per-drawer design decision, not something this
            component enforces.
          </p>
        </Drawer>
      ))}

      <Drawer open={noFooterOpen} onClose={() => setNoFooterOpen(false)} title="Header title">
        <p className="type-body-regular" style={{ margin: 0 }}>
          A drawer with no leading icon and no footer — both are optional.
        </p>
      </Drawer>

      {/* Sticky footer: buttons passed via `footer` sit outside the scrollable area and stay
          pinned to the bottom of the drawer regardless of scroll position. */}
      <Drawer
        open={stickyFooterOpen}
        onClose={() => setStickyFooterOpen(false)}
        title="Sticky footer"
        footer={
          <>
            <Button variant="secondary" onClick={() => setStickyFooterOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setStickyFooterOpen(false)}>
              Apply
            </Button>
          </>
        }
      >
        <DrawerLongContent />
      </Drawer>

      {/* Buttons after content: no `footer` prop at all — Cancel/Apply are just the last
          elements of `children`, so they scroll away with the rest of the content instead of
          staying pinned. Both placements are valid; which one to use is a design decision the
          `footer` slot doesn't force either way. */}
      <Drawer open={inlineFooterOpen} onClose={() => setInlineFooterOpen(false)} title="Buttons after content">
        <DrawerLongContent />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <Button variant="secondary" onClick={() => setInlineFooterOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setInlineFooterOpen(false)}>
            Apply
          </Button>
        </div>
      </Drawer>
    </div>
  );
}

export default function App() {
  const frameParam = new URLSearchParams(window.location.search).get("frame");
  if (frameParam === "template") {
    const variant = new URLSearchParams(window.location.search).get("variant") === "short" ? "short" : "long";
    return <TemplateFrame variant={variant} />;
  }

  return <PreviewHarness />;
}

function PreviewHarness() {
  const [activeTab, setActiveTab] = useState<"components" | "table" | "templates">("components");
  const [selectedPageId, setSelectedPageId] = useState("linodes");
  const [expandedPinned, setExpandedPinned] = useState(true);
  const [collapsedPinned, setCollapsedPinned] = useState(true);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, padding: 16 }}>
      <div style={{ display: "flex", gap: 8, borderBottom: "1px solid #E5E5EA", paddingBottom: 8 }}>
        <TabButton label="Components" active={activeTab === "components"} onClick={() => setActiveTab("components")} />
        <TabButton label="Component: Table" active={activeTab === "table"} onClick={() => setActiveTab("table")} />
        <TabButton label="Templates" active={activeTab === "templates"} onClick={() => setActiveTab("templates")} />
      </div>

      {activeTab === "components" && (
        <>
          <PreviewSection title="Icons">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: 12, border: "1px solid #E5E5EA" }}>
              {ALL_ICONS.map((Icon, i) => (
                <Icon key={i} />
              ))}
            </div>
          </PreviewSection>

          <PreviewSection title="Button">
            <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: 12, border: "1px solid #E5E5EA" }}>
              {BUTTON_VARIANTS.map((variant) => (
                <ButtonVariantRow key={variant} variant={variant} />
              ))}
            </div>
          </PreviewSection>

          <PreviewSection title="Container">
            <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 12, border: "1px solid #E5E5EA" }}>
              <Container>
                <p className="type-body-regular" style={{ margin: 0 }}>
                  A Container always spans the full width of its parent — it never sizes to its
                  content's width, only its height.
                </p>
              </Container>
              <Container>
                <p className="type-heading-xs" style={{ margin: "0 0 8px" }}>
                  Longer content
                </p>
                <p className="type-body-regular" style={{ margin: 0 }}>
                  This paragraph is here to show the container growing to fit taller content while
                  keeping its 24px horizontal / 16px vertical padding and full-width sizing.
                </p>
              </Container>
            </div>
          </PreviewSection>

          <PreviewSection title="Text Field">
            <TextFieldSection />
          </PreviewSection>

          <PreviewSection title="Checkbox">
            <CheckboxSection />
          </PreviewSection>

          <PreviewSection title="Radio Button">
            <RadioButtonSection />
          </PreviewSection>

          <PreviewSection title="Badge">
            <BadgeSection />
          </PreviewSection>

          <PreviewSection title="Tabs Horizontal">
            <TabsHorizontalSection />
          </PreviewSection>

          <PreviewSection title="Drawer">
            <DrawerSection />
          </PreviewSection>

          <PreviewSection title="System Badge">
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <SystemBadge type="new" />
              <SystemBadge type="beta" />
            </div>
          </PreviewSection>

          <PreviewSection title="Global Header">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <GlobalHeader />
              <GlobalHeader isAuthenticated={false} showSearch={false} notificationCount={12} />
            </div>
          </PreviewSection>

          <PreviewSection title="Side Navigation">
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ height: 900 }}>
                <SideNavigation
                  selectedPageId={selectedPageId}
                  onSelectPage={setSelectedPageId}
                  pinned={expandedPinned}
                  pinnedExpanded={true}
                  onPinToggle={setExpandedPinned}
                />
              </div>
              <div style={{ height: 900 }}>
                <SideNavigation
                  selectedPageId={selectedPageId}
                  onSelectPage={setSelectedPageId}
                  pinned={collapsedPinned}
                  pinnedExpanded={false}
                  onPinToggle={setCollapsedPinned}
                />
              </div>
            </div>
          </PreviewSection>

          <PreviewSection title="Global Footer">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <GlobalFooter />
              <GlobalFooter
                links={[
                  { id: "docs", label: "Documentation", href: "#" },
                  { id: "status", label: "Status", href: "#" },
                  { id: "support", label: "Support", href: "#", target: "_blank" },
                ]}
                copyrightText="© 2026 Example Corp. All Rights Reserved"
              />
            </div>
          </PreviewSection>
        </>
      )}

      {activeTab === "table" && <TableTabContent />}

      {activeTab === "templates" && (
        <PreviewSection title="Page Template">
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <ResizableTemplatePreview title="Full Page (Desktop, resizable)" variant="long" />
            <BreakpointPreview title="Tablet" width={768} height={800} variant="short" />
            <BreakpointPreview title="Mobile" width={375} height={800} variant="short" />
          </div>
        </PreviewSection>
      )}
    </div>
  );
}
