/// <reference types="vite/client" />
import { useEffect, useState, type ReactNode } from "react";
import Badge from "./Badge";
import {
  BucketIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ComputeIcon,
  MonitorIcon,
  MoreIcon,
  NetworkIcon,
  PinIcon,
  ServerIcon,
  UserIcon,
} from "./icons";

// Figma: node 17:2719 "cm_side-navigation" — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=17-2719
// Internal components: node 17:4917 ".menu-item" (section header), ".submenu-item" (page row), ".pin-button".
// Interactions: node 17:2743 — a section's header switches to the "selected" color when one of its
// pages is selected (not just on hover). Mini rail reference: node 17:2732 — collapsed rows are
// icon-only and stack directly with zero gap (no submenu rows, no dividers rendered at all).
// Color/spacing tokens: tokens/sideNavigation.json (component.sideNavigation.*), resolved through
// tokens/global.json. Typography: src/typography.css. Icons: components/icons (exact Figma vectors).
//
// Collapse/expand interaction: unpinned, the rail defaults to collapsed (48px, icon-only) and
// expands to 232px on hover with an eased width transition. Pinned locks the rail to whatever
// `pinnedExpanded` says (expanded by default) and disables hover entirely — this is what lets a
// consumer show a permanently-collapsed-but-pinned rail, not just a permanently-open one.
// Rows always render full markup (icon + label + chevron) at a fixed 232px inner width — collapsing
// is done by animating the *outer* width with overflow-hidden, so content is clipped away rather
// than swapped, which is what makes the transition look continuous instead of a jump-cut. Page rows
// (and their divider) only ever render while `expanded` — otherwise their height would still occupy
// vertical space while clipped, producing the "gaps between collapsed sections" bug.
// The pin icon's filled state tracks `pinned` specifically, not the transient hover-expanded state
// (matches Figma's own Pinned=Yes/No component naming — filled means "locked open/closed", not "currently visible").

export interface SideNavPage {
  id: string;
  label: string;
  badge?: { type: "new" | "beta" };
}

export interface SideNavSection {
  id: string;
  label: string;
  icon: ReactNode;
  pages: SideNavPage[];
}

export interface SideNavigationProps {
  /** Explicit override: force a static "full" or "mini" rail with no hover/pin behavior.
   *  Omit to get the interactive default (collapsed unless pinned or hovered). */
  menu?: "full" | "mini";
  sections?: SideNavSection[];
  selectedPageId?: string;
  onSelectPage?: (pageId: string, sectionId: string) => void;
  defaultOpenSectionIds?: string[];
  pinned?: boolean;
  onPinToggle?: (pinned: boolean) => void;
  /** When `pinned`, whether the locked rail shows expanded or collapsed. Ignored while unpinned
   *  (unpinned always rests collapsed and peeks open on hover). Defaults to true. */
  pinnedExpanded?: boolean;
  className?: string;
}

