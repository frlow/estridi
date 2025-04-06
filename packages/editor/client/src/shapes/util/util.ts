import { Editor, createShapeId, TLShapeId, TLBinding } from 'tldraw'
import { BaseShape } from '..'
import { ShapeDefinition } from 'editor-common'
import { TLEventMapHandler } from 'tldraw'

// Add interface for arrow binding props
interface ArrowBindingProps {
  terminal: 'start' | 'end'
  isPrecise: boolean
  isExact: boolean
  normalizedAnchor: { x: number; y: number }
}

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

  return arrowId
}

// Update handleDropShapeOnArrow to remove the highlight
export function handleDropShapeOnArrow(
  editor: Editor,
  droppedShapeId: TLShapeId,
) {
  const droppedShape = editor.getShape(droppedShapeId)
  if (!droppedShape) return

  const droppedShapeBounds = editor.getShapePageBounds(droppedShapeId)
  if (!droppedShapeBounds) return

  const existingBindings = editor.store
    .allRecords()
    .filter(
      (record): record is TLBinding =>
        record.typeName === 'binding' && record.toId === droppedShapeId,
    )

  if (existingBindings.length > 0) return

  const droppedCenter = getShapeCenter(droppedShapeBounds)

  const intersectingArrow = findIntersectingArrow(editor, droppedCenter)
  if (!intersectingArrow) return

  replaceArrowWithConnection(
    editor,
    intersectingArrow.arrow.id,
    intersectingArrow.startShape.id,
    droppedShapeId,
    intersectingArrow.endShape.id,
  )

  // Clean up any highlight indicators that might be on the page
  const highlightShapes = editor.getCurrentPageShapes().filter((shape) => {
    // Check for geo type and then check properties
    if (shape.type !== 'geo') return false
    const props = shape.props as any
    return props.stroke === '#ff0000' && props.fill === 'none'
  })

  highlightShapes.forEach((shape) => editor.deleteShape(shape.id))
}

function getShapeCenter(bounds: {
  x: number
  y: number
  width: number
  height: number
}) {
  return {
    x: bounds.x + bounds.width / 2,
    y: bounds.y + bounds.height / 2,
  }
}

function findIntersectingArrow(
  editor: Editor,
  droppedCenter: { x: number; y: number },
) {
  const arrows = editor
    .getCurrentPageShapes()
    .filter((shape) => shape.type === 'arrow')

  for (const arrow of arrows) {
    const arrowBindings = editor.store
      .allRecords()
      .filter(
        (record): record is TLBinding =>
          record.typeName === 'binding' && record.fromId === arrow.id,
      )

    if (arrowBindings.length !== 2) continue

    const startBinding = arrowBindings.find(
      (b) => b.props && (b.props as ArrowBindingProps).terminal === 'start',
    )
    const endBinding = arrowBindings.find(
      (b) => b.props && (b.props as ArrowBindingProps).terminal === 'end',
    )

    if (!startBinding || !endBinding) continue

    const startShape = editor.getShape(startBinding.toId)
    const endShape = editor.getShape(endBinding.toId)

    if (!startShape || !endShape) continue

    const startShapeBounds = editor.getShapePageBounds(startShape.id)
    const endShapeBounds = editor.getShapePageBounds(endShape.id)

    if (!startShapeBounds || !endShapeBounds) continue

    const startCenter = getShapeCenter(startShapeBounds)
    const endCenter = getShapeCenter(endShapeBounds)

    // Check if the dropped shape is near the line between start and end
    if (isPointNearLine(droppedCenter, startCenter, endCenter)) {
      return { arrow, startShape, endShape }
    }
  }

  return null
}

function isPointNearLine(
  point: { x: number; y: number },
  lineStart: { x: number; y: number },
  lineEnd: { x: number; y: number },
  threshold = 50,
) {
  const padding = 20
  const lineMinX = Math.min(lineStart.x, lineEnd.x) - padding
  const lineMaxX = Math.max(lineStart.x, lineEnd.x) + padding
  const lineMinY = Math.min(lineStart.y, lineEnd.y) - padding
  const lineMaxY = Math.max(lineStart.y, lineEnd.y) + padding

  if (
    point.x < lineMinX ||
    point.x > lineMaxX ||
    point.y < lineMinY ||
    point.y > lineMaxY
  ) {
    return false
  }

  const lineLength = Math.sqrt(
    Math.pow(lineEnd.x - lineStart.x, 2) + Math.pow(lineEnd.y - lineStart.y, 2),
  )

  if (lineLength === 0) return false

  const distance =
    Math.abs(
      (lineEnd.y - lineStart.y) * point.x -
        (lineEnd.x - lineStart.x) * point.y +
        lineEnd.x * lineStart.y -
        lineEnd.y * lineStart.x,
    ) / lineLength

  return distance <= threshold
}

function replaceArrowWithConnection(
  editor: Editor,
  arrowId: TLShapeId,
  startShapeId: TLShapeId,
  middleShapeId: TLShapeId,
  endShapeId: TLShapeId,
) {
  editor.deleteShape(arrowId)
  createArrow(editor, startShapeId, middleShapeId)
  createArrow(editor, middleShapeId, endShapeId)
  editor.select(middleShapeId)
}
