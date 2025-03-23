import { BaseBoxShapeUtil, HTMLContainer, toRichText } from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape } from './index.ts'
import { TextLabelWithAutoHeight } from './util/TextLabelWithAutoHeight.tsx'
import { BORDER, BORDER_RADIUS, GREY } from './util/constants.ts'

const shapeType = Shapes['custom-note']
type ShapeType = BaseShape<typeof shapeType>

const DEFAULT_WIDTH = 300
const MIN_HEIGHT = 150
const PADDING = 16

export default class extends BaseBoxShapeUtil<ShapeType> {
  static override type = shapeType.name
  static override props = shapeType.props

  override getDefaultProps(): ShapeType['props'] {
    return {
      h: MIN_HEIGHT,
      w: DEFAULT_WIDTH,
      richText: toRichText('Add comment...'),
    }
  }

  override canEdit = () => true
  override hideSelectionBoundsFg = () => true
  override hideResizeHandles = () => false
  override canResize = () => true
  override hideRotateHandle = () => true

  override component(shape: ShapeType) {
    const isSelected = shape.id === this.editor.getOnlySelectedShapeId()

    return (
      <HTMLContainer
        style={{
          background: GREY,
          border: BORDER,
          padding: '1rem',
          borderRadius: BORDER_RADIUS,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TextLabelWithAutoHeight
          shape={shape}
          isSelected={isSelected}
          padding={PADDING}
          iconHeight={0}
          minHeight={MIN_HEIGHT}
        />
      </HTMLContainer>
    )
  }

  override indicator(shape: ShapeType) {
    return <rect width={shape.props.w} height={shape.props.h} rx="10" ry="10" />
  }
}
