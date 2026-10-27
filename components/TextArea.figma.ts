// url=https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=140-6170
// source=components/TextArea.tsx
// component=TextArea
import figma from 'figma'
const instance = figma.selectedInstance

const labelPosition = instance.getEnum('Label', {
  'No label': 'none',
  'Top label': 'top',
  'Left label': 'left',
})
const infoIcon = instance.getBoolean('Info icon')
const labelInfoIcon = instance.getBoolean('Label info icon')
const helperText = instance.getBoolean('Helper text')

// Hover/Focus/Placeholder/Filled/Error all collapse onto native browser/CSS behavior (:hover,
// focus-within:, the browser's own placeholder-vs-value rendering, Boolean(errorText) driving the
// error visual) — only Disabled/Read only correspond to real TextAreaProps flags.
const stateName = instance.getEnum('State', {
  Default: 'default',
  Placeholder: 'placeholder',
  Hover: 'placeholder',
  Focus: 'default',
  Filled: 'filled',
  Disabled: 'disabled',
  Error: 'error',
  'Read only': 'readonly',
})
const disabled = stateName === 'disabled'
const readOnly = stateName === 'readonly'
const isError = stateName === 'error'

// Label text lives on an unbound "Label" layer (absent when Label=No label).
const labelHandle = labelPosition !== 'none' ? instance.findText('Label') : null
const label = labelHandle && labelHandle.type === 'TEXT' ? labelHandle.textContent : undefined

// The "Text" layer is "Placeholder text" in the Placeholder/Hover swatches and the sample paragraph
// in Filled/Disabled/Error/Read only; it is "|" (a caret) in Focus, which is skipped.
const textHandle = instance.findText('Text')
const text = textHandle && textHandle.type === 'TEXT' ? textHandle.textContent : undefined
const placeholder = stateName === 'placeholder' ? text : undefined
const defaultValue = ['filled', 'disabled', 'error', 'readonly'].includes(stateName) ? text : undefined

export default {
  example: figma.code`
    <TextArea
      ${label ? figma.code`label="${label}"` : ''}
      ${label && labelPosition === 'left' ? 'labelPosition="left"' : ''}
      ${label && labelInfoIcon ? 'labelInfoIcon' : ''}
      ${placeholder ? figma.code`placeholder="${placeholder}"` : ''}
      ${defaultValue ? figma.code`defaultValue="${defaultValue}"` : ''}
      ${disabled ? 'disabled' : ''}
      ${readOnly ? 'readOnly' : ''}
      ${isError ? 'errorText="Warning text"' : helperText ? 'helperText="Hint text"' : ''}
      ${infoIcon ? 'infoIcon' : ''}
    />
  `,
  imports: ['import { TextArea } from "figma-make-bridge"'],
  id: 'text-area',
  metadata: {
    nestable: true,
  },
}
