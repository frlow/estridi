import {
  DefaultToolbar,
  DefaultToolbarContent,
  TLComponents,
  TldrawUiMenuItem,
  TLUiAssetUrlOverrides,
  TLUiOverrides,
  useIsToolSelected,
  useTools
} from 'tldraw'
import { icons, ShapeNames, Shapes } from 'editor-common'


export const customAssetUrls: TLUiAssetUrlOverrides = {
  icons
}

export const uiOverrides: TLUiOverrides = {
  tools(editor, tools) {
    Object.values(Shapes).forEach(shape => {
      tools[shape.name] = {
        id: shape.name,
        icon: shape.icon,
        label: shape.name,
        // kbd: 'c',
        onSelect: () => editor.setCurrentTool(shape.name)
      }
    })

    return tools
  }
}

export const components: TLComponents = {
  Toolbar: (props) => {
    const tools = useTools()
    const isSelected = ShapeNames.reduce((acc, cur) => {
      acc[cur] = useIsToolSelected(tools[cur])
      return acc
    }, {} as any)
    const toolItems = ShapeNames.filter(n => n !== 'other').map((shapeName, i) =>
      <TldrawUiMenuItem key={i} {...tools[shapeName]} isSelected={isSelected[shapeName]} />)
    return (
      <DefaultToolbar {...props}>
        {toolItems}
        <DefaultToolbarContent />
      </DefaultToolbar>
    )
  }
}
