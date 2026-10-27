// url=https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=140-6272
// source=components/Tag.tsx
// component=Tag
import figma from 'figma'
const instance = figma.selectedInstance

// State collapses onto CSS + props: Default/Hover/Focus are native :hover / :focus-visible, so only
// Error (invalid), Disabled, Read only and Show more (the "+N" chip) are real TagProps.
const stateName = instance.getEnum('State', {
  Default: 'default',
  'Show more': 'more',
  Hover: 'default',
  Focus: 'default',
  Disabled: 'disabled',
  Error: 'error',
  'Read only': 'readonly',
})
const showIcon = instance.getBoolean('Show icon')
const showCross = instance.getBoolean('Show cross')

// Label text lives on the unbound "Title" layer ("+7" in Show more).
const titleHandle = instance.findText('Title')
const label = titleHandle && titleHandle.type === 'TEXT' ? titleHandle.textContent : 'Tag label'

const more = stateName === 'more'
// The cross only exists in Default/Hover/Focus/Error (Disabled/Read only/Show more never render it, and
// the component hides it for them anyway), so only an explicit "Show cross" = off needs a prop.
const removable = more || stateName === 'disabled' || stateName === 'readonly' ? true : showCross

export default {
  example: figma.code`
    <Tag
      label="${label}"
      ${showIcon && !more ? 'icon={<LockIcon />}' : ''}
      ${removable ? '' : 'removable={false}'}
      ${stateName === 'error' ? 'invalid' : ''}
      ${stateName === 'disabled' ? 'disabled' : ''}
      ${stateName === 'readonly' ? 'readOnly' : ''}
      ${more ? 'more' : ''}
    />
  `,
  imports: ['import { Tag, LockIcon } from "figma-make-bridge"'],
  id: 'tag',
  metadata: {
    nestable: true,
  },
}
