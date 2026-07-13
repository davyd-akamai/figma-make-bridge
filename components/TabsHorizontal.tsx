// Figma: Tabs-horizontal, node 74:5959 —
// https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=74-5959
// Internal breakdown (".base-tab-horizontal", Default/Hover/Selected/Disabled x Small/Large),
// node 71:4262 — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=71-4262
// Collapsible/overflow behaviour, node 82:5854 —
// https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=82-5854
//
// The main variant set (74:5959) only demonstrates 2-8 *static* tabs with the first one always
// selected — the actual per-tab state matrix (Default/Hover/Selected/Disabled, each with an
// optional leading icon and optional badge) lives on the internal ".base-tab-horizontal" primitive
// (71:4262), so that's what each rendered tab button is modeled on. Hover only recolors text/icon
// (no border change) and is left to a real `:hover` pseudo-class rather than JS state, same as
// TextField/Checkbox's hover handling.
//
// Figma's own token naming quirk (same class as Button/Checkbox/RadioButton's "Active" labeling):
// the *default* tab's underline-reserving border resolves through a key literally named
// `alias.interaction.border.disabled` in tokens/tabs.json, not `.default` — that's the token
// bucket Figma's file actually uses for the always-present grey baseline, unrelated to this
// component's own `disabled` prop.
//
// Collapsible behaviour (82:5854): when the tab row doesn't have room for every tab, trailing
// tabs are cut and replaced by a single "..." (core_actions, reused here as the existing shared
// `MoreIcon`) button that opens a small dropdown (core_dropdown) listing the overflowed tabs by
// label. This is measured for real via a hidden clone of every tab (rendered off-screen with
// `visibility:hidden; height:0`, which still yields real `getBoundingClientRect()` widths) plus a
// `ResizeObserver` on the visible row — not a CSS-only `overflow:hidden` clip, since knowing
// *which* tabs to move into the dropdown requires actual per-tab widths. The ellipsis button's own
// box (52x44 large / 48x32 small) is fixed straight from Figma's frame dimensions rather than
// measured, since it never changes size. No dedicated dropdown component exists yet in this repo,
// so the overflow menu is a small local sub-component here, same bar GlobalFooter's `FooterLink`
// was held to — extract only once a second consumer needs one.
//
// This component renders tab *headers* only (no content-panel slot) — matches what 74:5959 itself
// contains; panel content is the consumer's job to compose, same scoping call as Container.

import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MoreIcon } from "./icons";
import Badge from "./Badge";

export type TabsHorizontalSize = "small" | "large";

export interface TabsHorizontalTab {
  id: string;
  label: string;
  /** Optional leading icon, e.g. `<ComputeIcon size={16} />`. No icon renders if omitted. */
  icon?: ReactNode;
  /** Optional trailing badge text, rendered via the shared `Badge` (subtle/ultramarine, matching
   * Figma's tab badge exactly). */
  badge?: string;
  disabled?: boolean;
}

export interface TabsHorizontalProps {
  tabs?: TabsHorizontalTab[];
  size?: TabsHorizontalSize;
  selectedTabId?: string;
  defaultSelectedTabId?: string;
  onSelectTab?: (tabId: string) => void;
  /** Accessible label for the button that reveals overflowed tabs. Default "More tabs". */
  moreLabel?: string;
  "aria-label"?: string;
  className?: string;
}

const DEFAULT_TABS: TabsHorizontalTab[] = [
  { id: "overview", label: "Overview" },
  { id: "configuration", label: "Configuration" },
  { id: "monitoring", label: "Monitoring" },
  { id: "activity", label: "Activity log" },
  { id: "access", label: "Access control" },
  { id: "tags", label: "Tags" },
];

const ROW_HEIGHT: Record<TabsHorizontalSize, string> = {
  large: "h-[44px]",
  small: "h-[32px]",
};

const TAB_PADDING: Record<TabsHorizontalSize, string> = {
  large: "gap-[var(--global-spacing-s8,8px)] px-[var(--global-spacing-s24,24px)] py-[var(--global-spacing-s12,12px)]",
  small: "gap-[var(--global-spacing-s4,4px)] px-[var(--global-spacing-s16,16px)] py-[var(--global-spacing-s6,6px)]",
};

const TAB_TYPE_ACTIVE: Record<TabsHorizontalSize, string> = {
  large: "type-label-bold-l",
  small: "type-body-bold",
};

const TAB_TYPE_DEFAULT: Record<TabsHorizontalSize, string> = {
  large: "type-label-semibold-l",
  small: "type-body-semibold",
};

