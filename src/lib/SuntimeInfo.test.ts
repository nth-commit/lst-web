import format from 'date-fns/format'
import { range } from 'ix/iterable'
import { flatMap, map } from 'ix/iterable/operators'
import { mapObject } from '../utility/ObjectUtils'
import { SuntimeInfo, SuntimeInfoOptions } from './SuntimeInfo'

const sampleGeolocation = {
  latitude: -43.5330136,
  longitude: 172.6413054,
}

test('Snapshot', () => {
  // Arrange
  const sampleTimezoneOffsetHours = 13
  const sampleUtcTimestamp = Date.UTC(2023, 2, 2, 22, 45, 0)
  const options = generateOptionsInUtc(sampleUtcTimestamp, sampleTimezoneOffsetHours)

  // Act
  const result = SuntimeInfo.calculate(options)

  // Assert
  const snapshot = mapObject(result.timezones, (suntimeInfo) => {
    return {
      now: formatDate(suntimeInfo.now),
      sunrise: formatDate(suntimeInfo.sunrise),
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

test('Snapshot - day of UTC+12', () => {
  // Arrange
  const sampleTimezoneOffsetHours = 12
  const options = range(0, 24).pipe(
    flatMap(function* (hour): Generator<number> {
      yield Date.UTC(2023, 2, 2, hour, 0, 0)
      yield Date.UTC(2023, 2, 2, hour, 30, 0)
    }),
    map((utcTimestamp) => generateOptionsInUtc(utcTimestamp, sampleTimezoneOffsetHours))
  )

  // Act
  const result = Array.from(options).map((options) => SuntimeInfo.calculate(options))

  // Assert
  const snapshot = result.map((suntimeInfo) => formatDate(suntimeInfo.timezones['lst+24'].now))
  expect(snapshot).toMatchInlineSnapshot(`
Array [
  "02-03-2023 17:55:00",
  "02-03-2023 18:25:00",
  "02-03-2023 18:55:00",
  "02-03-2023 19:25:00",
  "02-03-2023 19:55:00",
  "02-03-2023 20:25:00",
  "02-03-2023 20:55:00",
  "02-03-2023 21:25:00",
  "02-03-2023 21:55:00",
  "02-03-2023 22:25:00",
  "02-03-2023 22:55:00",
  "02-03-2023 23:25:00",
  "02-03-2023 23:55:00",
  "03-03-2023 0:25:00",
  "03-03-2023 0:55:00",
  "03-03-2023 1:25:00",
  "03-03-2023 1:55:00",
  "03-03-2023 2:25:00",
  "03-03-2023 2:55:00",
  "03-03-2023 3:25:00",
  "03-03-2023 3:55:00",
  "03-03-2023 4:25:00",
  "03-03-2023 4:55:00",
  "03-03-2023 5:25:00",
  "03-03-2023 5:55:00",
  "03-03-2023 6:25:00",
  "03-03-2023 6:55:00",
  "03-03-2023 7:25:00",
  "03-03-2023 7:55:00",
  "03-03-2023 8:25:00",
  "03-03-2023 8:55:00",
  "03-03-2023 9:25:00",
  "03-03-2023 9:55:00",
  "03-03-2023 10:25:00",
  "03-03-2023 10:55:00",
  "03-03-2023 11:25:00",
  "03-03-2023 11:55:00",
  "03-03-2023 12:25:00",
  "03-03-2023 12:55:00",
  "03-03-2023 13:25:00",
  "03-03-2023 13:55:00",
  "03-03-2023 14:25:00",
  "03-03-2023 14:55:00",
  "03-03-2023 15:25:00",
  "03-03-2023 15:55:00",
  "03-03-2023 16:25:00",
  "03-03-2023 16:55:00",
  "03-03-2023 17:25:00",
]
`)
})

function formatDate(date: Date): string {
  return format(date, `dd-MM-yyyy H:mm:ss`)
}

function generateOptionsInUtc(timestamp: number, offsetHours: number): SuntimeInfoOptions {
  const offset = offsetHours * 60 * 60 * 1000
  return {
    timestamp: timestamp - offset,
    ...sampleGeolocation,
    localTimezoneOffset: offset,
    lstOffsetResolution: '5 minutes',
  }
}
