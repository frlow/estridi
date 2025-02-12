import { Geometry2d, HTMLContainer, Rectangle2d, ShapeUtil } from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape } from './index.ts'
import { CSSProperties } from 'react'


const shapeType = Shapes.message
type ShapeType = BaseShape<typeof shapeType>

export default class extends ShapeUtil<ShapeType> {
  static override type = shapeType.name
  static override props = shapeType.props

  override getDefaultProps() {
    return {
      h: 0,
      w: 0,
      text: ''
    }
  }

  override getGeometry(_: ShapeType): Geometry2d {
    return new Rectangle2d({
      width: 60,
      height: 60,
      isFilled: true
    })
  }

  override canResize(_shape: ShapeType): boolean {
    return false
  }

  override component(shape: ShapeType) {
    const style: CSSProperties = { pointerEvents: 'all' }
    return (
      <HTMLContainer style={style}>
        <div>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '4px solid black',
            background: 'rgba(64,115,177,0.7)'
          }}>Message
          </div>
          <div contentEditable={true} style={{ resize: 'none', overflow: 'visible', width: "200px" }} onBlur={(e: any) => {
            this.editor.updateShape({
              id: shape.id,
              type: 'counter',
              props: { text: e.target.innerHTML }
            })
          }}>{shape.props.text}</div>
        </div>
      </HTMLContainer>
    )
  }

  override indicator(_: ShapeType) {
    return <rect width={60} height={60} />
  }
}
