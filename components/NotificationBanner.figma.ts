// url=https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=123-5210
// source=components/NotificationBanner.tsx
// component=NotificationBanner
import figma from 'figma'
const instance = figma.selectedInstance

const type = instance.getEnum('Type', {
  Info: 'info',
  Warning: 'warning',
  Success: 'success',
  Error: 'error',
  Secondary: 'secondary',
})
// Figma spells it "Dismisable"; the code prop is `dismissible` (default true, so only `false` is emitted).
const dismissible = instance.getBoolean('Dismisable')
const actionButton = instance.getBoolean('Action button')

// Message text has no bound property — read the literal "Text" layer.
const textHandle = instance.findText('Text')
const text = textHandle && textHandle.type === 'TEXT' ? textHandle.textContent.trim() : undefined

// The action is an instance of the local Button (connected via Button.figma.ts, id "button").
let actionCode
if (actionButton) {
  const button = instance.findConnectedInstance('button', { traverseInstances: true })
  if (button && button.type === 'INSTANCE') {
    actionCode = button.executeTemplate().example
  }
}

export default {
  example: figma.code`
    <NotificationBanner
      ${type !== 'info' ? figma.code`type="${type}"` : ''}
      ${!dismissible ? 'dismissible={false}' : ''}
      ${actionCode ? figma.code`action={${actionCode}}` : ''}
    >
      ${text ?? 'Message'}
    </NotificationBanner>
  `,
  imports: ['import { NotificationBanner } from "figma-make-bridge"'],
  id: 'notification-banner',
  metadata: {
    nestable: true,
  },
}
