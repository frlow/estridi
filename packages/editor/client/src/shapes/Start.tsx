import { BaseBoxShapeUtil, HTMLContainer, TLBaseShape } from 'tldraw'
import { ShapeProps, Shapes } from 'editor-common'
import { baseStyle } from './index.ts'

type Start = TLBaseShape<typeof Shapes.start.name, ShapeProps<typeof Shapes.start.props>>

export class StartShapeUtil extends BaseBoxShapeUtil<Start> {
  static override type = Shapes.start.name
  static override props = Shapes.start.props

  override getDefaultProps() {
    return {
      h: 80,
      w: 80
    }
  }

  override canResize(_shape: Start): boolean {
    return false
  }

  override component(_: Start) {
    return (
      <HTMLContainer style={baseStyle}>
        <div>Start</div>
      </HTMLContainer>
    )
  }

  override indicator(shape: Start) {
    return <rect width={shape.props.w} height={shape.props.h} />
  }
}
