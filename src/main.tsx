import React from 'react'
import ReactDOM from 'react-dom/client'

import { autorun } from 'mobx'
import { observer } from 'mobx-react-lite'

import { buttonStore, mainStore } from './stores'

import App from './App'

import { DEF_VER_DB } from './lib/consts'


let verDB = +(localStorage.getItem('verDB') || DEF_VER_DB)


autorun(() => {
  const chartName = buttonStore.chartName
  const chartData = mainStore.chartData

  if (!localStorage.getItem(`${chartName}StoreExist`)) {
    if(!chartData[chartName]) {
      const queryParams = new URLSearchParams({ chartname: chartName, verdb: String(verDB) })
      const swURL = `/main-sw.js?${queryParams}`

      navigator.serviceWorker.register(swURL)
      localStorage.setItem('currVerDB', String(++verDB))
    }
  }

  if (localStorage.getItem(`${chartName}StoreExist`)) {
    if(!chartData[chartName]) {
      const extractChannel = new BroadcastChannel('extractChannel')
      extractChannel.postMessage(chartName)
    }
  }
})


const ObservedApp = observer(App)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ObservedApp />
)
