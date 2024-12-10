import { camelize } from '../../common/texts.js'

export const validateDuplicates = (names: string[], category: string) => {
  const duplicates = names.filter((name, i, arr) => arr.indexOf(name) !== i)
  if (duplicates.length === 0) return
  throw `Duplicate ${category}: \n${duplicates.join('\n')}`
}

export const filterDuplicates = (texts: string[]): string[] =>
  texts.filter((v, i, a) => a.indexOf(v) === i)

export const getTestableNodes = (scraped: Scraped) => scraped.filter(
  (n) => n.type === 'script' || (n.type === 'subprocess' && !n.link && n.tableKey) || n.type === 'serviceCall'
)

export const getPathGatewayValuesForPath = (path: ScrapedNode[]) =>
  path
    .filter((n) => n.type === 'gateway')
    .reduce(
      (acc, cur) => ({
        ...acc,
        [cur.text.replace('*', '').trim()]:
          cur.options[path[path.indexOf(cur) + 1].id]
      }),
      {}
    )

export const getActionsForPath = (path: ScrapedNode[]) => {
  return path
    .filter((n) => n.type === 'userAction')
    .filter((a) => {
      const nextId = path[path.indexOf(a) + 1].id
      return a.next !== nextId
    })
    .map((a) => {
      const nextText = a.actions[path[path.indexOf(a) + 1].id]
      return `action_${camelize(nextText)}`
    })
}
