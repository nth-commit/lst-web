import { useEffect, useState } from 'react'
import { SuntimeInfo, SuntimeInfoOptions } from '../../lib/SuntimeInfo'

export { SuntimeInfo }

export function useSuntimeInfo(position: GeolocationPosition): SuntimeInfo {
  const [suntimeInfo, setSuntimeInfo] = useState<SuntimeInfo>(calculate(position))

  useEffect(() => {
    const timer = setInterval(() => {
      setSuntimeInfo(calculate(position))
    }, 100)

    return () => clearInterval(timer)
  }, [position])

  return suntimeInfo
}

const calculate = (position: GeolocationPosition) => {
  const { latitude, longitude } = position.coords

  const options: SuntimeInfoOptions = {
    timestamp: new Date().getTime(),
    latitude,
    longitude,
    localTimezoneOffset: new Date().getTimezoneOffset() * 60 * 1000,
  }

  return SuntimeInfo.calculate(options)
}
