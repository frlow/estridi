import {
  BaseBoxShapeUtil,
  HTMLContainer,
  Rectangle2d,
  stopEventPropagation,
} from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape } from './index.ts'
import { ShapeMenus } from './util/ShapeMenus.tsx'

const CIRCLE_RADIUS = 90

const transformationMap = {
  error: [{ value: 'soft-error', icon: 'soft-error-preview' }],
  'soft-error': [{ value: 'error', icon: 'hard-error-preview' }],
}

function createStartClass(variant: 'error' | 'soft-error') {
  const shapeType = Shapes[variant]
  type ShapeType = BaseShape<typeof shapeType>

  return class extends BaseBoxShapeUtil<ShapeType> {
    static override type = shapeType.name
    static override props = shapeType.props

    override getDefaultProps(): ShapeType['props'] {
      return {
        w: CIRCLE_RADIUS,
        h: CIRCLE_RADIUS,
        text: '',
      }
    }

    override canEdit = () => true
    override canResize = () => false
    override hideSelectionBoundsBg = () => true
    override hideSelectionBoundsFg = () => true

    override getGeometry() {
      return new Rectangle2d({
        width: CIRCLE_RADIUS,
        height: CIRCLE_RADIUS,
        isFilled: true,
      })
    }

    override component(shape: ShapeType) {
      const isSelected = shape.id === this.editor.getOnlySelectedShapeId()
      const isEditing = shape.id === this.editor.getEditingShapeId()
      const selectMenuId = shape.id + '-select-menu'
      const presetId = shape.id + '-preset-button'

      return (
        <HTMLContainer
          style={{ pointerEvents: isSelected ? 'all' : 'none' }}
          onPointerDown={(e) => {
            const target = e.target as HTMLElement
            if (
              target.id === presetId ||
              target.closest(`#${CSS.escape(presetId)}`)
            ) {
              stopEventPropagation(e)
            }
          }}
        >
          <ShapeMenus
            isSelected={isSelected}
            isEditing={isEditing}
            presetId={presetId}
            selectMenuId={selectMenuId}
            shape={shape}
            isFe={false}
            editor={this.editor}
            transformationMap={transformationMap[variant]}
          />
          <div
            style={{
              width: 'var(--circle-radius-px)',
              height: 'var(--circle-radius-px)',
              borderRadius: 'var(--circle-radius-px)',
              border: {
                error: 'var(--border)',
                'soft-error': 'var(--inter-border)',
              }[variant],
              background: 'var(--primary-green)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img height="60px" draggable={false} src={'/error.svg'} />
          </div>
        </HTMLContainer>
      )
    }

    override indicator() {
      return (
        <circle
          cx={CIRCLE_RADIUS / 2}
          cy={CIRCLE_RADIUS / 2}
          r={Math.min(CIRCLE_RADIUS, CIRCLE_RADIUS) / 2}
        />
      )
    }
  }
}

export const HardError = createStartClass('error')
export const SoftError = createStartClass('soft-error')
