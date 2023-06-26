const MS_IN_DAY = 86400000


export const getMissedDaysNum = (a: string, b: string) => {
  return Math.abs((Date.parse(b) - Date.parse(a)) / MS_IN_DAY)
}
