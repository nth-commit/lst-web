import { useMemo, useState } from 'react'
import { DateTimeOffset } from '../../lib/DateTimeOffset'
import { DateUtils } from '../../lib/DateUtils'
import { LocalSunTimeAdjustmentsOptions, useLst } from '../hooks/useLst'

export type HomeProps = {
  position: GeolocationPosition
}

// eslint-disable-next-line no-script-url
const fakeLink = 'javascript:void(0)'

export function Home({ position }: HomeProps) {
  const [showMoreInfo, setShowMoreInfo] = useState<boolean>(false)

  const lstOptions = useMemo<LocalSunTimeAdjustmentsOptions>(
    () => ({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      lstOffsetResolution: '5 minutes',
      useLstPlus24: true,
      adjustmentTimeOffset: -4 * 60 * 60 * 1000,
    }),
    [position.coords.latitude, position.coords.longitude]
  )

  const { now, currentAdjustment, adjustments } = useLst(lstOptions)

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <h1 style={{ textAlign: 'center' }}>{DateTimeOffset.format(now, `h:mm:ssaaa`)}</h1>
        <div style={{ marginBottom: '15px' }}>
          <div>
            Geolocation: {position.coords.latitude}, {position.coords.longitude}
          </div>
          <div>LST Offset Resolution: {lstOptions.lstOffsetResolution}</div>
          <div>LST+24 Enabled: {lstOptions.useLstPlus24 ? 'Yes' : 'No'}</div>
          <div>UTC Offset: {DateUtils.formatOffset(currentAdjustment.offset)}</div>
        </div>
        {showMoreInfo === true && (
          <div style={{ marginBottom: '15px' }}>
            <h2>Timezone Adjustments</h2>
            <div style={{ marginLeft: '15px' }}>
              <p>Number of adjustments: {adjustments.length}</p>
              <p>Mean adjustment frequency: {Math.round(365 / adjustments.length)} days</p>
              <table>
                <thead>
                  <tr>
                    <th style={{ paddingRight: '15px' }}>Adjustment Date</th>
                    <th style={{ paddingRight: '15px' }}>UTC Offset</th>
                  </tr>
                </thead>
                <tbody>
                  {adjustments.map((adjustment) => (
                    <tr
                      key={adjustment.timestamp}
                      style={{ background: adjustment === currentAdjustment ? 'gray' : 'none' }}
                    >
                      <td style={{ textAlign: 'center' }}>
                        {DateTimeOffset.format(
                          { timestamp: adjustment.timestamp, offset: adjustment.offset },
                          'yyyy-MM-dd'
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>{DateUtils.formatOffset(adjustment.offset)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div>
          <a href={fakeLink} onClick={() => setShowMoreInfo(!showMoreInfo)}>
            {showMoreInfo ? 'Less info' : 'More info'}
          </a>
        </div>
      </div>
    </>
  )
}
