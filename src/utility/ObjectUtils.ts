export const mapObject = <T, K extends keyof any, U>(obj: Record<K, T>, fn: (value: T, key: K) => U): Record<K, U> => {
  const result = {} as Record<K, U>
  for (const key in obj) {
    result[key] = fn(obj[key], key)
  }
  return result
}
