import format from 'date-fns/format'
import { mapObject } from '../utility/ObjectUtils'
import { SuntimeInfo, SuntimeInfoOptions } from './SuntimeInfo'

test('Snapshot', () => {
  const sampleTimezoneOffsetHours = 13
  const sampleUtcTimestamp = Date.UTC(2023, 2, 2, 22, 45, 0)

  const localTimezoneOffset = sampleTimezoneOffsetHours * 60 * 60 * 1000
  const options: SuntimeInfoOptions = {
    timestamp: sampleUtcTimestamp - localTimezoneOffset,
    latitude: -43.5330136,
    longitude: 172.6413054,
    localTimezoneOffset,
    lstOffsetResolution: '5 minutes',
  }

  const result = SuntimeInfo.calculate(options)

  const snapshot = mapObject(result.timezones, (suntimeInfo) => {
    return {
      now: format(suntimeInfo.now, `dd-MM-yyyy H:mm:ss`),
      sunrise: format(suntimeInfo.sunrise, `dd-MM-yyyy H:mm:ss`),
      offset: suntimeInfo.offset,
    }
  })
  expect(snapshot).toMatchInlineSnapshot(`
Object {
  "local": Object {
    "now": "02-03-2023 22:45:00",
    "offset": 46800000,
    "sunrise": "03-03-2023 7:08:26",
  },
  "lst": Object {
    "now": "02-03-2023 15:40:00",
    "offset": -72300000,
    "sunrise": "03-03-2023 0:03:26",
  },
  "lst+24": Object {
    "now": "03-03-2023 15:40:00",
    "offset": 14100000,
    "sunrise": "04-03-2023 0:03:26",
  },
  "utc": Object {
    "now": "03-03-2023 11:45:00",
    "offset": 0,
    "sunrise": "03-03-2023 20:08:26",
  },
}
`)
})
