import format from 'date-fns/format'
import { useSuntimeInfo } from '../hooks/useSuntimeInfo'

export type HomeProps = {
  position: GeolocationPosition
}

export function Home({ position }: HomeProps) {
  const suntimeInfo = useSuntimeInfo(position)

  const facets: ReadonlyArray<{ label: string; value: string; strong?: boolean }> = [
    {
      label: 'Geolocation',
      value: `${position.coords.latitude}, ${position.coords.longitude}`,
    },
    {
      label: `Now (${suntimeInfo.localTimezone})`,
      value: format(suntimeInfo.nowLocal, `dd-MM-yyyy HH:mm:ss`),
    },
    {
      label: `Now (UTC)`,
      value: format(suntimeInfo.nowUtc, `dd-MM-yyyy HH:mm:ss`),
    },
    {
      label: `Sunrise (${suntimeInfo.localTimezone})`,
      value: format(suntimeInfo.sunriseLocal, `dd-MM-yyyy HH:mm:ss`),
    },
    {
      label: `Sunrise (UTC)`,
      value: format(suntimeInfo.sunriseUtc, `dd-MM-yyyy HH:mm:ss`),
    },
    {
      label: `Now (LST)`,
      value: format(suntimeInfo.nowLst, `dd-MM-yyyy HH:mm:ss`),
      strong: true,
    },
    {
      label: `Now (LST+24)`,
      value: format(suntimeInfo.nowLstPlus24, `dd-MM-yyyy HH:mm:ss`),
      strong: true,
    },
  ]

  return (
    <table>
      <tbody>
        {facets.map((facet) => (
          <tr key={facet.label}>
            <td>{facet.strong ? <strong>{facet.label}</strong> : facet.label}</td>
            <td>{facet.strong ? <strong>{facet.value}</strong> : facet.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
