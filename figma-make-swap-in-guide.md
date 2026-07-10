# Swapping figma-make-bridge into an existing Make prototype

For a prototype that was built *before* `figma-make-bridge` existed (or before it was installed there) and now needs its ad-hoc UI replaced with real library components. Different scenario from [figma-make-kickoff-prompt.md](figma-make-kickoff-prompt.md), which is for a brand-new file that starts with the library already in place.

**The reusable copy-paste prompt itself lives in [figma-make-swap-in-prompt.md](figma-make-swap-in-prompt.md)** — deliberately generic, works for any prototype, not specific to any one project. This file is the reasoning and troubleshooting behind why that prompt is shaped the way it is; don't fork a one-off version of the prompt for a specific prototype — if something's missing from it, add it there so every future swap-in benefits, the same way each finding below fed back into it.

## Sequence: shell first, then leaf components, in separate verified passes

If the prototype has never had the library installed, the first swap-in necessarily includes both a structural change (replacing the hand-built header/nav/footer with `DefaultCmPageTemplate`) and small leaf-component changes (buttons, containers). Don't do these in one undifferentiated instruction — ask for them as explicitly ordered passes, and check the result after pass 1 before letting pass 2 run. If something breaks, you want to know which pass caused it.

## Writing the actual prompt

**"Replace every X" reliably misses instances — ask for a checklist instead.** Twice now, a general instruction like "replace every button/container" converted the first or most prominent instances and silently skipped later, structurally-identical ones (a stat panel identical in structure to an already-converted one; a toolbar button). The fix that works: ask Make to first *enumerate* every remaining instance of the pattern before changing anything, then convert each one, then **report back the enumerated list with a ✅/❌ per item confirming it was actually changed.** This gives you something to check against instead of finding the next straggler by screenshot.

**Name specific elements when you already know one's a problem**, don't rely on the category description alone — "the Add Route button in the toolbar" lands more reliably than "buttons in general."

**Explicitly fence off what NOT to touch**, every time. Make will happily rewrite things beyond the intended scope if you don't say otherwise — "do NOT touch the actual data table, filters, or form fields" needs to be in the prompt, not assumed.

**If the library isn't installed in the target prototype yet**, the prompt needs the install step and the Guidelines.md paste step explicitly — don't assume either happened already just because it's been done elsewhere.

## Diagnosing a rendering bug with no console access

If the environment is read-only (no devtools console to run commands in), you can still get real diagnostic data by asking Make to write it directly into the rendered page instead of `console.log` — a temporary fixed-position debug panel showing whatever values you need, computed in a `useEffect`, removed once you've read it off a screenshot. This worked for reading `window.innerWidth`/`document.documentElement.clientWidth` and inspecting computed styles/class names on a specific element.

**Prefer static checks over live DOM reflection when possible.** Asking Make to search its own source/bundle for a literal string (e.g. "does the compiled CSS contain `960px`?", "what version is resolved in the lockfile?") is far more reliable than asking it to write live runtime introspection code — a static string search can't really get it wrong, but hand-written diagnostic JS can have subtle bugs (missed recursion into `@media`/`@layer` blocks, wrong element reference, timing issues) that produce a confidently-wrong answer with no way to audit it remotely. If a runtime check comes back with a result that doesn't add up, don't keep escalating the cleverness of the runtime script — switch to a static check on the same question instead.

## Known symptoms and what they mean

- **"Some unrelated styling shifted after a fix" is expected, not alarming**, if the fix involved changing stylesheet import order. This library and a prototype's own pre-existing Tailwind output can define the same utility class names (`.hidden`, `.flex`, `.gap-4`, etc.) — reordering imports to make ours win a specific conflict makes it win *every* tie, including on markup the swap never touched. Report specific broken elements (a screenshot with the exact button/panel called out is far more useful than "styles are broken") rather than treating it as a mystery regression — see `GUIDELINES.md`'s "First real Make swap-in" section for the actual root cause and the durable fix that's still pending (a CSS class prefix).
- **`Can't resolve 'figma-make-bridge/styles.css'` after returning to a file after a break is an environment quirk**, not a library bug — Make's dev container likely got recycled and needs to reinstall the dependency. Just let Make resolve/reinstall it; nothing about how the library is attached needs to change.
- **A crash right after swapping `Button` into a Radix trigger (`PopoverTrigger asChild`, `TooltipTrigger`, `DropdownMenuTrigger`, `DialogTrigger`, etc.)** is a known incompatibility, not a one-off bug — see `Button`'s section in `figma-make-guidelines.md` for the required workaround (wrap `Button` in a plain `<span>` and make that the `asChild` target). Worth pasting the current `Guidelines.md` again if a prototype hits this and it wasn't caught proactively — it's documented there now.

## What to escalate instead of troubleshooting further in-prompt

- Any suspected CSS cascade/specificity conflict beyond a one-off import-order fix — the durable fix is a build-level change (Tailwind class prefix) to this repo, not something to solve per-prototype.
- Breakpoint/responsive layout logic itself misbehaving (as opposed to losing a cascade fight) — that's a component change, not a prompt fix.
- Anything where "which of two very different bugs is this" isn't resolvable from a screenshot — get a second data point (see diagnosis section above) before guessing at a fix.
