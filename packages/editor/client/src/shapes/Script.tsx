import { BaseBoxShapeUtil, HTMLContainer } from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape, baseStyle } from './index.ts'


const shapeType = Shapes.script
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
    return true
  }

  override component(shape: ShapeType) {
    return (
      <HTMLContainer style={{ ...baseStyle, border: '2px solid black', overflow: 'hidden', borderRadius: "5px"}}>
        <img src="/page-white.svg" alt="page" style={{height: "25px"}}/>
        <div contentEditable={true}
             style={{ resize: 'none', overflow: 'visible', whiteSpace: 'pre-wrap', color: "white", fontWeight: "bold" }}
             onBlur={(e: any) => {
               const text = e.target.innerText
               this.editor.updateShape({
                 id: shape.id,
                 type: 'counter',
                 props: { text }
               })
             }}>{shape.props.text || "..."}</div>
      </HTMLContainer>
    )
  }

  override indicator(shape: ShapeType) {
    return <rect width={shape.props.w} height={shape.props.h} />
  }
}
