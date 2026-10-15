# Icons

Read this before using any icon.

## Rules

- The pack has one React component per icon, exported from `figma-make-bridge` by name.
- Only the icons listed below exist. Never hand-draw an icon inline. Never use another icon library.
- All icons accept `size?: number` plus standard SVG props.
- Icons render in `currentColor`. Color them by setting the text color of a parent (see foundations/colors.md). Never put a raw color on the icon.

## VERIFICATION STEP

Before using any icon name:

1. Check that the exact name appears in the lists below.
2. If it is not listed, do NOT use it. Never invent or guess icon names (`TrashIcon`, `GearIcon`, `CloseCircleIcon`, `SettingsIcon`, ...).
3. Pick a listed icon whose meaning fits. If none fits, flag the gap in the reply. Do not approximate with an unrelated icon.

## Icons

Default size 24px:

`ComputeIcon`, `BucketIcon`, `NetworkIcon`, `ServerIcon`, `MonitorIcon`, `UserIcon`, `MoreIcon`, `MenuIcon`, `SearchIcon`, `HelpCircleIcon`, `CommunityIcon`, `BellIcon`

Default size 20px:

`InfoIcon`, `EditIcon`, `DownloadIcon`, `DeleteIcon`, `CaretIcon`, `StatusAlertIcon`

Default size 16px:

`ChevronUpIcon`, `ChevronDownIcon`, `PinIcon`, `PlusIcon`, `CloseIcon`, `SortIcon`, `ArrowLeftIcon`, `SpinnerIcon`

Default size 12px:

`CheckIcon`, `MinusIcon`, `DotIcon`

Extra props:

| Icon | Prop | Type | Default |
|---|---|---|---|
| `PinIcon` | `filled` | `boolean` | `false` |
| `SpinnerIcon` | `variant` | `"white" \| "gradient"` | `"white"` |

## Import

```tsx
import { ComputeIcon, PlusIcon, type IconProps } from "figma-make-bridge";
```

## Usage

Correct:

```tsx
<span style={{ color: "var(--alias-content-icon-primary-default)" }}>
  <PlusIcon size={16} />
</span>
<Button startIcon={<PlusIcon />}>Add</Button>
```

Incorrect:

```tsx
<TrashIcon />
<PlusIcon style={{ color: "red" }} />
<svg viewBox="0 0 16 16"><path d="..." /></svg>
```

`TrashIcon` is not in the pack. Use `DeleteIcon`. Never color an icon directly. Never hand-draw an SVG.

## Where icons are passed

- `SideNavSection.icon`: pass an element, e.g. `icon: <ComputeIcon />`. A section that needs an icon not in the pack needs a new exact-vector icon, not an approximation. Say so in the reply (components/side-navigation.md).
- `Button` `startIcon` and `endIcon` (components/button.md). Sized automatically.
- `TabsHorizontal` tab `icon`, typically `size={16}` (components/tabs-horizontal.md).
- `Select` option `icon`, `Drawer` `icon`, `Table` action, link and iconText `icon` (see each component file).
