import { BaseBoxShapeUtil, HTMLContainer, Rectangle2d } from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape } from './index.ts'
import { BORDER_RADIUS } from './util/constants.ts'

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

  override component() {
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
            borderRadius: BORDER_RADIUS,
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
