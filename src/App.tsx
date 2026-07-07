import { useState, type ReactNode } from "react";
import GlobalHeader from "../components/GlobalHeader";
import GlobalFooter from "../components/GlobalFooter";
import SideNavigation from "../components/SideNavigation";
import DefaultCmPageTemplate from "../templates/DefaultCmPageTemplate";
import {
  BellIcon,
  BucketIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CommunityIcon,
  ComputeIcon,
  HelpCircleIcon,
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
const ALL_ICONS = [
  BellIcon,
  BucketIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CommunityIcon,
  ComputeIcon,
  HelpCircleIcon,
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
