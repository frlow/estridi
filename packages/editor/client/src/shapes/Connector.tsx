import { BaseBoxShapeUtil, HTMLContainer } from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape, baseStyle } from './index.ts'


const shapeType = Shapes.connector
type ShapeType = BaseShape<typeof shapeType>

export default class extends BaseBoxShapeUtil<ShapeType> {
  static override type = shapeType.name
  static override props = shapeType.props

  override getDefaultProps() {
    return {
      h: 30,
      w: 30,
      text: ''
    }
  }

  override canResize(_shape: ShapeType): boolean {
    return false
  }

  override component(_: ShapeType) {
    return (
      <HTMLContainer style={{ ...baseStyle, background: 'transparent' }}>
        <div style={{
          background: 'black',
          transform: 'rotate(45deg)',
          transformOrigin: 'center',
          height: '30px',
          width: '30px'
        }}></div>
      </HTMLContainer>
    )
  }

  override indicator(_: ShapeType) {
    return <rect width={30} height={30} />
  }
}
