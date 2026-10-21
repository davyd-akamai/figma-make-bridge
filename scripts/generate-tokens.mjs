// Generates src/tokens.css from tokens/*.json (light theme only). Run via `npm run tokens`.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tokensDir = join(root, "tokens");
const outFile = join(root, "src", "tokens.css");

const readJson = (name) => JSON.parse(readFileSync(join(tokensDir, name), "utf8"));

// dark.json is intentionally not read: dark overrides can be generated from tokens/dark.json later.
const THEME_FILES = new Set(["global.json", "light.json", "dark.json"]);
const componentFiles = readdirSync(tokensDir)
  .filter((f) => f.endsWith(".json") && !THEME_FILES.has(f))
  .sort();

const tree = {};
const merge = (target, src) => {
  for (const [k, v] of Object.entries(src)) {
    if (v && typeof v === "object" && !Array.isArray(v) && !("value" in v)) merge((target[k] ??= {}), v);
    else target[k] = v;
  }
};
for (const f of ["global.json", "light.json", ...componentFiles]) merge(tree, readJson(f));

const isToken = (o) => o && typeof o === "object" && !Array.isArray(o) && "value" in o;

function* leaves(node, path = []) {
  if (isToken(node)) yield [path, node];
  else if (node && typeof node === "object") for (const [k, v] of Object.entries(node)) yield* leaves(v, [...path, k]);
}

const lookup = (ref) => ref.split(".").reduce((n, k) => n?.[k], tree);

const hexToRgb = (hex) => {
  let h = hex.replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};

const formatAlpha = (n) => String(Number(n));

function applyAlpha(color, alpha) {
  if (!/^#[0-9a-f]{3,6}$/i.test(color)) throw new Error(`Cannot apply alpha to non-hex color "${color}"`);
  const [r, g, b] = hexToRgb(color);
  return `rgba(${r}, ${g}, ${b}, ${formatAlpha(alpha)})`;
}

function resolveString(str, from) {
  return str.replace(/\{([^}]+)\}/g, (_, ref) => {
    const target = lookup(ref);
    if (!isToken(target)) throw new Error(`Unresolved reference {${ref}} in ${from}`);
    return resolveToken(target, ref);
  });
}

function resolveToken(token, name) {
  const value = token.value;
  if (typeof value === "object") return shadowToCss(value, name);
  let out = resolveString(String(value), name);
  const mod = token.$extensions?.["studio.tokens"]?.modify;
  if (mod) {
    if (mod.type !== "alpha") throw new Error(`Unsupported modifier "${mod.type}" on ${name}`);
    out = applyAlpha(out, mod.value);
  }
  return out;
}

const px = (v) => {
  const s = resolveString(String(v), "shadow");
  return /^-?\d+(\.\d+)?$/.test(s) ? (Number(s) === 0 ? "0px" : `${s}px`) : s;
};

function shadowToCss(value, name) {
  const layers = Array.isArray(value) ? value : [value];
  return layers
    .map((l) => {
      const inset = l.type === "innerShadow" ? "inset " : "";
      return `${inset}${px(l.x)} ${px(l.y)} ${px(l.blur)} ${px(l.spread)} ${resolveString(String(l.color), name)}`;
    })
    .join(", ");
}


function resolveSource(source, name) {
  if (source.startsWith("{")) return resolveString(source, name);
  if (source.startsWith("shadowColor:")) {
    const t = lookup(source.slice("shadowColor:".length));
    return resolveString(String((Array.isArray(t.value) ? t.value[0] : t.value).color), name);
  }
  const t = lookup(source);
  if (!isToken(t)) throw new Error(`Legacy name ${name} points at missing token ${source}`);
  return resolveToken(t, source);
}

