// url=https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=58-4716
// source=components/Checkbox.tsx
// component=Checkbox
import figma from 'figma'
const instance = figma.selectedInstance

const showLabel = instance.getBoolean('Show label')
const label = instance.getString('Label')

const checked = instance.getEnum('Checked', {
  No: 'no',
  Yes: 'yes',
  Indeterminate: 'indeterminate',
})

// Hover/Focus are pseudo-class states Checkbox derives from CSS (peer-hover/peer-focus-visible),
// not props — only Disabled/Read-Only correspond to real CheckboxProps flags.
const state = instance.getEnum('State', {
  Default: 'default',
  Hover: 'default',
  Focus: 'default',
  Disabled: 'disabled',
  'Read-Only': 'readonly',
})
const disabled = state === 'disabled'
const readOnly = state === 'readonly'

const infoIcon = instance.getBoolean('Info icon')

export default {
  example: figma.code`
    <Checkbox
      ${checked === 'yes' ? 'checked' : ''}
      ${checked === 'indeterminate' ? 'indeterminate' : ''}
      ${disabled ? 'disabled' : ''}
      ${readOnly ? 'readOnly' : ''}
      ${infoIcon ? 'infoIcon' : ''}
      ${showLabel ? figma.code`label="${label}"` : ''}
    />
  `,
  imports: ['import { Checkbox } from "figma-make-bridge"'],
  id: 'checkbox',
  metadata: {
    nestable: true,
  },
}
