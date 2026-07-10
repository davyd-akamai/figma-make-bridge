# Using figma-make-bridge in Figma Make — a guide for designers

`figma-make-bridge` is our shared component library — the single source of truth for how product UI should look and behave across Figma Make prototypes. This guide walks through everything you need to do, step by step, no engineering background assumed.

## Three things, three different mechanics

Before the steps below, it helps to know these are three separate things — none of them get "uploaded" anywhere:

1. **The component library** (the actual buttons, fields, navigation, etc.) — an npm package Make installs like any other dependency.
2. **Guidelines.md** — a text file that teaches Figma Make's AI *how* to use the library correctly (which prop to reach for, sizing rules, what not to do). You paste its contents into Figma Make's own **Guidelines / project instructions field** — a settings area for that specific project, not the chat. Do this once per prototype, and again any time the library gets updated.
3. **Prompts** — one-time messages you copy and paste into Make's chat to kick off a specific piece of work (starting a new file, or converting an existing one). You just type them in like any other request — nothing to attach or install.

You'll always do #1 and #2 first, then use one of the prompts in #3 depending on which situation below you're in.

## Situation A: Starting a brand-new prototype

1. **Add the library.** In Figma Make's chat, ask it to add the npm package `figma-make-bridge` (latest version) as a dependency. Or just use the copy-paste prompt in step 3 below — it includes this.
2. **Paste the Guidelines.** Open [figma-make-guidelines.md](figma-make-guidelines.md) in this repo, copy its full contents, and paste them into Figma Make's Guidelines/project-instructions field for your file.
3. **Kick off the starter page.** Copy the prompt from [figma-make-kickoff-prompt.md](figma-make-kickoff-prompt.md) and paste it into Make's chat. It scaffolds a starting screen using the shared header/navigation/footer shell.
4. **Verify it rendered correctly.** Follow the checklist in [figma-make-test-guide.md](figma-make-test-guide.md) — real colors/fonts (not browser defaults), navigation actually works, no console errors.
5. **Build your feature.** As you prompt Make to add whatever your prototype actually needs (a table, a form, a settings panel...), keep steering it toward the library: mention `figma-make-bridge` components by name where you know one exists, and check Guidelines.md's "Component reference" section for what's available before assuming something needs to be built from scratch.

## Situation B: You already have a prototype with its own custom-built UI

This is for converting an existing prototype — one that has its own hand-built buttons, forms, etc. — over to the shared library.

1. **Add the library and paste the Guidelines**, same as steps 1–2 above, if this prototype doesn't have them yet.
2. **Run the swap-in prompt.** Copy the prompt from [figma-make-swap-in-prompt.md](figma-make-swap-in-prompt.md) and paste it into Make's chat. It asks Make to find everything in your prototype that has a match in the library, convert it, and report back exactly what it changed.
3. **Read the report.** Make will list every element it found with a ✅ (converted), ❌ (tried, broke — worth a closer look), or ⚠️ (no match, left alone) next to each one.
4. **Spot-check it yourself.** Click through the actual prototype — not just how it looks, but whether it still works (typing, clicking, selecting). A screenshot with an arrow pointing at whatever looks wrong is the fastest way to get help if something's off.
5. **If something looks broken that wasn't before,** check [figma-make-swap-in-guide.md](figma-make-swap-in-guide.md) first — a couple of known, expected quirks are documented there (e.g. some unrelated styling shifting after a fix, which is a known tradeoff, not a new bug).

## When Make flags something as "no match"

Not everything is in the library yet — this is expected, not a failure. Two options:
- **One-off, unlikely to repeat elsewhere:** it's fine for Make to build it as a custom piece, as long as it still uses our design tokens, typography classes, and spacing — never raw hex colors, arbitrary fonts, or invented spacing values. Guidelines.md already tells Make this.
- **Something you expect other prototypes will also need** (a component, not a one-off layout): flag it to the library team rather than letting every prototype quietly reinvent its own version. That's exactly how the library grows — each component so far came from a real prototype need.

## Quick reference

| I need to... | Use this |
|---|---|
| See what's in the library and how to use it | [figma-make-guidelines.md](figma-make-guidelines.md) (paste into Make's Guidelines field) |
| Start a brand-new prototype | [figma-make-kickoff-prompt.md](figma-make-kickoff-prompt.md) |
| Convert an existing prototype | [figma-make-swap-in-prompt.md](figma-make-swap-in-prompt.md) |
| Understand *why* the swap prompt works the way it does, or troubleshoot | [figma-make-swap-in-guide.md](figma-make-swap-in-guide.md) |
| Confirm a fresh install actually works | [figma-make-test-guide.md](figma-make-test-guide.md) |

## If you get stuck

Don't work around a missing component with fully custom, un-tokenized code — that's exactly the drift this library exists to prevent. Flag it instead.
