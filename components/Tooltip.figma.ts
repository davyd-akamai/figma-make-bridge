// url=https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=149-6624
// source=components/Tooltip.tsx
// component=Tooltip
import figma from 'figma'
const instance = figma.selectedInstance

// "Property 1" is the only property, and Figma names each swatch after the side the ARROW is on, not the side
// the tooltip sits on: Top = arrow above the bubble = tooltip BELOW its trigger, Left = tooltip to the RIGHT of it.
// `placement` in code is the conventional meaning (where the tooltip sits), so the sides are mirrored:
// Bottom -> "top" (the default, so it emits nothing), None -> no arrow (`arrow={false}`, placement left at default).
const side = instance.getEnum('Property 1', {
  Top: 'bottom',
  Bottom: 'top',
  Left: 'right',
  Right: 'left',
  None: 'none',
})

// The bubble text has no bound property — read the literal "Tooltip" layer.
const textHandle = instance.findText('Tooltip')
const text = textHandle && textHandle.type === 'TEXT' ? textHandle.textContent.trim() : undefined

// The trigger the tooltip wraps isn't part of the Figma component, so the example leaves it as a placeholder.
export default {
  example: figma.code`
    <Tooltip
      content="${text ?? 'Tooltip'}"
      ${side !== 'top' && side !== 'none' ? figma.code`placement="${side}"` : ''}
      ${side === 'none' ? 'arrow={false}' : ''}
    >
      {/* trigger element */}
    </Tooltip>
  `,
  imports: ['import { Tooltip } from "figma-make-bridge"'],
  id: 'tooltip',
  metadata: {
    nestable: true,
  },
}
