import {
  BaseBoxShapeUtil,
  HTMLContainer,
  Rectangle2d,
  stopEventPropagation,
} from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape } from './index.ts'
import { ShapeSelectMenu } from './util/ShapeSelectMenu.tsx'
import { useState } from 'react'
import { handleDropShapeOnArrow } from './util/util.ts'

const shapeType = Shapes.connector
type ShapeType = BaseShape<typeof shapeType>

const squareSize = 50
const boundingBoxSize = Math.ceil(squareSize * Math.sqrt(2))

export default class extends BaseBoxShapeUtil<ShapeType> {
  static override type = shapeType.name
  static override props = shapeType.props

  override getDefaultProps(): ShapeType['props'] {
    return {
      h: squareSize,
      w: squareSize,
    }
  }

  override getGeometry() {
    return new Rectangle2d({
      width: boundingBoxSize,
      height: boundingBoxSize,
      isFilled: true,
    })
  }
  override canResize = () => false
  override hideSelectionBoundsFg = () => true
  override hideRotateHandle = () => true
  override hideResizeHandles = () => true
  override canEdit = () => false

  override onTranslateEnd = (shape: ShapeType) =>
    handleDropShapeOnArrow(this.editor, shape.id)

  override component(shape: ShapeType) {
    const isSelected = shape.id === this.editor.getOnlySelectedShapeId()
    const isEditing = shape.id === this.editor.getEditingShapeId()
    const presetId = shape.id + '-preset-button'
    const [showSelectMenu, setShowSelectMenu] = useState(false)

    return (
      <HTMLContainer
        style={{ pointerEvents: isSelected ? 'all' : 'none' }}
        onPointerDown={(e) => {
          const target = e.target as HTMLElement
          if (
            target.id === presetId ||
            target.closest(`#${CSS.escape(presetId)}`)
          ) {
            stopEventPropagation(e)
          }
        }}
      >
        <ShapeSelectMenu
          isFe={false}
          id={presetId}
          sourceShapeId={shape.id}
          show={showSelectMenu}
          onClose={() => setShowSelectMenu(!showSelectMenu)}
          editor={this.editor}
          showNextButton={isSelected && !isEditing}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            background: 'black',
            transform: 'translate(-50%, -50%) rotate(45deg)',
            height: `${squareSize}px`,
            width: `${squareSize}px`,
            borderRadius: 'var(--border-radius-px)',
          }}
        ></div>
      </HTMLContainer>
    )
  }

  override indicator() {
    // Center of the bounding box
    const center = boundingBoxSize / 2

    return (
      <rect
        x={center - squareSize / 2}
        y={center - squareSize / 2}
        width={squareSize}
        height={squareSize}
        rx={10}
        transform={`rotate(45 ${center} ${center})`}
      />
    )
  }
}
