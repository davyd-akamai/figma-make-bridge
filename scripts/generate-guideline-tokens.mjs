// Adds a generated "## Tokens" section to each component guideline in dist/guidelines/components/.
// Runs after copy-guidelines.mjs. Source files in guidelines/ are never modified.
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tokensDir = join(root, "tokens");
const guidelinesDir = join(root, "dist", "guidelines", "components");
const cssText = readFileSync(join(root, "src", "tokens.css"), "utf8");

const START = "<!-- tokens:start -->";
const END = "<!-- tokens:end -->";
const THEME_FILES = new Set(["global.json", "light.json", "dark.json"]);

const isToken = (o) => o && typeof o === "object" && !Array.isArray(o) && "value" in o;
const kebabCase = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

function* leaves(node, path = []) {
  if (isToken(node)) yield [path, node];
  else if (node && typeof node === "object") for (const [k, v] of Object.entries(node)) yield* leaves(v, [...path, k]);
}

// Same naming as src/tokens.css: path segments lowercased and joined with "-".
const cssName = (ref) => `--${ref.split(".").map((k) => k.toLowerCase()).join("-")}`;

const guidelineFiles = new Set(readdirSync(guidelinesDir).filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -3)));

function findGuideline(fileBase, rootKey) {
  const names = [kebabCase(rootKey), kebabCase(fileBase)];
  for (const n of names) if (guidelineFiles.has(n)) return n;
  for (const n of names) {
    const hits = [...guidelineFiles].filter((g) => g.startsWith(`${n}-`));
    if (hits.length === 1) return hits[0];
  }
  return null;
}

function describe(path, token, file) {
  if (typeof token.value !== "string") return null;
  const m = token.value.match(/^\{((?:global|alias)\.[^}]+)\}$/);
  if (!m) throw new Error(`${file}: ${path.join(".")} does not point at a single alias or global`);
  const variable = cssName(m[1]);
  if (!cssText.includes(`${variable}:`)) throw new Error(`${file}: ${variable} not found in src/tokens.css`);
  const alpha = token.$extensions?.["studio.tokens"]?.modify;
  const suffix = alpha?.type === "alpha" ? ` at ${Number(alpha.value) * 100}% opacity` : "";
  return `${path.join(".")} → {${m[1]}} → ${variable}${suffix}`;
}

const files = readdirSync(tokensDir).filter((f) => f.endsWith(".json") && !THEME_FILES.has(f)).sort();
for (const file of files) {
  const json = JSON.parse(readFileSync(join(tokensDir, file), "utf8"));
  const [rootKey, tree] = Object.entries(json.component ?? json)[0];
  const target = findGuideline(basename(file, ".json"), rootKey);
  if (!target) {
    console.warn(`warning: no component guideline for ${file}; skipped`);
    continue;
  }
  const lines = [];
  for (const [path, token] of leaves(tree)) {
    const line = describe(path, token, file);
    if (line) lines.push(line);
  }
  lines.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

  const section = [
    START,
    "## Tokens",
    "",
    "Take this component's colors only from this list. Do not deviate.",
    "",
    ...lines.map((l) => `- ${l}`),
    END,
    "",
  ].join("\n");

  const out = join(guidelinesDir, `${target}.md`);
  let text = readFileSync(out, "utf8");
  const a = text.indexOf(START);
  const b = text.indexOf(END);
  if (a !== -1 && b > a) text = text.slice(0, a) + section + text.slice(b + END.length).replace(/^\n/, "");
  else text = text.replace(/\s*$/, "\n\n") + section;
  writeFileSync(out, text);
  console.log(`tokens: ${file} -> components/${target}.md (${lines.length})`);
}
