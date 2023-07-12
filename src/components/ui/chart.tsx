import { useContext, useEffect, useState } from 'react'

import { YearsContext } from '../../stores'

import { Canvas } from './'

import type { ItemProps } from '../../utils/interfaces'


interface ChartProps { data: ItemProps[] }


export function Chart({ data }: ChartProps) {
  const { yearsState } = useContext(YearsContext)
  const { firstYear, lastYear } = yearsState

  const [points, setPoints] = useState<number[]>()


  useEffect(() => {
    const dataFirstDate = new Date(data[0].t)
    const userFirstDate = new Date(`${firstYear}-01-01`)

    const dataLastDate = new Date(data[data.length - 1].t)
    let userLastDate = new Date(`${lastYear}-12-31`)

    if (firstYear === lastYear) {
      userLastDate = new Date(`${firstYear}-12-31`)
    }

    let points: number[]
  
    if (dataFirstDate === userFirstDate && dataLastDate === userLastDate) {
      points = data.map(item => item.v)
    }
    
    else {
      points = data
        .filter((item) => { return new Date(item.t) >= userFirstDate && new Date(item.t) <= userLastDate})
        .map(item => item.v)
    }

    setPoints(points)
  }, [data, firstYear, lastYear])


  useEffect(() => {
    let animFrameID: number
  }, [points])


  return (
    <></>
    // <Canvas points={points} />
  )
}