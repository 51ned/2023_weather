// const lastYear = (new Date()).getFullYear()
// const firstYear = lastYear - 120
// ...
// okFace


const FIRST_YEAR = 1881
const LAST_YEAR = 2006


const getYears = () => {
  let arr = []

  for (let i = FIRST_YEAR; i <= LAST_YEAR; i++) {
    arr.push(i)
  }
  
  return arr
}


export const yearsArr = getYears()