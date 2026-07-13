// url=https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=74-5959
// source=components/TabsHorizontal.tsx
// component=TabsHorizontal
import figma from 'figma'
const instance = figma.selectedInstance

// "Size" is the only top-level property with a real code correspondence. "Tabs" (2-8) just
// selects how many *static* demo tabs the swatch shows — there's no "tab count" prop in
// TabsHorizontalProps (real usage is data-driven via `tabs`), so it's not mapped. Per-tab content
// (Label/Show icon/Badge/State) lives on repeated nested ".base-tab-horizontal" instances that
// aren't bound to top-level properties and can't be read via the descendant instance API
// (getString/getBoolean/getEnum are selectedInstance-only) — `tabs` is left unset so the
// component's own DEFAULT_TABS example content is used instead of inventing per-tab data.
const size = instance.getEnum('Size', {
  Large: 'large',
  Small: 'small',
})

export default {
  example: figma.code`
    <TabsHorizontal
      ${size === 'small' ? 'size="small"' : ''}
    />
  `,
  imports: ['import { TabsHorizontal } from "figma-make-bridge"'],
  id: 'tabs-horizontal',
  metadata: {
    nestable: true,
  },
}
