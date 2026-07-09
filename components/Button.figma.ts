// url=https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=47-14865
// source=components/Button.tsx
// component=Button
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('Label')

const size = instance.getEnum('Size', {
  Large: 'large',
  Small: 'small',
})

const variant = instance.getEnum('Type', {
  Primary: 'primary',
  Secondary: 'secondary',
  Link: 'link',
  Danger: 'danger',
})

// Hover/Active are pseudo-class states Button derives from CSS, not props — only
// Disabled/Loading correspond to real ButtonProps flags.
const state = instance.getEnum('State', {
  Default: 'default',
  Hover: 'default',
  Active: 'default',
  Disabled: 'disabled',
  Loading: 'loading',
})
const disabled = state === 'disabled'
const loading = state === 'loading'

const hasStartIcon = instance.getBoolean('Start icon')
const hasEndIcon = instance.getBoolean('End icon')

// Large-size icons swap via the "Icon" property, Small-size icons via "Small icon" —
// Figma models these as two separate INSTANCE_SWAP props keyed off the Size variant.
const iconSwap = size === 'small' ? instance.getInstanceSwap('Small icon') : instance.getInstanceSwap('Icon')

let startIconCode
if (hasStartIcon && iconSwap && iconSwap.type === 'INSTANCE') {
  startIconCode = iconSwap.executeTemplate().example
}

let endIconCode
if (hasEndIcon && iconSwap && iconSwap.type === 'INSTANCE') {
  endIconCode = iconSwap.executeTemplate().example
}

export default {
  example: figma.code`
    <Button
      variant="${variant}"
      size="${size}"
      ${disabled ? 'disabled' : ''}
      ${loading ? 'loading' : ''}
      ${startIconCode ? figma.code`startIcon={${startIconCode}}` : ''}
      ${endIconCode ? figma.code`endIcon={${endIconCode}}` : ''}
    >
      ${label}
    </Button>
  `,
  imports: ['import { Button } from "figma-make-bridge"'],
  id: 'button',
  metadata: {
    nestable: true,
  },
}
