import {
  ScrapedConnector,
  ScrapedGateway,
  ScrapedNode,
  ScrapedScript,
  ScrapedStart,
  ScrapedUserAction,
} from '../scraped'
import { expect } from 'vitest'

const idRegex = /^.{4,40}$/
const idMatch = expect.stringMatching(idRegex)

const script: ScrapedScript = {
  type: 'script',
  raw: 'Target',
  id: idMatch,
  next: idMatch,
}

const root: ScrapedStart = {
  id: idMatch,
  raw: expect.stringMatching(/^tc-node-root-(fe|be)$/),
  next: idMatch,
  type: 'root',
}

const gatewayFe: ScrapedGateway = {
  id: idMatch,
  raw: 'Target',
  options: expect.toSatisfy((opts: Record<string, string>) =>
    [
      !!Object.keys(opts)[0].match(idRegex),
      !!Object.keys(opts)[1].match(idRegex),
      !!Object.values(opts)[0].match(/A/),
      !!Object.values(opts)[1].match(/B/),
    ].every((v) => v),
  ),
  type: 'gateway',
}

const connector: ScrapedConnector = {
  raw: '',
  id: idMatch,
  next: idMatch,
  type: 'connector',
}

const userAction: ScrapedUserAction = {
  id: idMatch,
  raw: '',
  actions: expect.toSatisfy((opts: Record<string, string>) =>
    [
      !!Object.keys(opts)[0].match(idRegex),
      !!Object.keys(opts)[1].match(idRegex),
      !!Object.values(opts)[0].match(/ClickA/),
      !!Object.values(opts)[1].match(/ClickB/),
    ].every((v) => v),
  ),
  type: 'userAction',
  next: idMatch,
}

export const expected: Record<string, ScrapedNode> = {
  root: root,
  script,
  message: script,
  gateway: gatewayFe,
  connector,
  userAction,
  signalSend: script
}
