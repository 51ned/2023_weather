import { MainLayout } from './layouts/main'

import { mainStore } from './stores'

import { Canvas, WeatherApp } from './views'

import '../public/styles/index.css'


export default function Home() {
  const { points } = mainStore

  return (
    <MainLayout>
      <WeatherApp>
        <Canvas points={points} />
      </WeatherApp>
    </MainLayout>
  )
}
