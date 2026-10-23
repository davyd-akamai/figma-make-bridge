// url=https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=128-4563
// source=components/Pagination.tsx
// component=Pagination
import figma from 'figma'
const instance = figma.selectedInstance

// "Type" is the only property. Table is the component's default variant; "List selected" is not a third
// `variant` value in code — it's the list variant with `selectable` on (Select/Deselect/Selected only bar).
// Everything else on the swatches (counts, "Page size: 20", "1 - 20 of 50") is static sample text with no
// bound property, and the nested chevron/Checkbox instances are rendered internally by Pagination, so
// `length`, `pageSize` etc. are left to the component's own defaults rather than invented from sample text.
const type = instance.getEnum('Type', {
  Table: 'table',
  List: 'list',
  'List selected': 'list-selected',
})

export default {
  example: figma.code`
    <Pagination
      ${type === 'list' || type === 'list-selected' ? 'variant="list"' : ''}
      ${type === 'list-selected' ? 'selectable' : ''}
    />
  `,
  imports: ['import { Pagination } from "figma-make-bridge"'],
  id: 'pagination',
  metadata: {
    nestable: true,
  },
}
