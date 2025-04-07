import {
  ScrapedConnector,
  ScrapedGateway,
  ScrapedLoop,
  ScrapedParallel,
  ScrapedScript,
  ScrapedServiceCall,
  ScrapedStart,
  ScrapedSubprocess,
  ScrapedUserAction,
} from '../scraped'
import { expect } from 'vitest'

const idRegex = /^.{3,60}$/
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

const gateway: ScrapedGateway = {
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
  type: 'userAction',
  actions: expect.toSatisfy((opts: Record<string, string>) =>
    [
      !!Object.keys(opts).every((key) => key.match(idRegex)),
      !!Object.values(opts).some((t) => t.match(/ClickA/)),
      !!Object.values(opts).some((t) => t.match(/ClickB/)),
    ].every((v) => v),
  ),
  next: idMatch,
}

const serviceCall: ScrapedServiceCall = {
  id: idMatch,
  next: idMatch,
  raw: 'Target',
  type: 'serviceCall',
}

const subprocess: ScrapedSubprocess = {
  type: 'subprocess',
  raw: 'tc-node-subprocess-fe-sub',
  id: idMatch,
  next: idMatch,
  link: idMatch,
  special: {
    actions: expect.toSatisfy((opts: Record<string, string>) =>
      [
        !!Object.keys(opts).every((key) => key.match(idRegex)),
        !!Object.values(opts).some((t) => t.match(/ClickA/)),
        !!Object.values(opts).some((t) => t.match(/ClickB/)),
      ].every((v) => v),
    ),
  },
}

const start: ScrapedStart = {
  id: idMatch,
  raw: 'tc-node-subprocess-fe-sub',
  type: 'start',
  next: idMatch,
}

const loop: ScrapedLoop = {
  type: 'loop',
  next: idMatch,
  raw: 'Target',
  id: idMatch,
}

const parallel: ScrapedParallel = {
  type: 'parallel',
  options: expect.toSatisfy((opts: Record<string, null>) =>
    [
      !!Object.keys(opts)[0].match(idRegex),
      !!Object.keys(opts)[1].match(idRegex),
      Object.values(opts)[0] === null,
      Object.values(opts)[1] === null,
    ].every((v) => v),
  ),
  raw: 'Target',
  id: idMatch,
}

const scriptMultipleOut: ScrapedScript = {
  raw: 'Target',
  id: idMatch,
  next: undefined,
  type: 'script',
  special: {
    out: expect.toSatisfy((opts) => {
      if (opts.length !== 2) return false
      return  opts.every((o) => o.match(idRegex))
    }),
  },
}

export const expected = {
  root: root,
  script,
  message: script,
  gateway,
  connector,
  userAction,
  signalSend: script,
  serviceCall,
  subprocess,
  start,
  loop,
  parallel,
  scriptMultipleOut,
}
