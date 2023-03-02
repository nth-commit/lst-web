import { useCallback, useEffect, useState } from 'react'

export type GeolocationResult =
  | {
      type: 'approved'
      position: GeolocationPosition
    }
  | {
      type: 'pending'
    }
  | {
      type: 'denied'
    }

export function useGeolocation(): GeolocationResult {
  const [state, setState] = useState<GeolocationResult>({ type: 'pending' })

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setState({ type: 'approved', position })
  }, [])

  const handleError = useCallback(() => {
    setState({ type: 'denied' })
  }, [])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError)
  }, [handleSuccess, handleError])

  return state
}
