# Page shell: DefaultCmPageTemplate

The page shell for every full screen. It composes `GlobalHeader`, `SideNavigation` and `GlobalFooter` around a `children` content slot.

Read this before building any page layout.

## Import

```tsx
import { DefaultCmPageTemplate, type DefaultCmPageTemplateProps } from "figma-make-bridge";
```

## Page templates

Product landing page:

1. Page title (for example "Firewalls")
2. Main call to action
3. Content (usually a `Table`)

Resource details page (below a landing page):

1. `Breadcrumbs` as the page header (components/breadcrumbs.md). No page title.
2. Content

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `children` | `ReactNode` | required | The content slot |
| `headerProps` | `Omit<GlobalHeaderProps, "className">` | none | See components/global-header.md |
| `sideNavProps` | `Omit<SideNavigationProps, "className">` | none | See components/side-navigation.md |
| `footerProps` | `Omit<GlobalFooterProps, "className">` | none | See components/global-footer.md |
| `className` | `string` | none | Replaces the default shell classes. Do not pass it |

- All three prop bags are optional. `<DefaultCmPageTemplate>...</DefaultCmPageTemplate>` alone is a complete, valid shell.
- Configure the shell parts through the prop bags, not by rendering them. The rules in each component file apply to its bag.

## Valid values

- Invalid or non-existent: `header`, `sidebar`, `footer`, `title`, `maxWidth`, `padding`, `background`, `theme`, `showSideNav`.

## Content slot rules

- The template provides the page background (`--alias-background-neutral`, the light grey page color).
- The slot is `max-width: 1280px`, horizontally centered, with built-in padding: 16px left and right, 24px top, 32px bottom.
- The template owns background, centering, max-width and outer padding. Do NOT add your own page background, centering wrapper, `max-width` or outer padding around the page content.
- The template also sets the default text color (`--alias-content-text-primary-default`). Page titles and body text inherit it. Do not set a text color on them. Custom text that needs another color uses an `--alias-content-text-*` variable. Never use a hard-coded color, a Tailwind color class, or a template variable such as `--foreground`.
- Never render content wider than 1280px. Never break out with negative margins.
- Inside the slot, stack `Container`s vertically (components/container.md).
- Do not put a `Table` in a `Container` (components/table.md).

## Layout rules

- Scroll model (not configurable): the whole page scrolls as one document. The header scrolls away. `SideNavigation` stays fixed in view. The footer sits at the viewport bottom on short pages and follows the content on long ones.
- Do not wrap the template in your own scroll container or fixed-height wrapper.
- Below 960px the `SideNavigation` is hidden entirely. No mobile nav drawer exists in this version.
- Never nest a second `GlobalHeader`, `SideNavigation` or `GlobalFooter` inside `children`.
- Do not wrap the template in app-shell dependencies (see setup.md).

## Navigation state footgun

- One static nav state (common): omit `selectedPageId` and `onSelectPage` in `sideNavProps`. The rail tracks its own selection.
- NEVER pass a hardcoded `selectedPageId` without `onSelectPage`. It locks the selection permanently. Clicking another page visibly does nothing.
- Real multi-page navigation: pass both together, wired to real state. `onSelectPage` must update the same state that drives what is rendered in the content slot, not just the nav highlight.

## Correct

```tsx
<DefaultCmPageTemplate headerProps={{ notificationCount: 2 }}>
  <Container>Content</Container>
</DefaultCmPageTemplate>
```

## Incorrect

```tsx
<div style={{ height: "100vh", overflow: "auto" }}>
  <DefaultCmPageTemplate sideNavProps={{ selectedPageId: "linodes" }}>
    <div style={{ maxWidth: 1600, margin: "0 auto", background: "white" }}>
      <GlobalFooter />
    </div>
  </DefaultCmPageTemplate>
</div>
```

Scroll wrapper, locked `selectedPageId`, own max-width and background, nested footer.
