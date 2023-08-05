/*
  Алгоритм скользящего среднего с динамическим размером окна
  и шагом в размер окна.

*/


import { DAYS_IN_YEAR, POINTS_NUM } from '../lib/consts'


export function smoothData(data: number[]) {
  const res = []

  let winSize = Math.round(data.length / 100)

  // switch (true) {
  //   case data.length > POINTS_NUM / 4 * 3:
  //     winSize = Math.round(DAYS_IN_YEAR / 4 * 3)
  //     break
  //   case data.length > POINTS_NUM / 2:
  //     winSize = Math.round(DAYS_IN_YEAR / 2)
  //     break
  //   case data.length > POINTS_NUM / 3:
  //     winSize = Math.round(DAYS_IN_YEAR / 3)
  //     break
  //   case data.length > 365:
  //     winSize = Math.round(DAYS_IN_YEAR / 4)
  //     break  
  //   case data.length === 365:
  //     winSize = 1
  //     break    
  // }

  const getSum = (arr: number[]) => {
    return arr.reduce((acc, current) => acc + current, 0)
  }

  let firstIndex = 0
  let lastIndex = Math.min(winSize, data.length)

  while (lastIndex <= data.length) {
    res.push(Math.round(getSum(data.slice(firstIndex, lastIndex)) / winSize))

    firstIndex = lastIndex
    lastIndex += winSize
  }

  return res
}