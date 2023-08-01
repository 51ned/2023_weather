// Адгоритм скользящего среднего


export function smoothData(data: number[], winSize: number) {
  const res = []

  let left = 0
  let right = 0
  let sum = 0

  while (right < data.length) {
    sum += data[right]

    if (right - left + 1 > winSize) {
      sum -= data[left]
      left++
    }

    if (right - left + 1 === winSize) {
      res.push(Math.round(sum / winSize))
    }

    right++
  }

  return res
}