import { useContext, useEffect, useRef, useState } from 'react'

import { ChartContext, YearsContext } from '../../stores'

import { createChartDrawer, getIndexes } from '../../utils'

import style from './chart.module.css'


const NAME_DB = 'WeatherDB'

const DEF_BATCH_SIZE = 1
const TARGET_TIME = 16.67


export function Chart() {
  const { yearsState } = useContext(YearsContext)
  const { firstYear, lastYear } = yearsState

  const { chartState } = useContext(ChartContext)
  const { chartName } = chartState

  const [toggle, setToggle] = useState<string | null>(null)

  const frameRef = useRef<number>()

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const drawChart = createChartDrawer(canvasRef.current)

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
  
        const [firstIndex, lastIndex] = getIndexes(firstYear, lastYear)
        const range = IDBKeyRange.bound(firstIndex, lastIndex)
        
        const storeReq = store.getAll(range)
  
        storeReq.onsuccess = () => {
          let batchFirstIndex = 0
          let batchLastIndex = DEF_BATCH_SIZE

          let anmStart: number | null = null
  
          const processChart = (timeStamp: number) => {
            if (!anmStart) {
              anmStart = timeStamp
            }

            const anmTime = timeStamp - anmStart

            const drawStart = performance.now()
  
            drawChart(storeReq.result.slice(batchFirstIndex, batchLastIndex))

            const drawFinish = performance.now()
            const drawTime = drawFinish - drawStart
            const totalTime = anmTime + drawTime
            
            batchFirstIndex = batchLastIndex

            switch (true) {
              case totalTime === 0:
                batchLastIndex = Math.min(Math.round(batchLastIndex * TARGET_TIME), lastIndex)
                break
              case totalTime < TARGET_TIME:
                batchLastIndex = Math.min(Math.round(batchLastIndex * (TARGET_TIME / drawTime)), lastIndex)
                break
              case totalTime === TARGET_TIME:
                batchLastIndex = batchLastIndex
                break
              case totalTime > TARGET_TIME:
                batchLastIndex = Math.min(Math.round(batchLastIndex * (TARGET_TIME / drawTime)), lastIndex)
                break
            }
            
            if (batchLastIndex <= lastIndex) {
              frameRef.current = requestAnimationFrame(processChart)
            }
          }
          
          requestAnimationFrame(processChart)
        }
        
        storeReq.onerror = (e: Event) => console.error(`${(e.target as IDBRequest).error}`)
  
        tx.oncomplete = () => reqDB.result.close()
        tx.onerror = (e: Event) => console.error(`${(e.target as IDBTransaction).error}`)
      }
    }
  
    return () => {
      setToggle(null)
      frameRef.current && cancelAnimationFrame(frameRef.current)
    }
  }, [chartName, firstYear, lastYear, toggle])


  return <canvas ref={canvasRef} />
}
