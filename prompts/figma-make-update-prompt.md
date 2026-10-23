Update this prototype to the latest library components. Do not build anything new and do not change the design or the content.

Step 1: update the library
- Check the installed version of `figma-make-bridge` (node_modules/figma-make-bridge/package.json) and find the latest published version (`npm view figma-make-bridge version`). Tell me both.
- If the latest version is newer, update `figma-make-bridge` to it as a direct dependency. Change no other dependency. If the versions are the same, say so and continue.
- If you cannot find the latest version, stop and tell me. Do not guess a version.
- The folder `node_modules/@make-kits/ads-components/guidelines/` contains only empty placeholders. Ignore it.
- Read `node_modules/figma-make-bridge/dist/guidelines/Guidelines.md` by exact path, then every file it links to under `node_modules/figma-make-bridge/dist/guidelines/`. Follow them exactly.
- Do not use any other component source or token source.

Step 2: find custom components
Search the project for UI that you built yourself in place of a library component. Look for custom files and folders, and for components defined inside other files (breadcrumbs, modals, toasts, banners, pagination, switches, and anything similar). Ignore components that already come from `figma-make-bridge`.

Step 3: compare with the library. Do not change any file yet.
Compare each custom component with the components now listed in the guidelines. Match by what the component does, not by its name. Reply with these three lists:

1. Can be replaced. A library component does the same job. For each one give: the custom component and where it is used, the library component that replaces it, and any difference in look or behavior I should know about.
2. Partial match. A library component exists, but the custom one does something it cannot do (a missing prop, state or behavior). For each one say exactly what would be lost.
3. Stays custom. No library component does this job.

Then ask me: "Replace everything in list 1? Answer yes, no, or name the items to skip. For list 2, tell me which to replace." Stop and wait for my answer. Do not change anything before I answer.

Step 4: after I confirm
- Replace only the confirmed items with the library components, keeping the same content, labels, data and behavior. Use each library component exactly as it is, with no restyling and no className or style overrides.
- Remove a custom component's file only when nothing uses it any more.
- Leave list 3 untouched.
- Do not change anything else on the page.

Step 5: final reply
- The library version before and after.
- Which custom components you replaced, and with which library component.
- Which you left and why.
- Anything that looks different now.
- Any color you still use outside library components, and which token it comes from.