// Figma: Breadcrumbs, node 123:4284 — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=123-4284
// Per-item states/interactions: `.breadcrumb-item`, node 123:4208 — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=123-4208
// Figma shows 1-5 items (Property 1=1..5), each non-last item rendered as `label` (+ optional BETA
// badge) + a "/" separator, the last item bold/primary with no separator. Last-item states: Hover
// (pencil appears) and Editable (inline TextField + confirm/cancel). Default-item Hover is an
// underline only (no color change — CDS's blue hover was deliberately not ported).
// Rename editing is opt-in via `editable`; Breadcrumbs never mutates `items`, the consumer applies
// the new title from `onRename`. No overflow/collapse behavior — Figma has no such state.

import { useState, type KeyboardEvent } from "react";
import SystemBadge from "./SystemBadge";
import TextField from "./TextField";
import { CheckmarkIcon, CloseIcon, EditIcon } from "./icons";

export interface BreadcrumbsItem {
  /** Stable key. Falls back to the index when omitted. */
  id?: string;
  label: string;
  /** Renders the item as a link. Omit for a plain button (use `onClick`/`onNavigate`). */
  href?: string;
  onClick?: () => void;
  /** Fixed BETA/NEW marker shown after the label (shared SystemBadge). */
  badge?: "beta" | "new";
}

export interface BreadcrumbsProps {
  /** Trail from root to current page. The last item is the current page (not a link). */
  items?: BreadcrumbsItem[];
  /** Called when a non-last item is activated, in addition to that item's own `onClick`. */
  onNavigate?: (item: BreadcrumbsItem, index: number) => void;
  /** Lets the last item be renamed inline (pencil on hover → field with ✓ / ✕). Default false. */
  editable?: boolean;
  /** Called with the trimmed new title when a rename is confirmed and changed. */
  onRename?: (title: string) => void;
  "aria-label"?: string;
  className?: string;
}

export const DEFAULT_BREADCRUMBS_ITEMS: BreadcrumbsItem[] = [
  { id: "home", label: "Breadcrumb" },
  { id: "current", label: "Last Item Title" },
];

const ITEM_TEXT = "type-label-semibold-l leading-[20px] text-[color:var(--component-breadcrumb-normal-text-default,#696970)]";
const LAST_TEXT = "type-label-bold-l leading-[20px] text-[color:var(--component-breadcrumb-lastitem-text-default,#343438)]";
const ICON_BUTTON =
  "flex size-[20px] shrink-0 cursor-pointer items-center justify-center text-[color:var(--component-breadcrumb-lastitem-icon-default,#3D3D42)]";
const FOCUS_RING = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alias-interaction-border-focus,#0174BC)]";

function Separator() {
  return (
    <span aria-hidden="true" className="type-label-semibold-l shrink-0 leading-[20px] text-[color:var(--component-breadcrumb-separator-text-default,#696970)]">
      /
    </span>
  );
}

function LastItem({
  item,
  editable,
  onRename,
}: {
  item: BreadcrumbsItem;
  editable: boolean;
  onRename?: (title: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.label);

  function startEditing() {
    setDraft(item.label);
    setEditing(true);
  }

  function confirm() {
    const next = draft.trim();
    setEditing(false);
    if (next && next !== item.label) onRename?.(next);
  }

  function cancel() {
    setEditing(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      confirm();
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancel();
    }
  }

  if (editing) {
    return (
      <li className="flex items-center gap-[var(--global-spacing-s8,8px)]">
        <div className="w-[240px]">
          <TextField
            value={draft}
            onChange={setDraft}
            onKeyDown={handleKeyDown}
            clearable={false}
            autoFocus
            aria-label="Rename current page"
          />
        </div>
        <button type="button" onClick={confirm} aria-label="Confirm rename" className={`${ICON_BUTTON} ${FOCUS_RING}`}>
          <CheckmarkIcon size={20} />
        </button>
        <button type="button" onClick={cancel} aria-label="Cancel rename" className={`${ICON_BUTTON} ${FOCUS_RING}`}>
          <CloseIcon size={20} />
        </button>
      </li>
    );
  }

  return (
    <li className="group flex items-center gap-[var(--global-spacing-s4,4px)]">
      <span aria-current="page" className={`${LAST_TEXT} whitespace-nowrap`}>
        {item.label}
      </span>
      {item.badge && <SystemBadge type={item.badge} />}
      {editable && (
        // Pencil only takes layout space while shown, so the row's width matches Figma's Default
        // vs Hover swatches (108 vs 136); group-focus-within keeps it reachable by keyboard.
        <button
          type="button"
          onClick={startEditing}
          aria-label="Rename current page"
          className={`${ICON_BUTTON} ${FOCUS_RING} ml-0 w-0 overflow-hidden opacity-0 group-hover:ml-[var(--global-spacing-s4,4px)] group-hover:w-[20px] group-hover:opacity-100 group-focus-within:ml-[var(--global-spacing-s4,4px)] group-focus-within:w-[20px] group-focus-within:opacity-100`}
        >
          <EditIcon size={20} />
        </button>
      )}
    </li>
  );
}

export default function Breadcrumbs({
  items = DEFAULT_BREADCRUMBS_ITEMS,
  onNavigate,
  editable = false,
  onRename,
  "aria-label": ariaLabel = "Breadcrumb",
  className,
}: BreadcrumbsProps) {
  const lastIndex = items.length - 1;

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ol className="m-0 flex min-h-[34px] list-none flex-wrap items-center gap-[var(--global-spacing-s4,4px)] p-0">
        {items.map((item, index) => {
          const key = item.id ?? String(index);
          if (index === lastIndex) {
            return <LastItem key={key} item={item} editable={editable} onRename={onRename} />;
          }
          const activate = () => {
            item.onClick?.();
            onNavigate?.(item, index);
          };
          const linkClass = `${ITEM_TEXT} cursor-pointer whitespace-nowrap no-underline hover:underline hover:decoration-[6%] ${FOCUS_RING}`;
          return (
            <li key={key} className="flex items-center gap-[var(--global-spacing-s4,4px)]">
              {item.href ? (
                <a href={item.href} onClick={activate} className={linkClass}>
                  {item.label}
                </a>
              ) : (
                <button type="button" onClick={activate} className={`${linkClass} border-none bg-transparent p-0`}>
                  {item.label}
                </button>
              )}
              {item.badge && <SystemBadge type={item.badge} />}
              <Separator />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
