import { BaseBoxShapeUtil, HTMLContainer, toRichText } from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape } from './index.ts'
import { TextLabelWithAutoHeight } from './util/TextLabelWithAutoHeight'
import {
  RECTANGLE_DEFAULT_HEIGHT,
  RECTANGLE_DEFAULT_WIDTH,
  RECTANGLE_ICON_HEIGHT,
  RECTANGLE_ICON_PADDING,
} from './util/constants.ts'

function createScriptClass(variant: 'script-fe' | 'script-be') {
  const shapeType = Shapes[variant]
  type ShapeType = BaseShape<typeof shapeType>
  const isFe = variant.includes('fe')

  return class extends BaseBoxShapeUtil<ShapeType> {
    static override type = shapeType.name
    static override props = shapeType.props

    override getDefaultProps(): ShapeType['props'] {
      return {
        h: RECTANGLE_DEFAULT_HEIGHT,
        w: RECTANGLE_DEFAULT_WIDTH,
        richText: toRichText('Script tag..'),
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
              height: 'var(--rectangle-icon-height-px)',
            }}
          >
            <img
              src="/script.svg"
              alt="script"
              draggable={false}
              onError={(e) => {
                console.error(`Failed to load image: /script.svg`, e)
                // Set a fallback background color
                ;(e.target as HTMLImageElement).style.backgroundColor = '#ddd'
              }}
            />
          </div>
          <TextLabelWithAutoHeight
            shape={shape}
            isSelected={isSelected}
            padding={RECTANGLE_ICON_PADDING}
            iconHeight={RECTANGLE_ICON_HEIGHT}
            minHeight={RECTANGLE_DEFAULT_HEIGHT}
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

export const Script = createScriptClass('script-fe')
export const ScriptBe = createScriptClass('script-be')
