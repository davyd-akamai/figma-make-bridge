// url=https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=123-5295
// source=components/Toast.tsx
// component=Toast
import figma from 'figma'
const instance = figma.selectedInstance

const type = instance.getEnum('Type', {
  Info: 'info',
  Warning: 'warning',
  Error: 'error',
  Success: 'success',
})

// Message text has no bound property — read the literal "Text" layer.
const textHandle = instance.findText('Text')
const text = textHandle && textHandle.type === 'TEXT' ? textHandle.textContent.trim() : undefined

// `open`/`onClose` are runtime state and can't come from Figma; `duration` has no Figma counterpart
// (default 5000ms). Status icons and the close × are internal instances with no swap properties.
export default {
  example: figma.code`
    <Toast
      open={open}
      onClose={() => setOpen(false)}
      ${type !== 'info' ? figma.code`type="${type}"` : ''}
    >
      ${text ?? 'Message'}
    </Toast>
  `,
  imports: ['import { Toast } from "figma-make-bridge"'],
  id: 'toast',
  metadata: {
    nestable: true,
  },
}
