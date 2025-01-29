import { MessageShapeUtil } from './Message.tsx'
import { ShapeNames, Shapes } from 'editor-common'
import { BaseBoxShapeTool, ShapeUtil, TLShapeUtilConstructor } from 'tldraw'
import { StartShapeUtil } from './Start.tsx'
import { CSSProperties } from 'react'

const customShapeDefinitions: Record<keyof typeof Shapes, TLShapeUtilConstructor<any, ShapeUtil<any>>> = {
  message: MessageShapeUtil,
  start: StartShapeUtil
}

export const customShapes = Object.values(customShapeDefinitions)

export const customTools = ShapeNames.map(name => class extends BaseBoxShapeTool {
  static override id = name
  override shapeType = name
})

export const baseStyle: CSSProperties= {
  pointerEvents: 'all',
  background: '#efefef',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8
}
