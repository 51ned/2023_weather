import { useContext, useEffect, useState } from 'react'

import { ChartContext, YearsProvider } from './stores'

import { getData } from './utils'

import type { ItemProps, ChartDataProps } from './utils/interfaces'

import { WeatherApp } from './components/weather-app'
import { Chart } from './components/ui'


const NAME_DB = 'WeatherDB'
const DEF_VER_DB = 1


export default function Home() {
  const { chartState } = useContext(ChartContext)
  const { chartName } = chartState

  const [points, setPoints] = useState<ChartDataProps>({
    precipitation: null,
    temperature: null
  })


  useEffect(() => {
    let currVerDB = +(localStorage.getItem('currVerDB') || DEF_VER_DB)

    const reqDB = indexedDB.open(NAME_DB, currVerDB)
    const chartPoints = points[`${chartName as keyof ChartDataProps}`]


    const getStore = (): Promise<IDBDatabase> => {
      return new Promise((rs, rj) => {
        reqDB.onupgradeneeded = () => {
          reqDB.result.onerror = (e: Event) => rj(new Error(`${(e.target as IDBRequest).error}`))
          reqDB.result.createObjectStore(`${chartName}Items`, { autoIncrement: true })
        }

        reqDB.onsuccess = () => {
          localStorage.getItem(`${chartName}StoreFormed`) === 'true'
            ? setState(reqDB.result)
            : checkStore(reqDB.result)
          
          rs(reqDB.result)
        }

        reqDB.onerror = (e: Event) => rj(new Error(`${(e.target as IDBRequest).error}`))
      })
    }


    const checkStore = (db: IDBDatabase) => {
      if (!db.objectStoreNames.contains(`${chartName}Items`)) {
        db.close()
        localStorage.setItem('currVerDB', String(++currVerDB))
        getStore()
      }

      else formStore(db)
    }


    const formStore = async (db: IDBDatabase) => {
      const data = await getData<ItemProps>(`../data/${chartName}.json`)
      const tx = db.transaction(`${chartName}Items`, 'readwrite') 
      const store = tx.objectStore(`${chartName}Items`)

      data.forEach(obj => store.add(obj.v))

      localStorage.setItem(`${chartName}StoreFormed`, 'true')
    
      return new Promise<IDBDatabase>((rs, rj) => {
        tx.oncomplete = () => {
          setState(db)
          rs(db)
        }

        tx.onerror = (e: Event) => rj(new Error(`${(e.target as IDBTransaction).error}`))
      })
    }


    const setState = (db: IDBDatabase) => {
      return new Promise((rs, rj) => {
        const tx = db.transaction(`${chartName}Items`, 'readonly')
        const store = tx.objectStore(`${chartName}Items`)
        const req = store.getAll()

        req.onsuccess = () => {
          tx.oncomplete = () => {
            rs(setPoints({...points, [`${chartName}`]: req.result}))
            db.close()
          }
        }

        req.onerror = (e: Event) => rj(new Error(`${(e.target as IDBRequest).error}`))
        tx.onerror = (e: Event) => rj(new Error(`${(e.target as IDBTransaction).error}`))
      })
    }


    !chartPoints && getStore()
  }, [chartName])


  return (
    <YearsProvider>
      <WeatherApp>
        <Chart data={ points[`${chartName as keyof ChartDataProps}`] } />
      </WeatherApp>
    </YearsProvider>
  )
}
