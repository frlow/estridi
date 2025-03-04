import { BaseBoxShapeUtil, useDelaySvgExport } from 'tldraw'
import { Shapes } from 'editor-common'
import { BaseShape } from './index.ts'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, ClientSideRowModelModule } from 'ag-grid-community'

ModuleRegistry.registerModules([ClientSideRowModelModule])

const shapeType = Shapes.table
type ShapeType = BaseShape<typeof shapeType>

export default class extends BaseBoxShapeUtil<ShapeType> {
  static override type = shapeType.name
  static override props = shapeType.props

  getDefaultProps() {
    return {
      h: 300,
      w: 400,
      text: '',
      rows: [
        { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
        { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
        { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
      ],
      columns: [
        { field: 'make', filter: true, floatingFilter: true, flex: 1 },
        { field: 'model', flex: 1 },
        { field: 'price', filter: true, floatingFilter: true, flex: 1 },
        { field: 'electric', flex: 1 },
      ],
    }
  }

  override canScroll(): boolean {
    return true
  }

  override canEdit(): boolean {
    return true
  }

  override canResize(): boolean {
    return false
  }

  override component(shape: ShapeType) {
    const isEditing = this.editor.getEditingShapeId() === shape.id
    const isReady = useDelaySvgExport()

    return (
      <div
        style={{
          width: shape.props.w,
          height: shape.props.h,
          pointerEvents: isEditing ? 'all' : undefined,
        }}
        className="ag-theme-quartz"
      >
        <AgGridReact
          onGridReady={isReady}
          rowData={shape.props.rows}
          columnDefs={shape.props.columns}
          autoSizeStrategy={{ type: 'fitGridWidth' }}
        />
      </div>
    )
  }

  override indicator(shape: ShapeType) {
    return <rect width={shape.props.w} height={shape.props.h} rx={8} ry={8} />
  }
}
