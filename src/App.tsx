/*
  Первая сессия: запрос версии БД 'currVerDB' в localStorage => при её отсутствии присваивание значения DEF_VER_DB.
  Базы данных не существует: срабатывание обработчика onupgradeneeded => (хранилища не существует) =>
  создание хранилища 'temperatureItems' => увеличение 'currVerDB' на 1.
  Смена chartName: запрос версии БД 'currVerDB' в localStorage => значение переменной 2 / версия БД 1 =>
  повторное срабатывание обработчика onupgradeneeded => создание хранилища 'precipitationItems' =>
  увеличение 'currVerDB'.
*/

/*
  Если при первой сессии значение 'chartName' не было изменено, в начале второй сессии вызывается обработчик onupgradeneeded,
  но код внутри него будет проигнорирован (хранилище 'temeratureItems' уже существует). При смене значения 'chartName',
  обработчик onugpradeneeded будет проигнорирован (версия БД и currVerDB равны). На этот случай из обработчика onsuccess
  выполнение переходит в функцию 'checkStore', где запрашивается проверка наличия уже хранилища 'precipitationItems'
  и если его нет, БД закрывается, 'currVerDB' увеличивается (чтобы выполнился обработчик onupgradeneeded)
  и рекурсивно вызывается функция 'getStore'. Если хранилище есть, выполнение переходит в функцию 'formStore'.
*/

/*
  Так или иначе, мы в функции 'formStore'.
*/

import { useContext, useEffect, useState } from 'react'

import { ChartContext, YearsProvider } from './stores'

import { getData } from './utils'

import type { ItemProps, ChartDataProps } from './utils/interfaces'

import { WeatherApp } from './components/weather-app'
import { Chart } from './components/ui'


const NAME_DB = 'WeatherDB'
const DEF_VER_DB = 1
const UPD_TIME_DB = 21600000


export default function Home() {
  const { chartState } = useContext(ChartContext)
  const { chartName } = chartState

  const [points, setPoints] = useState<ChartDataProps>({
    precipitation: null,
    temperature: null
  })


  useEffect(() => {
    let currVerDB = +(localStorage.getItem('currVerDB') || DEF_VER_DB)


    const getStore = async (): Promise<IDBDatabase> => {
      return new Promise((rs, rj) => {
        const reqDB = indexedDB.open(NAME_DB, currVerDB)
        
        reqDB.onupgradeneeded = () => {
          reqDB.result.onerror = (e: Event) => rj(new Error(`${(e.target as IDBRequest).error}`))

          if (!reqDB.result.objectStoreNames.contains(`${chartName}Items`)) {
            reqDB.result.createObjectStore(`${chartName}Items`, { autoIncrement: true })
            localStorage.setItem('currVerDB', String(++currVerDB))
          }
        }

        reqDB.onsuccess = async () => {
          await checkStore(reqDB.result)
          rs(reqDB.result)
        }

        reqDB.onerror = (e: Event) => rj(new Error(`${(e.target as IDBRequest).error}`))
      })
    }


    const checkStore = async (db: IDBDatabase) => {
      if (!db.objectStoreNames.contains(`${chartName}Items`)) {
        db.close()
        localStorage.setItem('currVerDB', String(++currVerDB))
        await getStore()
      }

      else await formStore(db)
    }


    const formStore = async (db: IDBDatabase): Promise<IDBDatabase> => {
      let tx: IDBTransaction
      let store: IDBObjectStore

      await getData<ItemProps>(`../data/${chartName}.json`)
        .then(data => {
          tx = db.transaction(`${chartName}Items`, 'readwrite') 
          store = tx.objectStore(`${chartName}Items`)
          data.forEach(obj => store.add(obj.v))
        })
    
      return new Promise<IDBDatabase>((rs, rj) => {
        tx.oncomplete = async () => {
          setState(db)
          rs(db)
        }

        tx.onerror = (e: Event) => rj(new Error(`${(e.target as IDBTransaction).error}`))
      })
    }


    const setState = async (db: IDBDatabase) => {
      return new Promise((rs, rj) => {
        const tx = db.transaction(`${chartName}Items`, 'readonly')
        const store = tx.objectStore(`${chartName}Items`)
        const req = store.getAll()

        req.onsuccess = () => rs(setPoints({...points, [`${chartName}`]: req.result}))

        req.onerror = (e: Event) => rj(new Error(`${(e.target as IDBRequest).error}`))
        tx.onerror = (e: Event) => rj(new Error(`${(e.target as IDBTransaction).error}`))
      })
    }


    (async () => {
      await getStore()
    })()
  }, [chartName])


  useEffect(() => {
    console.log(points)
  }, [points])


  return (
    <YearsProvider>
      <WeatherApp>
        {/* <Chart data={data[`${chartName}` as keyofChartDataProps]} /> */}
      </WeatherApp>
    </YearsProvider>
  )
}
