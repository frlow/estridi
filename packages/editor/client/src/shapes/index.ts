import { CSSProperties } from 'react'
import Message from './Message.tsx'
import { Start, End } from './Start.tsx'
import {
  ShapeDefinition,
  ShapeName,
  ShapeNames,
  ShapeProps,
} from 'editor-common'
import {
  BaseBoxShapeTool,
  ShapeUtil,
  TLBaseShape,
  TLShapeUtilConstructor,
} from 'tldraw'
import Script from './Script.tsx'
import UserAction from './UserAction.tsx'
import Subprocess from './Subprocess.tsx'
import { Gateway, Loop } from './Gateway.tsx'
import ServiceCall from './ServiceCall.tsx'
import SignalSend from './SignalSend.tsx'
import SignalListen from './SignalListen.tsx'
import Table from './Table.tsx'
import Connector from './Connector.tsx'
import Note from './Note.tsx'
import Other from './Other.tsx'

const customShapeDefinitions: Record<
  ShapeName,
  TLShapeUtilConstructor<any, ShapeUtil<any>>
> = {
  customNote: Note,
  gateway: Gateway,
  loop: Loop,
  script: Script,
  serviceCall: ServiceCall,
  signalSend: SignalSend,
  subprocess: Subprocess,
  userAction: UserAction,
  message: Message,
  start: Start,
  end: End,
  signalListen: SignalListen,
  other: Other,
  table: Table,
  connector: Connector,
}

export const customShapes = Object.values(customShapeDefinitions)

export const customTools = ShapeNames.map(
  (name) =>
    class extends BaseBoxShapeTool {
      static override id = name
      override shapeType = name
    },
)

export const baseStyle: CSSProperties = {
  pointerEvents: 'all',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: 8,
}

export const figureStyles: CSSProperties = {
  background: '#83BBE5',
  border: '4px solid black',
}

export const internalInputStyle: CSSProperties = {
  background: 'transparent',
  border: 'none',
}

export type BaseShape<T extends ShapeDefinition> = TLBaseShape<
  T['name'],
  ShapeProps<T['props']>
>
