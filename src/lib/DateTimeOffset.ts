import fnsFormat from 'date-fns/format'

export type DateTimeOffset = {
  timestamp: number
  offset: number
}

export namespace DateTimeOffset {
  export function now(offset: number): DateTimeOffset {
    return {
      timestamp: new Date().getTime(),
      offset,
    }
  }

  export function format(d: DateTimeOffset, format: string): string {
    const systemTimeZoneOffset = -new Date().getTimezoneOffset() * 60 * 1000
    const date = new Date(d.timestamp - systemTimeZoneOffset + d.offset)
    return fnsFormat(date, format)
  }
}
