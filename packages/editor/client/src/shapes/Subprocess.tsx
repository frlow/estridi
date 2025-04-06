import { BaseBoxShapeUtil, HTMLContainer, toRichText } from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape } from './index.ts'
import { TextLabelWithAutoHeight } from './util/TextLabelWithAutoHeight.tsx'

const DEFAULT_WIDTH = 300
const MIN_HEIGHT = 150
const PADDING = 16
const ICON_HEIGHT = 36

function createSubprocessClass(variant: 'subprocess-fe' | 'subprocess-be') {
  const shapeType = Shapes[variant]
  type ShapeType = BaseShape<typeof shapeType>
  const isFe = variant.includes('fe')

  return class extends BaseBoxShapeUtil<ShapeType> {
    static override type = shapeType.name
    static override props = shapeType.props

    override getDefaultProps(): ShapeType['props'] {
      return {
        h: MIN_HEIGHT,
        w: DEFAULT_WIDTH,
        richText: toRichText('Sub process'),
      }
    }

    override canEdit = () => true
    override hideSelectionBoundsFg = () => true
    override hideResizeHandles = () => false
    override canResize = () => true

    override component(shape: ShapeType) {
      const isSelected = shape.id === this.editor.getOnlySelectedShapeId()

      return (
        <HTMLContainer
          style={{
            background: isFe ? 'var(--primary-blue)' : 'var(--primary-green)',
            border: 'var(--border)',
            padding: '1rem',
            borderRadius: 'var(--border-radius-px)',
            pointerEvents: isSelected ? 'all' : 'none',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: `${ICON_HEIGHT}px`,
            }}
          >
            <img
              src="./sub-process.svg"
              alt="subprocess"
              onError={(e) => {
                console.error(`Failed to load image: ./sub-process.svg`, e)
                // Set a fallback background color
                ;(e.target as HTMLImageElement).style.backgroundColor = '#ddd'
              }}
            />
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
      return (
        <rect width={shape.props.w} height={shape.props.h} rx="10" ry="10" />
      )
    }
  }
}

export const SubprocessFE = createSubprocessClass('subprocess-fe')
export const SubprocessBE = createSubprocessClass('subprocess-be')
