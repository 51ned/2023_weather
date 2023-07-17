import { useContext, useEffect, useRef, useState } from 'react'

import { ChartContext, YearsContext } from '../../stores'

import { drawChart, getIndexes } from '../../utils'

import style from './chart.module.css'


const NAME_DB = 'WeatherDB'


export function Chart() {
  const { yearsState } = useContext(YearsContext)
  const { firstYear, lastYear } = yearsState

  const { chartState } = useContext(ChartContext)
  const { chartName } = chartState

  const [toggle, setToggle] = useState<string | null>(null)


  useEffect(() => {
    const storageListner = setInterval(() => {
      if (localStorage.getItem(`${chartName}StoreFilled`) === 'true') {
        clearInterval(storageListner)
        setToggle('str')
      }
    }, 100)
  }, [chartName, firstYear, lastYear])


  useEffect(() => {
    if (toggle) {
      const reqDB = indexedDB.open(NAME_DB)

      reqDB.onsuccess = () => {
        const tx = reqDB.result.transaction(`${chartName}`, 'readonly')
        const store = tx.objectStore(`${chartName}`)

        console.log(store.count())

        tx.oncomplete = () => reqDB.result.close()
      }
    }

    return () => setToggle(null)
  }, [chartName, firstYear, lastYear, toggle])


  return null
}