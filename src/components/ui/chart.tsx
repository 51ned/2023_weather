import { useContext, useEffect, useRef, useState } from 'react'

import { ChartContext, YearsContext } from '../../stores'

import { drawChart, getIndexes } from '../../utils'

import style from './chart.module.css'


const NAME_DB = 'WeatherDB'

const DEF_BATCH_SIZE = 365
const TARGET_TIME = 16.7


export function Chart() {
  const { yearsState } = useContext(YearsContext)
  const { firstYear, lastYear } = yearsState

  const { chartState } = useContext(ChartContext)
  const { chartName } = chartState

  const [toggle, setToggle] = useState<string | null>(null)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)


  useEffect(() => {
    const storageListner = setInterval(() => {
      if (localStorage.getItem(`${chartName}StoreFilled`) === 'true') {
        clearInterval(storageListner)
        setToggle('str')
      }
    }, 100)
  }, [chartName, firstYear, lastYear])


  useEffect(() => {
    let processChartFrameID: number
  
    if (toggle) {
      const reqDB = indexedDB.open(NAME_DB)
  
      reqDB.onsuccess = () => {
        const tx = reqDB.result.transaction(`${chartName}`, 'readonly')
        const store = tx.objectStore(`${chartName}`)
  
        const [firstIndex, lastIndex] = getIndexes(firstYear, lastYear)
        const range = IDBKeyRange.bound(firstIndex, lastIndex)
        
        const storeReq = store.getAll(range)
  
        storeReq.onsuccess = () => {
          let batchFirstIndex = firstIndex
          let batchLastIndex = DEF_BATCH_SIZE
  
          const processChart = () => {
            const drawStart = performance.now()
  
            const batch = storeReq.result.slice(batchFirstIndex, batchLastIndex)
            drawChart(canvasRef.current, batch)

            const drawFinish = performance.now()
            const drawTime = drawFinish - drawStart
            
            batchFirstIndex = batchLastIndex

            if (drawTime === 0) {
              batchLastIndex = lastIndex
            }
  
            if (drawTime < TARGET_TIME) {
              batchLastIndex = Math.min(
                Math.ceil(batchLastIndex * (TARGET_TIME / drawTime)), lastIndex
              )
            }
  
            if (drawTime > TARGET_TIME) {
              batchLastIndex = Math.min(
                Math.floor(batchLastIndex * (TARGET_TIME / drawTime)), lastIndex
              )
            }
  
            if (batchLastIndex < lastIndex) {
              processChartFrameID = requestAnimationFrame(processChart)
            }
          }

          processChart()
        }
        
        storeReq.onerror = (e: Event) => console.error(`${(e.target as IDBRequest).error}`)
  
        tx.oncomplete = () => reqDB.result.close()
        tx.onerror = (e: Event) => console.error(`${(e.target as IDBTransaction).error}`)
      }
    }
  
    return () => {
      setToggle(null)
      cancelAnimationFrame(processChartFrameID)
    }
  }, [chartName, firstYear, lastYear, toggle])


  return <canvas ref={canvasRef} />
}
