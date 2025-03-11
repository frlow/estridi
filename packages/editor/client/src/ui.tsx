import {
  DefaultStylePanel,
  DefaultStylePanelContent,
  DefaultToolbar,
  DefaultToolbarContent,
  TLComponents,
  TldrawUiMenuItem,
  TLUiAssetUrlOverrides,
  TLUiOverrides,
  useEditor,
  useIsToolSelected,
  useRelevantStyles,
  useTools
} from 'tldraw'
import { icons, ShapeNames, Shapes, targetStyle } from 'editor-common'

export const customAssetUrls: TLUiAssetUrlOverrides = {
  icons
}

export const uiOverrides: TLUiOverrides = {
  tools(editor, tools) {
    Object.values(Shapes).forEach((shape) => {
      tools[shape.name] = {
        id: shape.name,
        icon: shape.icon,
        label: shape.name,
        onSelect: () => editor.setCurrentTool(shape.name)
      }
    })

    return tools
  }
}

export const TargetSelector = () => {

}

const CustomStylePanel = () => {
  const editor = useEditor()
  const styles = useRelevantStyles()
  if (!styles) return null
  const target = styles.get(targetStyle)
  return <DefaultStylePanel>
    <DefaultStylePanelContent styles={styles} />
    {target !== undefined &&
      <select value={target.type === 'mixed' ? '' : target.value} onChange={(e) => {
        editor.markHistoryStoppingPoint()
        const value = targetStyle.validate(e.currentTarget.value)
        editor.setStyleForSelectedShapes(targetStyle, value)
      }}>
        {targetStyle.values.map(v => <option key={v} value={v}>{v}</option>)}
      </select>}
  </DefaultStylePanel>
}

export const components: TLComponents = {
  StylePanel: CustomStylePanel,
  Toolbar: (props) => {
    const tools = useTools()
    const isSelected = ShapeNames.reduce((acc, cur) => {
      acc[cur] = useIsToolSelected(tools[cur])
      return acc
    }, {} as any)
    const toolItems = ShapeNames.filter((n) => n !== 'other').map(
      (shapeName, i) => (
        <TldrawUiMenuItem
          key={i}
          {...tools[shapeName]}
          isSelected={isSelected[shapeName]}
        />
      )
    )
    return (
      <DefaultToolbar {...props}>
        {toolItems}
        <DefaultToolbarContent />
      </DefaultToolbar>
    )
  }
}
