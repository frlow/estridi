import { defaultColorNames, T } from 'tldraw'
import { icons } from './icons'

export type ShapeProps<T> = {
  [K in keyof T]: ExtractGenericArgs<T[K]>
}

type ExtractGenericArgs<T> = T extends T.Validator<infer U> ? U : never

const props = {
  w: T.positiveNumber,
  h: T.positiveNumber,
  text: T.string,
}

export type ShapeDefinition = {
  name: ShapeName
  props: Record<string, T.Validator<any>>
  icon: keyof typeof icons
}
export const Shapes = {
  message: {
    name: 'message',
    props: {
      ...props,
      color: T.literalEnum(...defaultColorNames),
      dash: T.literalEnum('solid', 'dashed', 'draw'),
    },
    icon: 'letter',
  },
  script: {
    name: 'script',
    props: {
      ...props,
      color: T.literalEnum(...defaultColorNames),
    },
    icon: 'script',
  },
  signalSend: {
    name: 'signalSend',
    props: {
      ...props,
      color: T.literalEnum(...defaultColorNames),
    },
    icon: 'triangle',
  },
  start: {
    name: 'start',
    props: {
      ...props,
      color: T.literalEnum(...defaultColorNames),
    },
    icon: 'circle',
  },
  end: {
    name: 'end',
    props: {
      ...props,
      color: T.literalEnum(...defaultColorNames),
    },
    icon: 'circle',
  },
  subprocess: {
    name: 'subprocess',
    props: {
      ...props,
      color: T.literalEnum(...defaultColorNames),
    },
    icon: 'sub-process',
  },
  serviceCall: {
    name: 'serviceCall',
    props: {
      ...props,
      color: T.literalEnum(...defaultColorNames),
    },
    icon: 'gear',
  },
  userAction: {
    name: 'userAction',
    props: {
      ...props,
      color: T.literalEnum(...defaultColorNames),
    },
    icon: 'user-action',
  },
  gateway: {
    name: 'gateway',
    props: {
      ...props,
      color: T.literalEnum(...defaultColorNames),
    },
    icon: 'diamond',
  },
  loop: {
    name: 'loop',
    props: {
      ...props,
      color: T.literalEnum(...defaultColorNames),
    },
    icon: 'loop',
  },
  signalListen: {
    name: 'signalListen',
    props: {
      ...props,
      color: T.literalEnum(...defaultColorNames),
    },
    icon: 'cross',
  },
  table: {
    name: 'table',
    props: {
      ...props,
      rows: T.array,
      columns: T.array,
    },
    icon: 'cross',
  },
  other: {
    name: 'other',
    props: {
      ...props,
    },
    icon: 'cross',
  },
  connector: {
    name: 'connector',
    props: {
      ...props,
    },
    icon: 'diamond-black',
  },
  customNote: {
    name: 'customNote',
    props: {
      ...props,
      color: T.literalEnum(...defaultColorNames),
    },
    icon: 'diamond-black',
  },
} as const

export const ShapeNames: (keyof typeof Shapes)[] = Object.keys(
  Shapes,
) as (keyof typeof Shapes)[]
export type ShapeName = keyof typeof Shapes
