import { DateUtils } from './DateUtils'
import { TimeZoneAdjustment, LocalSunTimeAdjustmentsOptions, LocalSunTimeV2 } from './LocalSunTimeV2'

const sampleGeolocation = {
  latitude: -43.5330136,
  longitude: 172.6413054,
}

test('Adjustments', () => {
  // Arrange
  const options: LocalSunTimeAdjustmentsOptions = {
    ...sampleGeolocation,
    lstOffsetResolution: '5 minutes',
    adjustmentTimeOffset: -(4 * 60 * 60 * 1000), // 8pm the day before (~4 hours before sunrise)
    useLstPlus24: true,
  }

  // Act
  const result = LocalSunTimeV2.calculateAdjustments(options)

  // Assert
  expect(result.map(formatAdjustment)).toMatchInlineSnapshot(`
Array [
  Object {
    "offset": "+07:05",
    "timestamp": "2023-01-04T20:00:00.000Z",
  },
  Object {
    "offset": "+07:00",
    "timestamp": "2023-01-09T20:00:00.000Z",
  },
  Object {
    "offset": "+06:55",
    "timestamp": "2023-01-13T20:00:00.000Z",
  },
  Object {
    "offset": "+06:50",
    "timestamp": "2023-01-17T20:00:00.000Z",
  },
  Object {
    "offset": "+06:45",
    "timestamp": "2023-01-21T20:00:00.000Z",
  },
  Object {
    "offset": "+06:40",
    "timestamp": "2023-01-25T20:00:00.000Z",
  },
  Object {
    "offset": "+06:35",
    "timestamp": "2023-01-29T20:00:00.000Z",
  },
  Object {
    "offset": "+06:30",
    "timestamp": "2023-02-01T20:00:00.000Z",
  },
  Object {
    "offset": "+06:25",
    "timestamp": "2023-02-05T20:00:00.000Z",
  },
  Object {
    "offset": "+06:20",
    "timestamp": "2023-02-08T20:00:00.000Z",
  },
  Object {
    "offset": "+06:15",
    "timestamp": "2023-02-12T20:00:00.000Z",
  },
  Object {
    "offset": "+06:10",
    "timestamp": "2023-02-16T20:00:00.000Z",
  },
  Object {
    "offset": "+06:05",
    "timestamp": "2023-02-19T20:00:00.000Z",
  },
  Object {
    "offset": "+06:00",
    "timestamp": "2023-02-23T20:00:00.000Z",
  },
  Object {
    "offset": "+05:55",
    "timestamp": "2023-02-27T20:00:00.000Z",
  },
  Object {
    "offset": "+05:50",
    "timestamp": "2023-03-03T20:00:00.000Z",
  },
  Object {
    "offset": "+05:45",
    "timestamp": "2023-03-07T20:00:00.000Z",
  },
  Object {
    "offset": "+05:40",
    "timestamp": "2023-03-11T20:00:00.000Z",
  },
  Object {
    "offset": "+05:35",
    "timestamp": "2023-03-15T20:00:00.000Z",
  },
  Object {
    "offset": "+05:30",
    "timestamp": "2023-03-19T20:00:00.000Z",
  },
  Object {
    "offset": "+05:25",
    "timestamp": "2023-03-23T20:00:00.000Z",
  },
  Object {
    "offset": "+05:20",
    "timestamp": "2023-03-27T20:00:00.000Z",
  },
  Object {
    "offset": "+05:15",
    "timestamp": "2023-03-31T20:00:00.000Z",
  },
  Object {
    "offset": "+05:10",
    "timestamp": "2023-04-05T20:00:00.000Z",
  },
  Object {
    "offset": "+05:05",
    "timestamp": "2023-04-09T20:00:00.000Z",
  },
  Object {
    "offset": "+05:00",
    "timestamp": "2023-04-13T20:00:00.000Z",
  },
  Object {
    "offset": "+04:55",
    "timestamp": "2023-04-17T20:00:00.000Z",
  },
  Object {
    "offset": "+04:50",
    "timestamp": "2023-04-22T20:00:00.000Z",
  },
  Object {
    "offset": "+04:45",
    "timestamp": "2023-04-26T20:00:00.000Z",
  },
  Object {
    "offset": "+04:40",
    "timestamp": "2023-04-30T20:00:00.000Z",
  },
  Object {
    "offset": "+04:35",
    "timestamp": "2023-05-05T20:00:00.000Z",
  },
  Object {
    "offset": "+04:30",
    "timestamp": "2023-05-09T20:00:00.000Z",
  },
  Object {
    "offset": "+04:25",
    "timestamp": "2023-05-14T20:00:00.000Z",
  },
  Object {
    "offset": "+04:20",
    "timestamp": "2023-05-19T20:00:00.000Z",
  },
  Object {
    "offset": "+04:15",
    "timestamp": "2023-05-24T20:00:00.000Z",
  },
  Object {
    "offset": "+04:10",
    "timestamp": "2023-05-29T20:00:00.000Z",
  },
  Object {
    "offset": "+04:05",
    "timestamp": "2023-06-05T20:00:00.000Z",
  },
  Object {
    "offset": "+04:00",
    "timestamp": "2023-06-13T20:00:00.000Z",
  },
  Object {
    "offset": "+04:05",
    "timestamp": "2023-07-12T20:00:00.000Z",
  },
  Object {
    "offset": "+04:10",
    "timestamp": "2023-07-20T20:00:00.000Z",
  },
  Object {
    "offset": "+04:15",
    "timestamp": "2023-07-25T20:00:00.000Z",
  },
  Object {
    "offset": "+04:20",
    "timestamp": "2023-07-30T20:00:00.000Z",
  },
  Object {
    "offset": "+04:25",
    "timestamp": "2023-08-04T20:00:00.000Z",
  },
  Object {
    "offset": "+04:30",
    "timestamp": "2023-08-07T20:00:00.000Z",
  },
  Object {
    "offset": "+04:35",
    "timestamp": "2023-08-11T20:00:00.000Z",
  },
  Object {
    "offset": "+04:40",
    "timestamp": "2023-08-15T20:00:00.000Z",
  },
  Object {
    "offset": "+04:45",
    "timestamp": "2023-08-18T20:00:00.000Z",
  },
  Object {
    "offset": "+04:50",
    "timestamp": "2023-08-21T20:00:00.000Z",
  },
  Object {
    "offset": "+04:55",
    "timestamp": "2023-08-24T20:00:00.000Z",
  },
  Object {
    "offset": "+05:00",
    "timestamp": "2023-08-27T20:00:00.000Z",
  },
  Object {
    "offset": "+05:05",
    "timestamp": "2023-08-30T20:00:00.000Z",
  },
  Object {
    "offset": "+05:10",
    "timestamp": "2023-09-02T20:00:00.000Z",
  },
  Object {
    "offset": "+05:15",
    "timestamp": "2023-09-05T20:00:00.000Z",
  },
  Object {
    "offset": "+05:20",
    "timestamp": "2023-09-08T20:00:00.000Z",
  },
  Object {
    "offset": "+05:25",
    "timestamp": "2023-09-11T20:00:00.000Z",
  },
  Object {
    "offset": "+05:30",
    "timestamp": "2023-09-13T20:00:00.000Z",
  },
  Object {
    "offset": "+05:35",
    "timestamp": "2023-09-16T20:00:00.000Z",
  },
  Object {
    "offset": "+05:40",
    "timestamp": "2023-09-19T20:00:00.000Z",
  },
  Object {
    "offset": "+05:45",
    "timestamp": "2023-09-22T20:00:00.000Z",
  },
  Object {
    "offset": "+05:50",
    "timestamp": "2023-09-24T20:00:00.000Z",
  },
  Object {
    "offset": "+05:55",
    "timestamp": "2023-09-27T20:00:00.000Z",
  },
  Object {
    "offset": "+06:00",
    "timestamp": "2023-09-30T20:00:00.000Z",
  },
  Object {
    "offset": "+06:05",
    "timestamp": "2023-10-03T20:00:00.000Z",
  },
  Object {
    "offset": "+06:10",
    "timestamp": "2023-10-05T20:00:00.000Z",
  },
  Object {
    "offset": "+06:15",
    "timestamp": "2023-10-08T20:00:00.000Z",
  },
  Object {
    "offset": "+06:20",
    "timestamp": "2023-10-11T20:00:00.000Z",
  },
  Object {
    "offset": "+06:25",
    "timestamp": "2023-10-14T20:00:00.000Z",
  },
  Object {
    "offset": "+06:30",
    "timestamp": "2023-10-17T20:00:00.000Z",
  },
  Object {
    "offset": "+06:35",
    "timestamp": "2023-10-20T20:00:00.000Z",
  },
  Object {
    "offset": "+06:40",
    "timestamp": "2023-10-23T20:00:00.000Z",
  },
  Object {
    "offset": "+06:45",
    "timestamp": "2023-10-26T20:00:00.000Z",
  },
  Object {
    "offset": "+06:50",
    "timestamp": "2023-10-30T20:00:00.000Z",
  },
  Object {
    "offset": "+06:55",
    "timestamp": "2023-11-02T20:00:00.000Z",
  },
  Object {
    "offset": "+07:00",
    "timestamp": "2023-11-06T20:00:00.000Z",
  },
  Object {
    "offset": "+07:05",
    "timestamp": "2023-11-10T20:00:00.000Z",
  },
  Object {
    "offset": "+07:10",
    "timestamp": "2023-11-15T20:00:00.000Z",
  },
  Object {
    "offset": "+07:15",
    "timestamp": "2023-11-21T20:00:00.000Z",
  },
  Object {
    "offset": "+07:20",
    "timestamp": "2023-11-28T20:00:00.000Z",
  },
  Object {
    "offset": "+07:15",
    "timestamp": "2023-12-22T20:00:00.000Z",
  },
  Object {
    "offset": "+07:10",
    "timestamp": "2023-12-30T20:00:00.000Z",
  },
]
`)
})

function formatAdjustment(adjustment: TimeZoneAdjustment) {
  return {
    timestamp: new Date(adjustment.timestamp).toISOString(),
    offset: DateUtils.formatOffset(adjustment.offset),
  }
}
