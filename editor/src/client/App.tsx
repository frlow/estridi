import {
  BaseBoxShapeTool,
  BaseBoxShapeUtil,
  defaultShapeUtils,
  DefaultToolbar,
  DefaultToolbarContent,
  HTMLContainer,
  stopEventPropagation,
  T,
  TLBaseShape,
  TLComponents,
  Tldraw,
  TldrawUiMenuItem,
  TLUiOverrides,
  useIsToolSelected,
  useTools
} from 'tldraw'
import 'tldraw/tldraw.css'
import { useSync } from '@tldraw/sync'
import { multiplayerAssets, WORKER_URL } from './sync.ts'
import { useMemo } from 'react'


type CounterShape = TLBaseShape<'counter', { w: number; h: number; count: number }>

export class CounterShapeUtil extends BaseBoxShapeUtil<CounterShape> {
  static override type = 'counter' as const
  static override props = {
    w: T.positiveNumber,
    h: T.positiveNumber,
    count: T.number
  }

  override getDefaultProps() {
    return {
      w: 200,
      h: 200,
      count: 0
    }
  }

  override component(shape: CounterShape) {
    const onClick = (event: MouseEvent, change: number) => {
      event.stopPropagation()
      this.editor.updateShape({
        id: shape.id,
        type: 'counter',
        props: { count: shape.props.count + change }
      })
    }

    return (
      <HTMLContainer
        style={{
          pointerEvents: 'all',
          background: '#efefef',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8
        }}
      >
        <button onClick={(e) => onClick(e, -1)} onPointerDown={stopEventPropagation}>
          -
        </button>
        <span>{shape.props.count}</span>
        <button onClick={(e) => onClick(e, 1)} onPointerDown={stopEventPropagation}>
          +
        </button>
      </HTMLContainer>
    )
  }

  override indicator(shape: CounterShape) {
    return <rect width={shape.props.w} height={shape.props.h} />
  }
}

export class CounterShapeTool extends BaseBoxShapeTool {
  static override id = 'counter'
  override shapeType = 'counter'
}

const customShapes = [CounterShapeUtil]
const customTools = [CounterShapeTool]

export const components: TLComponents = {
  Toolbar: (props) => {
    const tools = useTools()
    const isCounterSelected = useIsToolSelected(tools['counter'])
    return (
      <DefaultToolbar {...props}>
        <TldrawUiMenuItem {...tools['counter']} isSelected={isCounterSelected} />
        <DefaultToolbarContent />
      </DefaultToolbar>
    )
  }
}

export const uiOverrides: TLUiOverrides = {

  tools(editor, tools) {
    // Create a tool item in the ui's context.
    tools.counter = {
      id: 'counter',
      icon: 'color',
      label: 'counter',
      kbd: 'c',
      onSelect: () => {
        editor.setCurrentTool('counter')
      }
    }
    return tools
  }
}


function App() {
  const store = useSync({
    uri: `${WORKER_URL}/`,
    assets: multiplayerAssets,
    shapeUtils: useMemo(() => [...customShapes, ...defaultShapeUtils], [])
  })
  return (
    <Tldraw
      store={store}
      shapeUtils={customShapes}
      tools={customTools}
      overrides={uiOverrides}
      components={components}
      deepLinks
    />
  )
}

export default App


