import { BaseBoxShapeUtil, HTMLContainer, Rectangle2d } from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape } from './index.ts'

const shapeType = Shapes.connector
type ShapeType = BaseShape<typeof shapeType>

// When a square of 30x30 is rotated 45 degrees, its bounding box becomes larger
// The width/height of this bounding box is approximately: side length * sqrt(2)
const squareSize = 30
const boundingBoxSize = Math.ceil(squareSize * Math.sqrt(2)) // ≈ 42

export default class extends BaseBoxShapeUtil<ShapeType> {
  static override type = shapeType.name
  static override props = shapeType.props

  override getDefaultProps() {
    return {
      h: boundingBoxSize,
      w: boundingBoxSize,
      text: '',
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

  override component(_: ShapeType) {
    return (
      <HTMLContainer>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            background: 'black',
            transform: 'translate(-50%, -50%) rotate(45deg)',
            height: `${squareSize}px`,
            width: `${squareSize}px`,
            borderRadius: '5px',
          }}
        ></div>
      </HTMLContainer>
    )
  }

  override indicator(_: ShapeType) {
    // Center of the bounding box
    const center = boundingBoxSize / 2

    return (
      <rect
        x={center - squareSize / 2}
        y={center - squareSize / 2}
        width={squareSize}
        height={squareSize}
        rx={5}
        transform={`rotate(45 ${center} ${center})`}
      />
    )
  }
}
