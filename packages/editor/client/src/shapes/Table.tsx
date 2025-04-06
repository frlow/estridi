import {
  BaseBoxShapeUtil,
  useDefaultColorTheme,
  stopEventPropagation,
  HTMLContainer,
} from 'tldraw'

import { Shapes } from 'editor-common'
import { BaseShape } from './index.ts'
import { useEffect, useRef } from 'react'

const tableControlButtonStyles = `
  .table-control-button {
    transition: opacity 0.2s, background-color 0.2s;
  }
  .table-control-button:hover {
    background-color: #2a8c5a !important;
  }
`

interface TableControlButtonProps {
  onClick: () => void
  children: React.ReactNode
  style?: React.CSSProperties
}

const TableControlButton = ({
  onClick,
  children,
  style,
}: TableControlButtonProps) => (
  <>
    <style>{tableControlButtonStyles}</style>
    <button
      onClick={onClick}
      className="table-control-button"
      style={{
        background: '#3cb371',
        color: 'black',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        padding: 0,
        ...style,
      }}
    >
      {children}
    </button>
  </>
)

interface TableControlGroupProps {
  orientation: 'vertical' | 'horizontal'
  onAdd: () => void
  onRemove: () => void
  style?: React.CSSProperties
}

const TableControlGroup = ({
  orientation,
  onAdd,
  onRemove,
  style,
}: TableControlGroupProps) => {
  const isVertical = orientation === 'vertical'
  const buttonSize = isVertical
    ? { width: '20px', height: '25px' }
    : { width: '35px', height: '20px' }

  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'row',
        background: '#3cb371',
        borderRadius: '1rem',
        overflow: 'hidden',
        ...style,
      }}
    >
      <TableControlButton
        onClick={onAdd}
        style={{
          ...buttonSize,
          [isVertical ? 'borderBottom' : 'borderRight']:
            '1px solid rgba(255,255,255,0.2)',
        }}
      >
        +
      </TableControlButton>
      <TableControlButton onClick={onRemove} style={buttonSize}>
        -
      </TableControlButton>
    </div>
  )
}

