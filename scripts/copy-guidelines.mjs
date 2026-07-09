import { copyFileSync } from "node:fs";

// figma-make-guidelines.md lives at the repo root (see GUIDELINES.md's filename note —
// macOS's case-insensitive filesystem can't have Guidelines.md and GUIDELINES.md side by
// side). It only becomes Guidelines.md once it lands in dist/, a different directory.
copyFileSync("figma-make-guidelines.md", "dist/Guidelines.md");
