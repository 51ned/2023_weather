import { MainLayout } from './views/layouts/main'

import { mainStore } from './stores'

import { Canvas, Placeholder, WeatherApp } from './views'


export default function Home() {
  const points = mainStore.points
  
  return (
    <MainLayout>
      <WeatherApp>
        { !points ? <Placeholder /> : <Canvas points={points} /> }
      </WeatherApp>
    </MainLayout>
  )
}
