import { createMigrationSequence } from 'tldraw'
import { schema } from './schema'

const SEQUENCE_ID = 'com.example.my-app'

// const Versions = createMigrationIds(SEQUENCE_ID, {})

export const myMigrations = createMigrationSequence({
  sequenceId: SEQUENCE_ID,
  sequence: [],
})

export const migrateRoomSnapshot = (snapshot: any) => {
  for (const doc of snapshot.documents) {
    const result = schema.migratePersistedRecord(doc, snapshot.schema)
    if (result.type === 'success') Object.assign(doc, result.value)
  }
}
