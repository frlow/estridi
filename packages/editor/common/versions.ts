import { createMigrationIds, createMigrationSequence } from 'tldraw'
import { schema } from './schema'

const SEQUENCE_ID = 'com.example.my-app'

const Versions = createMigrationIds(SEQUENCE_ID, {
  // Migrations must start at 1 and be sequential integers.
  AddColors: 1,
  Target: 2
})

export const myMigrations = createMigrationSequence({
  sequenceId: SEQUENCE_ID,
  sequence: [
    {
      id: Versions.AddColors,
      scope: 'record',
      filter: (record: any) => [
        'userAction',
        'start',
        'gateway',
        'serviceCall',
        'subprocess',
        'signalSend',
        'signalListen',
        'script',
        'message'
      ].includes(record?.state?.type),
      up(record: any) {
        record.state.props.color = 'light-blue'
        if (['message'].includes(record?.state?.type))
          record.state.props.dash = 'solid'
      },
      down() {}
    },
    {
      id: Versions.Target,
      scope: 'record',
      filter: (record: any) => [
        'start',
      ].includes(record?.state?.type),
      up(record: any) {
        record.state.props.target = 'playwright'
      },
      down() {}
    }
  ]
})

export const migrateRoomSnapshot = (snapshot: any) => {
  for (const doc of snapshot.documents) {
    const result = schema.migratePersistedRecord(doc, snapshot.schema)
    if (result.type === 'success')
      Object.assign(doc, result.value)
  }
}
