// url=https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=58-5044
// source=components/RadioButton.tsx
// component=RadioButton
import figma from 'figma'
const instance = figma.selectedInstance

const showLabel = instance.getBoolean('Show label')
const label = instance.getString('Label')

// "Selected" is a VARIANT (False/True), not a BOOLEAN property, despite the binary values.
const selected = instance.getEnum('Selected', {
  False: false,
  True: true,
})

// Hover/Focus are pseudo-class states RadioButton derives from CSS (peer-hover/peer-focus-visible),
// not props — only Disabled/Read-only correspond to real RadioButtonProps flags.
const state = instance.getEnum('State', {
  Default: 'default',
  Hover: 'default',
  Focus: 'default',
  Disabled: 'disabled',
  'Read-only': 'readonly',
})
const disabled = state === 'disabled'
const readOnly = state === 'readonly'

const infoIcon = instance.getBoolean('Info icon')

export default {
  example: figma.code`
    <RadioButton
      ${selected ? 'checked' : ''}
      ${disabled ? 'disabled' : ''}
      ${readOnly ? 'readOnly' : ''}
      ${infoIcon ? 'infoIcon' : ''}
      ${showLabel ? figma.code`label="${label}"` : ''}
    />
  `,
  imports: ['import { RadioButton } from "figma-make-bridge"'],
  id: 'radio-button',
  metadata: {
    nestable: true,
  },
}
