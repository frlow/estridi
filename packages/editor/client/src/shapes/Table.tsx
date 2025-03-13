import {
  BaseBoxShapeUtil,
  HTMLContainer,
  stopEventPropagation,
  TldrawUiButton,
  TldrawUiButtonLabel,
  TldrawUiDialogBody,
  TldrawUiDialogCloseButton,
  TldrawUiDialogFooter,
  TldrawUiDialogHeader,
  TldrawUiDialogTitle,
  TldrawUiInput,
  useDialogs,
} from 'tldraw'
import { useMemo, useRef, useState } from 'react'
import {
  AllCommunityModule,
  ColDef,
  ColumnVisibleEvent,
  ModuleRegistry,
  provideGlobalGridOptions,
} from 'ag-grid-community'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { Shapes } from 'editor-common'
import { BaseShape } from './index.ts'
import { AgGridReact } from 'ag-grid-react'

provideGlobalGridOptions({ theme: 'legacy' })
ModuleRegistry.registerModules([AllCommunityModule])

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
      columns: [],
      rows: [],
    }
  }
  override component(shape: ShapeType) {
    const editor = this.editor
    const isEditing = editor.getEditingShapeId() === shape.id
    const dialog = useDialogs()
    const gridRef = useRef<AgGridReact<any>>(null)

    const defaultColDef = useMemo<ColDef>(() => {
      return {
        editable: true,
        wrapText: true,
        autoHeight: true,
      }
    }, [])

    function MyDialog({ onClose }: { onClose(): void }) {
      const [value, setValue] = useState('')

      return (
        <div className="tlui-dialog__content">
          <TldrawUiDialogHeader>
            <TldrawUiDialogTitle>Column name</TldrawUiDialogTitle>
            <TldrawUiDialogCloseButton />
          </TldrawUiDialogHeader>
          <TldrawUiDialogBody
            className="tlui-dialog__body"
            style={{ maxWidth: 350 }}
          >
            <TldrawUiInput onValueChange={setValue} />
          </TldrawUiDialogBody>
          <TldrawUiDialogFooter className="tlui-dialog__footer__actions">
            <TldrawUiButton type="primary" onClick={onClose}>
              <TldrawUiButtonLabel>Close</TldrawUiButtonLabel>
            </TldrawUiButton>
            <TldrawUiButton
              type="primary"
              onClick={() => {
                editor.updateShape({
                  type: shapeType.name,
                  id: shape.id,
                  props: {
                    ...shape.props,
                    w: shape.props.w + 200,
                    columns: [...shape.props.columns, value],
                  },
                })
                dialog.removeDialog('add-column')
              }}
            >
              <TldrawUiButtonLabel>Add</TldrawUiButtonLabel>
            </TldrawUiButton>
          </TldrawUiDialogFooter>
        </div>
      )
    }

    return (
      <HTMLContainer
        onPointerDown={isEditing ? stopEventPropagation : undefined}
      >
        <div
          className="ag-theme-quartz"
          style={{
            width: shape.props.w,
            height: shape.props.h,
            pointerEvents: isEditing ? 'all' : undefined,
          }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={shape.props.rows.map((r: object) => ({ ...r }))}
            columnDefs={shape.props.columns.map((c) => ({
              field: c,
              editable: true,
            }))}
            rowHeight={38}
            autoSizeStrategy={{
              type: 'fitGridWidth',
              defaultMinWidth: 100,
            }}
            onColumnVisible={(e: ColumnVisibleEvent) => {
              if (!e.visible) {
                editor.updateShape({
                  type: shapeType.name,
                  id: shape.id,
                  props: {
                    ...shape.props,
                    columns: shape.props.columns.filter(
                      (c) => c !== e.column?.getColDef().field,
                    ),
                  },
                })
              }
            }}
            defaultColDef={defaultColDef}
            singleClickEdit={true}
            onCellValueChanged={(e) => {
              const { data, rowIndex } = e
              editor.updateShape({
                type: shapeType.name,
                id: shape.id,
                props: {
                  ...shape.props,
                  rows: shape.props.rows.map((row: object, index: number) =>
                    index === rowIndex ? data : row,
                  ),
                },
              })
            }}
          />
        </div>
        {isEditing && (
          <div style={{ display: 'flex' }}>
            <TldrawUiButton
              onClick={() => {
                editor.updateShape({
                  type: shapeType.name,
                  id: shape.id,
                  props: {
                    ...shape.props,
                    rows: [
                      ...shape.props.rows,
                      shape.props.columns.reduce<{ [key: string]: any }>(
                        (acc, col) => {
                          acc[col] = ''
                          return acc
                        },
                        {},
                      ),
                    ],
                  },
                })
              }}
              className="ag-theme-quartz"
              type="normal"
            >
              Add row
            </TldrawUiButton>
            <TldrawUiButton
              onClick={() => {
                dialog.addDialog({
                  id: 'add-column',
                  component: MyDialog,
                })
              }}
              className="ag-theme-quartz"
              type="normal"
            >
              Add column
            </TldrawUiButton>
          </div>
        )}
      </HTMLContainer>
    )
  }

  override indicator(shape: ShapeType) {
    return <rect width={shape.props.w} height={shape.props.h} rx={8} ry={8} />
  }
}
