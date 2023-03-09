import { getSunrise } from 'sunrise-sunset-js'
import { from } from 'ix/iterable'
import { take, distinctUntilChanged, map, skip } from 'ix/iterable/operators'

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

export type SpecificTimeZoneAdjustment = {
  timestamp: number
  offset: number
}

export namespace LocalSunTimeV2 {
  const originUtcDay = [2023, 1, 1] as const // Not a leap year

  export function calculateAdjustments(options: LocalSunTimeAdjustmentsOptions): SpecificTimeZoneAdjustment[] {
    const calculateLstOffsetWithOptions = (timestamp: number): SpecificTimeZoneAdjustment =>
      calculateAdjustment(timestamp, options.latitude, options.longitude, options.lstOffsetResolution)

    return Array.from(
      from(utcDayStarts(...originUtcDay)).pipe(
        take(366), // One year + 1 day
        map(calculateLstOffsetWithOptions),
        distinctUntilChanged({
          keySelector: (x) => x.offset,
        }),
        skip(1), // The first is a duplicate of the last, because we are looping around the year
        map((adjustment) =>
          offsetAdjustmentByPreferences(adjustment, options.adjustmentTimeOffset, options.useLstPlus24)
        )
      )
    )
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
  ): SpecificTimeZoneAdjustment {
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
    adjustment: SpecificTimeZoneAdjustment,
    adjustmentTimeOffset: number,
    useLstPlus24: boolean
  ): SpecificTimeZoneAdjustment {
    const offset = useLstPlus24 ? adjustment.offset + 24 * 60 * 60 * 1000 : adjustment.offset
    const timestampAtStartOfDay = adjustment.timestamp - offset
    const adjustmentTimestamp = timestampAtStartOfDay + adjustmentTimeOffset + offset

    return {
      timestamp: adjustmentTimestamp,
      offset,
    }
  }
}
