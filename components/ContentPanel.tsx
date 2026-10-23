// Figma: Content panel, node 126:4081 — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=126-4081&m=dev
// Variant set: Type=Default (1px border, node 126:4080) / Borderless (no border, node 126:4079). Both are a 56px
// header (caret + bold label on the left, icons on the right) over an optional body separated by a 1px divider.
// CDS reference: core-design-system's cds-content-panel (Lit) — the collapse behavior (caret rotates -90deg when
// collapsed, header click toggles) comes from there; Figma only shows the expanded state.
// Design-owner decisions (not in Figma): collapsible via `expanded`/`defaultExpanded`/`onExpandedChange`;
// header actions are a data-driven `actions` array — at most 3 icons *including* the ⋯ trigger, the rest live in
// the ⋯ dropdown (label-only rows); body renders only when `children` is passed (replaces Figma's `contentBox`).

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { CaretFilledIcon, MoreIcon } from "./icons";
import Popover from "./internal/Popover";

export type ContentPanelType = "default" | "borderless";

export interface ContentPanelAction {
  id: string;
  /** Accessible name / tooltip for an icon button, and the visible text of a menu row. */
  label: string;
  /** Icon shown when the action is placed as an icon button. Without one the action goes to the ⋯ menu. */
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  /** "icon" (default) shows an icon button in the header; "menu" puts it in the ⋯ dropdown. */
  placement?: "icon" | "menu";
}

export interface ContentPanelProps {
  /** Panel title (bold label in the header). */
  title: ReactNode;
  /** Body content. Omit to render a header-only panel. */
  children?: ReactNode;
  /** "default" has a 1px border; "borderless" has none. */
  type?: ContentPanelType;
  /** Shows the caret and lets the header toggle the body. Default true. */
  expandable?: boolean;
  /** Controlled expanded state. */
  expanded?: boolean;
  /** Initial expanded state when uncontrolled. Default true. */
  defaultExpanded?: boolean;
  /** Fired when the user toggles the panel, with the next expanded value. */
  onExpandedChange?: (expanded: boolean) => void;
  /** Header actions. At most 3 icons including the ⋯ trigger; overflow and `placement: "menu"` go in the ⋯ dropdown. */
  actions?: ContentPanelAction[];
  className?: string;
}

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alias-interaction-border-focus,#0174BC)]";

const ICON_BUTTON =
  "flex size-[20px] shrink-0 cursor-pointer items-center justify-center text-[color:var(--component-contentpanel-icon,#3D3D42)] hover:text-[color:var(--alias-content-icon-primary-hover,#009CDE)] disabled:cursor-not-allowed disabled:text-[color:var(--alias-content-icon-primary-disabled,#A3A3AB)]";

// Splits `actions` into header icon buttons and ⋯-menu rows. The ⋯ trigger counts toward the 3-icon cap.
function splitActions(actions: ContentPanelAction[]) {
  const wantsIcon = (a: ContentPanelAction) => a.placement !== "menu" && a.icon != null;
  const iconCandidates = actions.filter(wantsIcon);
  const hasMenuOnly = actions.some((a) => !wantsIcon(a));
  const maxIcons = hasMenuOnly || iconCandidates.length > 3 ? 2 : 3;
  const visibleIds = new Set(iconCandidates.slice(0, maxIcons).map((a) => a.id));
  return {
    demoted: Math.max(0, iconCandidates.length - maxIcons),
    icons: actions.filter((a) => visibleIds.has(a.id)),
    menu: actions.filter((a) => !visibleIds.has(a.id)),
  };
}

function ActionsMenu({ actions }: { actions: ContentPanelAction[] }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="More actions"
        onClick={() => setOpen((v) => !v)}
        className={`${ICON_BUTTON} ${FOCUS_RING}`}
      >
        <MoreIcon size={20} />
      </button>
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={triggerRef}
        align="end"
        role="menu"
        aria-label="More actions"
        className="flex min-w-[160px] flex-col items-stretch bg-[var(--component-dropdown-background-default,#FFFFFF)] py-[var(--global-spacing-s4,4px)] shadow-[var(--component-dropdown-elevation-s,0px_2px_8px_0px_rgba(58,59,63,0.18))]"
      >
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            role="menuitem"
            disabled={action.disabled}
            onClick={() => {
              action.onClick();
              setOpen(false);
            }}
            className={`type-label-regular-s px-[var(--global-spacing-s12,12px)] py-[var(--global-spacing-s8,8px)] text-left ${
              action.disabled
                ? "cursor-not-allowed text-[color:var(--component-dropdown-text-disabled,#A3A3AB)]"
                : "cursor-pointer text-[color:var(--component-dropdown-text-default,#343438)] hover:bg-[var(--component-dropdown-background-hover,#EDF8FF)]"
            }`}
          >
            {action.label}
          </button>
        ))}
      </Popover>
    </>
  );
}

