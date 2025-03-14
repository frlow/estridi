import { describe, expect, test } from 'vitest'
import {
  autoText,
  complexStringTestCase,
  connectorTestCase,
  endTestCase,
  gatewayTestCase,
  loopTestCase,
  messageTestCase,
  otherTestCase,
  parsers,
  rootTestCase,
  scriptTestCase,
  serviceCallTestCase,
  signalSendTestCase,
  startTestCase,
  subprocessActionsTestCase,
  subProcessTestCase,
  tableTestCase,
  testTestCase,
  userActionTestCase
} from '../test/testCases'
import { processTldraw } from './tldraw'
import { generatePlaywright } from '../targets/playwright'
import { filterScraped } from '../common/filter'
import { Scraped } from '../scraped'
import { convertToTldraw } from '../converter/tldrawConverter'
import { getTestCase } from '../test/editorTestCases'

const parserName: keyof typeof parsers = 'tldraw'
const parser = parsers[parserName]


describe(`Load from ${parserName}`, () => {
  describe('test cases', () => {
    test('message', async () => await testTestCase(parser, messageTestCase))
    test('script', async () => await testTestCase(parser, scriptTestCase))
    test('signalSend', async () => await testTestCase(parser, signalSendTestCase))
    test('subprocess', async () => await testTestCase(parser, subProcessTestCase))
    test('serviceCall', async () => await testTestCase(parser, serviceCallTestCase))
    test('userAction', async () => await testTestCase(parser, userActionTestCase))
    test('gateway', async () => await testTestCase(parser, gatewayTestCase))
    test('start', async () => await testTestCase(parser, startTestCase))
    test('root', async () => await testTestCase(parser, rootTestCase))
    test('end', async () => await testTestCase(parser, endTestCase))
    test('other', async () => await testTestCase(parser, otherTestCase))
    test('complex string', async () => await testTestCase(parser, complexStringTestCase))
    test('table', async () => await testTestCase(parser, tableTestCase))
    test('subprocess-actions', async () => await testTestCase(parser, subprocessActionsTestCase))
    test('loop', async () => await testTestCase(parser, loopTestCase))
    test('connector', async () => await testTestCase(parser, connectorTestCase))
  })
})

test('tldraw typical case', async () => {
  const scraped = await processTldraw(tlDrawTestCase)
  const filtered = filterScraped(scraped, 'main')
  const code = await generatePlaywright('main', filtered, {})
  expect(code).toBeTruthy()
})

test('id with ":"', async () => {
  const scraped: Scraped = [{
    type: 'start',
    id: '0000:0000',
    ...autoText('root:main'),
    next: '3333:3333'
  }, {
    type: 'serviceCall',
    ...autoText('some text'),
    id: '3333:3333'
  }]
  const tlDrawData = await convertToTldraw(scraped)
  const result = await processTldraw(tlDrawData)
  expect(result).toBeTruthy()
})

