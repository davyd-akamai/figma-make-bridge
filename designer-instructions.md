# Using the ADS kit in Make — a guide for designers

`@make-kits/ads-components` is our shared component kit for Make prototypes. It contains the components and the guidelines that tell Make how to use them. This guide covers what you need to do, step by step. No engineering background needed.

## How it works

Two things, and neither is pasted anywhere:

1. **The kit** — the buttons, fields, navigation and so on, plus a `guidelines/` folder that teaches Make how to use them (which prop to use, sizing rules, which colors to take, what not to do). You attach the kit to your Make file. Make reads the guidelines itself from `node_modules/@make-kits/ads-components/guidelines/`. There is no Guidelines field to fill in.
2. **Prompts** — optional messages you copy into Make's chat to start a specific job (a new page, or converting an existing prototype).

Inside the kit, components are imported from `figma-make-bridge` and the stylesheet is loaded with `@import 'figma-make-bridge/styles.css';` in `index.css`. The prompts below already say this, so you do not need to remember it.

## Situation A: Starting a new prototype

1. **Attach the kit.** Add `@make-kits/ads-components` to your Make file.
2. **Kick off the starter page.** Copy the prompt from [figma-make-kickoff-prompt.md](figma-make-kickoff-prompt.md) into Make's chat. It scaffolds a starting screen with the shared header, navigation and footer.
3. **Check it rendered correctly.** Use the checklist in [figma-make-test-guide.md](figma-make-test-guide.md): real colors and fonts (not browser defaults), working navigation, no console errors.
4. **Build your feature.** Ask Make for what you need (a table, a form, a settings panel). Name library components where you know one exists. Make is told to build only what you ask for, so be specific.

## Situation B: Converting an existing prototype

For a prototype with its own hand-built buttons, forms and so on.

1. **Attach the kit** if it is not attached yet.
2. **Run the swap-in prompt.** Copy [figma-make-swap-in-prompt.md](figma-make-swap-in-prompt.md) into Make's chat. Make finds everything that has a library match, converts it, and reports back.
3. **Read the report.** Each item is marked ✅ (converted), ❌ (tried, broke — look closer) or ⚠️ (no match, left alone).
4. **Click through the prototype.** Check that typing, clicking and selecting still work, not just the look. A screenshot with an arrow on what looks wrong is the fastest way to get help.
5. **If something broke that worked before,** see [figma-make-swap-in-guide.md](figma-make-swap-in-guide.md) for known quirks.

## When Make says "no component fits"

Not everything is in the kit yet. That is expected. The guidelines tell Make to:

1. **Use a library component** whenever one exists for the job, exactly as it is.
2. **Say so in its reply** before building custom UI when none fits.
3. **Take colors in this order** for custom UI: the tokens in the nearest component's Tokens section, then `--alias-*` variables, then `--global-color-*` (and say so in the reply). Spacing and text classes come from the kit's scales.

Make is also told not to invent variants, states, sizes or colors, and not to add pages, sections or copy you did not ask for. If a reply says something was built custom and other prototypes will probably need it, tell the library team so it can become a real component.

## Quick reference

| I need to... | Use this |
|---|---|
| Start a new prototype | [figma-make-kickoff-prompt.md](figma-make-kickoff-prompt.md) |
| Convert an existing prototype | [figma-make-swap-in-prompt.md](figma-make-swap-in-prompt.md) |
| Troubleshoot a conversion | [figma-make-swap-in-guide.md](figma-make-swap-in-guide.md) |
| Confirm a fresh setup works | [figma-make-test-guide.md](figma-make-test-guide.md) |

## If you get stuck

Do not work around a missing component with fully custom, un-tokenized code. Ask Make to say what is missing and flag it to the library team.
