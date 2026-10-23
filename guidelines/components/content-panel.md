# ContentPanel

Titled section with a header (caret, bold title, icon actions) over an optional body. Collapsible by default.

## When to use / when not to use

- Use to split a page into titled, collapsible sections, each with its own header actions (download, edit, more).
- Use `Container` instead for a plain bordered box with no header.
- Do NOT put a `Table` inside the body unless the panel is `type="borderless"` and you accept the 24px/16px body padding.
- Stack panels vertically with a gap. There is no group/accordion wrapper; each panel collapses independently.

## Import

```tsx
import { ContentPanel, type ContentPanelProps, type ContentPanelAction } from "figma-make-bridge";
```

## Props

```ts
type ContentPanelType = "default" | "borderless";

interface ContentPanelAction {
  id: string;
  label: string;                    // icon button name/tooltip, or menu row text
  icon?: ReactNode;                 // an icon at size={20}; without one the action goes to the ⋯ menu
  onClick: () => void;
  disabled?: boolean;
  placement?: "icon" | "menu";      // default "icon"
}

interface ContentPanelProps {
  title: ReactNode;
  children?: ReactNode;             // body; omit for a header-only panel
  type?: ContentPanelType;          // default "default"
  expandable?: boolean;             // default true (caret + toggling)
  expanded?: boolean;               // controlled
  defaultExpanded?: boolean;        // default true
  onExpandedChange?: (expanded: boolean) => void;
  actions?: ContentPanelAction[];
  className?: string;
}
```

## Valid values

- `type`: `"default"` (1px border) or `"borderless"` (no border).
- `placement`: `"icon"` or `"menu"`.
- Invalid or non-existent: `collapsed`, `defaultCollapsed`, `onToggle`, `border`, `stripe`, `disabled`, `header`, `footer`, `contentBox`, `size`.

## Correct

```tsx
<ContentPanel
  title="Details"
  actions={[
    { id: "download", label: "Download", icon: <DownloadIcon size={20} />, onClick: download },
    { id: "rename", label: "Rename", placement: "menu", onClick: rename },
  ]}
>
  <p className="type-body-regular">Body content</p>
</ContentPanel>
```

## Incorrect

```tsx
<ContentPanel title="Details" collapsed onToggle={...} headerActions={<Button>Edit</Button>} />
```

`collapsed`, `onToggle` and `headerActions` do not exist. Use `defaultExpanded={false}` / `onExpandedChange` and `actions`.

## Known footguns

- Header actions are at most 3 icons INCLUDING the ⋯ trigger. The ⋯ appears only when at least one action is menu-placed (or an icon action overflows). With a ⋯ you get at most 2 icon buttons; without one, at most 3. Extra icon actions silently move into the ⋯ menu (a dev warning is logged).
- Menu rows show the label only (no icon). Icon buttons need a real `label` (it is the accessible name).
- Use icons from foundations/icons.md at `size={20}` (for example `DownloadIcon`, `EditIcon`, `DeleteIcon`; `MoreIcon` is 24px by default).
- Uncontrolled by default, starting expanded. Pass `expanded` together with `onExpandedChange` to control it. Pass `defaultExpanded={false}` to start collapsed.
- `expandable={false}` removes the caret and toggling: the body is always shown.
- The body renders only when `children` is passed. With no children you get a header-only panel (the caret then toggles nothing, so also set `expandable={false}`).
- Always full width of its parent. Never place two side by side or set an explicit width.
- Body height is intrinsic with fixed 24px horizontal / 16px vertical padding and a divider under the header.
- Action buttons and the ⋯ menu do not toggle the panel; only the caret/title area does.
