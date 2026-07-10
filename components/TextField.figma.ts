// url=https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=47-7385
// source=components/TextField.tsx
// component=TextField
import figma from 'figma'
const instance = figma.selectedInstance

const labelPosition = instance.getEnum('Label position', {
  None: 'none',
  Top: 'top',
  Left: 'left',
})

const placeholder = instance.getString('Placeholder')
const infoIcon = instance.getBoolean('Info icon')

// Hover/Placeholder/Filled/Focus/Error all collapse onto native browser/CSS behavior (:hover,
// focus-within:, and the browser's own placeholder-vs-value rendering, plus Boolean(errorText)
// driving the error visual) — only Disabled/Read only correspond to real TextFieldProps flags.
const state = instance.getEnum('State', {
  Default: 'default',
  Placeholder: 'default',
  Hover: 'default',
  Focus: 'default',
  Filled: 'default',
  Disabled: 'disabled',
  Error: 'default',
  'Read only': 'readonly',
})
const disabled = state === 'disabled'
const readOnly = state === 'readonly'

// Label content isn't exposed as a top-level property on Text-field — it lives on the nested
// "core_label [not coded]" instance's own "Label" text layer, only present when Label position != None.
const labelHandle = labelPosition !== 'none' ? instance.findText('Label', { traverseInstances: true }) : null
const label = labelHandle && labelHandle.type === 'TEXT' ? labelHandle.textContent : undefined

// Error message content has no bound property either — pull the literal "Warning Text" layer
// content, only present on State=Error instances.
const errorHandle = instance.findText('Warning Text')
const errorText = errorHandle && errorHandle.type === 'TEXT' ? errorHandle.textContent : undefined

// The field's entered value likewise has no bound property, but Filled/Focus/Disabled/Error/
// Read-only instances render it as a literal "Text" layer — reuse that as an illustrative
// defaultValue rather than leaving those swatches showing an empty field.
const valueHandle = instance.findText('Text')
const defaultValue = valueHandle && valueHandle.type === 'TEXT' ? valueHandle.textContent : undefined

export default {
  example: figma.code`
    <TextField
      ${label ? figma.code`label="${label}"` : ''}
      ${label && labelPosition === 'left' ? 'labelPosition="left"' : ''}
      ${placeholder ? figma.code`placeholder="${placeholder}"` : ''}
      ${defaultValue ? figma.code`defaultValue="${defaultValue}"` : ''}
      ${disabled ? 'disabled' : ''}
      ${readOnly ? 'readOnly' : ''}
      ${errorText ? figma.code`errorText="${errorText}"` : ''}
      ${infoIcon ? 'infoIcon' : ''}
    />
  `,
  imports: ['import { TextField } from "figma-make-bridge"'],
  id: 'text-field',
  metadata: {
    nestable: true,
  },
}
