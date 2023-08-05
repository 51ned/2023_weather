import { MainLayout } from './views/layouts/main'

import { mainStore } from './stores'

import { Canvas, WeatherApp } from './views'


export default function Home() {
  const points = mainStore.points ?? []
  
  return (
    <MainLayout>
      <WeatherApp>
        <Canvas points={points} />
      </WeatherApp>
    </MainLayout>
  )
}
