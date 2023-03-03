import { useEffect, useState } from 'react'
import { SuntimeInfo, SuntimeTimeInfo, SuntimeInfoOptions } from '../../lib/SuntimeInfo'

export { SuntimeInfo }
export type { SuntimeTimeInfo }

export function useSuntimeInfo(
  position: GeolocationPosition,
  lstOffsetResolution: SuntimeInfoOptions['lstOffsetResolution']
): SuntimeInfo {
  const [suntimeInfo, setSuntimeInfo] = useState<SuntimeInfo>(calculate(position, lstOffsetResolution))

  useEffect(() => {
    const timer = setInterval(() => {
      setSuntimeInfo(calculate(position, lstOffsetResolution))
    }, 100)

    return () => clearInterval(timer)
  }, [position, lstOffsetResolution])

  return suntimeInfo
}

const calculate = (position: GeolocationPosition, lstOffsetResolution: SuntimeInfoOptions['lstOffsetResolution']) => {
  const { latitude, longitude } = position.coords

  const options: SuntimeInfoOptions = {
    timestamp: new Date().getTime(),
    latitude,
    longitude,
    localTimezoneOffset: -new Date().getTimezoneOffset() * 60 * 1000,
    lstOffsetResolution,
  }

  return SuntimeInfo.calculate(options)
}
