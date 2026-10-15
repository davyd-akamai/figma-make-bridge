import { cpSync, existsSync, rmSync } from "node:fs";

// Only guidelines/ is copied into dist/. Repo-level docs stay out of the package.
if (!existsSync("guidelines")) throw new Error("guidelines/ folder not found");
rmSync("dist/guidelines", { recursive: true, force: true });
cpSync("guidelines", "dist/guidelines", { recursive: true });
console.log("copied guidelines/ -> dist/guidelines/");
