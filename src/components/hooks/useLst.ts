import { useCallback, useMemo } from 'react'
import { DateTimeOffset } from '../../lib/DateTimeOffset'
import { DateUtils } from '../../lib/DateUtils'
import { LocalSunTimeAdjustmentsOptions, LocalSunTimeV2, TimeZoneAdjustment } from '../../lib/LocalSunTimeV2'
import { usePolling } from './usePolling'

export type { LocalSunTimeAdjustmentsOptions }

export type Lst = {
  now: DateTimeOffset
  currentAdjustment: TimeZoneAdjustment
  adjustments: TimeZoneAdjustment[]
}

export function useLst(options: LocalSunTimeAdjustmentsOptions): Lst {
  const adjustments = useLstAdjustments(options)
  const currentAdjustment = useCurrentLstAdjustment(adjustments)
  const now = useLstNow(currentAdjustment)

  return {
    now,
    currentAdjustment,
    adjustments,
  }
}

function useLstAdjustments(options: LocalSunTimeAdjustmentsOptions): TimeZoneAdjustment[] {
  const getLstAdjustments = useCallback(() => LocalSunTimeV2.calculateAdjustments(options), [options])
  return usePolling(getLstAdjustments, 60 * 1000)
}

function useCurrentLstAdjustment(adjustments: TimeZoneAdjustment[]): TimeZoneAdjustment {
  return useMemo(() => LocalSunTimeV2.findAdjustment(adjustments, DateUtils.currentTimestamp()), [adjustments])
}

function useLstNow(currentAdjustment: TimeZoneAdjustment): DateTimeOffset {
  const getLstNow = useCallback(() => DateTimeOffset.now(currentAdjustment.offset), [currentAdjustment])
  return usePolling(getLstNow, 200)
}
