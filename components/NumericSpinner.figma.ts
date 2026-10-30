// url=https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=158-8448
// source=components/NumericSpinner.tsx
// component=NumericSpinner
import figma from 'figma'
const instance = figma.selectedInstance

const labelPosition = instance.getEnum('Label', {
  'No label': 'none',
  'Top label': 'top',
  'Left label': 'left',
})
const labelInfoIcon = instance.getBoolean('Label info icon')

// Hover/Focus/Default/Selected collapse onto native browser/CSS behavior (:hover, focus-within:,
// placeholder-vs-value rendering, Boolean(errorText) driving the error visual) — only Disabled and
// Read only correspond to real NumericSpinnerProps flags.
const stateName = instance.getEnum('State', {
  Default: 'default',
  Hover: 'hover',
  Focus: 'focus',
  Selected: 'selected',
  Disabled: 'disabled',
  'Read only': 'readonly',
  Error: 'error',
})
const disabled = stateName === 'disabled'
const readOnly = stateName === 'readonly'
const isError = stateName === 'error'

// Label text lives on an unbound "Label" layer (absent when Label=No label).
const labelHandle = labelPosition !== 'none' ? instance.findText('Label') : null
const label = labelHandle && labelHandle.type === 'TEXT' ? labelHandle.textContent : undefined

// The unbound "Value" layer is the placeholder "0" in Default/Hover (the component's own default,
// so nothing is emitted) and the entered number in the other states; Focus is skipped (caret).
const valueHandle = instance.findText('Value')
const valueText = valueHandle && valueHandle.type === 'TEXT' ? valueHandle.textContent : undefined
const hasValue = stateName !== 'default' && stateName !== 'hover' && stateName !== 'focus'
const defaultValue = hasValue && valueText && valueText.trim() !== '' && isFinite(Number(valueText)) ? valueText.trim() : undefined

const errorHandle = isError ? instance.findText('Warning text') : null
const errorText = errorHandle && errorHandle.type === 'TEXT' ? errorHandle.textContent : 'Warning text'

export default {
  example: figma.code`
    <NumericSpinner
      ${label ? figma.code`label="${label}"` : ''}
      ${label && labelPosition === 'left' ? 'labelPosition="left"' : ''}
      ${label && labelInfoIcon ? 'labelInfoIcon' : ''}
      ${defaultValue ? figma.code`defaultValue={${defaultValue}}` : ''}
      ${disabled ? 'disabled' : ''}
      ${readOnly ? 'readOnly' : ''}
      ${isError ? figma.code`errorText="${errorText}"` : ''}
    />
  `,
  imports: ['import { NumericSpinner } from "figma-make-bridge"'],
  id: 'numeric-spinner',
  metadata: {
    nestable: true,
  },
}
