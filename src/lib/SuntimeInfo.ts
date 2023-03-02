import addDays from 'date-fns/addDays'
import subDays from 'date-fns/subDays'
import startOfDay from 'date-fns/startOfDay'
import addMilliseconds from 'date-fns/addMilliseconds'
import { getSunrise } from 'sunrise-sunset-js'
import subMilliseconds from 'date-fns/subMilliseconds'

export type SuntimeInfo = {
  sunriseLocal: Date
  sunriseUtc: Date
  nowLocal: Date
  nowUtc: Date
  nowLst: Date
  nowLstPlus24: Date
}

export type SuntimeInfoOptions = {
  timestamp: number
  latitude: number
  longitude: number
  localTimezoneOffset: number
}

export namespace SuntimeInfo {
  export function calculate({ timestamp, latitude, longitude, localTimezoneOffset }: SuntimeInfoOptions): SuntimeInfo {
    const nowUtc = addMilliseconds(new Date(timestamp), localTimezoneOffset)
    const sunriseUtc = addMilliseconds(getSunrise(latitude, longitude, subDays(nowUtc, 1)), localTimezoneOffset)

    const nowLocal = subMilliseconds(nowUtc, localTimezoneOffset)
    const sunriseLocal = subMilliseconds(sunriseUtc, localTimezoneOffset)

    const durationSinceSunriseUtc = nowUtc.getTime() - sunriseUtc.getTime()
    const nowLst = addMilliseconds(startOfDay(sunriseUtc), durationSinceSunriseUtc)
    const nowLstPlus24 = addDays(nowLst, 1)

    return {
      sunriseLocal,
      sunriseUtc,
      nowLocal,
      nowUtc,
      nowLst,
      nowLstPlus24,
    }
  }
}
