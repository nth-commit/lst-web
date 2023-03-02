import { SuntimeInfo, SuntimeInfoOptions } from './SuntimeInfo'

test('Snapshot', () => {
  const sampleTimezoneOffsetHours = 13
  const sampleUtcTimestamp = Date.UTC(2023, 2, 2, 22, 45, 0)

  const localTimezoneOffset = -sampleTimezoneOffsetHours * 60 * 60 * 1000
  const options: SuntimeInfoOptions = {
    timestamp: sampleUtcTimestamp - localTimezoneOffset,
    latitude: -43.5330136,
    longitude: 172.6413054,
    localTimezoneOffset,
  }

  const result = SuntimeInfo.calculate(options)

  expect(result).toMatchInlineSnapshot(`
Object {
  "nowLocal": 2023-03-03T11:45:00.000Z,
  "nowLst": 2023-03-02T04:36:33.014Z,
  "nowLstPlus24": 2023-03-03T04:36:33.014Z,
  "nowUtc": 2023-03-02T22:45:00.000Z,
  "sunriseLocal": 2023-03-02T18:08:26.986Z,
  "sunriseUtc": 2023-03-02T05:08:26.986Z,
}
`)
})
