# Testing figma-make-bridge in Figma Make

How to connect the published package to an actual Figma Make prototype and run a first smoke test. See [GUIDELINES.md](GUIDELINES.md)'s "Packaging" and "Figma Make private registry" sections for how/where the package is published.

**Caveat:** the steps below for Figma Make's own UI are a best-effort starting point, not verified firsthand in this session (no browser access to Figma Make itself here) — adjust to whatever the actual panel/flow shows you, and update this file once you've confirmed the real steps.

## 1. Connect the package and scaffold the first screen

Open a Figma Make file (new or existing prototype) and use [figma-make-kickoff-prompt.md](figma-make-kickoff-prompt.md) — it covers pasting the guidelines, adding the dependency, and the initial-screen prompt in one reusable place, so it's not duplicated here.

No `.npmrc`/auth-token setup is needed for any of this — that's only required once we move off the temporary public-npm listing onto Akamai's private registry (see GUIDELINES.md).

## 2. First test scenario (minimal smoke test)

Goal: confirm the page shell renders correctly through Figma Make's own bundler and registry install — not just our local Vite dev server.

Check once it renders:
- [ ] Header/sidenav/footer show real colors/typography, not default browser styles (confirms `styles.css` actually loaded)
- [ ] SideNavigation hover-to-expand and pin toggle work (confirms interactivity, not just static markup)
- [ ] Resize across ~600px and ~960px to confirm `tablet:`/`desktop:` breakpoint behavior matches the local dev preview
- [ ] SideNavigation stays sticky while scrolling; GlobalFooter sits at viewport bottom on a short page and follows content on a tall one
- [ ] No console errors about duplicate/conflicting React instances (would mean the peer-dependency resolution didn't work)

**If it fails**, likely first suspects: `styles.css` never got imported; Figma Make pinned its own React version and it collided with the peer dep; the public npm listing hasn't finished propagating yet (usually near-instant).

## 3. Timing

Do this right after publishing — it's the actual point of the public-npm publish, and nothing about it benefits from waiting.
