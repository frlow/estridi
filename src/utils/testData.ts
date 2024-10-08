import { Scraped } from '../common.js'
import { findAllPaths } from './paths.js'


export const getTestData = (scraped: Scraped, rootId: string) => {
  const allPaths = findAllPaths(scraped, rootId)
  const unique = allPaths
    .flatMap(n => n)
    .filter((n, i, arr) => arr.indexOf(n) === i)
  const lowestIndex = (id: string) => {
    const relevant = allPaths.filter(path => path.includes(id))
    const indexes = relevant.map((arr) =>
      arr.indexOf(id)
    )
    return Math.min(...indexes)
  }
  unique.sort((a, b) => {
    const aIndex = lowestIndex(a)
    const bIndex = lowestIndex(b)
    return aIndex < bIndex ? -1 : 1
  })
  return unique.map(id => scraped.find(s => s.id === id)!)
}
