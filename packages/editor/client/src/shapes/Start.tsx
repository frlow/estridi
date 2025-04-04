import {
  BaseBoxShapeUtil,
  HTMLContainer,
  Rectangle2d,
  stopEventPropagation,
} from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape } from './index.ts'
import { BLUE, BORDER, CIRCLE_RADIUS, GREEN } from './util/constants.ts'
import { TransformButton } from './util/TransformButton.tsx'
import { mapTransformations } from './util/util.ts'

const transformationsMap = {
  'start-fe': [
    {
      value: 'end-fe',
      icon: 'end-fe-preview',
      updateProps: (props: any) => ({ h: props.h, w: props.w }),
    },
  ],
  'start-be': [
    {
      value: 'end-be',
      icon: 'end-be-preview',
      updateProps: (props: any) => ({ h: props.h, w: props.w }),
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
      const presetId = shape.id + '-preset'

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
              id={presetId}
              presets={mapTransformations(
                transformationsMap,
                variant,
                shape,
                this.editor,
              )}
            />
          )}
          <div
            style={{
              width: `${CIRCLE_RADIUS}px`,
              height: `${CIRCLE_RADIUS}px`,
              borderRadius: `${CIRCLE_RADIUS}px`,
              border: BORDER,
              background: isFe ? BLUE : GREEN,
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
