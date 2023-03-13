import { useEffect, useState } from 'react'
import { LocalSunTimeAdjustmentsOptions, LocalSunTimeV2 } from '../../lib/LocalSunTimeV2'

export type { LocalSunTimeAdjustmentsOptions }

export function useLstOffset(options: LocalSunTimeAdjustmentsOptions): number {
  const [lstOffset, setLstOffset] = useState<number>(getCurrentLstOffset(options))

  useEffect(() => {
    const timer = setInterval(() => {
      setLstOffset(getCurrentLstOffset(options))
    }, 60 * 1000)

    return () => clearInterval(timer)
  }, [options])

  return lstOffset
}

const getCurrentLstOffset = (options: LocalSunTimeAdjustmentsOptions): number => {
  const timestamp = new Date().getTime()
  return LocalSunTimeV2.calculateCurrentUtcOffset({ ...options, timestamp })
}
