import {
  BaseBoxShapeUtil,
  HTMLContainer,
  Rectangle2d,
  stopEventPropagation,
} from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape } from './index.ts'
import { CIRCLE_RADIUS } from './util/constants.ts'
import { ShapeMenus } from './util/ShapeMenus.tsx'

const transformationMap = {
  'end-fe': [
    {
      value: 'start-fe',
      icon: 'start-fe-preview',
      addProps: {
        target: 'playwright',
      },
    },
  ],
  'end-be': [
    {
      value: 'start-be',
      icon: 'start-be-preview',
      addProps: {
        target: 'vitest',
      },
    },
  ],
}

function createStartClass(variant: 'end-fe' | 'end-be') {
  const shapeType = Shapes[variant]
  type ShapeType = BaseShape<typeof shapeType>
  const isFe = variant.includes('fe')

  return class extends BaseBoxShapeUtil<ShapeType> {
    static override type = shapeType.name
    static override props = shapeType.props

    override getDefaultProps(): ShapeType['props'] {
      return {
        h: CIRCLE_RADIUS,
        w: CIRCLE_RADIUS,
      }
    }

    override canEdit = () => false
    override canResize = () => false
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
      const presetId = shape.id + '-preset-button'
      const selectMenuId = shape.id + '-select-menu'

      return (
        <HTMLContainer
          style={{ pointerEvents: isSelected ? 'all' : 'none' }}
          onPointerDown={(e) => {
            const target = e.target as HTMLElement
            if (
              target.id === presetId ||
              target.closest(`#${CSS.escape(presetId)}`) ||
              target.id === selectMenuId ||
              target.closest(`#${CSS.escape(selectMenuId)}`)
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
            isFe={isFe}
            editor={this.editor}
            transformationMap={transformationMap[variant]}
          />
          <div
            style={{
              width: 'var(--circle-radius-px)',
              height: 'var(--circle-radius-px)',
              borderRadius: 'var(--circle-radius-px)',
              border: 'var(--end-border)',
              background: isFe ? 'var(--primary-blue)' : 'var(--primary-green)',
            }}
          ></div>
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

export const EndFe = createStartClass('end-fe')
export const EndBe = createStartClass('end-be')
