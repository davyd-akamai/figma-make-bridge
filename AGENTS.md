# Maintainer notes

Repo-level and maintainer-only. Nothing here ships in `dist/` or `guidelines/`.

## Responsive styles: no utility pairs on the same property

Figma Make loads its own Tailwind after our styles.css. Its later
.hidden, .flex, .flex-col and similar utilities have the same
specificity as ours and override our tablet:* / desktop:* rules.
This hid the side navigation and left the header in the mobile
layout on wide screens (fixed in 0.1.12).

Rules for every component, new or changed:
- Never put a base utility and a tablet:/desktop:/md:/lg: utility
  on the same element for the same property (for example
  "hidden desktop:block", "flex-col desktop:flex-row",
  "px-4 desktop:px-6").
- For any layout that changes with width, define one fmb-* class in
  src/library.css with its media query next to it. Keep the 600px
  (tablet) and 960px (desktop) breakpoints.
- Use tokens inside those classes (var(--global-spacing-*), alias
  variables). No new hardcoded px or hex values except breakpoints.
- Before finishing a component, render it in a test page with
  Tailwind imported before AND after figma-make-bridge/styles.css, at
  1200px and 800px. All four cases must give the same, correct result.