function createTableClass(variant: 'table-fe' | 'table-be') {
  const shapeType = Shapes[variant]
  type ShapeType = BaseShape<typeof shapeType>
  const isFe = variant.includes('fe')

  return class extends BaseBoxShapeUtil<ShapeType> {
    static override type = shapeType.name
    static override props = shapeType.props

    override canScroll = () => false
    override canEdit = () => true
    override hideRotateHandle = () => true

    override getDefaultProps() {
      return {
        w: isFe ? 400 : 350,
        h: isFe ? 140 : 100,
        rows: isFe
          ? [
              ['Label', 'Component type', 'Properties', 'Special requirements'],
              ['Label', 'Component type', 'Properties', 'Special requirements'],
            ]
          : [
              ['Code', 'Message'],
              ['100', 'System error'],
            ],
      }
    }

    override component(shape: ShapeType) {
      const theme = useDefaultColorTheme()
      const editor = this.editor
      const isEditing = editor.getEditingShapeId() === shape.id
      const tableRef = useRef<HTMLTableElement>(null)
      const firstRender = useRef(true)

      useEffect(() => {
        if (tableRef.current && !firstRender.current) {
          const table = tableRef.current
          editor.updateShape({
            id: shape.id,
            type: shapeType.name,
            props: {
              ...shape.props,
              h: table.offsetHeight,
              w: table.offsetWidth,
            },
          })
        }
        firstRender.current = false
      }, [shape.props.rows])

      const handleCellEdit = (
        value: string,
        rowIndex: number,
        colIndex: number,
      ) => {
        const newRows = shape.props.rows.map((row, ri) =>
          ri === rowIndex
            ? row.map((cell, ci) => (ci === colIndex ? value : cell))
            : row,
        )

        editor.updateShapes([
          {
            id: shape.id,
            type: shape.type,
            props: {
              ...shape.props,
              rows: newRows,
            },
          },
        ])
      }

      return (
        <HTMLContainer
          style={{
            width: shape.props.w,
            height: shape.props.h,
            pointerEvents: isEditing ? 'all' : undefined,
            position: 'relative',
          }}
          onPointerDown={isEditing ? stopEventPropagation : undefined}
        >
          {isEditing && (
            <div
              style={{
                position: 'absolute',
                top: '-24px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#3cb371',
                color: 'black',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              editing
            </div>
          )}
          <table
            ref={tableRef}
            style={{
              background: theme.background,
              height: '100%',
              width: '100%',
              flex: 'auto',
              borderCollapse: 'separate',
              borderRadius: '8px',
              overflow: 'hidden',
              border: `2px solid ${isEditing ? '#3cb371' : '#cccccc'}`,
              borderSpacing: 0,
              boxShadow: isEditing
                ? '0 0 0 2px rgba(60, 179, 113, 0.2)'
                : 'none',
              transition: 'border-color 0.5s, box-shadow 0.5s',
              fontSize: '1rem',
            }}
          >
            <thead>
              <tr style={{ textAlign: 'left' }}>
                {(shape.props.rows[0] || []).map((header, colIndex) => {
                  return (
                    <th
                      key={colIndex}
                      style={{
                        padding: '8px',
                        borderRight:
                          colIndex === shape.props.rows[0].length - 1
                            ? 'none'
                            : '1px solid #ccc',
                        borderBottom: '1px solid #ccc',
                        background: '#f0f0f0',
                      }}
                    >
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onClick={() => handleCellEdit(header, 0, colIndex)}
                        style={{
                          minHeight: '1em',
                          outline: 'none',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {header}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {shape.props.rows.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((value, colIndex) => (
                    <td
                      key={colIndex}
                      style={{
                        padding: '8px',
                        borderRight:
                          colIndex === row.length - 1
                            ? 'none'
                            : '1px solid #ccc',
                        borderBottom:
                          rowIndex === shape.props.rows.length - 2
                            ? 'none'
                            : '1px solid #ccc',
                      }}
                    >
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleCellEdit(
                            e.target.textContent || '',
                            rowIndex + 1,
                            colIndex,
                          )
                        }
                        style={{
                          minHeight: '1em',
                          outline: 'none',
                          cursor: isEditing ? 'text' : 'default',
                        }}
                      >
                        {value}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {isEditing && (
            <>
              <TableControlGroup
                orientation="vertical"
                style={{
                  top: '10px',
                  right: '-25px',
                }}
                onAdd={() => {
                  const newRows = [...shape.props.rows]
                  newRows[0] = newRows[0].concat('Column')
                  newRows.forEach((_, i) => {
                    if (i !== 0) {
                      newRows[i] = newRows[i].concat('')
                    }
                  })

                  editor.updateShape({
                    type: shapeType.name,
                    id: shape.id,
                    props: {
                      ...shape.props,
                      rows: newRows,
                    },
                  })
                }}
                onRemove={() => {
                  if (shape.props.rows[0].length <= 1) return
                  const newRows = shape.props.rows.map((row) =>
                    row.slice(0, -1),
                  )

                  editor.updateShape({
                    type: shapeType.name,
                    id: shape.id,
                    props: {
                      ...shape.props,
                      rows: newRows,
                    },
                  })
                }}
              />
              <TableControlGroup
                orientation="horizontal"
                style={{
                  bottom: '-24px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
                onAdd={() => {
                  const newRows = [...shape.props.rows]
                  const emptyRow = Array(shape.props.rows[0].length).fill('')
                  newRows.push(emptyRow)

                  editor.updateShape({
                    type: shapeType.name,
                    id: shape.id,
                    props: {
                      ...shape.props,
                      rows: newRows,
                    },
                  })
                }}
                onRemove={() => {
                  if (shape.props.rows.length <= 2) return
                  const newRows = shape.props.rows.slice(0, -1)

                  editor.updateShape({
                    type: shapeType.name,
                    id: shape.id,
                    props: {
                      ...shape.props,
                      rows: newRows,
                    },
                  })
                }}
              />
            </>
          )}
        </HTMLContainer>
      )
    }

    override indicator(shape: ShapeType) {
      return <rect width={shape.props.w} height={shape.props.h} rx={8} ry={8} />
    }
  }
}

export const TableFE = createTableClass('table-fe')
export const TableBE = createTableClass('table-be')
