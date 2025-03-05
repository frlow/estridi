import { createTLSchema, defaultBindingSchemas, defaultShapeSchemas } from 'tldraw'
import { Shapes } from './shapeDefinitions'
import { myMigrations } from './versions'

export const schema = createTLSchema({
  migrations: [myMigrations],
  shapes: {
    ...defaultShapeSchemas,
    ...Shapes
  },
  bindings: defaultBindingSchemas
})
