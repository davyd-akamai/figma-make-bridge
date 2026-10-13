# Migration map: figma-make-guidelines.md -> guidelines-preview/

Preview only. Not wired into the build, `copy-guidelines.mjs` or the package.

## 1. Section map

Every section and bullet group of `figma-make-guidelines.md` and where it now lives.

| Old section | New location |
|---|---|
| Intro paragraph (purpose) | Guidelines.md (purpose paragraph). The claim "sole reference Figma Make reads" and "every section is self-contained" is dropped on purpose |
| Overview: single source of truth, supersedes older kit | setup.md > Package |
| Overview: stack React 18 + Vite, peer deps | setup.md > Package |
| Overview: components are self-contained, no providers | setup.md > Self-contained components |
| Overview: styling ships as compiled CSS, import once | setup.md > Styles (also repeated as a hard rule in Guidelines.md) |
| Overview: light theme only, no `theme` prop | setup.md > Theme |
| Components first: steps 1-3 and "state it in the reply" | Guidelines.md > Components first |
| Components first: do not invent variants/props/states | components/overview.md > Rules for all components (short pointer in Guidelines.md closing line) |
| Components first: do not hand-build replacements | components/overview.md > Rules for all components |
| Design tokens: three tiers | foundations/colors.md > Rules |
| Design tokens: components own their `--component-*`, no overrides | foundations/colors.md > Rules (hard rule repeated in Guidelines.md; override ban also in components/overview.md) |
| Design tokens: custom UI color rules 1-3 | foundations/colors.md > Rules and Decision tree (repeated in Guidelines.md) |
| Design tokens: exempt spacing scale | foundations/spacing.md |
| Design tokens: exempt `.type-*` classes | foundations/typography.md > Rules |
| Design tokens: only listed variable names exist | foundations/colors.md > Rules |
| Alias reference: Text, Icon, Border, Background, Action, Interaction | foundations/colors.md > Alias reference (tables unchanged) |
| Alias reference: Accent, Elevation, Chart | foundations/colors.md > Alias reference |
| Alias reference: "Applying an alias variable" example | foundations/colors.md > Examples |
| Typography: brand typeface rules, no manual overrides | foundations/typography.md > Rules |
| Typography: class table | foundations/typography.md > Classes |
| Typography: gap rule | foundations/typography.md > Missing styles |
| Component reference: GlobalHeader | components/global-header.md |
| Component reference: GlobalFooter | components/global-footer.md |
| Component reference: SideNavigation | components/side-navigation.md |
| Component reference: DefaultCmPageTemplate | composition/page-shell.md |
| Component reference: Badge | components/badge.md |
| Component reference: SystemBadge | components/system-badge.md |
| Component reference: Button (incl. Radix `asChild`) | components/button.md |
| Component reference: Container | components/container.md |
| Component reference: Checkbox | components/checkbox.md |
| Component reference: TextField (incl. width rule) | components/text-field.md. The shared width rule for TextField/Select/Search lives once in components/overview.md |
| Component reference: Select | components/select.md |
| Component reference: Search | components/search.md |
| Component reference: RadioButton | components/radio-button.md |
| Component reference: TabsHorizontal | components/tabs-horizontal.md |
| Component reference: Table | components/table.md |
| Component reference: Drawer | components/drawer.md |
| Component reference: Icon pack | foundations/icons.md |
| Composition examples (all 6) | composition/examples.md |
| Known constraints: content wider than 1280px, own centering/padding | composition/page-shell.md > Content slot rules |
| Known constraints: static imports | setup.md > Imports |
| Known constraints: no app-shell dependencies | setup.md > Self-contained components |
| Known constraints: no `theme` prop, no color overrides | setup.md > Theme; foundations/colors.md; components/overview.md |
| Known constraints: do not invent variants/props | components/overview.md > Rules for all components |
| Known constraints: GlobalHeader | components/global-header.md > Known footguns |
| Known constraints: GlobalFooter | components/global-footer.md > Valid values |
| Known constraints: DefaultCmPageTemplate | composition/page-shell.md > Layout rules |
| Known constraints: Badge | components/badge.md > Valid values |
| Known constraints: SystemBadge | components/system-badge.md > Known footguns |
| Known constraints: SideNavigation | components/side-navigation.md > Known footguns |
| Known constraints: trailing element / `flex-1` label rule | foundations/spacing.md > Layout rule |
| Known constraints: Container | components/container.md > Known footguns |
| Known constraints: Checkbox | components/checkbox.md > Known footguns |
| Known constraints: TextField / Select / Search | components/text-field.md, select.md, search.md > Known footguns; width rule in components/overview.md |
| Known constraints: TabsHorizontal | components/tabs-horizontal.md > Known footguns |
| Known constraints: Table | components/table.md > Known footguns |
| Known constraints: Drawer | components/drawer.md > Known footguns |
| Known constraints: missing components, `infoIcon` placeholder | components/overview.md > Components that do NOT exist yet; Rules for all components |
| Known constraints: no dark theme | setup.md > Theme |

