import { useGeolocation } from './components/hooks/useGeolocation'
import { Home } from './components/views/Home'

function App(): JSX.Element {
  const geolocationResult = useGeolocation()
  switch (geolocationResult.type) {
    case 'approved':
      return <Home position={geolocationResult.position} />
    case 'pending':
      return <span>Geolocation permission pending</span>
    case 'denied':
      return <span>Geolocation is required to use this site. TODO: Add manual location input</span>
  }
}

export default App
