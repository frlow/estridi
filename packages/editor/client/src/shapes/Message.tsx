import { MouseEvent } from 'react'
import { BaseBoxShapeUtil, HTMLContainer, stopEventPropagation, TLBaseShape } from 'tldraw'
import { ShapeProps, Shapes } from 'editor-common'

type Message = TLBaseShape<typeof Shapes.message.name, ShapeProps<typeof Shapes.message.props>>

export class MessageShapeUtil extends BaseBoxShapeUtil<Message> {
  static override type = Shapes.message.name
  static override props = Shapes.message.props

  override getDefaultProps() {
    return {
      w: 200,
      h: 200,
      count: 0
    }
  }

  override component(shape: Message) {
    const onClick = (event: MouseEvent, change: number) => {
      event.stopPropagation()
      this.editor.updateShape({
        id: shape.id,
        type: Shapes.message.name,
        props: { count: shape.props.count + change }
      })
    }

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
        <button onClick={(e) => onClick(e, -1)} onPointerDown={stopEventPropagation}>
          -
        </button>
        <span>{shape.props.count}</span>
        <button onClick={(e) => onClick(e, 1)} onPointerDown={stopEventPropagation}>
          +
        </button>
      </HTMLContainer>
    )
  }

  override indicator(shape: Message) {
    return <rect width={shape.props.w} height={shape.props.h} />
  }
}
