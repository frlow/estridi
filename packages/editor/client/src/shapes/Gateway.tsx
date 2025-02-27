import { Geometry2d, HTMLContainer, Rectangle2d, ShapeUtil } from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape } from './index.ts'
import { CSSProperties } from 'react'

const sideSize = 70
const createGatewayClass = (variant: 'gateway' | 'loop') => {
  const shapeType = Shapes[variant]
  type ShapeType = BaseShape<typeof shapeType>
  return class extends ShapeUtil<ShapeType> {
    static override type = shapeType.name
    static override props = shapeType.props

    override getDefaultProps() {
      return {
        h: 0,
        w: 0,
        text: ''
      }
    }

    override getGeometry(_: ShapeType): Geometry2d {
      return new Rectangle2d({
        width: sideSize,
        height: sideSize,
        isFilled: true
      })
    }

    override canResize(_shape: ShapeType): boolean {
      return false
    }

    override component(shape: ShapeType) {
      const style: CSSProperties = { pointerEvents: 'all' }
      return (
        <HTMLContainer style={style}>
          <div>
            <div style={{
              width: sideSize,
              height: sideSize,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{
                width: `${0.7 * sideSize}px`,
                height: `${0.7 * sideSize}px`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '2px solid black',
                borderRadius: '5px',
                background: 'rgba(64,115,177,0.7)',
                transform: 'rotate(45deg)'
              }}>{variant==="loop" && <img src="/loop-white.svg" alt="loop" style={{width: "40px"}} draggable={false}/>}</div>
            </div>
            <div contentEditable={true} style={{ resize: 'none', overflow: 'visible', width: '200px' }}
                 onBlur={(e: any) => {
                   this.editor.updateShape({
                     id: shape.id,
                     type: 'counter',
                     props: { text: e.target.innerHTML }
                   })
                 }}>{shape.props.text}</div>
          </div>
        </HTMLContainer>
      )
    }

    override indicator(_: ShapeType) {
      return <rect width={sideSize} height={sideSize} />
    }
  }
}

export const Gateway = createGatewayClass('gateway')
export const Loop = createGatewayClass('loop')
