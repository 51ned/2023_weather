import { useContext, useEffect } from 'react'

import { MainLayout } from './layouts/main'

import { Chart, WeatherApp } from './components'

import { ChartContext, YearsProvider } from './stores'

import { getData } from './utils'

import { DEF_VER_DB, NAME_DB } from './lib/consts'
import type { ItemProps } from './lib/interfaces'

import './styles/index.css'


export default function Home() {
  const { chartState } = useContext(ChartContext)
  const { chartName } = chartState
  

  useEffect(() => {
    let currVerDB = +(localStorage.getItem('currVerDB') || DEF_VER_DB)

    const getStore = () => {
      const reqDB = indexedDB.open(NAME_DB, currVerDB)

      reqDB.onupgradeneeded = () => {
        reqDB.result.createObjectStore(`${chartName}`, { autoIncrement: true })
        reqDB.result.onerror = (e: Event) => console.error(`${(e.target as IDBRequest).error}`)
      }

      reqDB.onsuccess = () => formStore(reqDB.result)
      reqDB.onerror = (e: Event) => console.error(`${(e.target as IDBRequest).error}`)
    }

    const formStore = async (db: IDBDatabase) => {
      const data = await getData<ItemProps>(`/data/${chartName}.json`) // узкое место, мне не нравится
      const tx = db.transaction(`${chartName}`, 'readwrite') 
      const store = tx.objectStore(`${chartName}`)

      data.forEach(obj => store.add(obj.v)) // см. src/utils/get-indexes.ts
    
      tx.oncomplete = () => {
        localStorage.setItem(`${chartName}StoreFilled`, 'true')
        db.close()
      }
        
      tx.onerror = (e: Event) => console.error(`${(e.target as IDBTransaction).error}`)
    }

    if (localStorage.getItem(`${chartName}StoreFilled`) !== 'true') {
      localStorage.setItem('currVerDB', String(++currVerDB))
      getStore()
    }
  }, [chartName])


  return (
    <MainLayout>
      <YearsProvider>
        <WeatherApp>
          <Chart />
        </WeatherApp>
      </YearsProvider>
    </MainLayout>
  )
}
