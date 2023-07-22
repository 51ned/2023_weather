import { useContext, useEffect, useRef, useState } from 'react'

import { ChartContext, YearsContext } from '../stores'

import { Canvas } from './'

import { createChartDrawer, getIndexes } from '../utils'

import { DEF_BATCH_SIZE, NAME_DB } from '../lib/consts'


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
          
          const formChart = () => {
            drawChart(storeReq.result.slice(batchFirstIndex, batchLastIndex))
            
            batchFirstIndex = batchLastIndex
            batchLastIndex = Math.min(Math.round(batchLastIndex += DEF_BATCH_SIZE), lastIndex)
            
            if (batchLastIndex < lastIndex) {
              frameRef.current = requestAnimationFrame(formChart)
            }

            if (batchLastIndex === lastIndex) {
              drawChart(storeReq.result.slice(batchFirstIndex, batchLastIndex))
              cancelAnimationFrame(frameRef.current)
            }
          }

          requestAnimationFrame(formChart)
        }
        
        storeReq.onerror = (e: Event) => console.error(`${(e.target as IDBRequest).error}`)
  
        tx.oncomplete = () => reqDB.result.close()
        tx.onerror = (e: Event) => console.error(`${(e.target as IDBTransaction).error}`)
      }
    }
  
    return () => setToggle(null)
  }, [chartName, firstYear, lastYear, toggle])


  return <Canvas ref={canvasRef} />
}
