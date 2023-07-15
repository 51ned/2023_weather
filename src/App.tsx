import { useContext, useEffect } from 'react'

import { ChartContext, YearsProvider } from './stores'

import { getData } from './utils'

import type { ItemProps } from './utils/interfaces'

import { WeatherApp } from './components/weather-app'
import { Chart } from './components/ui'


const NAME_DB = 'WeatherDB'
const DEF_VER_DB = 0


export default function Home() {
  const { chartState } = useContext(ChartContext)
  const { chartName } = chartState


  useEffect(() => {
    let currVerDB = +(localStorage.getItem('currVerDB') || DEF_VER_DB)


    const getStore = (): Promise<IDBDatabase> => {
      const reqDB = indexedDB.open(NAME_DB, currVerDB)

      return new Promise((rs, rj) => {
        reqDB.onupgradeneeded = () => {
          reqDB.result.onerror = (e: Event) => rj(new Error(`${(e.target as IDBRequest).error}`))
          reqDB.result.createObjectStore(`${chartName}`, { autoIncrement: true })
        }

        reqDB.onsuccess = () => {
          formStore(reqDB.result)
          rs(reqDB.result)
        }

        reqDB.onerror = (e: Event) => rj(new Error(`${(e.target as IDBRequest).error}`))
      })
    }


    const formStore = async (db: IDBDatabase) => {
      const data = await getData<ItemProps>(`../data/${chartName}.json`)
      const tx = db.transaction(`${chartName}`, 'readwrite') 
      const store = tx.objectStore(`${chartName}`)

      data.forEach(obj => store.add(obj.v))
    
      tx.oncomplete = () => {
        db.close()
        localStorage.setItem(`${chartName}StoreFilled`, 'true')
      }
        
      tx.onerror = (e: Event) => new Error(`${(e.target as IDBTransaction).error}`)
    }


    if (localStorage.getItem(`${chartName}StoreFilled`) !== 'true') {
      localStorage.setItem('currVerDB', String(++currVerDB))
      getStore()
    }
  }, [chartName])


  return (
    <YearsProvider>
      <WeatherApp>
        <Chart />
      </WeatherApp>
    </YearsProvider>
  )
}