// Fixed straight from Figma's Ellipsis frame dimensions (82:5322/82:5328) — never measured, since
// this button's size never changes.
const ELLIPSIS_BOX: Record<TabsHorizontalSize, { width: number; className: string; iconSize: number }> = {
  large: { width: 52, className: "w-[52px] h-[44px] px-[16px] py-[12px]", iconSize: 20 },
  small: { width: 48, className: "w-[48px] h-[32px] px-[16px] py-[8px]", iconSize: 16 },
};

function tabButtonClassName(size: TabsHorizontalSize, selected: boolean, disabled: boolean) {
  const padding = TAB_PADDING[size];
  const base = `content-stretch flex items-center justify-center shrink-0 whitespace-nowrap border-b-3 border-solid ${padding}`;
  if (disabled) {
    return `${base} ${TAB_TYPE_DEFAULT[size]} border-transparent text-[color:var(--component-tabs-disabled-text,#A3A3AB)] cursor-not-allowed`;
  }
  if (selected) {
    return `${base} ${TAB_TYPE_ACTIVE[size]} border-[var(--component-tabs-active-border,#0174BC)] text-[color:var(--component-tabs-active-text,#0174BC)]`;
  }
  return `${base} ${TAB_TYPE_DEFAULT[size]} border-transparent text-[color:var(--component-tabs-default-text,#343438)] hover:text-[color:var(--component-tabs-hover-text,#009CDE)]`;
}

function tabIconClassName(selected: boolean, disabled: boolean) {
  if (disabled) return "shrink-0 text-[color:var(--component-tabs-disabled-icon,#A3A3AB)]";
  if (selected) return "shrink-0 text-[color:var(--component-tabs-active-icon,#0174BC)]";
  return "shrink-0 text-[color:var(--component-tabs-default-icon,#3D3D42)] group-hover:text-[color:var(--component-tabs-hover-icon,#009CDE)]";
}

function TabButton({
  tab,
  size,
  selected,
  tabIndex,
  onSelect,
  onKeyDown,
  buttonRef,
}: {
  tab: TabsHorizontalTab;
  size: TabsHorizontalSize;
  selected: boolean;
  tabIndex: number;
  onSelect: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
  buttonRef?: (el: HTMLButtonElement | null) => void;
}) {
  const disabled = Boolean(tab.disabled);
  return (
    <button
      ref={buttonRef}
      type="button"
      role="tab"
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      tabIndex={tabIndex}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      className={`group ${tabButtonClassName(size, selected, disabled)}`}
      data-tab-id={tab.id}
    >
      {tab.icon && <span className={tabIconClassName(selected, disabled)}>{tab.icon}</span>}
      <span>{tab.label}</span>
      {tab.badge && <Badge type="subtle" color="ultramarine" label={tab.badge} />}
    </button>
  );
}

