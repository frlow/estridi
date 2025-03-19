import {
  DefaultColorStyle,
  DefaultStylePanel,
  DefaultStylePanelContent,
  DefaultToolbar,
  DefaultToolbarContent,
  TLComponents,
  TLUiAssetUrlOverrides,
  TLUiOverrides,
  useEditor,
  useRelevantStyles,
} from 'tldraw'
import {icons, Shapes, targetStyle, testDirStyle} from 'editor-common'
import { useState } from 'react'

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

    // Always make text black
    tools.text.onSelect = () => {
      editor.setStyleForNextShapes(DefaultColorStyle, 'black')
      editor.setCurrentTool('text')
    }

    Object.values(Shapes).forEach((shape) => {
      tools[shape.name] = {
        id: shape.name,
        icon: shape.icon,
        label: shape.name,
        onSelect: () => editor.setCurrentTool(shape.name),
      }
    })

    return tools
  },
}

const CustomStylePanel = () => {
  const editor = useEditor()
  const styles = useRelevantStyles()
  if (!styles) return null
  const target = styles.get(targetStyle)
    const testDir = styles.get(testDirStyle)
  return (
    <DefaultStylePanel>
      <DefaultStylePanelContent styles={styles} />
      {target !== undefined && (
        <>
          <select
            value={target.type === 'mixed' ? '' : target.value}
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
            <input placeholder="./tests" value={testDir!.type === 'mixed' ? '' : testDir!.value} onChange={e=>{
                editor.markHistoryStoppingPoint()
                const value = testDirStyle.validate(e.currentTarget.value)
                editor.setStyleForSelectedShapes(testDirStyle, value)
            }}/>
        </>
      )}
    </DefaultStylePanel>
  )
}

const shapeGroups: Array<Array<string>> = [
  ['start', 'message', 'gateway', 'connector', 'end'],
  ['serviceCall', 'subprocess', 'script', 'table'],
  ['loop', 'parallel', 'error', 'softError', 'timer'],
  ['userAction', 'signalSend', 'signalListen', 'customNote'],
]

function CustomRightMenu() {
  const editor = useEditor()
  const [hide, setHide] = useState(false)

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
        width: '120px',
      }}
    >
      <div className="tlui-style-panel__section__common">
        <div className="tlui-menu__group">
          <button
            className="tlui-button tlui-button__menu"
            draggable={false}
            style={{
              justifyContent: 'space-between',
              gap: '0.5rem',
              padding: '0.5rem',
              fontWeight: '500',
            }}
            onClick={() => {
              setHide(true)
            }}
          >
            Hide
            <img
              src={`./hide.svg`}
              height="15px"
              style={{ paddingRight: '0.5rem' }}
            />
          </button>
        </div>
        {shapeGroups.map((groupedShapes) => (
          <div key={groupedShapes.join()} className="tlui-menu__group">
            {groupedShapes.map((shapeName) => {
              const shapeData = Shapes[shapeName as keyof typeof Shapes]
              return (
                <button
                  key={shapeName}
                  className="tlui-button tlui-button__menu"
                  draggable={false}
                  style={{
                    justifyContent: 'flex-start',
                    gap: '0.5rem',
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
                    height="18px"
                  />
                  {shapeData.name
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str: string) => str.toUpperCase())}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export const components: TLComponents = {
  StylePanel: CustomStylePanel,
  InFrontOfTheCanvas: CustomRightMenu,
  Toolbar: (props) => {
    return (
      <DefaultToolbar {...props}>
        <DefaultToolbarContent />
      </DefaultToolbar>
    )
  },
}
