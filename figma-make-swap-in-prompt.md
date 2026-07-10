# Figma Make Swap-In Prompt

Reusable starting point for replacing an existing Make prototype's ad-hoc UI with real `figma-make-bridge` components — works for any prototype, not tied to a specific project. See [figma-make-swap-in-guide.md](figma-make-swap-in-guide.md) for the reasoning and troubleshooting behind why this prompt is shaped the way it is.

## Before sending the prompt below

Paste the current contents of [figma-make-guidelines.md](figma-make-guidelines.md) into Figma Make's Guidelines/project-instructions field — every component this prompt can match against is documented there, and that list grows over time, so always use the current version, not a saved copy.

## The prompt

```
Add (or update) the npm package `figma-make-bridge` to its latest published version as a dependency, if it isn't already at the latest. Import `figma-make-bridge/styles.css` once at the app root if it isn't imported yet — do not add any other font, stylesheet, or CSS reset alongside it.

If this prototype already has its own pre-existing Tailwind-generated styles (i.e. it wasn't built with this library from the start), make sure `figma-make-bridge/styles.css` is imported AFTER the app's own global stylesheet, not before — this library's compiled utility classes can share names with an app's own Tailwind output (`.hidden`, `.flex`, etc.), and whichever stylesheet loads later wins ties in the cascade. If it's already ordered that way, leave it as-is.

**Phase 1 — shell, first and in isolation.** Check whether this prototype already composes `GlobalHeader`, `SideNavigation`, and `GlobalFooter` via `DefaultCmPageTemplate`. If it doesn't yet (true for any prototype that predates this library), do this before anything else in this prompt, and confirm it renders correctly before moving on to Phase 2:

- Replace the existing hand-built header/nav/footer with `GlobalHeader`/`SideNavigation`/`GlobalFooter`, composed via `DefaultCmPageTemplate`. Use the exported `DEFAULT_SIDE_NAV_SECTIONS` for the nav unless told otherwise. Don't pass `selectedPageId`/`onSelectPage`/`pinned`/`onPinToggle` unless wiring them to real state that also drives page content — omit them entirely for a single-screen prototype.
- Move the prototype's existing page content into `DefaultCmPageTemplate`'s content slot unchanged — **except** for one thing: strip any styling on the content's own outer wrapper that's now redundant with what the template already provides — page-level background color, outer padding/margin, max-width/centering. The template owns all of that now; leaving the old wrapper's styling in place doubles up padding or stacks two conflicting backgrounds. List exactly what you removed from the old wrapper as part of your Phase 1 report.
- Take a screenshot after this phase and check specifically for doubled spacing or a visible background mismatch around the content area before proceeding — this is a visual check, not just "does it render."

**Phase 2 — everything else, checklist-driven, not a judgment-based "replace everything" pass:**

**Step 1 — enumerate before changing anything.** Scan the entire prototype's source for any existing UI element that has an equivalent among the components documented in Guidelines.md's "Component reference" section (buttons, form fields, containers, navigation, etc. — whatever's currently exported). List every match you find, with its file and a short description, before converting anything.

**Step 2 — convert each one, translating prop shapes, not just visual classes.** Common cases where the shape genuinely differs, not just the styling:
- A plain shadcn/Radix `Checkbox` uses `onCheckedChange(checked: boolean | "indeterminate")` on a `<button role="checkbox">`; this library's `Checkbox` uses `onChange(checked: boolean)` on a real `<input type="checkbox">`. Rewrite the handler signature, don't just rename the prop.
- A shadcn/Radix `RadioGroup` + `RadioGroupItem` manages selection via React context between children. This library's `RadioButton` has no group-context awareness — each instance is an independent native radio input, and grouping comes purely from giving every `RadioButton` in the group the same `name` prop. Nesting `RadioButton`s inside the old `RadioGroup` wrapper won't work (the context has nothing to talk to) — replace the whole selection mechanism with a `selectedValue` state in the parent, a shared `name`, and per-item `checked={selectedValue === thisValue}` / `onChange={() => setSelectedValue(thisValue)}` (this library's `RadioButton.onChange` takes no argument — it only fires on select).
- If a converted `Button` is the child of a Radix `asChild` trigger (`PopoverTrigger`, `TooltipTrigger`, `DropdownMenuTrigger`, `DialogTrigger`, etc.), don't pass `Button` directly as that child — Radix's `Slot` clones its child via `cloneElement` and can clobber `Button`'s internal `variant`/`size` handling, crashing the render. Wrap `Button` in a plain `<span className="inline-flex">` and make the span the `asChild` target instead; clicks bubble through to `Button` normally.
- For anything else, match variant/size/prop names to what's documented in Guidelines.md's Component reference for that component.

**Step 3 — don't force-fit what doesn't match.** If something looks superficially similar to a library component but doesn't actually map cleanly (e.g. a dropdown/select when there's no `Select` component yet, a tab bar when there's no tab-style `Button` variant), leave it exactly as-is and flag it in your report instead of guessing at a workaround or inventing a new prop.

**Step 4 — verify behavior, not just appearance.** Actually interact with every converted element (type into fields, check/uncheck, select options, click buttons) and confirm the underlying state still works correctly, not just that it renders styled correctly.

**Step 5 — report back** the full list from Step 1 with a ✅ (converted and verified), ❌ (attempted but broke — describe how), or ⚠️ (flagged, left as-is, doesn't map) next to each item, plus the Phase 1 shell report if that phase ran.
```

## Keeping this current

This prompt deliberately doesn't name specific components or prop shapes beyond the handful of idiom translations (Checkbox, RadioGroup, Button+asChild) that are unlikely to change — everything else defers to whatever Guidelines.md documents at the time, so this file shouldn't need edits every time a new component ships. Only revisit it if a *new* component introduces its own non-obvious idiom mismatch worth calling out the same way (add it to Step 2 as its own bullet), or if a new class of bug is found that every future swap-in should guard against proactively.

The Phase 1 shell step is deliberately conditional ("if it doesn't already exist") rather than assumed-needed every time — a prototype that's already been through one swap-in shouldn't be told to reinstall a shell it already has.