function OverflowMenu({
  size,
  tabs,
  selectedTabId,
  onSelect,
  moreLabel,
  triggerRef,
}: {
  size: TabsHorizontalSize;
  tabs: TabsHorizontalTab[];
  selectedTabId: string;
  onSelect: (tabId: string) => void;
  moreLabel: string;
  triggerRef: (el: HTMLButtonElement | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const box = ELLIPSIS_BOX[size];

  useEffect(() => {
    if (!open) return;
    const onOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={moreLabel}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center justify-end border-b border-solid border-[var(--component-tabs-default-border,#C2C2CA)] text-[color:var(--component-tabs-ellipsis-icon,#3D3D42)] hover:text-[color:var(--component-tabs-ellipsis-icon-hover,#009CDE)] ${box.className}`}
      >
        <MoreIcon size={box.iconSize} />
      </button>
      {open && (
        <div
          role="menu"
          aria-label={moreLabel}
          className="absolute right-0 top-full z-10 flex min-w-[160px] flex-col items-stretch py-[var(--global-spacing-s4,4px)] bg-[var(--component-tabs-overflowmenu-background,#FFFFFF)] shadow-[0px_2px_8px_0px_var(--component-tabs-overflowmenu-shadow-color,rgba(58,59,63,0.18))]"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="menuitemradio"
              aria-checked={tab.id === selectedTabId}
              disabled={tab.disabled}
              onClick={() => {
                if (tab.disabled) return;
                onSelect(tab.id);
                setOpen(false);
              }}
              className={`type-label-regular-s flex items-center gap-[var(--global-spacing-s8,8px)] py-[var(--global-spacing-s8,8px)] pl-[var(--global-spacing-s12,12px)] pr-[var(--global-spacing-s8,8px)] text-left disabled:cursor-not-allowed disabled:text-[color:var(--component-tabs-disabled-text,#A3A3AB)] ${
                tab.disabled
                  ? ""
                  : "text-[color:var(--component-tabs-overflowmenu-text,#343438)] hover:bg-[var(--component-tabs-overflowmenu-hover-background,#EDF8FF)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TabsHorizontal({
  tabs = DEFAULT_TABS,
  size = "large",
  selectedTabId,
  defaultSelectedTabId,
  onSelectTab,
  moreLabel = "More tabs",
  className,
  "aria-label": ariaLabel,
}: TabsHorizontalProps) {
  const firstEnabledId = tabs.find((t) => !t.disabled)?.id ?? tabs[0]?.id;
  const [internalSelectedId, setInternalSelectedId] = useState(defaultSelectedTabId ?? firstEnabledId);
  const effectiveSelectedId = selectedTabId ?? internalSelectedId;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const measureRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [visibleCount, setVisibleCount] = useState(tabs.length);
  const listId = useId();

  const select = (tabId: string) => {
    if (selectedTabId === undefined) setInternalSelectedId(tabId);
    onSelectTab?.(tabId);
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ellipsisWidth = ELLIPSIS_BOX[size].width;

    const recompute = () => {
      const available = container.clientWidth;
      const widths = measureRefs.current.map((el) => el?.getBoundingClientRect().width ?? 0);
      let total = 0;
      let fit = 0;
      for (; fit < widths.length; fit++) {
        const next = total + widths[fit];
        const hasMore = fit + 1 < widths.length;
        if (next + (hasMore ? ellipsisWidth : 0) > available) break;
        total = next;
      }
      setVisibleCount(Math.max(1, fit));
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(container);
    return () => ro.disconnect();
  }, [tabs, size]);

  const visibleTabs = useMemo(() => tabs.slice(0, visibleCount), [tabs, visibleCount]);
  const overflowTabs = useMemo(() => tabs.slice(visibleCount), [tabs, visibleCount]);

  const focusVisibleTab = (fromIndex: number, delta: number) => {
    const count = visibleTabs.length;
    if (count === 0) return;
    let i = (fromIndex + delta + count) % count;
    for (let tries = 0; tries < count; tries++, i = (i + delta + count) % count) {
      if (!visibleTabs[i].disabled) {
        buttonRefs.current[i]?.focus();
        return;
      }
    }
  };

  const handleKeyDown = (index: number) => (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusVisibleTab(index, 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusVisibleTab(index, -1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusVisibleTab(-1, 1);
    } else if (e.key === "End") {
      e.preventDefault();
      focusVisibleTab(0, -1);
    }
  };

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label={ariaLabel}
      aria-orientation="horizontal"
      id={listId}
      className={`relative flex items-stretch border-b border-solid border-[var(--component-tabs-default-border,#C2C2CA)] ${ROW_HEIGHT[size]} ${className ?? ""}`}
    >
      {/* Hidden full-width measurer: same markup as the real tabs, just off-layout, so every tab's
          natural width is known even while some are hidden behind the overflow menu below. */}
      <div className="absolute left-0 top-0 flex h-0 items-stretch overflow-hidden invisible" aria-hidden="true">
        {tabs.map((tab, i) => (
          <TabButton
            key={tab.id}
            tab={tab}
            size={size}
            selected={tab.id === effectiveSelectedId}
            tabIndex={-1}
            onSelect={() => {}}
            onKeyDown={() => {}}
            buttonRef={(el) => {
              measureRefs.current[i] = el;
            }}
          />
        ))}
      </div>

      {visibleTabs.map((tab, i) => (
        <TabButton
          key={tab.id}
          tab={tab}
          size={size}
          selected={tab.id === effectiveSelectedId}
          tabIndex={tab.id === effectiveSelectedId ? 0 : -1}
          onSelect={() => select(tab.id)}
          onKeyDown={handleKeyDown(i)}
          buttonRef={(el) => {
            buttonRefs.current[i] = el;
          }}
        />
      ))}

      {overflowTabs.length > 0 && (
        <OverflowMenu
          size={size}
          tabs={overflowTabs}
          selectedTabId={effectiveSelectedId}
          onSelect={select}
          moreLabel={moreLabel}
          triggerRef={() => {}}
        />
      )}
    </div>
  );
}
