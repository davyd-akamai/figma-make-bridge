# New Component Kickoff Prompt

Copy this into a new session to start building a new component. Fill in the bracketed parts.

---

Let's build a new component for `figma-make-bridge`: **[COMPONENT NAME]**.

Figma reference(s):
- Main component: [URL with node-id]
- Internal components / detail breakdown (if there's a separate section like SideNavigation had): [URL with node-id]
- Interactions / states (if there's a separate annotated section): [URL with node-id]

Before doing anything else, read the repo's root `GUIDELINES.md` — it has the established conventions and known gotchas from GlobalHeader and SideNavigation, and I want this component to follow the same patterns, specifically:

- **Exact vectors only.** Every icon comes from `download_assets` (`defaultFormat: "svg"`) on the real Figma node, never hand-drawn, then normalized into a local viewBox. Check `components/icons/index.tsx` first — reuse an existing icon before fetching a new one, and add any new icon there (not locally in the new component) so future components can reuse it too.
- **New icons must also land in `src/App.tsx`'s "Icons" preview section** (both the import and the `ALL_ICONS` array) in the *same* change that adds them to `components/icons/index.tsx` — adding an icon to the shared pack alone is not enough. This has been missed more than once; don't treat it as optional cleanup.
- **Reuse shared components** before building new ones — check `components/Badge.tsx` and anything else already built for something this component's design also uses (badges, buttons, avatars, etc.). If Figma has two similarly-named components, confirm via the `data-name` in the fetched code which one is actually instantiated — don't assume from the name.
- **Tokens:** check whether a token file already exists for this component in `tokens/`. Extend it additively with clearly-named keys if it's incomplete or ambiguous; don't overwrite existing ambiguous keys. Add matching CSS custom properties to `src/tokens.css`, resolved to hex with a fallback, following the existing naming pattern (`--component-{name}-{element}-{state}`).
- **CDS as reference, never a dependency:** if `core-design-system/packages/cds-components/src/components/<name>/` has a matching component, use its **Lit source** (`*.element.ts` + `*.styles.ts`) as the primary code reference for structure/states/behavior — it's the most Figma-aligned of CDS's three framework outputs (Lit/Angular/React). Still verify everything against the actual Figma node before finalizing — CDS has drifted from Figma in places too, so it informs the build, it doesn't override Figma. Never import from `core-design-system` at runtime; it can't be pulled into Figma Make.
- **Dual-purpose design:** no app-shell assumptions (no routing/app-specific context), `react`/`react-dom` treated as peer deps conceptually, no dynamic imports, styling via CSS custom properties rather than relying on Tailwind JIT alone.
- **Data-driven API where the design has repeatable content** (lists, sections, items) — expose it as a typed prop (exported interface) with a sensible default dataset, rather than hardcoding content into JSX. This is what makes a component actually extensible later from Figma Make.
- Cite the Figma node ID/URL in a header comment, same as the existing components.

Workflow:
1. Fetch metadata + design context for the main node and any sub-sections, get a screenshot to confirm visual understanding before writing code.
2. Identify what's genuinely new (icons, tokens, interaction patterns) vs. what already exists in the shared pack/tokens — reuse the latter.
3. Build the component in `components/`.
4. Add it to `src/App.tsx`'s preview harness in its own labeled section (see the existing sections for the pattern), demoing more than one meaningful state if the component has interactive variants. If step 3 added any new icons, also add them to the "Icons" section's import and `ALL_ICONS` array in this same step — don't leave that for later.
5. Start the dev server and verify in the browser: check console for errors, test every interactive state (not just the default render), and confirm against the Figma screenshot before calling it done.
6. Update `GUIDELINES.md`'s component roadmap and add any new conventions/gotchas discovered while building this one — that file is the durable record, not just this chat.

Ask me before assuming anything the Figma file doesn't make clear (exact copy for content, ambiguous interaction behavior, etc.) rather than guessing.
