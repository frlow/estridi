import { createTLSchema, defaultBindingSchemas, defaultShapeSchemas } from 'tldraw'
import { CounterShapeProps } from 'editor-common/props'

export const schema = createTLSchema({
  shapes: {
    ...defaultShapeSchemas,
    counter: {
      props: CounterShapeProps
    }
  },
  bindings: defaultBindingSchemas
})
