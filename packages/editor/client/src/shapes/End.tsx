import {
  BaseBoxShapeUtil,
  HTMLContainer,
  Rectangle2d,
  stopEventPropagation,
} from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape } from './index.ts'
import { CIRCLE_RADIUS } from './util/constants.ts'
import { TransformButton } from './util/TransformButton'
import { mapTransformations } from './util/util.ts'

const transformationMap = {
  'end-fe': [
    {
      value: 'start-fe',
      icon: 'start-fe-preview',
      updateProps: (props: any) => ({
        h: props.h,
        w: props.w,
        target: 'playwright',
      }),
    },
  ],
  'end-be': [
    {
      value: 'start-be',
      icon: 'start-be-preview',
      updateProps: (props: any) => ({
        h: props.h,
        w: props.w,
        target: 'vitest',
      }),
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
      const presetId = shape.id + '-preset-button'

      return (
        <HTMLContainer
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
          {isSelected && (
            <TransformButton
              id={`${shape.id}-preset-button`}
              presets={mapTransformations(
                transformationMap,
                variant,
                shape,
                this.editor,
              )}
            />
          )}
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
