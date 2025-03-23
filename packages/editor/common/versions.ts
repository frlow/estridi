import { createMigrationIds, createMigrationSequence, toRichText } from 'tldraw'
import { schema } from './schema'

const SEQUENCE_ID = 'com.example.my-app'

const Versions = createMigrationIds(SEQUENCE_ID, {
  // Migrations must start at 1 and be sequential integers.
  AddColors: 1,
  Target: 2,
  SymbolUpgrade: 3,
  SimplifyTable: 4,
  newNaming: 5,
})

export const myMigrations = createMigrationSequence({
  sequenceId: SEQUENCE_ID,
  sequence: [
    {
      id: Versions.AddColors,
      scope: 'record',
      filter: (record: any) =>
        [
          'userAction',
          'start',
          'gateway',
          'serviceCall',
          'subprocess',
          'signalSend',
          'signalListen',
          'script',
          'message',
        ].includes(record?.state?.type),
      up(record: any) {
        record.state.props.color = 'light-blue'
        if (['message'].includes(record?.state?.type))
          record.state.props.dash = 'solid'
      },
      down() { },
    },
    {
      id: Versions.Target,
      scope: 'record',
      filter: (record: any) => ['start'].includes(record?.state?.type),
      up(record: any) {
        record.state.props.target = 'playwright'
      },
      down() { },
    },
    {
      id: Versions.SymbolUpgrade,
      scope: 'record',
      filter: (record: any) =>
        [
          'start',
          'signalSend',
          'userAction',
          'root',
          'end',
          'table',
          'connector',
        ].includes(record?.state?.type),
      up(record: any) {
        if (
          ['start', 'userAction', 'end', 'root', 'table', 'connector'].includes(
            record?.state?.type,
          )
        ) {
          delete record.state.props.text
        }
        if (['signalSend'].includes(record?.state?.type)) {
          record.state.props.dash = 'solid'
        }
      },
      down() { },
    },
    {
      id: Versions.SimplifyTable,
      scope: 'record',
      filter: (record: any) => record?.state?.type === 'table',
      up(_: any) {
        debugger
      },
      down() { },
    },
    {
      id: Versions.newNaming,
      scope: 'record',
      filter: (record: any) =>
        [
          'start',
          'end',
          'message',
          'gateway',
          'loop',
          'parallel',
          'script',
          'serviceCall',
          'signalSend',
          'signalListen',
          'subprocess',
          'userAction',
          'table',
          'timer',
          'frame',
        ].includes(record?.state?.type),
      up(record: any) {
        if (
          [
            'start',
            'end',
            'message',
            'gateway',
            'loop',
            'parallel',
            'script',
            'serviceCall',
            'signalSend',
            'signalListen',
            'subprocess',
            'userAction',
            'table',
            'timer',
            'frame',
          ].includes(record?.state?.type)
        ) {
          const isFe = record.state.props.color === 'light-blue'
          const suffix = isFe ? '-fe' : '-be'
          const isInter = record.state.props.dash === 'dashed'
          const interSuffix = isInter ? '-inter' : ''

          switch (record.state.type) {
            case 'start':
              record.state.type = 'start' + suffix
              break
            case 'end':
              record.state.type = 'end' + suffix
              break
            case 'message':
              record.state.type = 'message' + interSuffix
              break
            case 'gateway':
              record.state.type = 'gateway' + suffix
              break
            case 'loop':
              record.state.type = 'loop' + suffix
              break
            case 'parallel':
              record.state.type = 'parallel' + suffix
              break
            case 'script':
              record.state.type = 'script' + suffix
              break
            case 'serviceCall':
              record.state.type = 'service-call' + suffix
              break
            case 'signalSend':
              record.state.type = 'signal-send' + suffix
              break
            case 'signalListen':
              record.state.type = 'signal-listen' + suffix
              break
            case 'subprocess':
              record.state.type = 'subprocess' + suffix
              break
            case 'table':
              record.state.type = 'table' + suffix
              break
            case 'timer':
              record.state.type = 'timer' + suffix + interSuffix
              break
            case 'userAction':
              record.state.type = 'user-action'
              break
          }

          if (
            ['subprocess', 'service-call', 'script'].some((type) =>
              record.state.type.startsWith(type),
            )
          ) {
            delete record.state.props.text
            record.state.props.richText = toRichText('Edit me..')
          }

          if (record.state.type === 'frame') {
            record.state.props.color = 'white'
          } else if (record.state.props.color) {
            delete record.state.props.color
          }
          if (record.state.props.dash) {
            delete record.state.props.dash
          }
        }
      },
      down() { },
    },
  ],
})

export const migrateRoomSnapshot = (snapshot: any) => {
  for (const doc of snapshot.documents) {
    const result = schema.migratePersistedRecord(doc, snapshot.schema)
    if (result.type === 'success') Object.assign(doc, result.value)
  }
}
