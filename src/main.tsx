import React from 'react'
import ReactDOM from 'react-dom/client'

import { autorun } from 'mobx'
import { observer } from 'mobx-react-lite'

import { buttonStore, mainStore } from './stores'

import App from './App'

import { registerSW } from './utils'

import { DEF_VER_DB } from './lib/consts'


const funcChannel = new BroadcastChannel('funcChannel')
let verDB = +(localStorage.getItem('verDB') || DEF_VER_DB)

autorun(() => {
  const chartName = buttonStore.chartName
  const chartData = mainStore.chartData

  if (!localStorage.getItem(`${chartName}StoreExist`)) {
    if(!chartData[chartName]) {
      localStorage.setItem('currVerDB', String(++verDB))
      registerSW(chartName, verDB)
    }
  }

  if (localStorage.getItem('isFirstSession') === 'false') {
    if (localStorage.getItem(`${chartName}StoreExist`)) {
      if(!chartData[chartName]) {
        localStorage.setItem('currVerDB', String(++verDB))
        funcChannel.postMessage({chartName, verDB})
      }
    }
  }
})


if (!localStorage.getItem('isFirstSession')) {
  window.onbeforeunload = () => {
    localStorage.setItem('isFirstSession', 'false')
  }
}


const ObservedApp = observer(App)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ObservedApp />
)