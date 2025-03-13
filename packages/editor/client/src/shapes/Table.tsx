import { BaseBoxShapeUtil, useDefaultColorTheme } from 'tldraw'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { Shapes } from 'editor-common'
import { BaseShape } from './index.ts'

const shapeType = Shapes.table
type ShapeType = BaseShape<typeof shapeType>

export default class extends BaseBoxShapeUtil<ShapeType> {
  static override type = shapeType.name
  static override props = shapeType.props

  override canScroll = () => false
  override canEdit = () => true

  override getDefaultProps() {
    return {
      w: 600,
      h: 200,
      rows: []
    }
  }

  override component(shape: ShapeType) {
    const theme = useDefaultColorTheme()
    return <table style={{ background: theme.background, height: "100%",width: "100%", flex: "auto" }}>
      <thead>
      <tr style={{textAlign: "left"}}>{(shape.props.rows[0] || []).map(header => <th>{header}</th>)}</tr>
      </thead>
      <tbody>
      {shape.props.rows.slice(1).map((row, ri) =>
        <tr key={ri}>{row.map(value => <td>{value}</td>)}</tr>)}
      </tbody>
    </table>
  }

  override indicator(shape: ShapeType) {
    return <rect width={shape.props.w} height={shape.props.h} rx={8} ry={8} />
  }
}
