// url=https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=129-5474
// source=components/Switch.tsx
// component=Switch
import figma from 'figma'
const instance = figma.selectedInstance

const size = instance.getEnum('Size', {
  Small: 'small',
  Large: 'large',
})

const active = instance.getEnum('Active', {
  Yes: 'yes',
  No: 'no',
})

// Hover/Selected are pseudo-class states Switch derives from CSS (peer-hover / peer-focus-visible /
// peer-active), not props — only Disabled corresponds to a real SwitchProps flag.
const state = instance.getEnum('State', {
  Default: 'default',
  Hover: 'default',
  Selected: 'default',
  Disabled: 'disabled',
})
const disabled = state === 'disabled'

const showLabel = instance.getBoolean('Show label')

// The label text has no bound property — read the literal "Label" layer.
const labelHandle = instance.findText('Label')
const label = labelHandle && labelHandle.type === 'TEXT' ? labelHandle.textContent.trim() : 'Label'

export default {
  example: figma.code`
    <Switch
      ${size === 'small' ? 'size="small"' : ''}
      ${active === 'yes' ? 'defaultChecked' : ''}
      ${disabled ? 'disabled' : ''}
      ${showLabel ? figma.code`label="${label}"` : ''}
    />
  `,
  imports: ['import { Switch } from "figma-make-bridge"'],
  id: 'switch',
  metadata: {
    nestable: true,
  },
}
