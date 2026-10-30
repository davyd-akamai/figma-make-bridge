# TagInput

Field for entering several values as removable tags, with optional suggestions and free-text creation.

## When to use / when not to use

- Use when the user builds a list of short values: keywords, emails, labels, hostnames.
- For picking exactly one value from a list, use `Select` (components/select.md).
- For a single free-text value, use `TextField` (components/text-field.md).
- It is not a multi-select with checkboxes, grouped options or async loading. Those do not exist. Say so in the reply.

## Import

```tsx
import { TagInput, type TagInputProps, type TagInputTag, type TagInputOption, type TagInputLabelPosition } from "figma-make-bridge";
```

## Props

| Prop | Type | Default | Allowed values |
|---|---|---|---|
| `tags` | `TagInputTag[]` | unset (uncontrolled) | `{ value, label?, icon?, removable?, invalid? }` |
| `defaultTags` | `TagInputTag[]` | `[]` | |
| `onChange` | `(tags: TagInputTag[]) => void` | none | receives the full new list |
| `options` | `TagInputOption[]` | `[]` | `{ value, label, disabled? }`; options already used as tags are hidden |
| `placeholder` | `string` | `"Add tag"` | shown only while there are no tags |
| `label` | `string` | none | omit for an unlabeled field |
| `labelPosition` | `TagInputLabelPosition` | `"top"` | `"top"`, `"left"` |
| `labelInfoIcon` | `boolean` | `false` | info icon right after the label text |
| `labelInfoText` | `string` | none | text of the `Tooltip` shown on hover or keyboard focus of that icon |
| `helperText` | `string` | none | |
| `errorText` | `string` | none | |
| `clearable` | `boolean` | `true` | clear-all (×) button once there are tags |
| `creatable` | `boolean` | `true` | `false` = options only, no free text |
| `disabled` | `boolean` | `false` | |
| `readOnly` | `boolean` | `false` | |
| `className` | `string` | none | |

## Valid values

- `labelPosition`: `"top"`, `"left"`.
- Invalid or non-existent: `value` (use `tags`), `multiple`, `maxTags`, `validate`, `validateTag`, `delimiters`, `startIcon`, `size`, `variant`, `error` (boolean), `infoIcon`, `onInfoIconClick`.

## Correct

```tsx
const [tags, setTags] = useState<TagInputTag[]>([{ value: "apple", label: "apple (fruit)" }]);

<div style={{ width: 416 }}>
  <TagInput
    label="Keywords"
    tags={tags}
    onChange={setTags}
    options={[{ value: "apricot", label: "apricot" }, { value: "banana", label: "banana" }]}
    errorText={tags.some((t) => t.invalid) ? "Remove invalid tags" : undefined}
  />
</div>
```

## Incorrect

```tsx
<TagInput value={["a", "b"]} onChange={(e) => setTags(e.target.value)} />
```

`value` does not exist and tags are objects, not strings. Use `tags` with `{ value }` objects; `onChange` receives the array, not an event.

## Known footguns

- Tags are `{ value }` objects, not strings. `value` is the identity (duplicates are ignored, case-insensitively); `label` is the display text and defaults to `value`.
- Entering tags: Enter or a comma/semicolon turns the typed text into a tag. Pasting text with commas, semicolons or newlines adds several at once. Backspace on an empty input removes the last tag; ArrowLeft moves onto the tags, then Backspace/Delete removes the focused one.
- The dropdown shows the matching `options` plus a `+ "typed"` row to create a new tag (when `creatable` and the text isn't already a tag/option). `TagInput` never changes `options`: it only reports the new tag list through `onChange`.
- Invalid tags are your decision: set `invalid: true` on a tag. `errorText` turns the box red and shows the message; the two are independent, so set both. `helperText` is hidden while `errorText` is present.
- Many tags wrap onto extra rows; the box grows up to 100px tall, then the tag area scrolls. There is no "+N" collapse.
- `removable: false` on a tag (for example with a `<LockIcon />`) keeps it permanently; it is also skipped by Backspace.
- `disabled` shows only the greyed tags (no input, chevron or ×). `readOnly` renders plain tags with no box, like `TextField`. Use `readOnly` for a value the user cannot edit here, `disabled` for a temporarily locked one.
- Omit `label` for an unlabeled field and pass an explicit `aria-label`.
- `labelInfoIcon` shows a `Tooltip` with `labelInfoText` on hover or keyboard focus. Always pass `labelInfoText`, or the icon shows nothing.
- Width is the wrapper's job. Follow the form field width rule in components/overview.md.