export default function ContentPanel({
  title,
  children,
  type = "default",
  expandable = true,
  expanded,
  defaultExpanded = true,
  onExpandedChange,
  actions = [],
  className,
}: ContentPanelProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = !expandable || (expanded ?? internalExpanded);
  const bodyId = useId();
  const hasBody = children != null && children !== false;
  const { icons, menu, demoted } = splitActions(actions);

  // Dev-only footgun warning, once per mount (not per render).
  const warned = useRef(false);
  useEffect(() => {
    if (import.meta.env?.DEV && demoted > 0 && !warned.current) {
      warned.current = true;
      console.warn(`ContentPanel: ${demoted} icon action(s) exceeded the header limit and were moved to the ⋯ menu.`);
    }
  }, [demoted]);

  // Keep the body out of the tab order/AT tree once it has finished collapsing (visibility is transitioned).
  const [bodyHidden, setBodyHidden] = useState(!isExpanded);
  useEffect(() => {
    if (isExpanded) setBodyHidden(false);
  }, [isExpanded]);

  function toggle() {
    const next = !isExpanded;
    if (expanded === undefined) setInternalExpanded(next);
    onExpandedChange?.(next);
  }

  const labelClasses =
    "type-label-bold-l min-w-0 text-left text-[color:var(--component-contentpanel-text,#343438)]";

  return (
    <div
      className={`box-border flex w-full flex-col items-start bg-[var(--component-contentpanel-background,#FFFFFF)] ${
        type === "default" ? "border border-solid border-[var(--component-contentpanel-border,#D6D6DD)]" : ""
      } ${className ?? ""}`}
    >
      <div className="flex min-h-[56px] w-full items-stretch">
        {expandable ? (
          <button
            type="button"
            aria-expanded={isExpanded}
            aria-controls={hasBody ? bodyId : undefined}
            onClick={toggle}
            className={`flex min-w-0 flex-1 cursor-pointer items-center gap-[var(--global-spacing-s8,8px)] pl-[var(--global-spacing-s24,24px)] text-[color:var(--component-contentpanel-icon,#3D3D42)] ${FOCUS_RING} focus-visible:-outline-offset-2`}
          >
            <CaretFilledIcon
              aria-hidden="true"
              className={`shrink-0 transition-transform duration-[350ms] ease-linear ${isExpanded ? "" : "-rotate-90"}`}
            />
            <span className={labelClasses}>{title}</span>
          </button>
        ) : (
          <div className="flex min-w-0 flex-1 items-center pl-[var(--global-spacing-s24,24px)]">
            <span className={labelClasses}>{title}</span>
          </div>
        )}
        {(icons.length > 0 || menu.length > 0) && (
          <div className="flex shrink-0 items-center gap-[var(--global-spacing-s8,8px)] pl-[var(--global-spacing-s12,12px)] pr-[var(--global-spacing-s24,24px)]">
            {icons.map((action) => (
              <button
                key={action.id}
                type="button"
                aria-label={action.label}
                title={action.label}
                disabled={action.disabled}
                onClick={action.onClick}
                className={`${ICON_BUTTON} ${FOCUS_RING}`}
              >
                {action.icon}
              </button>
            ))}
            {menu.length > 0 && <ActionsMenu actions={menu} />}
          </div>
        )}
      </div>
      {hasBody && (
        <div
          id={bodyId}
          role="region"
          aria-hidden={!isExpanded}
          onTransitionEnd={(e) => {
            if (e.target === e.currentTarget && !isExpanded) setBodyHidden(true);
          }}
          className={`grid w-full transition-[grid-template-rows] duration-[350ms] ease-linear ${
            isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          } ${bodyHidden && !isExpanded ? "invisible" : ""}`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="border-t border-solid border-[var(--component-contentpanel-divider,#D6D6DD)] px-[var(--global-spacing-s24,24px)] py-[var(--global-spacing-s16,16px)]">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
