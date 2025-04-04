import { Scraped, ScrapedNode, ScrapedUserAction } from '../../scraped'

export const injectSubprocessWithActions = (
  node: ScrapedNode,
): Scraped | undefined => {
  if (node.type !== 'subprocess') return undefined
  if (!node.special?.actions) return undefined
  const userAction: ScrapedUserAction = {
    raw: node.raw,
    type: 'userAction',
    actions: node.special.actions,
    id: node.id,
    next: node.next,
  }
  return [userAction]
}
