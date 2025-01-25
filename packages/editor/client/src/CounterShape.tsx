import { MouseEvent } from 'react'
import { BaseBoxShapeTool, BaseBoxShapeUtil, HTMLContainer, stopEventPropagation, TLBaseShape } from 'tldraw'
import { CounterShapeProps, ShapeProps } from 'editor-common/props'

type CounterShape = TLBaseShape<'counter', ShapeProps<typeof CounterShapeProps>>

export class CounterShapeUtil extends BaseBoxShapeUtil<CounterShape> {
  static override type = 'counter' as const
  static override props = CounterShapeProps

  override getDefaultProps() {
    return {
      w: 200,
      h: 200,
      count: 0
    }
  }

  override component(shape: CounterShape) {
    const onClick = (event: MouseEvent, change: number) => {
      event.stopPropagation()
      this.editor.updateShape({
        id: shape.id,
        type: 'counter',
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

  override indicator(shape: CounterShape) {
    return <rect width={shape.props.w} height={shape.props.h} />
  }
}

export class CounterShapeTool extends BaseBoxShapeTool {
  static override id = 'counter'
  override shapeType = 'counter'
}
