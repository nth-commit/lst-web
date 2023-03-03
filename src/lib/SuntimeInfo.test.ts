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
  }

  const result = SuntimeInfo.calculate(options)

  expect(result).toMatchInlineSnapshot(`
Object {
  "timezones": Object {
    "local": Object {
      "now": 2023-03-02T09:45:00.000Z,
      "offset": 46800000,
      "sunrise": 2023-03-02T18:08:26.986Z,
    },
    "lst": Object {
      "now": 2023-03-02T02:36:33.014Z,
      "offset": -72506986,
      "sunrise": 2023-03-02T11:00:00.000Z,
    },
    "lst+24": Object {
      "now": 2023-03-03T02:36:33.014Z,
      "offset": 13893014,
      "sunrise": 2023-03-03T11:00:00.000Z,
    },
    "utc": Object {
      "now": 2023-03-02T22:45:00.000Z,
      "offset": 0,
      "sunrise": 2023-03-03T07:08:26.986Z,
    },
  },
}
`)
})
