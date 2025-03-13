import { BaseBoxShapeUtil, HTMLContainer, useDefaultColorTheme } from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape, figureStyles } from './index.ts'
import { TextLabelWithAutoHeight } from './util/TextLabelWithAutoHeight'

const shapeType = Shapes.script
type ShapeType = BaseShape<typeof shapeType>

const DEFAULT_WIDTH = 300
const MIN_HEIGHT = 150
const PADDING = 16
const ICON_HEIGHT = 36

export default class extends BaseBoxShapeUtil<ShapeType> {
  static override type = shapeType.name
  static override props = shapeType.props

  override getDefaultProps(): ShapeType['props'] {
    return {
      h: MIN_HEIGHT,
      w: DEFAULT_WIDTH,
      text: 'Script tag..',
      color: 'light-blue',
    }
  }

  override canEdit = () => true
  override hideSelectionBoundsFg = () => true
  override hideResizeHandles = () => false
  override canResize = () => true

  override component(shape: ShapeType) {
    const isSelected = shape.id === this.editor.getOnlySelectedShapeId()
    const theme = useDefaultColorTheme()

    return (
      <HTMLContainer
        style={{
          background: theme[shape.props.color].solid,
          border: figureStyles.border,
          padding: '1rem',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div>
          <img src="/script.svg" alt="script" draggable={false} />
        </div>
        <TextLabelWithAutoHeight
          shape={shape}
          isSelected={isSelected}
          padding={PADDING}
          iconHeight={ICON_HEIGHT}
          minHeight={MIN_HEIGHT}
        />
      </HTMLContainer>
    )
  }

  override indicator(shape: ShapeType) {
    return <rect width={shape.props.w} height={shape.props.h} rx="10" ry="10" />
  }
}
