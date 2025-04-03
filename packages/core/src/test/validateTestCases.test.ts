import { test } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { schema } from 'editor-common'

const toRichText = (text: string) => ({
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      attrs: {
        dir: 'auto',
      },
      content: [
        {
          type: 'text',
          text: text || '',
        },
      ],
    },
  ],
})

const migrate = (doc: any, err: any) => {
  const ret = structuredClone(doc)
  if (ret.state.type === 'message') {
    delete ret.state.props.color
    delete ret.state.props.dash
  }
  if (ret.state.type === 'gateway') {
    ret.state.type = 'gateway-fe'
    delete ret.state.props.color
  }
  if (ret.state.type.startsWith('start')) {
    if (ret.state.type === 'start') ret.state.type = 'start-fe'
    delete ret.state.props.color
    delete ret.state.props.testDir
    delete ret.state.props.target
  }
  if (ret.state.type === 'frame') {
    ret.state.props.color = 'yellow'
  }
  if (ret.state.type === 'script') {
    ret.state.type = 'script-fe'
    ret.state.props.richText = toRichText(ret.state.props.text)
    delete ret.state.props.text
    delete ret.state.props.color
  }
  if (ret.state.type === 'parallel') {
    ret.state.type = 'parallel-fe'
    delete ret.state.props.color
  }
  if (ret.state.type === 'subprocess') {
    ret.state.type = 'subprocess-fe'
    delete ret.state.props.color
    ret.state.props.richText = toRichText(ret.state.props.text)
    delete ret.state.props.text
  }
  if (ret.state.type === 'end') {
    ret.state.type = 'end-fe'
    delete ret.state.props.color
  }
  if (ret.state.type === 'table') {
    ret.state.type = 'table-fe'
  }
  if (ret.state.type === 'userAction') {
    ret.state.type = 'user-action'
    delete ret.state.props.color
  }
  if (ret.state.type === 'signalListen') {
    ret.state.type = 'signal-listen-fe'
    delete ret.state.props.color
  }
  if (ret.state.type === 'serviceCall') {
    ret.state.type = 'service-call-fe'
    delete ret.state.props.color
    ret.state.props.richText = toRichText(ret.state.props.text)
    delete ret.state.props.text
  }
  if (ret.state.type === 'text') {
    ret.state.props.richText = toRichText(ret.state.props.text)
    delete ret.state.props.text
  }
  if (ret.state.type === 'loop') {
    ret.state.type = 'loop-fe'
    delete ret.state.props.color
  }
  return ret
}

test('validate test cases file', async () => {
  const filePath = path.join(__dirname, 's3d.json')
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  for (const doc of content.documents) {
    try {
      schema.validateRecord(null, doc.state, 'initialize', null)
    } catch (e) {
      const migrated = migrate(doc, e)
      schema.validateRecord(null, migrated.state, 'initialize', null)
      content.documents[content.documents.indexOf(doc)] = migrated
    }
  }
  for (const doc of content.documents) {
    schema.validateRecord(null, doc.state, 'initialize', null)
  }
  // fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8')
})
