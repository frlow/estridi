import { CSSProperties } from 'react'
import Message from './Message.tsx'
import Start from './Start.tsx'
import { ShapeDefinition, ShapeName, ShapeNames, ShapeProps } from 'editor-common'
import { BaseBoxShapeTool, ShapeUtil, TLBaseShape, TLShapeUtilConstructor } from 'tldraw'
import Script from './Script.tsx'
import UserAction from './UserAction.tsx'
import Subprocess from './Subprocess.tsx'
import Gateway from './Gateway.tsx'
import ServiceCall from './ServiceCall.tsx'
import SignalSend from './SignalSend.tsx'
import SignalListen from './SignalListen.tsx'
import Other from './Other.tsx'
import Table from './Table.tsx'
import Connector from './Connector.tsx'

const customShapeDefinitions: Record<ShapeName, TLShapeUtilConstructor<any, ShapeUtil<any>>> = {
  gateway: Gateway,
  script: Script,
  serviceCall: ServiceCall,
  signalSend: SignalSend,
  subprocess: Subprocess,
  userAction: UserAction,
  message: Message,
  start: Start,
  signalListen: SignalListen,
  other: Other,
  table: Table,
  connector: Connector
}

export const customShapes = Object.values(customShapeDefinitions)

export const customTools = ShapeNames.map(name => class extends BaseBoxShapeTool {
  static override id = name
  override shapeType = name
})

export const baseStyle: CSSProperties = {
  pointerEvents: 'all',
  background: 'rgba(64,115,177,0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: 8
}

export const internalInputStyle: CSSProperties = {
  background: 'transparent',
  border: "none"
}

export type BaseShape<T extends ShapeDefinition> = TLBaseShape<T['name'], ShapeProps<T['props']>>
