# Make Kickoff Prompt

Paste this as the first message in a new Make project that has the ADS kit added. Replace only the last block, 'What to build'. The setup block is required: the kit's own guidelines are empty placeholders, so without it Make does not find the library.

```
Setup, do this first:
- Check if `figma-make-bridge` is in package.json and node_modules. If it is there, do not add, remove or change any dependency. If it is missing, install only `figma-make-bridge` as a direct dependency, change nothing else, and tell me which version you installed.
- The folder `node_modules/@make-kits/ads-components/guidelines/` contains only empty placeholders. Ignore it.
- Read `node_modules/figma-make-bridge/dist/guidelines/Guidelines.md` by exact path, then every file it links to under `node_modules/figma-make-bridge/dist/guidelines/`. Follow them exactly.
- Import all components from `figma-make-bridge` and load its stylesheet in `src/index.css`, as the guidelines say.
- Do not use any other component source or any other token source.

Rules:
- Use only library components, exactly as they are. Do not restyle them.
- Take colors from each component's Tokens section in the guidelines.
- Build only what I ask for below. Nothing extra.
- If no library component fits, tell me before you build custom UI, then follow the token order in the guidelines.
- In your reply, list which library components you used.

What to build:
[Describe the page, who uses it, the parts you need, and real labels or sample data.]
```
