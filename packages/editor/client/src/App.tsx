import { defaultShapeUtils, Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { components, uiOverrides } from './ui.tsx'
import { CounterShapeTool, CounterShapeUtil } from './CounterShape.tsx'
import { useSync } from '@tldraw/sync'
import { multiplayerAssets, WORKER_URL } from './sync.ts'
import { useMemo } from 'react'

const customShapes = [CounterShapeUtil]
const customTools = [CounterShapeTool]


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


