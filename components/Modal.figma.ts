// url=https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=123-4666
// source=components/Modal.tsx
// component=Modal
import figma from 'figma'

// The node has no properties and its title layer is auto-named after its own content, so the
// example is static; `open`/`onClose` are runtime state and can't come from Figma.
export default {
  example: figma.code`
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title="Basic modal"
      footer={
        <>
          <Button variant="secondary">Secondary action</Button>
          <Button variant="primary">Primary action</Button>
        </>
      }
    >
      Description text
    </Modal>
  `,
  imports: ['import { Modal, Button } from "figma-make-bridge"'],
  id: 'modal',
  metadata: {
    nestable: true,
  },
}
