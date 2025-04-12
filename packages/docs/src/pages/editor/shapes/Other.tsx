import { BaseBoxShapeUtil, HTMLContainer } from 'tldraw'
import { Shapes } from 'editor-common'
import { type BaseShape, baseStyle } from './index.ts'

const shapeType = Shapes.other
type ShapeType = BaseShape<typeof shapeType>

export default class extends BaseBoxShapeUtil<ShapeType> {
  static override type = shapeType.name
  static override props = shapeType.props

  override getDefaultProps() {
    return {
      h: 80,
      w: 80,
      text: '',
    }
  }

  override canResize(_shape: ShapeType): boolean {
    return false
  }

  override component(_: ShapeType) {
    return (
      <HTMLContainer style={baseStyle}>
        <div>Other</div>
      </HTMLContainer>
    )
  }

  override indicator(shape: ShapeType) {
    return <rect width={shape.props.w} height={shape.props.h} />
  }
}
