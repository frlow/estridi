import { createTLSchema, defaultBindingSchemas, defaultShapeSchemas } from 'tldraw'
import { Shapes } from './shapeDefinitions'

export const schema = createTLSchema({
  shapes: {
    ...defaultShapeSchemas,
    ...Shapes

  },
  bindings: defaultBindingSchemas
})
