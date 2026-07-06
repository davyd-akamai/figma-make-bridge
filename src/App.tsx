import { useState, type ReactNode } from "react";
import GlobalHeader from "../components/GlobalHeader";
import SideNavigation from "../components/SideNavigation";
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

export default function App() {
  const [selectedPageId, setSelectedPageId] = useState("linodes");
  const [expandedPinned, setExpandedPinned] = useState(true);
  const [collapsedPinned, setCollapsedPinned] = useState(true);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, padding: 16 }}>
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
    </div>
  );
}
