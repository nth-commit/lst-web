import { getSunrise } from 'sunrise-sunset-js'
import { from } from '@reactivex/ix-es5-cjs/iterable'
import { take, skip, map, scan, repeat, takeWhile } from '@reactivex/ix-es5-cjs/iterable/operators'
import { groupUntilChanged } from './IxUtils'

export type LocalSunTimeAdjustmentsOptions = {
  /**
   * The latitude of the location to calculate LST for
   */
  latitude: number
  /**
   * The longitude of the location to calculate LST for
   */
  longitude: number
  /**
   * The resolution of the LST offset to calculate.
   *
   * For example, if the resolution is '5 minutes', then the offset from UTC will only be returned in 5 minute intervals.
   */
  lstOffsetResolution: 'exact' | '5 minutes' | '10 minutes' | '15 minutes' | '30 minutes' | '1 hour'
  /**
   * The time offset that specifies when an adjustment should be applied.
   *
   * For example: -4 * 60 * 60 * 1000 (-4 hours) means 8pm the day before.
   */
  adjustmentTimeOffset: number
  /**
   * Whether to use LST+24 convention to calculate the the LST offset, which may be more appropriate for co-ordination
   * with your native timezone, to ensure that you're in the same calendar date.
   */
  useLstPlus24: boolean
}

export type TimeZoneAdjustment = {
  timestamp: number
  offset: number
}

export namespace LocalSunTimeV2 {
  const originUtcDay = [2023, 1, 1] as const // Not a leap year

  export function calculateAdjustments(options: LocalSunTimeAdjustmentsOptions): TimeZoneAdjustment[] {
    const calculateLstOffsetWithOptions = (timestamp: number): TimeZoneAdjustment =>
      calculateAdjustment(timestamp, options.latitude, options.longitude, options.lstOffsetResolution)

    const result = Array.from(
      from(utcDayStarts(...originUtcDay)).pipe(
        take(365),
        map(calculateLstOffsetWithOptions),
        repeat(2), // Ensure it wraps around, we'll skip the first (incomplete) group
        groupUntilChanged({
          keySelector: (x) => x.offset,
        }),
        skip(1), // The first unique offset might have been encountered at the end of the previous year
        map((group): TimeZoneAdjustment => group[Math.floor(group.length / 2)]),
        scan(
          (acc, curr, ix) => ({
            isFirst: ix === 0,
            first: acc.first ?? curr,
            curr: curr,
          }),
          { isFirst: false, first: null! as TimeZoneAdjustment, curr: null! as TimeZoneAdjustment }
        ),
        takeWhile((x) => x.first === x.curr || x.first.timestamp !== x.curr.timestamp),
        map((x) => x.curr)
      )
    )

    return result.map((adjustment) =>
      offsetAdjustmentByPreferences(adjustment, options.adjustmentTimeOffset, options.useLstPlus24)
    )
  }

  export function calculateCurrentUtcOffset(options: LocalSunTimeAdjustmentsOptions & { timestamp: number }): number {
    const adjustments = calculateAdjustments(options)
    return findOffset(adjustments, options.timestamp)
  }

  export function findOffset(adjustments: TimeZoneAdjustment[], timestamp: number): number {
    const adjustment = adjustments.find((adjustment) => adjustment.timestamp >= timestamp)

    if (!adjustment) {
      throw new Error('Could not find an adjustment for the given timestamp')
    }

    return adjustment.offset
  }

  export function findAdjustment(adjustments: TimeZoneAdjustment[], timestamp: number): TimeZoneAdjustment {
    const adjustmentIndex = adjustments.findIndex((adjustment) => adjustment.timestamp >= timestamp)

    if (adjustmentIndex < 0) {
      throw new Error('Could not find an adjustment for the given timestamp')
    }

    return adjustments[adjustmentIndex - 1]
  }

  function* utcDayStarts(fromYear: number, fromMonth: number, fromDay: number): Generator<number> {
    const SAMPLE_START_OF_YEAR = new Date(
      `${fromYear}-${fromMonth.toString().padStart(2, '0')}-${fromDay.toString().padStart(2, '0')}T00:00:00.000Z`
    ).getTime()
    const ONE_DAY = 24 * 60 * 60 * 1000

    let current = SAMPLE_START_OF_YEAR
    while (true) {
      yield current
      current += ONE_DAY
    }
  }

  function calculateAdjustment(
    timestamp: number,
    latitude: number,
    longitude: number,
    lstOffsetResolution: LocalSunTimeAdjustmentsOptions['lstOffsetResolution']
  ): TimeZoneAdjustment {
    const sunriseUtcTimestamp = getSunriseUtc(timestamp, latitude, longitude)
    const exactLstOffset = timestamp - sunriseUtcTimestamp

    const lstOffsetResolutionMilliseconds = getLstOffsetResolutionMilliseconds(lstOffsetResolution)
    const lstOffsetRemainder = exactLstOffset % (lstOffsetResolutionMilliseconds || 1)

    const offset = exactLstOffset - lstOffsetRemainder

    return {
      timestamp,
      offset,
    }
  }

  function getSunriseUtc(timestamp: number, latitude: number, longitude: number): number {
    return getSunrise(latitude, longitude, new Date(timestamp)).getTime()
  }

  function getLstOffsetResolutionMilliseconds(
    lstOffsetResolution: LocalSunTimeAdjustmentsOptions['lstOffsetResolution']
  ): number | null {
    switch (lstOffsetResolution) {
      case 'exact':
        return null
      case '5 minutes':
        return 5 * 60 * 1000
      case '10 minutes':
        return 10 * 60 * 1000
      case '15 minutes':
        return 15 * 60 * 1000
      case '30 minutes':
        return 30 * 60 * 1000
      case '1 hour':
        return 60 * 60 * 1000
    }
  }

  function offsetAdjustmentByPreferences(
    adjustment: TimeZoneAdjustment,
    adjustmentTimeOffset: number,
    useLstPlus24: boolean
  ): TimeZoneAdjustment {
    const offset = useLstPlus24 ? adjustment.offset + 24 * 60 * 60 * 1000 : adjustment.offset
    const timestampAtStartOfDay = adjustment.timestamp - offset
    const adjustmentTimestamp = timestampAtStartOfDay + adjustmentTimeOffset + offset

    return {
      timestamp: adjustmentTimestamp,
      offset,
    }
  }
}
