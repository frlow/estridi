import {
  BaseBoxShapeUtil,
  HTMLContainer,
  Rectangle2d,
  stopEventPropagation,
} from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape } from './index.ts'
import { CIRCLE_RADIUS } from './util/constants'
import { ShapeMenus } from './util/ShapeMenus.tsx'

const transformationMap = {
  'start-fe': [
    {
      value: 'end-fe',
      icon: 'end-fe-preview',
      filterProps: (props: any) => ({ h: props.h, w: props.w }),
    },
  ],
  'start-be': [
    {
      value: 'end-be',
      icon: 'end-be-preview',
      filterProps: (props: any) => ({ h: props.h, w: props.w }),
    },
  ],
}

function createStartClass(variant: 'start-fe' | 'start-be') {
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
        target: isFe ? 'playwright' : 'vitest',
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
      const selectMenuId = shape.id + '-select-menu'
      const presetId = shape.id + '-preset'

      return (
        <HTMLContainer
          style={{ pointerEvents: isSelected ? 'all' : 'none' }}
          onPointerDown={(e) => {
            const target = e.target as HTMLElement
            const elementId = target.id
            const isMenuElement =
              elementId === presetId ||
              elementId === selectMenuId ||
              target.closest(`#${CSS.escape(presetId)}`) ||
              target.closest(`#${CSS.escape(selectMenuId)}`)

            if (isMenuElement) {
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
              border: 'var(--border)',
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

export const StartFE = createStartClass('start-fe')
export const StartBE = createStartClass('start-be')
