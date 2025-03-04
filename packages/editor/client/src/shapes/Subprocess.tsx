import { BaseBoxShapeUtil, HTMLContainer } from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape, baseStyle } from './index.ts'
import { useEffect, useRef } from 'react'


const shapeType = Shapes.subprocess
type ShapeType = BaseShape<typeof shapeType>

export default class extends BaseBoxShapeUtil<ShapeType> {
  static override type = shapeType.name
  static override props = shapeType.props

  override getDefaultProps() {
    return {
      h: 80,
      w: 300,
      text: ''
    }
  }

  override canResize(_shape: ShapeType): boolean {
    return true
  }

  override canEdit(_shape: ShapeType): boolean {
    return true
  }

  override component(shape: ShapeType) {
    const isEditing = this.editor.getEditingShapeId() === shape.id
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
      if (isEditing) ref.current?.focus()
      else ref.current?.blur()
    }, [isEditing])
    return (
      <HTMLContainer
        style={{ ...baseStyle, background: '#9d79f6', border: '2px solid black', borderRadius: '5px' }}
      >
        <div contentEditable={isEditing} ref={ref} style={{ resize: 'none', overflow: 'visible', fontWeight: 'bold' }}
             onBlur={(e: any) => {
               this.editor.updateShape({
                 id: shape.id,
                 type: 'dummy',
                 props: { text: e.target.innerHTML }
               })
             }}>{shape.props.text}</div>
      </HTMLContainer>
    )
  }

  override indicator(shape: ShapeType) {
    return <rect width={shape.props.w} height={shape.props.h} />
  }
}
