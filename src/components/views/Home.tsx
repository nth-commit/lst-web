import format from 'date-fns/format'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import { SuntimeInfo, SuntimeTimeInfo } from '../../lib/SuntimeInfo'
import { useSuntimeInfo } from '../hooks/useSuntimeInfo'

export type HomeProps = {
  position: GeolocationPosition
}

const displayOrder: Array<keyof SuntimeInfo['timezones']> = ['lst', 'lst+24', 'local', 'utc']

export function Home({ position }: HomeProps) {
  const lstOffsetResolution = '5 minutes'
  const suntimeInfo = useSuntimeInfo(position, lstOffsetResolution)

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <h1 style={{ textAlign: 'center' }}>{format(suntimeInfo.timezones['lst+24'].now, `H:mm:ssaaa`)}</h1>
        <table>
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
              <TimeInfoRow key={id} id={id as keyof SuntimeInfo['timezones']} suntimeInfo={suntimeInfo.timezones[id]} />
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 'auto', marginBottom: '15px', paddingLeft: '5px' }}>
          <div>
            Geolocation: {position.coords.latitude}, {position.coords.longitude}
          </div>
          <div>LST Offset Resolution: {lstOffsetResolution}</div>
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
  return `${sign}${formatDistanceStrict(offset, new Date(0), { unit: 'minute' })}`
}
