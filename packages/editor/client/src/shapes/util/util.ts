import { Editor, createShapeId, TLShapeId } from 'tldraw'
import { BaseShape } from '..'
import { ShapeDefinition } from 'editor-common'

type TransformationMap = {
  value: string
  icon: string
  filterProps?: (props: any) => any
  addProps?: Record<string, any>
}

export function mapTransformations(
  transformationMap: TransformationMap[],
  shape: BaseShape<ShapeDefinition>,
  editor: Editor,
) {
  return transformationMap.map((transformation) => ({
    iconUrl: `/${transformation.icon}.svg`,
    onSelected: () =>
      changeShape(
        shape,
        editor,
        transformation.value,
        transformation?.filterProps,
        transformation?.addProps,
      ),
  }))
}

export function changeShape(
  shape: BaseShape<ShapeDefinition>,
  editor: Editor,
  shapeName: string,
  filterProps?: (props: any) => any,
  addProps?: Record<string, any>,
) {
  editor.deleteShape(shape.id)

  const newShape = { ...shape, type: shapeName }

  if (filterProps) {
    console.log('filterProps', filterProps)
    newShape.props = filterProps(shape.props)
  }

  if (addProps) {
    newShape.props = {
      ...newShape.props,
      ...addProps,
    }
  }
  editor.createShape(newShape)

  editor.updateShape({
    id: newShape.id,
    type: shapeName,
    props: newShape.props,
  })
}

export function createArrow(
  editor: Editor,
  startShapeId: TLShapeId,
  targetId: TLShapeId,
) {
  // Get both shapes to determine if they share a parent
  const startShape = editor.getShape(startShapeId)
  const targetShape = editor.getShape(targetId)

  // If both shapes have the same parent (like a frame), use that parent for the arrow
  const sharedParentId =
    startShape?.parentId &&
    targetShape?.parentId &&
    startShape.parentId === targetShape.parentId
      ? startShape.parentId
      : undefined

  const arrowId = createShapeId()
  editor.createShape({
    id: arrowId,
    type: 'arrow',
    parentId: sharedParentId,
    props: {
      start: { x: 0, y: 0 },
      end: {
        x: 0,
        y: 0,
      },
    },
  })

  const arrowProps = {
    normalizedAnchor: { x: 0, y: 0 },
    isExact: false,
    isPrecise: false,
  }

  editor.createBinding({
    type: 'arrow',
    fromId: arrowId,
    toId: startShapeId,
    props: { ...arrowProps, terminal: 'start' },
  })
  editor.createBinding({
    type: 'arrow',
    fromId: arrowId,
    toId: targetId,
    props: { ...arrowProps, terminal: 'end' },
  })
}
