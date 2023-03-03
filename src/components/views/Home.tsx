import format from 'date-fns/format'
import { useState } from 'react'
import { SuntimeInfo, SuntimeTimeInfo } from '../../lib/SuntimeInfo'
import { useSuntimeInfo } from '../hooks/useSuntimeInfo'

export type HomeProps = {
  position: GeolocationPosition
}

const displayOrder: Array<keyof SuntimeInfo['timezones']> = ['utc', 'lst', 'lst+24', 'local']
// eslint-disable-next-line no-script-url
const fakeLink = 'javascript:void(0)'

export function Home({ position }: HomeProps) {
  const [showMoreInfo, setShowMoreInfo] = useState<boolean>(false)
  const lstOffsetResolution = '5 minutes'
  const suntimeInfo = useSuntimeInfo(position, lstOffsetResolution)
  const useLst24 = true as boolean
  const timeinfo = suntimeInfo.timezones[useLst24 ? 'lst+24' : 'lst']

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <h1 style={{ textAlign: 'center' }}>{format(timeinfo.now, `H:mm:ssaaa`)}</h1>
        <div>
          <div>
            Geolocation: {position.coords.latitude}, {position.coords.longitude}
          </div>
          <div>LST Offset Resolution: {lstOffsetResolution}</div>
          <div>LST+24 Enabled: {useLst24 ? 'Yes' : 'No'}</div>
          <div>UTC Offset: {formatOffset(timeinfo.offset)}</div>
        </div>
        {showMoreInfo === true && (
          <table style={{ marginTop: '15px' }}>
            <thead>
              <tr>
                <th>Timezone</th>
                <th>Current Time</th>
                <th>Today's Sunrise Time</th>
                <th>UTC Offset</th>
              </tr>
            </thead>
            <tbody>
              {displayOrder.map((id) => (
                <TimeInfoRow
                  key={id}
                  id={id as keyof SuntimeInfo['timezones']}
                  suntimeInfo={suntimeInfo.timezones[id]}
                />
              ))}
            </tbody>
          </table>
        )}
        <div style={{ marginTop: '15px' }}>
          <a href={fakeLink} onClick={() => setShowMoreInfo(!showMoreInfo)}>
            {showMoreInfo ? 'Less info' : 'More info'}
          </a>
        </div>
      </div>
    </>
  )
}

const timezoneDisplayNames: Record<keyof SuntimeInfo['timezones'], string> = {
  utc: 'UTC',
  local: Intl.DateTimeFormat().resolvedOptions().timeZone,
  lst: 'LST',
  'lst+24': 'LST+24',
}

type TimeInfoRowProps = {
  id: keyof SuntimeInfo['timezones']
  suntimeInfo: SuntimeTimeInfo
}

function TimeInfoRow({ id: key, suntimeInfo }: TimeInfoRowProps): JSX.Element {
  const cellStyle = { paddingLeft: '15px', paddingRight: '15px', textAlign: 'center' } as const
  return (
    <tr>
      <td style={cellStyle}>{timezoneDisplayNames[key]}</td>
      <td style={cellStyle}>{format(suntimeInfo.now, `dd-MM-yyyy H:mm:ss`)}</td>
      <td style={cellStyle}>{format(suntimeInfo.sunrise, `dd-MM-yyyy HH:mm:ss`)}</td>
      <td style={cellStyle}>{suntimeInfo.offset ? formatOffset(suntimeInfo.offset) : '~'}</td>
    </tr>
  )
}

function formatOffset(offset: number): string {
  const sign = offset < 0 ? '-' : '+'
  const offsetAbs = Math.abs(offset)
  const minutes = Math.floor(offsetAbs / 60 / 1000)
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${sign}${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`
}