const tlDrawTestCase = {
  'clock': 25361,
  'tombstones': {
    'shape:c0xg0vfB8kKH87tu2sWEO': 414,
    'shape:t1Syzq24ftd1VuhLmncq2': 439,
    'shape:vNsUMhrqluUHykVytQ46x': 821,
    'shape:nyf_0M9LLGDlxd9fw5wiw': 1431,
    'binding:LnQ8NML3cGfvkXJuuI46Z': 1732,
    'binding:zJ4OZM6Xq1V4L0PIuyOBd': 1800,
    'binding:bxGnZY6iyJfbQZTXM37or': 1862,
    'binding:qjpkjEYsj6MvEIgkzmqXq': 2171,
    'binding:1FlslitlHxpgVW3tKd1yE': 2660,
    'binding:5xLSyhn4O-cfBGXqVR2YK': 2668,
    'binding:FqV-SMcq0P8GClkFdTRkC': 2731,
    'binding:GL-91dScAajF40QjYKoOT': 4103,
    'binding:1sCM62fZyMELolg00oUra': 4238,
    'binding:BoaCX3ayHz6cNeY6cMH8P': 7329,
    'binding:4RCB5aB3xL7HpG1aYnwBv': 7329,
    'shape:3u9EZVCBT6F3be2bf13kf': 7329,
    'shape:VZ97J9M6yP7AyEhO4RBH3': 7429,
    'shape:1dCBTStP3jbDh3ucA4bD_': 7651,
    'shape:5JL0YKpEVjbfmsmOoBrUa': 7673,
    'binding:DvEcej4mStL5y3HO2RXha': 10584,
    'shape:rGUHDbIl8qJiEFnRswMQV': 10584,
    'shape:LWzw25MhQQV2ATE41tTdQ': 11073,
    'shape:6whHaa9EOQvyLoNxJwvwU': 11073,
    'shape:Pp0qwnA26NsdKjKYizaLO': 11073,
    'shape:fE3pmNgvlRairVitjjsWI': 11073,
    'shape:tZzUDX8P3J6F_7AL0UOfo': 11073,
    'shape:_FfLmv9LTWdICTIDNaTkM': 11117,
    'shape:UQv61u8sDFJrqgYk33tOh': 11117,
    'shape:tJzj6v3L6nQl9daSUW39e': 11117,
    'binding:EHVgWP0CM8pfSatPNWZDt': 13292,
    'shape:k2RM26HQGPWIb5fOtaqDh': 13992,
    'binding:-8ARE9uAWgXw1_IpegwjF': 17428,
    'shape:SZsf9MnA2ViRYxZT-LPg9': 18809,
    'shape:ylMRPXj3Xx8SqBmTY96_m': 23866,
    'binding:25rrrf75uMMWHUS5KkBkY': 24410,
    'binding:JislOLUHXzTCFsQSmHdQs': 24410,
    'binding:7gUq-CNrJJfzL750PAO35': 24410,
    'shape:Y_zwKs0URxd57I6P0NTua': 24410,
    'binding:90vMxKmFiRFwt0N_4wCJM': 24482,
    'shape:ekvUVcOJ6DHOfzmqT6O_b': 24482,
    'shape:1JYkYDYfzZex-_b4cQnWD': 24859
  },
  'schema': {
    'schemaVersion': 2,
    'sequences': {
      'com.tldraw.store': 4,
      'com.tldraw.asset': 1,
      'com.tldraw.camera': 1,
      'com.tldraw.document': 2,
      'com.tldraw.instance': 25,
      'com.tldraw.instance_page_state': 5,
      'com.tldraw.page': 1,
      'com.tldraw.instance_presence': 6,
      'com.tldraw.pointer': 1,
      'com.tldraw.shape': 4,
      'com.tldraw.asset.bookmark': 2,
      'com.tldraw.asset.image': 5,
      'com.tldraw.asset.video': 5,
      'com.tldraw.shape.arrow': 5,
      'com.tldraw.shape.bookmark': 2,
      'com.tldraw.shape.draw': 2,
      'com.tldraw.shape.embed': 4,
      'com.tldraw.shape.frame': 0,
      'com.tldraw.shape.geo': 9,
      'com.tldraw.shape.group': 0,
      'com.tldraw.shape.highlight': 1,
      'com.tldraw.shape.image': 4,
      'com.tldraw.shape.line': 5,
      'com.tldraw.shape.note': 8,
      'com.tldraw.shape.text': 2,
      'com.tldraw.shape.video': 2,
      'com.tldraw.shape.message': 0,
      'com.tldraw.shape.script': 0,
      'com.tldraw.shape.signalSend': 0,
      'com.tldraw.shape.start': 0,
      'com.tldraw.shape.subprocess': 0,
      'com.tldraw.shape.serviceCall': 0,
      'com.tldraw.shape.userAction': 0,
      'com.tldraw.shape.gateway': 0,
      'com.tldraw.shape.signalListen': 0,
      'com.tldraw.shape.other': 0,
      'com.tldraw.binding.arrow': 0
    }
  },
  'documents': [
    {
      'state': {
        'gridSize': 10,
        'name': '',
        'meta': {},
        'id': 'document:document',
        'typeName': 'document'
      },
      'lastChangedClock': 0
    },
    {
      'state': {
        'meta': {},
        'id': 'page:gWt5qpf3Ru44g127a6ohx',
        'name': 'Page 1',
        'index': 'a1',
        'typeName': 'page'
      },
      'lastChangedClock': 0
    },
    {
      'state': {
        'x': 74.8137559012977,
        'y': 175.88628283568818,
        'rotation': 0,
        'isLocked': false,
        'opacity': 1,
        'meta': {},
        'id': 'shape:t0WY-mM9Jx0JX_jSLKe7w',
        'type': 'start',
        'parentId': 'shape:nVGHAIZ7WAxjCeuxO0ZXH',
        'index': 'a1',
        'props': {
          'h': 80,
          'w': 80,
          'text': ''
        },
        'typeName': 'shape'
      },
      'lastChangedClock': 19464
    },
    {
      'state': {
        'x': 549.8456685934968,
        'y': 178.4095889660058,
        'rotation': 0,
        'isLocked': false,
        'opacity': 1,
        'meta': {},
        'id': 'shape:uiGeDO9tjuCKGyJswXOBH',
        'type': 'gateway',
        'parentId': 'shape:nVGHAIZ7WAxjCeuxO0ZXH',
        'index': 'a29s2',
        'props': {
          'h': 80,
          'w': 80,
          'text': 'is something true?'
        },
        'typeName': 'shape'
      },
      'lastChangedClock': 19464
    },
    {
      'state': {
        'x': 353.0136373434968,
        'y': 174.9447452160058,
        'rotation': 0,
        'isLocked': false,
        'opacity': 1,
        'meta': {},
        'id': 'shape:5hA4zVaI5DSz06TLwYZVX',
        'type': 'serviceCall',
        'parentId': 'shape:nVGHAIZ7WAxjCeuxO0ZXH',
        'index': 'a36qy',
        'props': {
          'h': 80,
          'w': 80,
          'text': '/api/data'
        },
        'typeName': 'shape'
      },
      'lastChangedClock': 19464
    },
    {
      'state': {
        'x': 1134.7209054540367,
        'y': 510.5184939937611,
        'rotation': 0,
        'isLocked': false,
        'opacity': 1,
        'meta': {},
        'id': 'shape:AlNgBpJ6XU3nHfzJoLSd-',
        'type': 'subprocess',
        'parentId': 'shape:nVGHAIZ7WAxjCeuxO0ZXH',
        'index': 'a642b',
        'props': {
          'h': 80,
          'w': 80,
          'text': 'Next'
        },
        'typeName': 'shape'
      },
      'lastChangedClock': 19464
    },
    {
      'state': {
        'x': 810.6528127440512,
        'y': 73.92170450213371,
        'rotation': 0,
        'isLocked': false,
        'opacity': 1,
        'meta': {},
        'id': 'shape:x7zKV8hmFNgxkyL-7wJY5',
        'type': 'signalSend',
        'parentId': 'shape:u2WEG2SSwg1lh9eC92VQw',
        'index': 'a1',
        'props': {
          'h': 80,
          'w': 80,
          'text': 'Go to link'
        },
        'typeName': 'shape'
      },
      'lastChangedClock': 21863
    },
    {
      'state': {
        'x': 756.5361132083399,
        'y': 86.82771798853196,
        'rotation': 0,
        'isLocked': false,
        'opacity': 1,
        'meta': {},
        'id': 'shape:OGGOmechCzm_faG1W-Q03',
        'type': 'script',
        'parentId': 'shape:nVGHAIZ7WAxjCeuxO0ZXH',
        'index': 'a79ZU',
        'props': {
          'h': 80,
          'w': 80,
          'text': 'Do thing'
        },
        'typeName': 'shape'
      },
      'lastChangedClock': 25330
    },
    {
      'state': {
        'x': 760.0384890128453,
        'y': 271.3038499525303,
        'rotation': 0,
        'isLocked': false,
        'opacity': 1,
        'meta': {},
        'id': 'shape:8Jb2tYqfc75dyfnX57h7u',
        'type': 'message',
        'parentId': 'shape:nVGHAIZ7WAxjCeuxO0ZXH',
        'index': 'a92GW',
        'props': {
          'h': 80,
          'w': 80,
          'text': 'Some message'
        },
        'typeName': 'shape'
      },
      'lastChangedClock': 25361
    },
    {
      'state': {
        'x': 192.93941859349678,
        'y': 202.4369327160058,
        'rotation': 0,
        'isLocked': false,
        'opacity': 1,
        'meta': {},
        'id': 'shape:KGlMNOdmYGmsFa4pA5ODa',
        'type': 'arrow',
        'props': {
          'dash': 'draw',
          'size': 's',
          'fill': 'none',
          'color': 'black',
          'labelColor': 'black',
          'bend': 0,
          'start': {
            'x': 0,
            'y': 0
          },
          'end': {
            'x': 130.34375,
            'y': 17.6640625
          },
          'arrowheadStart': 'none',
          'arrowheadEnd': 'arrow',
          'text': 'root:main',
          'labelPosition': 0.5,
          'font': 'draw',
          'scale': 1
        },
        'parentId': 'shape:nVGHAIZ7WAxjCeuxO0ZXH',
        'index': 'a57d5',
        'typeName': 'shape'
      },
      'lastChangedClock': 19464
    },
    {
      'state': {
        'meta': {},
        'id': 'binding:TLCE30D3PbnWaHObMXSH7',
        'type': 'arrow',
        'fromId': 'shape:KGlMNOdmYGmsFa4pA5ODa',
        'toId': 'shape:t0WY-mM9Jx0JX_jSLKe7w',
        'props': {
          'isPrecise': true,
          'isExact': false,
          'normalizedAnchor': {
            'x': 0.8825601606407745,
            'y': 0.49924301724335224
          },
          'terminal': 'start'
        },
        'typeName': 'binding'
      },
      'lastChangedClock': 16783
    },
    {
      'state': {
        'meta': {},
        'id': 'binding:b_Ilaw4tltJyCxhf6rdYH',
        'type': 'arrow',
        'fromId': 'shape:KGlMNOdmYGmsFa4pA5ODa',
        'toId': 'shape:5hA4zVaI5DSz06TLwYZVX',
        'props': {
          'isPrecise': false,
          'isExact': false,
          'normalizedAnchor': {
            'x': 0.569970703125,
            'y': 0.4009765625
          },
          'terminal': 'end'
        },
        'typeName': 'binding'
      },
      'lastChangedClock': 1750
    },
    {
      'state': {
        'x': 406.7050435934968,
        'y': 225.5970889660058,
        'rotation': 0,
        'isLocked': false,
        'opacity': 1,
        'meta': {},
        'id': 'shape:nfq5eNrBGixIPg_3F61fr',
        'type': 'arrow',
        'props': {
          'dash': 'draw',
          'size': 's',
          'fill': 'none',
          'color': 'black',
          'labelColor': 'black',
          'bend': 0,
          'start': {
            'x': 0,
            'y': 0
          },
          'end': {
            'x': 142.41796875,
            'y': -18.671875
          },
          'arrowheadStart': 'none',
          'arrowheadEnd': 'arrow',
          'text': '',
          'labelPosition': 0.5,
          'font': 'draw',
          'scale': 1
        },
        'parentId': 'shape:nVGHAIZ7WAxjCeuxO0ZXH',
        'index': 'a4C07',
        'typeName': 'shape'
      },
      'lastChangedClock': 19464
    },
    {
      'state': {
        'meta': {},
        'id': 'binding:8zY9jt4M0tvzKgvqJi9-p',
        'type': 'arrow',
        'fromId': 'shape:nfq5eNrBGixIPg_3F61fr',
        'toId': 'shape:5hA4zVaI5DSz06TLwYZVX',
        'props': {
          'isPrecise': false,
          'isExact': false,
          'normalizedAnchor': {
            'x': 0.671142578125,
            'y': 0.633154296875
          },
          'terminal': 'start'
        },
        'typeName': 'binding'
      },
      'lastChangedClock': 1798
    },
    {
      'state': {
        'meta': {},
        'id': 'binding:e0rXGcvvW-KoYqH7cAaKk',
        'type': 'arrow',
        'fromId': 'shape:nfq5eNrBGixIPg_3F61fr',
        'toId': 'shape:uiGeDO9tjuCKGyJswXOBH',
        'props': {
          'isPrecise': false,
          'isExact': false,
          'normalizedAnchor': {
            'x': 0.316357421875,
            'y': 0.298095703125
          },
          'terminal': 'end'
        },
        'typeName': 'binding'
      },
      'lastChangedClock': 1810
    },
    {
      'state': {
        'x': 593.5019185934968,
        'y': 236.6322452160058,
        'rotation': 0,
        'isLocked': false,
        'opacity': 1,
        'meta': {},
        'id': 'shape:wYVNfeykOmHkMVrKqh4-t',
        'type': 'arrow',
        'props': {
          'dash': 'draw',
          'size': 's',
          'fill': 'none',
          'color': 'black',
          'labelColor': 'black',
          'bend': 20.62301890320653,
          'start': {
            'x': 0,
            'y': 0
          },
          'end': {
            'x': 161.90234375,
            'y': -24.2734375
          },
          'arrowheadStart': 'none',
          'arrowheadEnd': 'arrow',
          'text': 'no',
          'labelPosition': 0.5,
          'font': 'draw',
          'scale': 1
        },
        'parentId': 'shape:nVGHAIZ7WAxjCeuxO0ZXH',
        'index': 'aA4df',
        'typeName': 'shape'
      },
      'lastChangedClock': 19464
    },
    {
      'state': {
        'meta': {},
        'id': 'binding:01v4EimSZq7Jn_ycvEBfm',
        'type': 'arrow',
        'fromId': 'shape:wYVNfeykOmHkMVrKqh4-t',
        'toId': 'shape:uiGeDO9tjuCKGyJswXOBH',
        'props': {
          'isPrecise': false,
          'isExact': false,
          'normalizedAnchor': {
            'x': 0.545703125,
            'y': 0.727783203125
          },
          'terminal': 'start'
        },
        'typeName': 'binding'
      },
      'lastChangedClock': 1860
    },
    {
      'state': {
        'meta': {},
        'id': 'binding:IMRSracnD6V3C8DTxFLQh',
        'type': 'arrow',
        'fromId': 'shape:wYVNfeykOmHkMVrKqh4-t',
        'toId': 'shape:8Jb2tYqfc75dyfnX57h7u',
        'props': {
          'isPrecise': true,
          'isExact': false,
          'normalizedAnchor': {
            'x': 0.5,
            'y': 0.5
          },
          'terminal': 'end'
        },
        'typeName': 'binding'
      },
      'lastChangedClock': 1884
    },
    {
      'state': {
        'x': 590.8964498434968,
        'y': 219.7533389660058,
        'rotation': 0,
        'isLocked': false,
        'opacity': 1,
        'meta': {},
        'id': 'shape:XeIK6ToSpsxzI_nNgyVYk',
        'type': 'arrow',
        'props': {
          'dash': 'draw',
          'size': 's',
          'fill': 'none',
          'color': 'black',
          'labelColor': 'black',
          'bend': -44.517255259350634,
          'start': {
            'x': 0,
            'y': 0
          },
          'end': {
            'x': 224.5234375,
            'y': -98.9609375
          },
          'arrowheadStart': 'none',
          'arrowheadEnd': 'arrow',
          'text': 'yes',
          'labelPosition': 0.5,
          'font': 'draw',
          'scale': 1
        },
        'parentId': 'shape:nVGHAIZ7WAxjCeuxO0ZXH',
        'index': 'a89TY',
        'typeName': 'shape'
      },
      'lastChangedClock': 19464
    },
    {
      'state': {
        'meta': {},
        'id': 'binding:zwM-tlwqT-gOzI-rdmEaQ',
        'type': 'arrow',
        'fromId': 'shape:XeIK6ToSpsxzI_nNgyVYk',
        'toId': 'shape:uiGeDO9tjuCKGyJswXOBH',
        'props': {
          'isPrecise': false,
          'isExact': false,
          'normalizedAnchor': {
            'x': 0.513134765625,
            'y': 0.516796875
          },
          'terminal': 'start'
        },
        'typeName': 'binding'
      },
      'lastChangedClock': 2169
    },
    {
      'state': {
        'meta': {},
        'id': 'binding:8FWJPFs1ApgMqz1kb0fnH',
        'type': 'arrow',
        'fromId': 'shape:XeIK6ToSpsxzI_nNgyVYk',
        'toId': 'shape:OGGOmechCzm_faG1W-Q03',
        'props': {
          'isPrecise': false,
          'isExact': false,
          'normalizedAnchor': {
            'x': 0.621533203125,
            'y': 0.510498046875
          },
          'terminal': 'end'
        },
        'typeName': 'binding'
      },
      'lastChangedClock': 2190
    },
    {
      'state': {
        'x': 867.6982328235313,
        'y': 137.8133620091719,
        'rotation': 0,
        'isLocked': false,
        'opacity': 1,
        'meta': {},
        'id': 'shape:XYov_T3J1ekDr7fMT0Zw4',
        'type': 'arrow',
        'props': {
          'dash': 'draw',
          'size': 's',
          'fill': 'none',
          'color': 'black',
          'labelColor': 'black',
          'bend': -5.628673738962461,
          'start': {
            'x': 24.63848642105495,
            'y': -7.6056266731895334
          },
          'end': {
            'x': 84.55721985397855,
            'y': 36.290969558615544
          },
          'arrowheadStart': 'none',
          'arrowheadEnd': 'arrow',
          'text': '',
          'labelPosition': 0.5,
          'font': 'draw',
          'scale': 1
        },
        'parentId': 'shape:nVGHAIZ7WAxjCeuxO0ZXH',
        'index': 'aH3Z2',
        'typeName': 'shape'
      },
      'lastChangedClock': 24652
    },
    {
      'state': {
        'x': 865.2528813479173,
        'y': 310.297995081718,
        'rotation': 0,
        'isLocked': false,
        'opacity': 1,
        'meta': {},
        'id': 'shape:H6Lx0C635V-9vDkeZBV0Z',
        'type': 'arrow',
        'props': {
          'dash': 'draw',
          'size': 's',
          'fill': 'none',
          'color': 'black',
          'labelColor': 'black',
          'bend': 8.646080414886276,
          'start': {
            'x': 0.8427293343891051,
            'y': -1.1451502967174747
          },
          'end': {
            'x': 78.04018400413523,
            'y': -38.4793152498075
          },
          'arrowheadStart': 'none',
          'arrowheadEnd': 'arrow',
          'text': '',
          'labelPosition': 0.5,
          'font': 'draw',
          'scale': 1
        },
        'parentId': 'shape:nVGHAIZ7WAxjCeuxO0ZXH',
        'index': 'aI9zk',
        'typeName': 'shape'
      },
      'lastChangedClock': 24744
    },
    {
      'state': {
        'meta': {},
        'id': 'binding:R3qq95OQQHbCouR1uDIKA',
        'type': 'arrow',
        'fromId': 'shape:H6Lx0C635V-9vDkeZBV0Z',
        'toId': 'shape:8Jb2tYqfc75dyfnX57h7u',
        'props': {
          'isPrecise': true,
          'isExact': false,
          'normalizedAnchor': {
            'x': 0.5856926354851197,
            'y': 0.4856578852374341
          },
          'terminal': 'start'
        },
        'typeName': 'binding'
      },
      'lastChangedClock': 3391
    },
    {
      'state': {
        'x': 100.10890323084087,
        'y': 66.42541370427284,
        'rotation': 0,
        'isLocked': false,
        'opacity': 1,
        'meta': {},
        'id': 'shape:62o1WuSoCyHh0JwTDp1OA',
        'type': 'start',
        'parentId': 'shape:u2WEG2SSwg1lh9eC92VQw',
        'index': 'a23Tb',
        'props': {
          'h': 80,
          'w': 80,
          'text': ''
        },
        'typeName': 'shape'
      },
      'lastChangedClock': 21863
    },
    {
      'state': {
        'x': 153.77171782975728,
        'y': 112.94477499216032,
        'rotation': 0,
        'isLocked': false,
        'opacity': 1,
        'meta': {},
        'id': 'shape:dQTxYqqvgM6-78ALPD7De',
        'type': 'arrow',
        'props': {
          'dash': 'draw',
          'size': 's',
          'fill': 'none',
          'color': 'black',
          'labelColor': 'black',
          'bend': 0,
          'start': {
            'x': 0,
            'y': 0
          },
          'end': {
            'x': 207.02092549159198,
            'y': -6.884215086031645
          },
          'arrowheadStart': 'none',
          'arrowheadEnd': 'arrow',
          'text': 'Next',
          'labelPosition': 0.5,
          'font': 'draw',
          'scale': 1
        },
        'parentId': 'shape:u2WEG2SSwg1lh9eC92VQw',
        'index': 'a38hT',
        'typeName': 'shape'
      },
      'lastChangedClock': 21863
    },
    {
      'state': {
        'meta': {},
        'id': 'binding:ZdnvWiQNRMQW5RbDPdxlU',
        'type': 'arrow',
        'fromId': 'shape:dQTxYqqvgM6-78ALPD7De',
        'toId': 'shape:62o1WuSoCyHh0JwTDp1OA',
        'props': {
          'isPrecise': false,
          'isExact': false,
          'normalizedAnchor': {
            'x': 0.6707851824864551,
            'y': 0.5814920160985949
          },
          'terminal': 'start'
        },
        'typeName': 'binding'
      },
      'lastChangedClock': 4101
    },
    {
      'state': {
        'meta': {},
        'id': 'binding:5CQn4tElHXA73JeBYlrWP',
        'type': 'arrow',
        'fromId': 'shape:dQTxYqqvgM6-78ALPD7De',
        'toId': 'shape:x7zKV8hmFNgxkyL-7wJY5',
        'props': {
          'isPrecise': false,
          'isExact': false,
          'normalizedAnchor': {
            'x': 0.7159998149976999,
            'y': 0.44440414619031826
          },
          'terminal': 'end'
        },
        'typeName': 'binding'
      },
      'lastChangedClock': 4120
    },
    {
      'state': {
        'x': 1192.7043644742305,
        'y': 282.47309226537254,
        'rotation': 0,
        'isLocked': false,
        'opacity': 1,
        'meta': {},
        'id': 'shape:Jdhoy3UOVMXoHsiSu2MqB',
        'type': 'arrow',
        'props': {
          'dash': 'draw',
          'size': 's',
          'fill': 'none',
          'color': 'black',
          'labelColor': 'black',
          'bend': 0,
          'start': {
            'x': -8.534946227033743,
            'y': 32.75818262040195
          },
          'end': {
            'x': 14.848589442884077,
            'y': 102.83116258214648
          },
          'arrowheadStart': 'none',
          'arrowheadEnd': 'arrow',
          'text': '',
          'labelPosition': 0.5,
          'font': 'draw',
          'scale': 1
        },
        'parentId': 'shape:nVGHAIZ7WAxjCeuxO0ZXH',
        'index': 'aF1jR',
        'typeName': 'shape'
      },
      'lastChangedClock': 19464
    },
    {
      'state': {
        'meta': {},
        'id': 'binding:xkTFSZMxCEMIYEu4NZSoG',
        'type': 'arrow',
        'fromId': 'shape:Jdhoy3UOVMXoHsiSu2MqB',
        'toId': 'shape:AlNgBpJ6XU3nHfzJoLSd-',
        'props': {
          'isPrecise': true,
          'isExact': false,
          'normalizedAnchor': {
            'x': 0.5,
            'y': 0.5
          },
          'terminal': 'end'
        },
        'typeName': 'binding'
      },
      'lastChangedClock': 4255
    },
    {
      'state': {
        'x': 1044.8843962041626,
        'y': 183.127906337409,
        'rotation': 0,
        'isLocked': false,
        'opacity': 1,
        'meta': {},
        'id': 'shape:_k_zbdC5TggR1P_CyIRt6',
        'type': 'userAction',
        'parentId': 'shape:nVGHAIZ7WAxjCeuxO0ZXH',
        'index': 'aB68p',
        'props': {
          'h': 80,
          'w': 421.58160071399834,
          'text': 'action'
        },
        'typeName': 'shape'
      },
      'lastChangedClock': 25203
    },
    {
      'state': {
        'x': 1132.3694073730499,
        'y': 234.64720942532546,
        'rotation': 0,
        'isLocked': false,
        'opacity': 1,
        'meta': {},
        'id': 'shape:eeX8JtNKEnPflBdlTzeLO',
        'type': 'signalListen',
        'parentId': 'shape:nVGHAIZ7WAxjCeuxO0ZXH',
        'index': 'aEAON',
        'props': {
          'h': 80,
          'w': 80,
          'text': 'Click'
        },
        'typeName': 'shape'
      },
      'lastChangedClock': 19464
    },
    {
      'state': {
        'meta': {},
        'id': 'binding:tJDPJ5ZDtFb3vYm1FxWNp',
        'type': 'arrow',
        'fromId': 'shape:Jdhoy3UOVMXoHsiSu2MqB',
        'toId': 'shape:eeX8JtNKEnPflBdlTzeLO',
        'props': {
          'isPrecise': true,
          'isExact': false,
          'normalizedAnchor': {
            'x': 0.4937286130086648,
            'y': 0.8417007166514289
          },
          'terminal': 'start'
        },
        'typeName': 'binding'
      },
      'lastChangedClock': 13307
    },
    {
      'state': {
        'meta': {},
        'id': 'binding:YvtqnNjVaXutj2E-go_o4',
        'type': 'arrow',
        'fromId': 'shape:XYov_T3J1ekDr7fMT0Zw4',
        'toId': 'shape:OGGOmechCzm_faG1W-Q03',
        'props': {
          'isPrecise': true,
          'isExact': false,
          'normalizedAnchor': {
            'x': 0.8553608899517713,
            'y': 0.32529401209654907
          },
          'terminal': 'start'
        },
        'typeName': 'binding'
      },
      'lastChangedClock': 24700
    },
    {
      'state': {
        'x': -108.31816859681368,
        'y': -60.34335360315856,
        'rotation': 0,
        'isLocked': false,
        'opacity': 1,
        'meta': {},
        'id': 'shape:nVGHAIZ7WAxjCeuxO0ZXH',
        'type': 'frame',
        'props': {
          'w': 1508.6060753781107,
          'h': 660.6642706917486,
          'name': 'Root flow'
        },
        'parentId': 'page:gWt5qpf3Ru44g127a6ohx',
        'index': 'a043L',
        'typeName': 'shape'
      },
      'lastChangedClock': 21037
    },
    {
      'state': {
        'x': -113.35955915728948,
        'y': 692.7799131911943,
        'rotation': 0,
        'isLocked': false,
        'opacity': 1,
        'meta': {},
        'id': 'shape:u2WEG2SSwg1lh9eC92VQw',
        'type': 'frame',
        'props': {
          'w': 1519.7069476617112,
          'h': 315.9904918391197,
          'name': 'Next subprocess'
        },
        'parentId': 'page:gWt5qpf3Ru44g127a6ohx',
        'index': 'aF5uK',
        'typeName': 'shape'
      },
      'lastChangedClock': 21973
    },
    {
      'state': {
        'x': 932.4848457388089,
        'y': 179.95149670452622,
        'rotation': 0,
        'isLocked': false,
        'opacity': 1,
        'meta': {},
        'id': 'shape:w9wMmTAbq8cZBW9I9IUQj',
        'type': 'other',
        'parentId': 'shape:nVGHAIZ7WAxjCeuxO0ZXH',
        'index': 'aG8Ro',
        'props': {
          'h': 80,
          'w': 80,
          'text': ''
        },
        'typeName': 'shape'
      },
      'lastChangedClock': 24586
    },
    {
      'state': {
        'meta': {},
        'id': 'binding:T7zdzGdyGcxcSELqZfFNU',
        'type': 'arrow',
        'fromId': 'shape:XYov_T3J1ekDr7fMT0Zw4',
        'toId': 'shape:w9wMmTAbq8cZBW9I9IUQj',
        'props': {
          'isPrecise': true,
          'isExact': false,
          'normalizedAnchor': {
            'x': 0.218846519431186,
            'y': 0.1790093103515346
          },
          'terminal': 'end'
        },
        'typeName': 'binding'
      },
      'lastChangedClock': 24675
    },
    {
      'state': {
        'meta': {},
        'id': 'binding:9a_8g_mzatGIpmQmUEw1k',
        'type': 'arrow',
        'fromId': 'shape:H6Lx0C635V-9vDkeZBV0Z',
        'toId': 'shape:w9wMmTAbq8cZBW9I9IUQj',
        'props': {
          'isPrecise': true,
          'isExact': false,
          'normalizedAnchor': {
            'x': 0.17695943968775368,
            'y': 0.8265393400921124
          },
          'terminal': 'end'
        },
        'typeName': 'binding'
      },
      'lastChangedClock': 24755
    },
    {
      'state': {
        'x': 991.3104943711501,
        'y': 236.88945552391476,
        'rotation': 0,
        'isLocked': false,
        'opacity': 1,
        'meta': {},
        'id': 'shape:jZxnIWkNzoDFO1OA_QXuq',
        'type': 'arrow',
        'props': {
          'dash': 'draw',
          'size': 'm',
          'fill': 'none',
          'color': 'black',
          'labelColor': 'black',
          'bend': 0,
          'start': {
            'x': 0,
            'y': 0
          },
          'end': {
            'x': 2,
            'y': 0
          },
          'arrowheadStart': 'none',
          'arrowheadEnd': 'arrow',
          'text': '',
          'labelPosition': 0.5,
          'font': 'draw',
          'scale': 1
        },
        'parentId': 'shape:nVGHAIZ7WAxjCeuxO0ZXH',
        'index': 'aJ71t',
        'typeName': 'shape'
      },
      'lastChangedClock': 25063
    },
    {
      'state': {
        'meta': {},
        'id': 'binding:GX9A9l5Ve1CPCrzRx3pSc',
        'type': 'arrow',
        'fromId': 'shape:jZxnIWkNzoDFO1OA_QXuq',
        'toId': 'shape:w9wMmTAbq8cZBW9I9IUQj',
        'props': {
          'isPrecise': false,
          'isExact': false,
          'normalizedAnchor': {
            'x': 0.735320607904265,
            'y': 0.7117244852423568
          },
          'terminal': 'start'
        },
        'typeName': 'binding'
      },
      'lastChangedClock': 25051
    },
    {
      'state': {
        'meta': {},
        'id': 'binding:JxvB-hcNrZ3Kfr1Np4kCm',
        'type': 'arrow',
        'fromId': 'shape:jZxnIWkNzoDFO1OA_QXuq',
        'toId': 'shape:_k_zbdC5TggR1P_CyIRt6',
        'props': {
          'isPrecise': true,
          'isExact': false,
          'normalizedAnchor': {
            'x': 0.06821553726431621,
            'y': 0.5185911826360282
          },
          'terminal': 'end'
        },
        'typeName': 'binding'
      },
      'lastChangedClock': 25077
    }
  ]
}
