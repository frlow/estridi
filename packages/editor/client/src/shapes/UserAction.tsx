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
      text: 'Action!',
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
          <svg
            width="32"
            height="38"
            viewBox="0 0 32 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 36.7075V28.0627C1 23.462 3.67849 19.3 8.5 17.5391C9.89411 17.03 11.6667 16.693 12.6667 16.2742V13.6919C8.70833 11.3342 9.14904 1.00001 16 1.00001C22.851 1.00001 23.7016 10.5483 19.7433 13.6919V16.2742C20.7849 16.693 22.0449 16.874 23.5 17.5391C26.7541 19.0264 31 23.462 31 28.0627V36.7075L24.3333 36.7075L23.7115 30.231V36.7075L8.5 36.7075V30.231L7.97216 36.7075L1 36.7075Z"
              fill="white"
            />
            <path
              d="M8.5 17.5391C3.67849 19.3 1 23.462 1 28.0627V36.7075L7.97216 36.7075L8.5 30.231V36.7075L23.7115 36.7075V30.231L24.3333 36.7075L31 36.7075C31 37.7554 31 36.236 31 28.0627C31 23.462 26.7541 19.0264 23.5 17.5391M8.5 17.5391C9.89411 17.03 11.6667 16.693 12.6667 16.2742V13.6919C8.70833 11.3342 9.14904 1.00001 16 1.00001C22.851 1.00001 23.7016 10.5483 19.7433 13.6919C19.7433 13.6919 19.7433 15.4883 19.7433 16.2742C20.7849 16.693 22.0449 16.874 23.5 17.5391M8.5 17.5391C10.0035 19.3729 9.66667 21.7755 16 21.7755C22.3333 21.7755 21.9167 19.3 23.5 17.5391"
              stroke="black"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M15.9903 5.73298C12.657 4.596 12.1014 5.54349 10.4347 5.73298C10.4347 5.73298 11.5555 1.18506 16 1.18506C20.4445 1.18506 21.5556 5.16449 21.5556 5.16449C19.7037 5.54349 19.3236 6.86997 15.9903 5.73298Z"
              fill="black"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
