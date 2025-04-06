import {
  DefaultStylePanel,
  DefaultStylePanelContent,
  DefaultColorStyle,
  DefaultToolbar,
  DefaultToolbarContent,
  TLComponents,
  TLUiAssetUrlOverrides,
  TLUiOverrides,
  useEditor,
  useRelevantStyles,
  TLUiStylePanelProps,
  DefaultFontStyle,
} from 'tldraw'
import { icons, Shapes, targetStyle } from 'editor-common'
import { useEffect, useState } from 'react'
export const customAssetUrls: TLUiAssetUrlOverrides = {
  icons,
}

export const uiOverrides: TLUiOverrides = {
  tools(editor, tools) {
    // Always make arrows black
    tools.arrow.onSelect = () => {
      editor.setStyleForNextShapes(DefaultColorStyle, 'black')
      editor.setCurrentTool('arrow')
    }

    // Always make text black and use sans font
    tools.text.onSelect = () => {
      editor.setStyleForNextShapes(DefaultColorStyle, 'black')
      editor.setStyleForNextShapes(DefaultFontStyle, 'sans')
      editor.setCurrentTool('text')
    }

    // Set default font for all tools
    editor.setStyleForNextShapes(DefaultFontStyle, 'sans')

    Object.values(Shapes).forEach((shape) => {
      tools[shape.name] = {
        id: shape.name,
        icon: shape.icon,
        label: shape.name,
        onSelect: () => {
          editor.setStyleForNextShapes(DefaultFontStyle, 'sans')
          editor.setCurrentTool(shape.name)
        },
      }
    })

    return tools
  },
}

