import { Scraped } from '../../common'

export const findAllPaths = (scraped: Scraped) => {
  const root = scraped.find(node => node.type === 'start' && node.text === 'root')
  if (!root) {
    console.warn('Could not find root node!')
    return
  }
  const process = (start: string[]) => {
    const paths: string[][] = []
    const toProcess = [start]
    while (toProcess.length > 0) {
      const path = toProcess.pop()!
      const id = path[path.length - 1].replace('*', '')
      const current = scraped.find(node => node.id === id)
      const connections = Object.keys(current.connections || {})
      if (current.type === 'subprocess' && !path[path.length - 1].includes('*')) {
        const subprocess = scraped.find(node => node.type === 'start' && node.text === current.text)
        if (subprocess) {
          const subprocessProcessed = process([subprocess.id])
          subprocessProcessed.forEach(sp => toProcess.push([...path, ...sp, `*${current.id}`]))
          continue
        } else {
          if (!['Validate', 'Display'].some(t => current.text.startsWith(t)))
            console.warn(`Could not find subprocess: ${current.text}`)
        }
      }
      if (connections.length === 0) {
        const pathTemp = path.filter(id => !id.includes('*'))
        paths.push(pathTemp)

        // Locate the last user action taken, all actions before this must be filtered
        let lastSignalListen = pathTemp.length - 1
        for (let i = pathTemp.length - 1; i >= 0; i--) {
          if (scraped.find(node => node.id === pathTemp[i]).type === 'signalListen') break
          lastSignalListen = i
        }
        const signalListens = pathTemp
          .slice(lastSignalListen)
          .flatMap(id => scraped.find(node => node.id === id).actions || [])
        signalListens.forEach(sl => toProcess.push([...pathTemp, sl]))
      } else
        connections.forEach(c => toProcess.push([...path, c]))
    }
    return paths
  }
  const processed = process([root.id])
  console.log(processed.length)
}
