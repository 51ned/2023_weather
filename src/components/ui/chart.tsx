import { useContext, useEffect, useRef, useState } from 'react'

import { ChartContext, YearsContext } from '../../stores'

import { Canvas } from './'

import { drawChart, getIndexes } from '../../utils'
import type { ChartDataProps } from '../../utils/interfaces'


const NAME_DB = 'WeatherDB'

const DEF_BATCH_SIZE = 365
const TARGET_TIME = 16.7


export function Chart() {
  const { yearsState } = useContext(YearsContext)
  const { firstYear, lastYear } = yearsState

  const { chartState } = useContext(ChartContext)
  const { chartName } = chartState

  const trigger = useRef(false)

  const [points, setPoints] = useState<number[]>([])

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const batchRef = useRef

  useEffect(() => {(async () => await checkLocalStorage())()}, []) // бесит сука. написать свой useEffect?
  useEffect(() => {(async () => await checkLocalStorage())()}, [chartName])

  const checkLocalStorage = async () => {
    return new Promise((rs, rj) => {
      const timer = setInterval(() => {
        if (localStorage.getItem(`${chartName}StoreFormed`)) {
          rs(trigger.current = !trigger.current)
          clearInterval(timer)
        }
      }, 100)
    })
  }


  useEffect(() => {
    const reqDB = indexedDB.open(NAME_DB)

    reqDB.onsuccess = () => {
      const tx = reqDB.result.transaction(`${chartName}`, 'readonly')
      const store = tx.objectStore(`${chartName}`)

      const [firstIndex, lastIndex] = getIndexes(firstYear, lastYear)
      const range = IDBKeyRange.bound(firstIndex, lastIndex)

      let firstBatchIndex = firstIndex
      let lastBatchIndex = DEF_BATCH_SIZE
      let batchRange = IDBKeyRange.bound(firstBatchIndex, lastBatchIndex)

      const cursorReq = store.openCursor(range)

      cursorReq.onsuccess = () => {
        if (cursorReq.result) { 
          const drawStart = performance.now()

          const batchReq = store.getAll(batchRange)
          
          batchReq.onsuccess = () => {
            setPoints((prv) => [...prv, ...batchReq.result])
            drawChart(canvasRef.current, points)
          }

          const drawFinish = performance.now()
          const drawTime = drawStart - drawFinish
        }
      }

      cursorReq.onerror = (e: Event) => new Error(`${(e.target as IDBRequest).error}`)
    }

    reqDB.onerror = (e: Event) => new Error(`${(e.target as IDBRequest).error}`)
  }, [firstYear, lastYear, trigger])


  return <canvas ref={canvasRef} />
}