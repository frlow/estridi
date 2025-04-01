export const allowedRegex = /[^a-zA-Z0-9åäöÅÄÖ ]/g
export const sanitizeText = (text: string) =>
  (text || '')
    .replaceAll(allowedRegex, ' ')
    .replace(/\n/g, ' ')
    .replace(/ +/g, ' ')
    .trim()

export const sanitizeAllProps = (obj: Object) =>
  Object.keys(obj).reduce(
    (acc, cur) => ({
      ...acc,
      [sanitizeText(cur)]: typeof obj[cur] === 'string' ? sanitizeText(obj[cur]) : obj[cur],
    }),
    {},
  )

export function camelize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[-_]/g, ' ')
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
      index === 0 ? match.toLowerCase() : match.toUpperCase()
    )
    .replace(/\s+/g, '')
}

export const capitalCamel = (str: string) => str.charAt(0).toUpperCase() + camelize(str.substring(1))

// export const _ = (count: number) => ''.padStart(count * 2, ' ')


export const autoText = (raw: string) =>
  ({
      raw,
      text: sanitizeText(raw)
    }
  )
