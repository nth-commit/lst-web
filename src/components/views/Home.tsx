import { useState } from 'react'
import { DateTimeOffset } from '../../lib/DateTimeOffset'
import { DateUtils } from '../../lib/DateUtils'
import { useLst } from '../hooks/useLst'
import { LocalSunTimeAdjustmentsOptions, useLstOffset } from '../hooks/useLstOffset'

export type HomeProps = {
  position: GeolocationPosition
}

// eslint-disable-next-line no-script-url
const fakeLink = 'javascript:void(0)'

export function Home({ position }: HomeProps) {
  const [showMoreInfo, setShowMoreInfo] = useState<boolean>(false)

  const options: LocalSunTimeAdjustmentsOptions = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    lstOffsetResolution: '5 minutes',
    useLstPlus24: true,
    adjustmentTimeOffset: -4 * 60 * 60 * 1000,
  }

  const lstOffset = useLstOffset(options)
  const lst = useLst(options)

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <h1 style={{ textAlign: 'center' }}>{DateTimeOffset.format(lst, `h:mm:ssaaa`)}</h1>
        <div>
          <div>
            Geolocation: {position.coords.latitude}, {position.coords.longitude}
          </div>
          <div>LST Offset Resolution: {options.lstOffsetResolution}</div>
          <div>LST+24 Enabled: {options.useLstPlus24 ? 'Yes' : 'No'}</div>
          <div>UTC Offset: {DateUtils.formatOffset(lstOffset)}</div>
        </div>
        {showMoreInfo === true && <div>Nothing here yet!</div>}
        <div style={{ marginTop: '15px' }}>
          <a href={fakeLink} onClick={() => setShowMoreInfo(!showMoreInfo)}>
            {showMoreInfo ? 'Less info' : 'More info'}
          </a>
        </div>
      </div>
    </>
  )
}
