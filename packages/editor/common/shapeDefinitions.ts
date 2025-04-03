import { richTextValidator, T } from 'tldraw'
import { icons } from './icons'

export type ShapeProps<T> = {
  [K in keyof T]: ExtractGenericArgs<T[K]>
}

type ExtractGenericArgs<T> = T extends T.Validatable<infer U> ? U : never

const props = {
  w: T.positiveNumber,
  h: T.positiveNumber,
}

export type ShapeDefinition = {
  name: ShapeName
  props: Record<string, T.Validatable<any>>
  icon: keyof typeof icons
}

export const Shapes = {
  'start-fe': {
    name: 'start-fe',
    props: {
      ...props,
    },
    icon: 'start-icon',
  },
  'start-be': {
    name: 'start-be',
    props: {
      ...props,
    },
    icon: 'start-icon',
  },
  message: {
    name: 'message',
    props: {
      ...props,
      text: T.string,
    },
    icon: 'message-icon',
  },
  'message-inter': {
    name: 'message-inter',
    props: {
      ...props,
      text: T.string,
    },
    icon: 'message-inter-icon',
  },
  'gateway-fe': {
    name: 'gateway-fe',
    props: {
      ...props,
      text: T.string,
    },
    icon: 'gateway-icon',
  },
  'gateway-be': {
    name: 'gateway-be',
    props: {
      ...props,
      text: T.string,
    },
    icon: 'gateway-icon',
  },
  'loop-fe': {
    name: 'loop-fe',
    props: {
      ...props,
      text: T.string,
    },
    icon: 'loop-icon',
  },
  'loop-be': {
    name: 'loop-be',
    props: {
      ...props,
      text: T.string,
    },
    icon: 'loop-icon',
  },
  'parallel-fe': {
    name: 'parallel-fe',
    props: {
      ...props,
      text: T.string,
    },
    icon: 'parallel-icon',
  },
  'parallel-be': {
    name: 'parallel-be',
    props: {
      ...props,
      text: T.string,
    },
    icon: 'parallel-icon',
  },
  connector: {
    name: 'connector',
    props: {
      ...props,
    },
    icon: 'connector-icon',
  },
  'service-call-fe': {
    name: 'service-call-fe',
    props: {
      ...props,
      richText: richTextValidator,
    },
    icon: 'service-call-icon',
  },
  'service-call-be': {
    name: 'service-call-be',
    props: {
      ...props,
      richText: richTextValidator,
    },
    icon: 'service-call-icon',
  },
  'service-call-be-external': {
    name: 'service-call-be-external',
    props: {
      ...props,
      richText: richTextValidator,
    },
    icon: 'service-call-icon',
  },
  'script-fe': {
    name: 'script-fe',
    props: {
      ...props,
      richText: richTextValidator,
    },
    icon: 'script-icon',
  },
  'script-be': {
    name: 'script-be',
    props: {
      ...props,
      richText: richTextValidator,
    },
    icon: 'script-icon',
  },
  'table-fe': {
    name: 'table-fe',
    props: {
      ...props,
      rows: T.arrayOf(T.arrayOf(T.string)),
    },
    icon: 'table-icon',
  },
  'table-be': {
    name: 'table-be',
    props: {
      ...props,
      rows: T.arrayOf(T.arrayOf(T.string)),
    },
    icon: 'table-icon',
  },
  'user-action': {
    name: 'user-action',
    props: {
      ...props,
    },
    icon: 'user-action-icon',
  },
  'signal-send-fe': {
    name: 'signal-send-fe',
    props: {
      ...props,
      text: T.string,
    },
    icon: 'signal-send-icon',
  },
  'signal-send-be': {
    name: 'signal-send-be',
    props: {
      ...props,
      text: T.string,
    },
    icon: 'signal-send-icon',
  },
  'signal-listen-fe': {
    name: 'signal-listen-fe',
    props: {
      ...props,
      text: T.string,
    },
    icon: 'signal-listen-icon',
  },
  'signal-listen-fe-inter': {
    name: 'signal-listen-fe-inter',
    props: {
      ...props,
      text: T.string,
    },
    icon: 'signal-listen-icon',
  },
  'signal-listen-be': {
    name: 'signal-listen-be',
    props: {
      ...props,
      text: T.string,
    },
    icon: 'signal-listen-icon',
  },
  'signal-listen-be-inter': {
    name: 'signal-listen-be-inter',
    props: {
      ...props,
      text: T.string,
    },
    icon: 'signal-listen-icon',
  },
  'signal-send-fe-inter': {
    name: 'signal-send-fe-inter',
    props: {
      ...props,
      text: T.string,
    },
    icon: 'signal-send-icon',
  },
  'signal-send-be-inter': {
    name: 'signal-send-be-inter',
    props: {
      ...props,
      text: T.string,
    },
    icon: 'signal-send-icon',
  },
  'timer-fe': {
    name: 'timer-fe',
    props: {
      ...props,
      text: T.string,
    },
    icon: 'timer-icon',
  },
  'timer-be': {
    name: 'timer-be',
    props: {
      ...props,
      text: T.string,
    },
    icon: 'timer-icon',
  },
  error: {
    name: 'error',
    props: {
      ...props,
      text: T.string,
    },
    icon: 'error-icon',
  },
  'soft-error': {
    name: 'soft-error',
    props: {
      ...props,
      text: T.string,
    },
    icon: 'dev-done-icon',
  },
  'end-fe': {
    name: 'end-fe',
    props: {
      ...props,
    },
    icon: 'end-icon',
  },
  'end-be': {
    name: 'end-be',
    props: {
      ...props,
    },
    icon: 'end-icon',
  },
  'not-started': {
    name: 'not-started',
    props: {
      ...props,
    },
    icon: 'not-started-icon',
  },
  'in-progress': {
    name: 'in-progress',
    props: {
      ...props,
    },
    icon: 'in-progress-icon',
  },
  'dev-done': {
    name: 'dev-done',
    props: {
      ...props,
    },
    icon: 'dev-done-icon',
  },
  'test-done': {
    name: 'test-done',
    props: {
      ...props,
    },
    icon: 'dev-done-icon',
  },
  'test-failed': {
    name: 'test-failed',
    props: {
      ...props,
    },
    icon: 'dev-done-icon',
  },
  'custom-note': {
    name: 'custom-note',
    props: {
      ...props,
      richText: richTextValidator,
    },
    icon: 'custom-note-icon',
  },
  'subprocess-fe': {
    name: 'subprocess-fe',
    props: {
      ...props,
      richText: richTextValidator,
    },
    icon: 'subprocess-icon',
  },
  'subprocess-be': {
    name: 'subprocess-be',
    props: {
      ...props,
      richText: richTextValidator,
    },
    icon: 'subprocess-icon',
  },
  frame: {
    name: 'frame',
    props: {
      w: T.positiveNumber,
      h: T.positiveNumber,
      name: T.string,
      color: T.literalEnum('white', 'blue', 'yellow', 'red'),
    },
    icon: 'frame-icon',
  },
  database: {
    name: 'database',
    props: {
      ...props,
      richText: richTextValidator,
    },
    icon: 'database-icon',
  },
  other: {
    name: 'other',
    props: { text: T.string, ...props },
    icon: 'start-icon',
  },
  'camera-mover': {
    name: 'camera-mover',
    props: {
      ...props,
    },
    icon: 'gateway-icon',
  },
} as const

export const ShapeNames: (keyof typeof Shapes)[] = Object.keys(
  Shapes,
) as (keyof typeof Shapes)[]
export type ShapeName = keyof typeof Shapes
