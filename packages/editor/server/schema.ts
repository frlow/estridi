import { createTLSchema, defaultBindingSchemas, defaultShapeSchemas } from 'tldraw'
import { Shapes } from 'editor-common'

export const schema = createTLSchema({
  shapes: {
    ...defaultShapeSchemas,
    ...Shapes
  },
  bindings: defaultBindingSchemas
})
