import { useGeolocation } from './components/hooks/useGeolocation'
import { Home } from './components/views/Home'

function App(): JSX.Element {
  const geolocationResult = useGeolocation()
  switch (geolocationResult.type) {
    case 'approved':
      return (
        <div style={{ marginLeft: '15px', marginRight: '15px', height: '100%' }}>
          <Home position={geolocationResult.position} />
        </div>
      )
    case 'pending':
      return <span></span>
    case 'denied':
      return <span>Geolocation is required to use this site. TODO: Add manual location input</span>
  }
}

export default App
