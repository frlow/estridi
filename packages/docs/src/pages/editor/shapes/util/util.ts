import { createShapeId, Editor, type TLShapeId } from 'tldraw'

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
