import addDays from 'date-fns/addDays'
import subDays from 'date-fns/subDays'
import startOfDay from 'date-fns/startOfDay'
import addMilliseconds from 'date-fns/addMilliseconds'
import { useEffect, useState } from 'react'
import { getSunrise } from 'sunrise-sunset-js'

export type SuntimeInfo = {
  localTimezone: string
  sunriseLocal: Date
  sunriseUtc: Date
  nowLocal: Date
  nowUtc: Date
  nowLst: Date
  nowLstPlus24: Date
}

export function useSuntimeInfo(position: GeolocationPosition): SuntimeInfo {
  const [suntimeInfo, setSuntimeInfo] = useState<SuntimeInfo>(calculateSuntimeInfo(position))

  useEffect(() => {
    const timer = setInterval(() => {
      setSuntimeInfo(calculateSuntimeInfo(position))
    }, 100)

    return () => clearInterval(timer)
  }, [position])

  return suntimeInfo
}

function calculateSuntimeInfo(position: GeolocationPosition): SuntimeInfo {
  const { latitude, longitude } = position.coords

  const nowLocal = new Date()

  const sunrise = getSunrise(latitude, longitude, subDays(nowLocal, 1))

  const timezoneOffset = nowLocal.getTimezoneOffset() * 60 * 1000

  const sunriseUtc = new Date(sunrise.getTime() + timezoneOffset)
  const nowUtc = new Date(nowLocal.getTime() + timezoneOffset)

  const localeOptions = Intl.DateTimeFormat().resolvedOptions()

  const durationSinceSunriseUtc = nowUtc.getTime() - sunriseUtc.getTime()
  const nowLst = addMilliseconds(startOfDay(sunriseUtc), durationSinceSunriseUtc)
  const nowLstPlus24 = addDays(nowLst, 1)

  return {
    localTimezone: localeOptions.timeZone,
    sunriseLocal: sunrise,
    sunriseUtc,
    nowLocal,
    nowUtc,
    nowLst,
    nowLstPlus24,
  }
}
