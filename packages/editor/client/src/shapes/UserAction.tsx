import { BaseBoxShapeUtil, HTMLContainer, useDefaultColorTheme } from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape, figureStyles } from './index.ts'

const shapeType = Shapes.userAction
type ShapeType = BaseShape<typeof shapeType>

const DEFAULT_WIDTH = 400
const MIN_HEIGHT = 150

export default class extends BaseBoxShapeUtil<ShapeType> {
  static override type = shapeType.name
  static override props = shapeType.props

  override getDefaultProps(): ShapeType['props'] {
    return {
      h: MIN_HEIGHT,
      w: DEFAULT_WIDTH,
      color: 'light-blue',
    }
  }

  override canEdit = () => true
  override hideSelectionBoundsFg = () => true
  override hideResizeHandles = () => false
  override canResize = () => true

  override component(shape: ShapeType) {
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
          <img src="./user-action.svg" alt="user-action" />
        </div>

        <div
          className="tl-text-label tl-text-wrapper"
          data-font="sans"
          style={{
            justifyContent: 'top',
            alignItems: 'flex-start',
            position: 'relative',
            textShadow: 'none',
            fontSize: '18px',
          }}
        >
          Action
        </div>
      </HTMLContainer>
    )
  }

  override indicator(shape: ShapeType) {
    return <rect width={shape.props.w} height={shape.props.h} />
  }
}