## 2. Old guidelines vs code

The code wins in every case.

| Item | Old guidelines | Code | Followed |
|---|---|---|---|
| `.type-heading-overline` | "small uppercase eyebrow" | `src/typography.css` has no `text-transform` | Code. typography.md says to write the text in uppercase yourself |

Verified with no disagreement: every prop, default and enum for all 15 components and the template; all 24 `.type-*` classes (weight, size, line height); all `--global-spacing-*` steps; every alias name in the tables (91 table entries) plus accent hues, elevation and chart names; all 29 icon names and their default sizes.

Behaviors the old file did not state, found in code and added to the new files:

- `GlobalHeader`: `user` default is `{ name: "CloudUserName", avatarInitial: "C" }`. `onSignInClick` is used only when signed out. `onMenuClick` is the hamburger below 960px. Create button is hidden below 600px.
- `className` REPLACES the default classes (not appended) on `GlobalHeader`, `GlobalFooter`, `SideNavigation`, `SystemBadge`, `DefaultCmPageTemplate`. `Search` replaces its `w-full`. Footgun added to each file.
- `Select` renders demo options "Item 1-3" when `options` is omitted. `Table` and `TabsHorizontal` demo defaults were already in the old file.
- `Button`: `loading` also disables the button. `type` defaults to `"button"`. Icons are auto-sized (16px large, 12px small).
- `Button`, `Container`, `Badge`, `Drawer`, `Table`, `Checkbox`, `RadioButton`, `Select`, `TextField`, `TabsHorizontal` append `className`. Only the five above replace.

## 3. Line counts

| File | Lines |
|---|---|
| Guidelines.md | 43 |
| MIGRATION-MAP.md | 128 |
| components/badge.md | 57 |
| components/button.md | 66 |
| components/checkbox.md | 62 |
| components/container.md | 54 |
| components/drawer.md | 64 |
| components/global-footer.md | 60 |
| components/global-header.md | 56 |
| components/overview.md | 70 |
| components/radio-button.md | 60 |
| components/search.md | 63 |
| components/select.md | 70 |
| components/side-navigation.md | 69 |
| components/system-badge.md | 44 |
| components/table.md | 90 |
| components/tabs-horizontal.md | 65 |
| components/text-field.md | 70 |
| composition/examples.md | 130 |
| composition/page-shell.md | 73 |
| foundations/colors.md | 156 |
| foundations/icons.md | 77 |
| foundations/spacing.md | 65 |
| foundations/typography.md | 65 |
| setup.md | 48 |

## 4. Unsure or needs your decision

- **Install command.** setup.md says `npm install figma-make-bridge`. README says the public npm listing is temporary and will move to Akamai's private registry. Update when that happens.
- **Invalid-value lists.** The "invalid or non-existent" lists (for example `variant="ghost"`, `cellType="button"`) come from absence in the code plus likely mistakes. They were not in the old file.
- **Forbidden names.** In components/overview.md the extra names (`Dialog`, `Toggle`, `Toast`, `Snackbar`, `Banner`, `Combobox`, `Pager`, `Popover`, ...) are my synonyms. An internal `Popover` exists in the repo but is not exported.
- **Hard rules wording.** Guidelines.md repeats the hard rules in tight wording, not word for word from the old file. Compare them against the old "Design tokens" bullets.
- **Intentional duplication.** Besides the hard rules, a few one-line pointers repeat a rule (for example the width-rule pointer in text-field.md, select.md, search.md; "no app-shell" pointer in page-shell.md; `infoIcon` placeholder line in checkbox.md, radio-button.md, text-field.md, which also stays in components/overview.md).
- **Line limits.** All component files are under 120 lines (max 90, table.md). foundations/colors.md (alias tables) and composition/examples.md (6 code samples) are longer because they carry the old content unchanged.
- **Examples not compiled.** composition/examples.md carries the old examples unchanged. They were not re-typechecked in this pass. Intentionally wrong tokens in "Incorrect" snippets (`--alias-content-text-brand`, `--global-spacing-s25`) do not exist on purpose.
- **Reading order.** The router forces components/overview.md before any component file. Component files link to foundations and to each other only by plain path, so a missed read degrades to the hard rules in Guidelines.md.
