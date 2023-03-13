export namespace DateUtils {
  export function formatOffset(offset: number): string {
    const sign = offset < 0 ? '-' : '+'
    const offsetAbs = Math.abs(offset)
    const minutes = Math.floor(offsetAbs / 60 / 1000)
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${sign}${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`
  }
}
