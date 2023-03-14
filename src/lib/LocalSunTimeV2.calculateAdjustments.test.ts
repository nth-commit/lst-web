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
    "timestamp": "2023-01-06T20:00:00.000Z",
  },
  Object {
    "offset": "+07:00",
    "timestamp": "2023-01-11T20:00:00.000Z",
  },
  Object {
    "offset": "+06:55",
    "timestamp": "2023-01-15T20:00:00.000Z",
  },
  Object {
    "offset": "+06:50",
    "timestamp": "2023-01-19T20:00:00.000Z",
  },
  Object {
    "offset": "+06:45",
    "timestamp": "2023-01-23T20:00:00.000Z",
  },
  Object {
    "offset": "+06:40",
    "timestamp": "2023-01-27T20:00:00.000Z",
  },
  Object {
    "offset": "+06:35",
    "timestamp": "2023-01-30T20:00:00.000Z",
  },
  Object {
    "offset": "+06:30",
    "timestamp": "2023-02-03T20:00:00.000Z",
  },
  Object {
    "offset": "+06:25",
    "timestamp": "2023-02-06T20:00:00.000Z",
  },
  Object {
    "offset": "+06:20",
    "timestamp": "2023-02-10T20:00:00.000Z",
  },
  Object {
    "offset": "+06:15",
    "timestamp": "2023-02-14T20:00:00.000Z",
  },
  Object {
    "offset": "+06:10",
    "timestamp": "2023-02-17T20:00:00.000Z",
  },
  Object {
    "offset": "+06:05",
    "timestamp": "2023-02-21T20:00:00.000Z",
  },
  Object {
    "offset": "+06:00",
    "timestamp": "2023-02-25T20:00:00.000Z",
  },
  Object {
    "offset": "+05:55",
    "timestamp": "2023-03-01T20:00:00.000Z",
  },
  Object {
    "offset": "+05:50",
    "timestamp": "2023-03-05T20:00:00.000Z",
  },
  Object {
    "offset": "+05:45",
    "timestamp": "2023-03-09T20:00:00.000Z",
  },
  Object {
    "offset": "+05:40",
    "timestamp": "2023-03-13T20:00:00.000Z",
  },
  Object {
    "offset": "+05:35",
    "timestamp": "2023-03-17T20:00:00.000Z",
  },
  Object {
    "offset": "+05:30",
    "timestamp": "2023-03-21T20:00:00.000Z",
  },
  Object {
    "offset": "+05:25",
    "timestamp": "2023-03-25T20:00:00.000Z",
  },
  Object {
    "offset": "+05:20",
    "timestamp": "2023-03-29T20:00:00.000Z",
  },
  Object {
    "offset": "+05:15",
    "timestamp": "2023-04-02T20:00:00.000Z",
  },
  Object {
    "offset": "+05:10",
    "timestamp": "2023-04-07T20:00:00.000Z",
  },
  Object {
    "offset": "+05:05",
    "timestamp": "2023-04-11T20:00:00.000Z",
  },
  Object {
    "offset": "+05:00",
    "timestamp": "2023-04-15T20:00:00.000Z",
  },
  Object {
    "offset": "+04:55",
    "timestamp": "2023-04-19T20:00:00.000Z",
  },
  Object {
    "offset": "+04:50",
    "timestamp": "2023-04-24T20:00:00.000Z",
  },
  Object {
    "offset": "+04:45",
    "timestamp": "2023-04-28T20:00:00.000Z",
  },
  Object {
    "offset": "+04:40",
    "timestamp": "2023-05-02T20:00:00.000Z",
  },
  Object {
    "offset": "+04:35",
    "timestamp": "2023-05-07T20:00:00.000Z",
  },
  Object {
    "offset": "+04:30",
    "timestamp": "2023-05-11T20:00:00.000Z",
  },
  Object {
    "offset": "+04:25",
    "timestamp": "2023-05-16T20:00:00.000Z",
  },
  Object {
    "offset": "+04:20",
    "timestamp": "2023-05-21T20:00:00.000Z",
  },
  Object {
    "offset": "+04:15",
    "timestamp": "2023-05-26T20:00:00.000Z",
  },
  Object {
    "offset": "+04:10",
    "timestamp": "2023-06-01T20:00:00.000Z",
  },
  Object {
    "offset": "+04:05",
    "timestamp": "2023-06-09T20:00:00.000Z",
  },
  Object {
    "offset": "+04:00",
    "timestamp": "2023-06-27T20:00:00.000Z",
  },
  Object {
    "offset": "+04:05",
    "timestamp": "2023-07-16T20:00:00.000Z",
  },
  Object {
    "offset": "+04:10",
    "timestamp": "2023-07-22T20:00:00.000Z",
  },
  Object {
    "offset": "+04:15",
    "timestamp": "2023-07-27T20:00:00.000Z",
  },
  Object {
    "offset": "+04:20",
    "timestamp": "2023-08-01T20:00:00.000Z",
  },
  Object {
    "offset": "+04:25",
    "timestamp": "2023-08-05T20:00:00.000Z",
  },
  Object {
    "offset": "+04:30",
    "timestamp": "2023-08-09T20:00:00.000Z",
  },
  Object {
    "offset": "+04:35",
    "timestamp": "2023-08-13T20:00:00.000Z",
  },
  Object {
    "offset": "+04:40",
    "timestamp": "2023-08-16T20:00:00.000Z",
  },
  Object {
    "offset": "+04:45",
    "timestamp": "2023-08-19T20:00:00.000Z",
  },
  Object {
    "offset": "+04:50",
    "timestamp": "2023-08-22T20:00:00.000Z",
  },
  Object {
    "offset": "+04:55",
    "timestamp": "2023-08-25T20:00:00.000Z",
  },
  Object {
    "offset": "+05:00",
    "timestamp": "2023-08-28T20:00:00.000Z",
  },
  Object {
    "offset": "+05:05",
    "timestamp": "2023-08-31T20:00:00.000Z",
  },
  Object {
    "offset": "+05:10",
    "timestamp": "2023-09-03T20:00:00.000Z",
  },
  Object {
    "offset": "+05:15",
    "timestamp": "2023-09-06T20:00:00.000Z",
  },
  Object {
    "offset": "+05:20",
    "timestamp": "2023-09-09T20:00:00.000Z",
  },
  Object {
    "offset": "+05:25",
    "timestamp": "2023-09-12T20:00:00.000Z",
  },
  Object {
    "offset": "+05:30",
    "timestamp": "2023-09-14T20:00:00.000Z",
  },
  Object {
    "offset": "+05:35",
    "timestamp": "2023-09-17T20:00:00.000Z",
  },
  Object {
    "offset": "+05:40",
    "timestamp": "2023-09-20T20:00:00.000Z",
  },
  Object {
    "offset": "+05:45",
    "timestamp": "2023-09-23T20:00:00.000Z",
  },
  Object {
    "offset": "+05:50",
    "timestamp": "2023-09-25T20:00:00.000Z",
  },
  Object {
    "offset": "+05:55",
    "timestamp": "2023-09-28T20:00:00.000Z",
  },
  Object {
    "offset": "+06:00",
    "timestamp": "2023-10-01T20:00:00.000Z",
  },
  Object {
    "offset": "+06:05",
    "timestamp": "2023-10-04T20:00:00.000Z",
  },
  Object {
    "offset": "+06:10",
    "timestamp": "2023-10-06T20:00:00.000Z",
  },
  Object {
    "offset": "+06:15",
    "timestamp": "2023-10-09T20:00:00.000Z",
  },
  Object {
    "offset": "+06:20",
    "timestamp": "2023-10-12T20:00:00.000Z",
  },
  Object {
    "offset": "+06:25",
    "timestamp": "2023-10-15T20:00:00.000Z",
  },
  Object {
    "offset": "+06:30",
    "timestamp": "2023-10-18T20:00:00.000Z",
  },
  Object {
    "offset": "+06:35",
    "timestamp": "2023-10-21T20:00:00.000Z",
  },
  Object {
    "offset": "+06:40",
    "timestamp": "2023-10-24T20:00:00.000Z",
  },
  Object {
    "offset": "+06:45",
    "timestamp": "2023-10-28T20:00:00.000Z",
  },
  Object {
    "offset": "+06:50",
    "timestamp": "2023-10-31T20:00:00.000Z",
  },
  Object {
    "offset": "+06:55",
    "timestamp": "2023-11-04T20:00:00.000Z",
  },
  Object {
    "offset": "+07:00",
    "timestamp": "2023-11-08T20:00:00.000Z",
  },
  Object {
    "offset": "+07:05",
    "timestamp": "2023-11-12T20:00:00.000Z",
  },
  Object {
    "offset": "+07:10",
    "timestamp": "2023-11-18T20:00:00.000Z",
  },
  Object {
    "offset": "+07:15",
    "timestamp": "2023-11-24T20:00:00.000Z",
  },
  Object {
    "offset": "+07:20",
    "timestamp": "2023-12-10T20:00:00.000Z",
  },
  Object {
    "offset": "+07:15",
    "timestamp": "2023-12-26T20:00:00.000Z",
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
