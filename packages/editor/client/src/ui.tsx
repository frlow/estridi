import {
  DefaultToolbar,
  DefaultToolbarContent,
  TLComponents,
  TldrawUiMenuItem,
  TLUiOverrides,
  useIsToolSelected,
  useTools
} from 'tldraw'
import { ShapeNames, Shapes } from 'editor-common'

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
    const toolItems = ShapeNames.map(shapeName => <TldrawUiMenuItem {...tools[shapeName]}
                                                                    isSelected={isSelected[shapeName]} />)
    return (
      <DefaultToolbar {...props}>
        {toolItems}
        <DefaultToolbarContent />
      </DefaultToolbar>
    )
  }
}
