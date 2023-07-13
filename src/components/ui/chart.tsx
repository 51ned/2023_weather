import { useContext, useEffect, useState } from 'react'

import { YearsContext } from '../../stores'

import { Canvas } from './'

import type { ChartDataProps } from '../../utils/interfaces'


const FIRST_DATE = '1881-01-01'
const MS_IN_DAY = 86400000
const TARGET_TIME = 16.7


interface ChartProps { data: number[] | null }


export function Chart({ data }: ChartProps) {
  const { yearsState } = useContext(YearsContext)
  const { firstYear, lastYear } = yearsState

  const [chartPoints, setChartPoints] = useState<number[]>()


  useEffect(() => {
    const getIndex = (a: string, b: string): number => {
      const firstDate = Math.abs(Date.parse(a))
      const lastDate = Math.abs(Date.parse(b))
  
      return Math.abs((lastDate - firstDate) / MS_IN_DAY)
    }
  
    const firstChoosedDate = `${firstYear}-01-01`
    let lastChoosedDate = `${lastYear}-12-31`
  
    firstYear === lastYear
      lastChoosedDate = `${firstYear}-12-31`
  
    const firstIndex = getIndex(FIRST_DATE, firstChoosedDate)
    let lastIndex = getIndex(firstChoosedDate, lastChoosedDate)


    let animFrameID: number
    let batchSize = 365

    if (data) {
      const animate = () => {
        const start = performance.now()
          setChartPoints(data.slice(firstIndex, lastIndex))
        const end = performance.now()

        const renderTime = end - start

        renderTime < TARGET_TIME && (batchSize = Math.min(batchSize * 2, data.length))
        renderTime > TARGET_TIME && (batchSize = Math.max(batchSize / 2, data.length))

        lastIndex = batchSize

        if (lastIndex < data.length) {
          requestAnimationFrame(animate)
        }
      }

      animate()
    }
    
    return () => cancelAnimationFrame(animFrameID)
  }, [data, firstYear, lastYear])



  return null
}