// Я старался, чтобы код читался и без комментариев,
// от того и много переменных, которые для production
// можно и удалить.

import { useContext, useEffect, useState } from 'react'

import { WeatherContext } from './stores/context'

import { WeatherApp } from './components/weather-app'
import { Canvas } from './components/ui'

import { fetchData, getMissedDaysNum } from './utils'
import type { ItemProps, ChartDataProps } from './utils/interfaces'


const FIRST_YEAR = 1881
const LAST_YEAR = 2006

// Я порезал локальный temperature.json: удалил начало и конец,
// фрагменты различной длины из середины. Не повреждённый файл
// сохранил на сервере одного из своих сайтов.
const serverURL = import.meta.env.VITE_SERVER_URL


export default function Home() {
  // Я знаю, что стоит разделить контекст для кнопок и селектов.
  const { globalState } = useContext(WeatherContext)
  const { chartType, firstYear, lastYear } = globalState
  
  const [data, setData] = useState<ChartDataProps>({
    precipitation: null,
    temperature: null
  })
  const source = data[chartType as keyof ChartDataProps]
  
  const [isDataLocal, setIsDataLocal] = useState(true)

  const [points, setPoints] = useState<number[]>()


  // Запрашиваем данные
  const getData = async () => {
    let res: ItemProps[]
    
    try { res = await fetchData(`../data/${chartType}.json`) }

    // Так как в функции .fetchData() есть метод .json(),
    // пустой файл json или его отсутствие приведёт нас сюда
    // и файл будет запрошен с удалённого сервера.
    catch {
      res = await fetchData<ItemProps>(`${serverURL}/${chartType}.json`)
      setIsDataLocal(false)
    }

    return res
  }


  // В зависимости от источника данных, либо
  // направляем результат из функции выше на проверку,
  // либо сразу сохраняем в state.
  const directData = async (res: ItemProps[]) => {
    isDataLocal
      ? await formData(res).then(res => saveData(res))
      : saveData(res)
  }


  // Вызываем getData() и directData()
  useEffect(() => {
    if (!source) {
      (async () => {
        await getData()
          .then(res => directData(res))
          .catch(err => console.error(err))
      })()
    }
  }, [chartType])


  // Если данные были запрошены локально,
  // начинаем их проверку и если нужно, восстановление.
  const formData = async (res: ItemProps[]) => {
    let currDay = 0
    let locData = res
    let remData = null

    const locFirstDay = locData[0].t
    const remFirstDay = `${FIRST_YEAR}-01-01`

    const locLastDay = locData[locData.length - 1].t
    const remLastDay = `${LAST_YEAR}-12-31`


    // Если отсутствует начало...
    if (locFirstDay !== remFirstDay) {
      const missedDaysNum = getMissedDaysNum(locFirstDay, remFirstDay)
      
      currDay = missedDaysNum

      remData = await fetchData<ItemProps>(`${serverURL}/${chartType}.json`)
      locData.splice(0, 0, ...remData.slice(0, missedDaysNum))
    }


    // ...фрагменты в середине...
    while (currDay < locData.length - 1) {
      const locCurrDay = locData[currDay].t
      const locNextDay = locData[currDay + 1].t
      const missedDaysNum = getMissedDaysNum(locCurrDay, locNextDay) - 1
    
      if (missedDaysNum > 0) {
        remData ??= await fetchData<ItemProps>(`${serverURL}/${chartType}.json`)
        locData.splice(currDay, 0, ...remData.slice(currDay + 1, currDay + 1 + missedDaysNum))

        currDay += missedDaysNum
      }
    
      currDay++
    }


    // ...или конец.
    if (locLastDay !== remLastDay) {
      remData ??= await fetchData<ItemProps>(`${serverURL}/${chartType}.json`)
      locData.push(...remData.slice(currDay + 1, remData.length))
    }
    
    remData = null

    return locData
  }
  

  // Сохраняем данные в state.
  // !!! В принципе, можно сразу сохранять массив точек и чуть изменить код ниже.
  // Будет время, переделаю.
  const saveData = async (res: ItemProps[]) => setData({...data, [`${chartType}`]: res})

  
  // Наконец, находим точки графика и также сохраняем их в state.
  // Я делаю это, чтобы разделить логику запроса данных и отрисовки графика
  // (продолжение в src/components/ui/canvas).
  useEffect(() => {
    if (source) {
      const dataFirstDate = new Date(source[0].t)
      const userFirstDate = new Date(`${firstYear}-01-01`)
  
      const dataLastDate = new Date(source[source.length - 1].t)
      let userLastDate = new Date(`${lastYear}-12-31`)

      // Последний год не может быть больше первого (см. 'src/components/weather-app').
      // На каком-то сайте видел такую фишку, на скорую руку сделал.
      // Ну а если они равны:
      if (firstYear === lastYear) {
        userLastDate = new Date(`${firstYear}-12-31`)
      }

      let points: number[]
  
      if (dataFirstDate === userFirstDate && dataLastDate === userLastDate) {
        points = source.map(item => item.v)
      } else {
        points = source
          .filter((item) => { return new Date(item.t) >= userFirstDate && new Date(item.t) <= userLastDate})
          .map(item => item.v)
      }
  
      setPoints(points)
    }
  }, [chartType, firstYear, lastYear, source])


  return (
    <WeatherApp>
      <Canvas points={points} />
    </WeatherApp>
  )
}