export const DEFAULT_SIDE_NAV_SECTIONS: SideNavSection[] = [
  {
    id: "compute",
    label: "Compute",
    icon: <ComputeIcon />,
    pages: [
      { id: "linodes", label: "Linodes" },
      { id: "images", label: "Images" },
      { id: "kubernetes", label: "Kubernetes" },
      { id: "stackscripts", label: "StackScripts" },
      { id: "placement-groups", label: "Placement Groups" },
      { id: "quick-deploy-apps", label: "Quick Deploy Apps" },
      { id: "partner-referrals", label: "Partner Referrals", badge: { type: "beta" } },
    ],
  },
  {
    id: "storage",
    label: "Storage",
    icon: <BucketIcon />,
    pages: [
      { id: "object-storage", label: "Object Storage" },
      { id: "volumes", label: "Volumes" },
    ],
  },
  {
    id: "networking",
    label: "Networking",
    icon: <NetworkIcon />,
    pages: [
      { id: "vpc", label: "VPC" },
      { id: "firewalls", label: "Firewalls" },
      { id: "nodebalancers", label: "NodeBalancers" },
      { id: "reserved-ips", label: "Reserved IPs" },
      { id: "domains", label: "Domains" },
    ],
  },
  {
    id: "databases",
    label: "Databases",
    icon: <ServerIcon />,
    pages: [{ id: "databases", label: "Databases" }],
  },
  {
    id: "monitor",
    label: "Monitor",
    icon: <MonitorIcon />,
    pages: [
      { id: "metrics", label: "Metrics", badge: { type: "new" } },
      { id: "alerts", label: "Alerts", badge: { type: "beta" } },
      { id: "logs", label: "Logs" },
      { id: "longview", label: "Longview" },
    ],
  },
  {
    id: "administration",
    label: "Administration",
    icon: <UserIcon />,
    pages: [
      { id: "billing", label: "Billing" },
      { id: "identity-access", label: "Identity & Access", badge: { type: "new" } },
      { id: "quotas", label: "Quotas" },
      { id: "login-history", label: "Login History" },
      { id: "service-transfers", label: "Service Transfers" },
      { id: "maintenance", label: "Maintenance" },
      { id: "account-settings", label: "Account Settings" },
    ],
  },
  {
    id: "more",
    label: "More",
    icon: <MoreIcon />,
    pages: [
      { id: "betas", label: "Betas" },
      { id: "help-support", label: "Help & Support" },
    ],
  },
];

interface SectionHeaderProps {
  label: string;
  icon: ReactNode;
  open: boolean;
  selected: boolean;
  onClick: () => void;
}

function SectionHeader({ label, icon, open, selected, onClick }: SectionHeaderProps) {
  const textIconColor = selected
    ? "var(--component-sidenavigation-sectionheader-text-selected,#5BB3EA)"
    : "var(--component-sidenavigation-sectionheader-text-default,#FFFFFF)";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className="flex h-[48px] w-[232px] shrink-0 cursor-pointer items-center gap-[12px] bg-[var(--component-sidenavigation-sectionheader-background-default,#3D3D42)] pl-[12px] pr-[8px] hover:bg-[var(--component-sidenavigation-sectionheader-background-hover,#343438)]"
    >
      <span className="size-6 shrink-0" style={{ color: textIconColor }}>
        {icon}
      </span>
      <span
        className="type-heading-overline min-w-px flex-1 text-left uppercase tracking-[0.36px]"
        style={{ color: textIconColor }}
      >
        {label}
      </span>
      <span className="shrink-0" style={{ color: textIconColor }}>
        {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </span>
    </button>
  );
}

interface PageRowProps {
  label: string;
  badge?: { type: "new" | "beta" };
  selected: boolean;
  onClick: () => void;
}

function PageRow({ label, badge, selected, onClick }: PageRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={selected ? "page" : undefined}
      className="flex h-8 w-[232px] shrink-0 items-center gap-[12px] bg-[var(--global-color-neutrals-90,#3D3D42)] pl-[48px] pr-[8px] hover:bg-[var(--global-color-neutrals-100,#343438)]"
    >
      <span
        className="type-label-semibold-s min-w-0 truncate text-left"
        style={{
          color: selected
            ? "var(--component-sidenavigation-pagetext-selected,#5BB3EA)"
            : "var(--component-sidenavigation-pagetext-default,#FFFFFF)",
          fontWeight: selected ? 700 : 600,
        }}
      >
        {label}
      </span>
      {badge && <Badge type={badge.type} />}
    </button>
  );
}

function Divider() {
  return <div className="h-2 w-[232px] shrink-0 bg-[var(--component-sidenavigation-divider-background,#3D3D42)]" />;
}

