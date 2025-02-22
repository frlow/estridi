import { BaseBoxShapeUtil, HTMLContainer } from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape, baseStyle } from './index.ts'


const shapeType = Shapes.serviceCall
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

  override component(shape: ShapeType) {
    return (
      <HTMLContainer style={{...baseStyle, background: "#59e351", border: "2px solid black", borderRadius: "5px"}}>
        <div contentEditable={true} style={{ resize: 'none', overflow: 'visible', width: "200px", fontWeight: "bold" }} onBlur={(e: any) => {
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
