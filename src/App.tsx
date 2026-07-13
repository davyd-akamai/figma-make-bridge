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
import DefaultCmPageTemplate from "../templates/DefaultCmPageTemplate";
import {
  ArrowLeftIcon,
  BellIcon,
  BucketIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  CommunityIcon,
  ComputeIcon,
  DotIcon,
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
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  CommunityIcon,
  ComputeIcon,
  DotIcon,
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

export default function App() {
  const frameParam = new URLSearchParams(window.location.search).get("frame");
  if (frameParam === "template") {
    const variant = new URLSearchParams(window.location.search).get("variant") === "short" ? "short" : "long";
    return <TemplateFrame variant={variant} />;
  }

  return <PreviewHarness />;
}

function PreviewHarness() {
  const [activeTab, setActiveTab] = useState<"components" | "templates">("components");
  const [selectedPageId, setSelectedPageId] = useState("linodes");
  const [expandedPinned, setExpandedPinned] = useState(true);
  const [collapsedPinned, setCollapsedPinned] = useState(true);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, padding: 16 }}>
      <div style={{ display: "flex", gap: 8, borderBottom: "1px solid #E5E5EA", paddingBottom: 8 }}>
        <TabButton label="Components" active={activeTab === "components"} onClick={() => setActiveTab("components")} />
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