export default function SideNavigation({
  menu,
  sections = DEFAULT_SIDE_NAV_SECTIONS,
  selectedPageId,
  onSelectPage,
  defaultOpenSectionIds,
  pinned,
  onPinToggle,
  pinnedExpanded = true,
  className,
}: SideNavigationProps) {
  const [openSectionIds, setOpenSectionIds] = useState<Set<string>>(() => {
    if (defaultOpenSectionIds) return new Set(defaultOpenSectionIds);
    const activeSection = sections.find((section) => section.pages.some((page) => page.id === selectedPageId));
    return new Set(activeSection ? [activeSection.id] : []);
  });
  const [internalSelectedPageId, setInternalSelectedPageId] = useState<string | undefined>(undefined);
  const [internalPinned, setInternalPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const activePageId = selectedPageId ?? internalSelectedPageId;
  // `pinned` follows the same controlled/uncontrolled split as `selectedPageId` above: pass it
  // (with `onPinToggle`) to fully control it from the app, or omit both and the rail manages its
  // own pin state — omitting `pinned` while still passing `onPinToggle` (rare) still works since
  // the internal state remains the source of truth.
  const effectivePinned = pinned ?? internalPinned;

  useEffect(() => {
    if (import.meta.env?.DEV && selectedPageId !== undefined && !onSelectPage) {
      console.warn(
        "SideNavigation: `selectedPageId` was passed without `onSelectPage`, so the selected page is locked to a fixed value and clicking another page has no visible effect. Omit both props to let SideNavigation manage its own selection, or pass both together to fully control it.",
      );
    }
  }, [selectedPageId, onSelectPage]);

  const isOverridden = menu !== undefined;
  const expanded = isOverridden ? menu === "full" : effectivePinned ? pinnedExpanded : isHovered;

  function togglePin() {
    const next = !effectivePinned;
    if (pinned === undefined) setInternalPinned(next);
    onPinToggle?.(next);
  }

  function toggleSection(sectionId: string) {
    setOpenSectionIds((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  }

  function selectPage(pageId: string, sectionId: string) {
    setInternalSelectedPageId(pageId);
    onSelectPage?.(pageId, sectionId);
  }

  return (
    <nav
      onMouseEnter={() => !isOverridden && setIsHovered(true)}
      onMouseLeave={() => !isOverridden && setIsHovered(false)}
      style={{ width: expanded ? 232 : 48 }}
      className={
        className ??
        `flex h-full flex-col overflow-hidden bg-[var(--global-color-neutrals-90,#3D3D42)] transition-[width] duration-200 ease-in-out ${
          !expanded ? "border-r border-solid border-[var(--global-color-neutrals-80,#515157)]" : ""
        }`
      }
    >
      <div className="side-nav-scroll min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
        {sections.map((section) => {
          const open = openSectionIds.has(section.id);
          const sectionSelected = section.pages.some((page) => page.id === activePageId);
          return (
            <div key={section.id}>
              <SectionHeader
                label={section.label}
                icon={section.icon}
                open={open}
                selected={sectionSelected}
                onClick={() => toggleSection(section.id)}
              />
              {expanded && open && (
                <>
                  {section.pages.map((page) => (
                    <PageRow
                      key={page.id}
                      label={page.label}
                      badge={page.badge}
                      selected={page.id === activePageId}
                      onClick={() => selectPage(page.id, section.id)}
                    />
                  ))}
                  <Divider />
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex h-[24px] w-full shrink-0 items-center justify-end bg-[var(--global-color-neutrals-90,#3D3D42)] py-[4px] pr-[16px]">
        <button
          type="button"
          onClick={togglePin}
          aria-pressed={effectivePinned}
          aria-label={effectivePinned ? "Unpin navigation" : "Pin navigation"}
          className="flex size-4 items-center justify-center text-[color:var(--component-sidenavigation-pin-icon-default,#D6D6DD)] hover:text-[color:var(--component-sidenavigation-pin-icon-hover,#FFFFFF)]"
        >
          <PinIcon filled={effectivePinned} />
        </button>
      </div>
    </nav>
  );
}
