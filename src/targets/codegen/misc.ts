export const validateDuplicates = (names: string[], category: string) => {
  const duplicates = names.filter((name, i, arr) => arr.indexOf(name) !== i)
  if (duplicates.length === 0) return
  throw `Duplicate ${category}: \n${duplicates.join('\n')}`
}

export const filterDuplicates = (texts: string[]): string[] =>
  texts.filter((v, i, a) => a.indexOf(v) === i)

export const getTestableNodes = (scraped: Scraped)=>scraped.filter(
  (n) => n.type === 'script' || (n.type === 'subprocess' && !n.link && n.tableKey)
)
