import { ScrapedTable } from '../scraped'

export type Table = {
  content: string[][]
  values: Record<string, string>[]
  headers: string[]
  id: string
  text: string
  signature: string
}

export const createTable = ({ rows, id, text }: ScrapedTable): Table => {
  const headers = rows[0]
  const content = rows.slice(1)
  return {
    text,
    id,
    headers,
    content,
    get values() {
      return content
        .filter((line) => !line[0].startsWith('#'))
        .map((row) =>
          headers.slice(1).reduce(
            (acc, cur) => {
              const index = headers.indexOf(cur)
              acc[cur] = row[index]
              return acc
            },
            { Id: row[0] } as Record<string, string>,
          ),
        )
    },
    get signature() {
      function hashCode(str: string) {
        let hash = 0
        for (let i = 0, len = str.length; i < len; i++) {
          let chr = str.charCodeAt(i)
          hash = (hash << 5) - hash + chr
          hash |= 0 // Convert to 32bit integer
        }
        return Math.abs(hash).toString().substring(0, 4).padStart(4, '0')
      }

      return (
        '\n' +
        [
          headers.map((h) => hashCode(h)).join('|'),
          ...content.map((line) => line.map((v) => hashCode(v)).join('|')),
        ].join('\n') +
        '\n'
      )
    },
  }
}
