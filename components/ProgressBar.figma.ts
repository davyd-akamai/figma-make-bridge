// url=https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=150-7570
// source=components/ProgressBar.tsx
// component=ProgressBar
import figma from 'figma'
const instance = figma.selectedInstance

const size = instance.getEnum('Size', {
  L: 'large',
  S: 'small',
})

// Figma's Type axis is "is there any content" in code (see ProgressBar.tsx): Line only emits no text slots.
const type = instance.getEnum('Type', {
  'Line only': 'line',
  'With title': 'title',
})
const withTitle = type === 'title'

// Empty is the default (value 0). In progress needs a value to show a fill: 56 is what the swatch draws.
// Success fills the whole line; Error is never derived from value, so it is passed explicitly.
const state = instance.getEnum('State', {
  Empty: 'empty',
  'In progress': 'in-progress',
  Success: 'success',
  Error: 'error',
})

const readText = (name: string) => {
  const handle = instance.findText(name)
  return handle && handle.type === 'TEXT' ? handle.textContent.trim() : ''
}

// Title, the right-hand "Time estimation" (only present in Empty/In progress) and the optional
// description/link are unbound text layers, read by name.
const title = withTitle ? readText('Title') : ''
const meta = withTitle ? readText('Time estimation') : ''
const showDescription = withTitle && instance.getBoolean('Description')
const description = showDescription ? readText('Optional text lorem ipsum') : ''
const showLink = withTitle && instance.getBoolean('Optional link')
const link = showLink ? readText('Optional link') : ''

export default {
  example: figma.code`
    <ProgressBar
      ${size === 'small' ? 'size="small"' : ''}
      ${state === 'in-progress' ? 'value={56}' : ''}
      ${state === 'success' ? 'value={100}' : ''}
      ${state === 'error' ? 'state="error"' : ''}
      ${title ? figma.code`title="${title}"` : ''}
      ${meta ? figma.code`meta="${meta}"` : ''}
      ${description ? figma.code`description="${description}"` : ''}
      ${link ? figma.code`link={<a href="#">${link}</a>}` : ''}
    />
  `,
  imports: ['import { ProgressBar } from "figma-make-bridge"'],
  id: 'progress-bar',
  metadata: {
    nestable: true,
  },
}
