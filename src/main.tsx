import React from 'react'
import ReactDOM from 'react-dom/client'

import { autorun } from 'mobx'
import { observer } from 'mobx-react-lite'

import { buttonStore, mainStore } from './stores'

import App from './App'

import { DEF_VER_DB } from './lib/consts'


const mainWW = new Worker('/workers/main-ww.js')
const subSW = navigator.serviceWorker.register('/workers/sub-sw.js')

let verDB = +(localStorage.getItem('verDB') || DEF_VER_DB)

autorun(() => {
  const chartName = buttonStore.chartName
  const { chartData, setData } = mainStore

  if (!localStorage.getItem(`${chartName}StoreExist`)) {
    if(!chartData[chartName]) {
      localStorage.setItem('currVerDB', String(++verDB))
      mainWW.postMessage({chartName: chartName, type: 'initReq'})
    }
  }

  if (localStorage.getItem(`${chartName}StoreExist`)) {
    if(!chartData[chartName]) {
      mainWW.postMessage({type: 'extractReq', chartName: chartName})
    }
  }

  mainWW.onmessage = e => {
    if (e.data.type === 'initRes') {
      localStorage.setItem(`${chartName}StoreExist`, 'true')
      setData(e.data.chartData)

      subSW.then(reg => {
        if (reg.active) {
          reg.active.postMessage({
            chartData: e.data.chartData, 
            chartName: chartName,
            verDB: verDB
          })
        }
      })
    }

    if (e.data.type === 'extractRes') {
      setData(e.data.chartData)
    }
  }
})


const ObservedApp = observer(App)


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ObservedApp />
)
