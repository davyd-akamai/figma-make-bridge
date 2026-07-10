# Code Connect Kickoff Prompt

Copy this into a new session to continue mapping `figma-make-bridge` components to Figma via Code Connect. Fill in the bracketed part.

---

Let's continue Code Connect work for `figma-make-bridge`. Next component(s): **[COMPONENT NAME(S), or "pick up wherever GUIDELINES.md left off" if unsure]**.

Before doing anything else, read the repo's root `GUIDELINES.md`, specifically its **"Code Connect" section** — it's the full record of what's mapped, what's blocked, and every gotcha hit so far. Don't re-derive these from scratch:

- **Two independent prerequisites, easy to conflate:** (1) the target file/library must actually be Figma-**published** (Assets panel → Publish — not exposed via any MCP tool, has to happen in Figma itself), and (2) the specific node must be the **owning** component, not an instance consumed from another library. A "Published component not found" error from `add_code_connect_map` can mean either — check both with `search_design_system` (scoped via `includeLibraryKeys` to `Internal ADS library`'s key) before assuming it's a mapping-logic bug.
- **Org libraries own most of the original Figma source components** — `core_button`, `core_container`, `core_checkbox`, etc. live in "Core Components Akamai DS", and shared icons (`core_checkmark`, `core_info`, etc.) live in a separate "Icons Akamai DS" library. We don't have write access to either, so the established workaround is: **duplicate the component locally into `Internal-ADS-library`, publish it, then map the local copy** — not the org original. Icons specifically get grouped under a shared "Icons" section (node `58:5152`) in the file so future icon duplicates land in one place.
- **`VARIANT` properties with binary options (e.g. `Selected: False/True`) are not `BOOLEAN` properties** — use `getEnum`, not `getBoolean`, or the template silently breaks. Check the property `type` field from `get_context_for_code_connect` rather than assuming from the Figma property name.
- **Hover/Active/Focus Figma states usually aren't real props** — they're CSS pseudo-classes (`:hover`, `peer-focus-visible:`, etc.) the component already handles itself. Only map `State` values that correspond to an actual prop (typically `Disabled`/`Read-only`/`Loading`); collapse the rest to the same default rather than inventing a prop that doesn't exist.
- **Never hardcode a swappable icon/instance** — if a Figma property is `INSTANCE_SWAP`, resolve it dynamically via `getInstanceSwap(...).executeTemplate()`. If a nested icon has no exposed swap property (i.e. the code component always renders it internally, not as a consumer-facing prop — e.g. Button's loading spinner), leave it out of that component's template, but consider giving *that icon* its own standalone Code Connect mapping if it's independently meaningful (see the CheckIcon/MinusIcon precedent) — that's separate from whether the parent template references it.
- **Fix naming drift while you're in a component anyway.** Several components' header comments and `GUIDELINES.md` citations still pointed at old `core_*` org node IDs/names after the user duplicated+renamed components locally (e.g. Button was `core_button`/44:2128, now `Button`/47:14865). If `get_context_for_code_connect`'s returned `name` doesn't match what the code/docs cite, update both to the current name — don't leave stale references.
- **Unresolved caveat, still open:** every `get_code_connect_map` read-back so far reports `hasTemplate: false` despite the `template` field being accepted on push. Not yet confirmed whether Figma Dev Mode actually serves the real variant-aware generated snippet or falls back to something generic. Worth a manual Dev Mode spot-check (e.g. does the snippet correctly show `variant="danger"` when `Type=Danger` is selected) if you get the chance — flag in `GUIDELINES.md` either way once checked.

Workflow (repeat per component):
1. **Load the skill first** — `figma-code-connect` — before calling any Code Connect MCP tool.
2. Parse the Figma URL (or ask for one if not given) → `fileKey`/`nodeId`.
3. `get_code_connect_suggestions` (excludeMappingPrompt: true) to confirm it's unmapped and resolve the real main-component node ID.
4. `search_design_system` scoped to `Internal ADS library`'s key to check publish status *and* ownership before doing anything else — this catches both blockers above up front.
5. `get_context_for_code_connect` to pull full property definitions.
6. Read the matching code component in `components/` to confirm the props interface.
7. Write `components/<Name>.figma.ts` (or `components/icons/<Name>.figma.ts` for icons) following the property-mapping conventions above. Validate against the Step 6 checklist in the `figma-code-connect` skill (property coverage, no invented props, no hardcoded swappable content, correct interpolation wrapping).
8. **Confirm before pushing** — `add_code_connect_map` writes to a shared team-visible library; don't push without checking in first, same as every mapping done so far.
9. Verify with `get_code_connect_map` (confirms `componentName`/`source` resolve for every variant instance).
10. Log the result in `GUIDELINES.md`'s Code Connect section — what got mapped, any judgment calls, any new gotchas.

Currently blocked: `InfoIcon` (local `info` component, node `58:5219`, already wired into Checkbox and RadioButton in Figma) — still hasn't been published, so its mapping push keeps failing. Check `search_design_system` for it first; if it's published now, finish that one before starting anything new.

Ask me before assuming a Figma property maps to a code prop that doesn't clearly correspond — omit rather than invent, same rule as building the components themselves.

**Immediately after copying this prompt in, commit this file and any GUIDELINES.md changes** rather than leaving them uncommitted for a session or more — an uncommitted new file is exactly what got lost last time (wiped by a `git reset`/clean before it was ever committed).
