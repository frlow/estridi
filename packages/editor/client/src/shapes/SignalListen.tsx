import { BaseBoxShapeUtil, HTMLContainer } from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape, baseStyle } from './index.ts'


const shapeType = Shapes.signalListen
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
    return false
  }

  override component(shape: ShapeType) {
    return (
      <HTMLContainer style={baseStyle}>
        <div>Signal Listen</div>
        <input value={shape.props.text} onChange={e => {
          this.editor.updateShape({
            id: shape.id,
            type: 'counter',
            props: { text: e.target.value },
          })
        }} />
      </HTMLContainer>
    )
  }

  override indicator(shape: ShapeType) {
    return <rect width={shape.props.w} height={shape.props.h} />
  }
}
