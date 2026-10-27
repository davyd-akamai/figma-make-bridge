// url=https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=140-8688
// source=components/TagInput.tsx
// component=TagInput
import figma from 'figma'
const instance = figma.selectedInstance

const labelPosition = instance.getEnum('Label', {
  'No label': 'none',
  'Top label': 'top',
  'Left label': 'left',
})
const labelInfoIcon = instance.getBoolean('Label info icon')
const helperText = instance.getBoolean('Helper text')

// Hover/Focus/Default/Placeholder collapse onto native CSS/browser behavior; Disabled, Read only and
// Error are real props. Filled/Filled multiline/Error/Disabled/Read only carry sample tags.
const stateName = instance.getEnum('State', {
  Default: 'default',
  Placeholder: 'placeholder',
  Hover: 'placeholder',
  Focus: 'default',
  Filled: 'filled',
  'Filled multiline': 'filled',
  Error: 'error',
  Disabled: 'disabled',
  'Read only': 'readonly',
})
const disabled = stateName === 'disabled'
const readOnly = stateName === 'readonly'
const isError = stateName === 'error'

// Label text lives on an unbound "Label" layer (absent when Label=No label).
const labelHandle = labelPosition !== 'none' ? instance.findText('Label') : null
const label = labelHandle && labelHandle.type === 'TEXT' ? labelHandle.textContent : undefined

const placeholderHandle = instance.findText('Placholder text')
const placeholder = stateName === 'placeholder' && placeholderHandle && placeholderHandle.type === 'TEXT' ? placeholderHandle.textContent : undefined

// Sample tags come from the nested "Tag item" instances' "Title" text; in Error the last one is the
// red (invalid) tag.
const tagTexts = ['filled', 'error', 'disabled', 'readonly'].includes(stateName)
  ? instance
      .findLayers((n) => n.type === 'TEXT' && n.name === 'Title', { traverseInstances: true })
      .map((n) => n.textContent)
  : []
const defaultTags = tagTexts.length
  ? '[' + tagTexts.map((t, i) => (isError && i === tagTexts.length - 1 ? `{ value: "${t}", invalid: true }` : `{ value: "${t}" }`)).join(', ') + ']'
  : undefined

export default {
  example: figma.code`
    <TagInput
      ${label ? figma.code`label="${label}"` : ''}
      ${label && labelPosition === 'left' ? 'labelPosition="left"' : ''}
      ${label && labelInfoIcon ? 'labelInfoIcon' : ''}
      ${placeholder ? figma.code`placeholder="${placeholder}"` : ''}
      ${defaultTags ? figma.code`defaultTags={${defaultTags}}` : ''}
      ${disabled ? 'disabled' : ''}
      ${readOnly ? 'readOnly' : ''}
      ${isError ? 'errorText="Warning text"' : helperText ? 'helperText="Hint text"' : ''}
    />
  `,
  imports: ['import { TagInput } from "figma-make-bridge"'],
  id: 'tag-input',
  metadata: {
    nestable: true,
  },
}
