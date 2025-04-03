import {
  BaseBoxShapeUtil,
  HTMLContainer,
  stopEventPropagation,
  TldrawUiButton,
} from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape, baseStyle } from './index.ts'

const shapeType = Shapes['camera-mover']
type ShapeType = BaseShape<typeof shapeType>

export default class extends BaseBoxShapeUtil<ShapeType> {
  static override type = shapeType.name
  static override props = shapeType.props

  override getDefaultProps() {
    return {
      h: 80,
      w: 80,
    }
  }

  override canResize(_shape: ShapeType): boolean {
    return false
  }

  override canEdit(_shape: ShapeType): boolean {
    return false
  }

  override component() {
    const { editor } = this

    const handleClick = (e: React.MouseEvent) => {
      stopEventPropagation(e)
      // Prevent selection
      editor.selectNone()

      // Get current camera position
      const camera = editor.getCamera()

      // Slide the camera 1400px to the right with animation
      editor.setCamera(
        {
          x: camera.x - 1700,
          y: camera.y,
          z: camera.z,
        },
        {
          animation: {
            duration: 800,
            easing: (t) =>
              t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
          },
        },
      )
    }

    const handlePointerDown = (e: React.PointerEvent) => {
      // Allow dragging by letting the event propagate to parent handlers
      if (e.button === 0 && e.buttons === 1) {
        // Only stop propagation if it's not a left mouse button drag
        if (e.altKey || e.metaKey || e.ctrlKey || e.shiftKey) {
          return
        }
      }
      stopEventPropagation(e)
    }

    return (
      <HTMLContainer
        style={{
          ...baseStyle,
          backgroundColor: '#ddecfa',
          border: '2px solid #4ca1f1',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
        onPointerDown={handlePointerDown}
      >
        <TldrawUiButton
          type="icon"
          onClick={handleClick}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            padding: '8px',
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 5L21 12L14 19"
              stroke="#333"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 12H21"
              stroke="#333"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </TldrawUiButton>
      </HTMLContainer>
    )
  }

  override indicator(shape: ShapeType) {
    return <rect width={shape.props.w} height={shape.props.h} rx={8} />
  }
}
