/*
  Нет необходимости сохранять в IDB ключи 't' с датами в формате строк.
  Зная первую дату (константа 'FIRST_DATE'), индексы для итерации по массиву можно рассчитать.
  Что-то подобное (работа с объектом 'Date') пришлось бы делать в любом случае.
  Такой же вариант позволяет сэкономить на операциях чтения/записи.
*/


const FIRST_DATE = '1881-01-01'
const MS_IN_DAY = 86400000


export function getIndexes(firstYear: string, lastYear: string): number[] {
  const getIndex = (a: string, b: string): number => {
    const firstDate = new Date(a)
    const lastDate = new Date(b)

    return Math.abs((lastDate.getTime() - firstDate.getTime()) / MS_IN_DAY)
  }

  const firstChoosedDate = `${firstYear}-01-01`
  let lastChoosedDate

  firstYear !== lastYear // Если пользователь выбрал один и тот же год...
    ? (lastChoosedDate = `${lastYear}-12-31`)
    : (lastChoosedDate = `${firstYear}-12-31`)

  const firstIndex = getIndex(FIRST_DATE, firstChoosedDate) + 1
  const lastIndex = getIndex(FIRST_DATE, lastChoosedDate) + 1
  
  return [firstIndex, lastIndex]
}
