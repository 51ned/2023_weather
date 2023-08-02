import { MainLayout } from './layouts/main'

import { mainStore } from './stores'

import { Canvas, WeatherApp } from './views'

import '../public/styles/index.css'


export default function Home() {
  const {setData, points } = mainStore

  const dataChannel = new BroadcastChannel('dataChannel')
  const funcChannel = new BroadcastChannel('funcChannel')

  dataChannel.onmessage = e => setData(e.data)
  funcChannel.onmessage = e => localStorage.setItem(e.data, 'true')


  return (
    <MainLayout>
      <WeatherApp>
        <Canvas points={points} />
      </WeatherApp>
    </MainLayout>
  )
}
