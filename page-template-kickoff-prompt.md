# New Page Template Kickoff Prompt

Copy this into a new session to build a page-shell template (GlobalHeader + SideNavigation + GlobalFooter composed together, with an open content slot). Fill in the bracketed parts.

---

Let's build the base page template for `figma-make-bridge`: a blank-page shell combining GlobalHeader (top), SideNavigation (left), and GlobalFooter (bottom), with an open content area in the middle. This is the layout scaffold every future Figma Make prototype gets built inside — Figma Make's custom UI work should always sit *within* this shell's content slot, never replace or duplicate the shell itself.

Figma reference, if there's a combined layout frame showing all three together: [URL with node-id]. If there isn't one, we're composing from the three individual component specs directly — say so.

**Prerequisite:** GlobalHeader, SideNavigation, and GlobalFooter must already exist in `components/`. This session composes them — it does not rebuild them. If any is missing, go build it first via `component-kickoff-prompt.md`, then come back to this.

Before doing anything else, read the repo's root `GUIDELINES.md` for established conventions (exact-vector icons, shared icon/badge reuse, additive tokens, dual-purpose design constraints) — this template needs to follow the same rules as every other component here.

Things this session needs to get right:

- **Compose, don't duplicate.** Import GlobalHeader/SideNavigation/GlobalFooter as-is. If the shell needs something extra from them to lay out correctly (sticky positioning, height/width coordination), that's layout code that lives in the template — it shouldn't require changing the underlying components' own props or internals. If it does turn out one of them is missing something needed for composition (e.g. a way to report its current width so the content area can react to SideNavigation's collapse/expand), flag that as a prop addition to the *existing* component, and ask before changing its public API.
- **Layout structure:** the page itself scrolls as one unit — there is no independent scrollable content pane. Header sits on top of the content and scrolls away with it (not fixed/sticky). Footer sits at the bottom of the content and scrolls with it too, but if the page's content is shorter than the viewport, the footer should still land at the bottom of the viewport rather than floating up under the content. SideNavigation is the only fixed element: it stays pinned to the left for the full height of the viewport, and once the page scrolls past where the header would be, the sidenav sticks to the top of the viewport. Check whether Figma has a responsive spec for this combined layout the way GlobalHeader's mobile/tablet/desktop breakpoints did (e.g. does SideNavigation hide/go off-canvas below a certain width?) — don't assume, check.
- **Content is a slot**, not fixed content — the shell takes `children` (or similarly named prop) so arbitrary future UI can be dropped in without touching the shell. The slot lives inside a "Page Content & Paddings" frame in the template: a max-width 1280px container, horizontally centered, with 16px left/right padding, 24px top padding, and 32px bottom padding inside it. This spec applies at 1280px and wider — we're not focusing on smaller screens for now, but pull the real breakpoint values from Figma if they're available there rather than guessing. Don't put any placeholder page content inside the template itself beyond what's needed for the preview demo.
- **Keep the dual-purpose constraints** from `GUIDELINES.md`: no app-specific routing assumptions baked into the slot (a real consumer might put a router outlet there — the template shouldn't care), no hardcoded page content shipped as part of the component.

Ask me rather than assuming on these — they're product decisions, not things to infer from Figma:
- What's actually configurable at the shell level vs. fixed? E.g., can a consumer render this without a sidenav for a full-width page, or is the shell always all three?
- Where should this live in the repo — alongside individual components in `components/`, or does it deserve its own folder (e.g. `templates/` or `layouts/`) since it's a composition rather than a primitive? I'd lean toward a separate folder once we have more than one template, but confirm with me.
- What should the component/file be named?

Workflow (same shape as the component prompt):
1. Confirm the layout spec (screenshot/design context if a combined Figma frame exists).
2. Build the shell, composing the three existing components.
3. Wire it into `src/App.tsx`'s preview harness as its own labeled section, with placeholder content in the slot so the layout is visible.
4. Verify interactively: test at multiple breakpoints if responsive behavior applies, test that SideNavigation's collapse/expand still works correctly inside the shell, test the scroll behavior (header scrolls away, sidenav sticks to top, footer sticks to viewport bottom on short content and sits below content on long content), check console for errors.
5. Update `GUIDELINES.md`'s component/template roadmap and document any new conventions this composition surfaced.
