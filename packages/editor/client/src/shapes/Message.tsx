import { BaseBoxShapeUtil, HTMLContainer, TLBaseShape } from 'tldraw'
import { ShapeProps, Shapes } from 'editor-common'
import { baseStyle } from './index.ts'

type Message = TLBaseShape<typeof Shapes.message.name, ShapeProps<typeof Shapes.message.props>>

export class MessageShapeUtil extends BaseBoxShapeUtil<Message> {
  static override type = Shapes.message.name
  static override props = Shapes.message.props

  override getDefaultProps() {
    return {
      h: 80,
      w: 80
    }
  }

  override canResize(_shape: Message): boolean {
    return false
  }

  override component(_: Message) {
    return (
      <HTMLContainer style={baseStyle}>
        <div>Message</div>
      </HTMLContainer>
    )
  }

  override indicator(shape: Message) {
    return <rect width={shape.props.w} height={shape.props.h} />
  }
}
