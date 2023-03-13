import { useEffect, useState } from 'react'
import { DateTimeOffset } from '../../lib/DateTimeOffset'
import { LocalSunTimeAdjustmentsOptions } from '../../lib/LocalSunTimeV2'
import { useLstOffset } from './useLstOffset'

export type { LocalSunTimeAdjustmentsOptions }

export function useLst(options: LocalSunTimeAdjustmentsOptions): DateTimeOffset {
  const lstOffset = useLstOffset(options)
  const [lst, setLst] = useState<DateTimeOffset>(DateTimeOffset.now(lstOffset))

  useEffect(() => {
    const timer = setInterval(() => {
      setLst(DateTimeOffset.now(lstOffset))
    }, 200)

    return () => clearInterval(timer)
  }, [lstOffset])

  return lst
}