const CustomStylePanel = (props: TLUiStylePanelProps) => {
  const editor = useEditor()
  const styles = useRelevantStyles()

  // Get the current tool
  const currentTool = editor.getCurrentTool()
  const currentToolId = currentTool.id

  // Standard creation tools where we want to show the style panel immediately
  const creationTools = [
    'geo',
    'draw',
    'arrow',
    'line',
    'text',
    'note',
    'frame',
    'start-fe',
    'start-be',
  ]
  const isInCreationTool = creationTools.includes(currentToolId)

  // Check if any selected shape is a default shape (not in our custom Shapes)
  const selectedShapes = editor.getSelectedShapes()
  const hasDefaultShape =
    selectedShapes.length > 0 &&
    selectedShapes.some(
      (shape) => !Object.values(Shapes).some((s) => s.name === shape.type),
    )

  // Show the style panel if we're using a creation tool or have a default shape selected
  if (!styles || (!hasDefaultShape && !isInCreationTool)) return null

  const target = styles.get(targetStyle)

  // Custom CSS to hide the opacity slider
  const hideOpacityStyle = `
    .tlui-slider__container {
      display: none !important;
    }
  `

  return (
    <>
      <style>{hideOpacityStyle}</style>
      <DefaultStylePanel {...props}>
        <DefaultStylePanelContent styles={styles} />
        {target !== undefined && (
          <select
            value={target.type === 'mixed' ? undefined : target.value}
            onChange={(e) => {
              editor.markHistoryStoppingPoint()
              const value = targetStyle.validate(e.currentTarget.value)
              editor.setStyleForSelectedShapes(targetStyle, value)
            }}
          >
            {targetStyle.values.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        )}
      </DefaultStylePanel>
    </>
  )
}

const backendShapeGroups: Array<Array<string>> = [
  ['start-be', 'gateway-be', 'connector'],
  ['service-call-be', 'error', 'signal-send-be', 'signal-listen-be'],
  ['subprocess-be', 'script-be', 'table-be', 'custom-note', 'database'],
  ['loop-be', 'parallel-be', 'timer-be', 'frame'],
  ['not-started', 'in-progress', 'dev-done'],
]

const frontendShapeGroups: Array<Array<string>> = [
  ['start-fe', 'message', 'gateway-fe', 'connector'],
  ['user-action', 'signal-send-fe', 'signal-listen-fe'],
  ['service-call-fe', 'subprocess-fe', 'script-fe', 'table-fe'],
  ['loop-fe', 'parallel-fe', 'timer-fe', 'custom-note', 'frame'],
  ['not-started', 'in-progress', 'dev-done'],
]

function CustomLeftMenu() {
  const editor = useEditor()
  const [hide, setHide] = useState(false)
  const [backend, setBackend] = useState(false)
  const [currentTool, setCurrentTool] = useState(editor.getCurrentTool().id)

  useEffect(() => {
    const listener = () => {
      setCurrentTool(editor.getCurrentTool().id)
    }
    editor.addListener('change', listener)
    return () => {
      editor.removeListener('change', listener)
    }
  }, [editor])

  if (hide) {
    return (
      <div
        className="tlui-style-panel tlui-style-panel__wrapper"
        style={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          left: 0,
          marginLeft: '0',
          borderBottomLeftRadius: '0',
          borderTopLeftRadius: '0',
          width: '40px',
          height: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <button
          className="tlui-button tlui-button__menu"
          draggable={false}
          onClick={() => {
            setHide(false)
          }}
        >
          <img
            src={`./hide.svg`}
            height="15px"
            style={{ transform: 'scaleX(-1)' }}
            onError={(e) => {
              console.error(`Failed to load image: hide.svg`, e)
              // Set a fallback background color
              ;(e.target as HTMLImageElement).style.backgroundColor = '#ddd'
            }}
          />
        </button>
      </div>
    )
  }

  return (
    <div
      className="tlui-style-panel tlui-style-panel__wrapper"
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        left: 0,
        height: 'auto',
        marginLeft: '0',
        borderBottomLeftRadius: '0',
        borderTopLeftRadius: '0',
        width: '130px',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <div className="tlui-style-panel__section__common">
        <div className="tlui-menu__group">
          <div className="switch-wrapper">
            <div className="switch-container">
              <input
                checked={backend}
                onChange={() => setBackend(!backend)}
                className="switch-checkbox"
                id={'switch'}
                type="checkbox"
                aria-label={'toggle backend/frontend'}
                role="switch"
                aria-checked={backend}
              />
              <label
                style={{ background: backend ? '#85C74E' : '' }}
                className="switch-label"
                htmlFor={'switch'}
              >
                <span className="switch-button" />
              </label>
            </div>
            <label className="switch-text-label" htmlFor={'switch'}>
              {backend ? 'Backend' : 'Frontend'}
            </label>
          </div>
        </div>
        {(backend ? backendShapeGroups : frontendShapeGroups).map(
          (groupedShapes) => (
            <div key={groupedShapes.join()} className="tlui-menu__group">
              {groupedShapes.map((shapeName) => {
                const shapeData = Shapes[shapeName as keyof typeof Shapes]
                return (
                  <button
                    key={shapeName}
                    className={`tlui-button tlui-button__menu ${currentTool === shapeData.name ? 'tlui-button__menu--active' : ''}`}
                    draggable={false}
                    style={{
                      justifyContent: 'flex-start',
                      gap: '0.8rem',
                      padding: '0.5rem',
                      fontWeight: '500',
                    }}
                    onClick={() => {
                      editor.setCurrentTool(shapeData.name)
                    }}
                  >
                    <img
                      src={`./${shapeData.icon}.svg`}
                      alt={shapeData.name}
                      height="20px"
                      width="20px"
                      draggable={false}
                      onError={(e) => {
                        console.error(
                          `Failed to load image: ${shapeData.icon}.svg`,
                          e,
                        )
                        // Set a fallback background color
                        ;(e.target as HTMLImageElement).style.backgroundColor =
                          '#ddd'
                      }}
                    />
                    {shapeData.name
                      .replace(/be|fe/g, '')
                      .replace(/-/g, ' ')
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str: string) => str.toUpperCase())}
                  </button>
                )
              })}
            </div>
          ),
        )}
        <div className="tlui-menu__group">
          <button
            className="tlui-button tlui-button__menu"
            draggable={false}
            style={{
              justifyContent: 'flex-start',
              gap: '0.8rem',
              padding: '0.5rem',
              fontWeight: '500',
            }}
            onClick={() => {
              setHide(true)
            }}
          >
            <img
              src={`./hide.svg`}
              height="20px"
              onError={(e) => {
                console.error(`Failed to load image: hide.svg`, e)
                // Set a fallback background color
                ;(e.target as HTMLImageElement).style.backgroundColor = '#ddd'
              }}
            />
            Hide menu
          </button>
        </div>
      </div>
    </div>
  )
}

export const components: TLComponents = {
  StylePanel: CustomStylePanel,
  InFrontOfTheCanvas: () => {
    return (
      <>
        <CustomLeftMenu />
      </>
    )
  },
  Toolbar: (props) => {
    return (
      <DefaultToolbar {...props}>
        <DefaultToolbarContent />
      </DefaultToolbar>
    )
  },
}
