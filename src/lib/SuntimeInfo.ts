import addDays from 'date-fns/addDays'
import subDays from 'date-fns/subDays'
import startOfDay from 'date-fns/startOfDay'
import addMilliseconds from 'date-fns/addMilliseconds'
import { getSunrise } from 'sunrise-sunset-js'
import subMilliseconds from 'date-fns/subMilliseconds'

export type SuntimeInfo = {
  timezones: Record<'utc' | 'local' | 'lst' | 'lst+24', SuntimeTimeInfo>
}

export type SuntimeTimeInfo = {
  offset: number
  sunrise: Date
  now: Date
}

export type SuntimeInfoOptions = {
  timestamp: number
  latitude: number
  longitude: number
  localTimezoneOffset: number
  lstOffsetResolution?: 'exact' | '5 minutes' | '10 minutes' | '15 minutes' | '30 minutes'
}

export namespace SuntimeInfo {
  export function calculate({
    timestamp,
    latitude,
    longitude,
    localTimezoneOffset,
    lstOffsetResolution,
  }: SuntimeInfoOptions): SuntimeInfo {
    lstOffsetResolution ??= 'exact'

    const nowUtc = addMilliseconds(new Date(timestamp), localTimezoneOffset)
    const sunriseUtc = addMilliseconds(getSunrise(latitude, longitude, subDays(nowUtc, 1)), localTimezoneOffset)

    const nowLocal = subMilliseconds(nowUtc, localTimezoneOffset)
    const sunriseLocal = subMilliseconds(sunriseUtc, localTimezoneOffset)

    const lstStartOfDayUtc = calculateStartOfDayLst(sunriseUtc, lstOffsetResolution)
    const ticksSinceStartOfDayLst = nowUtc.getTime() - lstStartOfDayUtc.getTime()
    const nowLst = addMilliseconds(startOfDay(lstStartOfDayUtc), ticksSinceStartOfDayLst)
    const lstTimezoneOffset = nowLst.getTime() - nowUtc.getTime()
    const sunriseLst = addMilliseconds(sunriseUtc, lstTimezoneOffset)

    const nowLstPlus24 = addDays(nowLst, 1)
    const lstTimezonePlus24Offset = nowLstPlus24.getTime() - nowUtc.getTime()
    const sunriseLstPlus24 = addMilliseconds(sunriseUtc, lstTimezonePlus24Offset)

    return {
      timezones: {
        utc: {
          now: nowUtc,
          sunrise: sunriseUtc,
          offset: 0,
        },
        local: {
          now: nowLocal,
          sunrise: sunriseLocal,
          offset: localTimezoneOffset,
        },
        lst: {
          now: nowLst,
          sunrise: sunriseLst,
          offset: lstTimezoneOffset,
        },
        'lst+24': {
          now: nowLstPlus24,
          sunrise: sunriseLstPlus24,
          offset: lstTimezonePlus24Offset,
        },
      },
    }
  }

  function calculateStartOfDayLst(
    sunriseUtc: Date,
    lstOffsetResolution: NotUndefined<SuntimeInfoOptions['lstOffsetResolution']>
  ): Date {
    const lstOffsetResolutionTicks = getLstOffsetResolutionTicks(lstOffsetResolution)
    const lstOffsetRemainder = sunriseUtc.getTime() % (lstOffsetResolutionTicks || 1)
    return new Date(sunriseUtc.getTime() - lstOffsetRemainder)
  }

  function getLstOffsetResolutionTicks(
    lstOffsetResolution: NotUndefined<SuntimeInfoOptions['lstOffsetResolution']>
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
    }
  }

  type NotUndefined<T> = T extends undefined ? never : T
}
