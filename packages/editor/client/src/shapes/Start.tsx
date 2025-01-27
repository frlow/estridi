import { BaseBoxShapeUtil, HTMLContainer, TLBaseShape } from 'tldraw'
import { ShapeProps, Shapes } from 'editor-common'

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
      <HTMLContainer
        style={{
          pointerEvents: 'all',
          background: '#efefef',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8
        }}
      >
        <div>Start</div>
      </HTMLContainer>
    )
  }

  override indicator(shape: Start) {
    return <rect width={shape.props.w} height={shape.props.h} />
  }
}