function legacyNames() {
  const list = [];
  // Primary/danger have no border tokens: Figma renders the border in the background color.
  for (const type of ["primary", "danger"])
    for (const [state, legacy = state] of [["default"], ["hover"], ["pressed", "active"], ["disabled"], ["loading"]]) {
      const base = `component.button.${type}.${state}`;
      list.push([`component-button-${type}-${legacy}-border`, `${base}.background`]);
      if (legacy !== state) for (const prop of ["background", "text"]) list.push([`component-button-${type}-${legacy}-${prop}`, `${base}.${prop}`]);
    }
  list.push(["component-button-secondary-active-background", "component.button.secondary.pressed.background"]);
  list.push(["component-button-secondary-active-border", "component.button.secondary.pressed.border"]);
  list.push(["component-button-secondary-active-text", "component.button.secondary.pressed.text"]);
  list.push(["component-button-link-active-text", "component.button.link.pressed.text"]);

  const tf = "component.textField";
  list.push(
    ["component-textfield-background", `${tf}.default.background`],
    ["component-textfield-background-disabled", `${tf}.disabled.background`],
    ["component-textfield-border-default", `${tf}.default.border`],
    ["component-textfield-border-hover", `${tf}.hover.border`],
    ["component-textfield-border-focus", `${tf}.focus.border`],
    ["component-textfield-border-error", `${tf}.error.border`],
    ["component-textfield-border-disabled", `${tf}.disabled.border`],
    ["component-textfield-label", "{alias.content.text.primary.default}"],
    ["component-textfield-text", `${tf}.filled.text`],
    ["component-textfield-text-disabled", `${tf}.disabled.text`],
    ["component-textfield-text-placeholder", `${tf}.placeholder.text`],
    ["component-textfield-hint", `${tf}.default.hintText`],
    ["component-textfield-hint-error", `${tf}.error.hintText`],
    ["component-textfield-icon", `${tf}.filled.icon.default`],
    ["component-textfield-icon-hover", `${tf}.filled.icon.hover`],
    ["component-textfield-icon-active", `${tf}.filled.icon.active`],
    ["component-textfield-info-icon", `${tf}.default.infoIcon`],
  );

  const tab = "component.tab";
  for (const [state, props] of [["default", ["text", "icon", "border"]], ["hover", ["text", "icon"]], ["active", ["text", "icon", "border"]], ["disabled", ["text", "icon"]]])
    for (const prop of props) list.push([`component-tabs-${state}-${prop}`, `${tab}.${state}.${prop}`]);
  list.push(
    ["component-tabs-ellipsis-icon", `${tab}.ellipsis.icon`],
    ["component-tabs-ellipsis-icon-hover", `${tab}.ellipsis.iconHover`],
    ["component-tabs-overflowmenu-background", `${tab}.overflowMenu.background`],
    ["component-tabs-overflowmenu-text", `${tab}.overflowMenu.text`],
    ["component-tabs-overflowmenu-hover-background", `${tab}.overflowMenu.hoverBackground`],
    ["component-tabs-overflowmenu-shadow-color", "shadowColor:alias.elevation.s"],
  );

  list.push(["component-select-label", "{alias.content.text.primary.default}"]);
  return list;
}

const out = [];
const decl = (name, value) => out.push(`  --${name}: ${value};`);
const blank = () => out.push("");
const comment = (text) => out.push(`  /* ${text} */`);

const kebab = (path) => path.map((k) => k.toLowerCase()).join("-");
const resolved = ([path, token]) => [path, resolveToken(token, path.join("."))];

out.push("/* Generated by scripts/generate-tokens.mjs from /tokens/*.json — do not edit by hand; run `npm run tokens`. */");
out.push("/* Light theme only. Dark overrides can be generated from tokens/dark.json later. */");
out.push(":root {");

// Component tokens (checkbox keeps the literal "indeterminated" key from the source JSON).
for (const [path, token] of leaves(tree.component, ["component"])) {
  const [p, v] = resolved([path, token]);
  decl(kebab(p), v);
}
blank();

// Global primitives
for (const [path, token] of leaves(tree.global.spacing, ["global", "spacing"])) {
  const [p, v] = resolved([path, token]);
  decl(kebab(p), v);
}
blank();
for (const [path, token] of leaves(tree.global.color, ["global", "color"])) {
  const [p, v] = resolved([path, token]);
  decl(kebab(p), v);
}
blank();

// global.font.font-family.brand -> --font-family-brand, global.font.line-height.xs -> --line-height-xs
for (const [path, token] of leaves(tree.global.font, [])) {
  if (!["font-family", "font-size", "font-weight", "line-height"].includes(path[0])) continue;
  const [p, v] = resolved([path, token]);
  decl(kebab(p), path[0] === "font-family" ? `'${v}'` : v);
}
blank();

// Stable names that components already consume but that don't mirror the JSON key paths
// (Figma-era flat names, "pressed" -> "active", tabs/tab, ...). Each entry points at its JSON source.
comment("legacy names — resolved from the JSON token each one points at");
for (const [name, source] of legacyNames()) decl(name, resolveSource(source, name));
blank();

// Alias tokens: colors and elevation only (composite typography is covered by the .type-* classes).
comment("alias tokens (light) — color + elevation; typography composites are the .type-* classes");
for (const [path, token] of leaves(tree.alias, ["alias"])) {
  if (token.type !== "color" && token.type !== "boxShadow") continue;
  const [p, v] = resolved([path, token]);
  decl(kebab(p), v);
}

out.push("}");
writeFileSync(outFile, out.join("\n") + "\n");
console.log(`wrote ${outFile}`);
