import { useEffect, useState } from 'react'

export function usePolling<T>(getValue: () => T, interval: number): T {
  const [value, setValue] = useState<T>(getValue())

  useEffect(() => {
    const timer = setInterval(() => {
      setValue(getValue())
    }, interval)

    return () => clearInterval(timer)
  }, [getValue, interval])

  return value
}
