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
        reqDB.result.onerror = (e: Event) => console.error(`${(e.target as IDBRequest).error}`)
        reqDB.result.createObjectStore(`${chartName}`, { autoIncrement: true })
      }

      reqDB.onsuccess = () => formStore(reqDB.result)
      reqDB.onerror = (e: Event) => console.error(`${(e.target as IDBRequest).error}`)
    }


    const formStore = async (db: IDBDatabase) => {
      const data = await getData<ItemProps>(`../data/${chartName}.json`) // тут узенько, мне не нравится
      const tx = db.transaction(`${chartName}`, 'readwrite') 
      const store = tx.objectStore(`${chartName}`)

      data.forEach(obj => store.add(obj.v)) // см. src/utils/get-indexes.ts
    
      tx.oncomplete = () => {
        db.close()
        localStorage.setItem(`${chartName}StoreFilled`, 'true')
      }
        
      tx.onerror = (e: Event) => console.error(`${(e.target as IDBTransaction).error}`)
    }


    if (localStorage.getItem(`${chartName}StoreFilled`) !== 'true') {
      localStorage.setItem('currVerDB', String(++currVerDB))
      getStore()
    }
  }, [chartName])


  return (
    <YearsProvider>
      <MainLayout>
        <WeatherApp>
          <Chart />
        </WeatherApp>
      </MainLayout>
    </YearsProvider>
  )
}
