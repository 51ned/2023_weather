// const lastYear = (new Date()).getFullYear()
// const firstYear = lastYear - 120
// ...
// okFace


export const getYears = (a: number, b: number) => {
  let arr = []

  for (let i = a; i <= b; i++) {
    arr.push(i)
  }
  
  return arr
}
