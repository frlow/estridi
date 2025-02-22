import { BaseBoxShapeUtil, HTMLContainer } from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape, baseStyle } from './index.ts'


const shapeType = Shapes.start
type ShapeType = BaseShape<typeof shapeType>

export default class extends BaseBoxShapeUtil<ShapeType> {
  static override type = shapeType.name
  static override props = shapeType.props

  override getDefaultProps() {
    return {
      h: 80,
      w: 80,
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
          width: '60px',
          height: '60px',
          borderRadius: '60px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '4px solid black',
          background: 'rgba(64,115,177,0.7)'
        }}></div>
      </HTMLContainer>
    )
  }

  override indicator(shape: ShapeType) {
    return <rect width={shape.props.w} height={shape.props.h} />
  }
}
