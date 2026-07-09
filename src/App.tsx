import { useState, type ReactNode } from "react";
import GlobalHeader from "../components/GlobalHeader";
import GlobalFooter from "../components/GlobalFooter";
import SideNavigation from "../components/SideNavigation";
import Button, { type ButtonVariant } from "../components/Button";
import Container from "../components/Container";
import TextField from "../components/TextField";
import DefaultCmPageTemplate from "../templates/DefaultCmPageTemplate";
import {
  BellIcon,
  BucketIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  CommunityIcon,
  ComputeIcon,
  HelpCircleIcon,
  InfoIcon,
  MenuIcon,
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
  BellIcon,
  BucketIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  CommunityIcon,
  ComputeIcon,
  HelpCircleIcon,
  InfoIcon,
  MenuIcon,
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
