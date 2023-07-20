import { useContext, useEffect, useRef, useState } from 'react'

import { ChartContext, YearsContext } from '../stores'

import { Canvas } from './'

import { createChartDrawer, getIndexes } from '../utils'

import { DEF_BATCH_SIZE, NAME_DB, TARGET_TIME } from '../lib/consts'


export function Chart() {
  const { yearsState } = useContext(YearsContext)
  const { firstYear, lastYear } = yearsState

  const { chartState } = useContext(ChartContext)
  const { chartName } = chartState

  const [toggle, setToggle] = useState<string | null>(null)

  const frameRef = useRef<number>(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  
  const drawChart = createChartDrawer(canvasRef.current)

  useEffect(() => {
    const storageListner = setInterval(() => {
      if (localStorage.getItem(`${chartName}StoreFilled`) === 'true') {
        setToggle('str')
        clearInterval(storageListner)
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

            const anmTime = (timeStamp - anmStart) / 1000
            
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
                batchLastIndex = Math.min(Math.round(batchLastIndex * (TARGET_TIME / totalTime)), lastIndex)
                break
              case totalTime === TARGET_TIME:
                batchLastIndex = batchLastIndex
                break
              case totalTime > TARGET_TIME:
                batchLastIndex = Math.min(Math.round(batchLastIndex * (TARGET_TIME / totalTime)), lastIndex)
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
      cancelAnimationFrame(frameRef.current)
    }
  }, [chartName, firstYear, lastYear, toggle])


  return <Canvas ref={canvasRef} />
}
