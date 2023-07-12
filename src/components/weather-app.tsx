import { useContext, useMemo } from 'react'

import { Button, Select} from './ui'

import { ChartContext, YearsContext } from '../stores'

import { yearsArr as years } from '../utils/get-years'

import style from './weather-app.module.css'


type WeatherAppProps = {
  children: React.ReactNode
}


const FIRST_YEAR = 1881
const LAST_YEAR = 2006


export function WeatherApp({ children }: WeatherAppProps) {
  const { chartState } = useContext(ChartContext)
  const { yearsState } = useContext(YearsContext)
  const { firstYear } = yearsState

  // При выборе года в первом селекте, массив опций для второго селекта
  // пересобирается, начиная с выбранного года.
  const yearsReversed = useMemo(() => {
    let arr = []

    for (let i = +firstYear; i <= LAST_YEAR; i++) {
      arr.push(i)
    }
    
    return arr.reverse()
    }, [firstYear])

  
  return (
    <article className={style.wrap}>
      <h1 className={style.header}>Архив метеослужбы</h1>

      <form className={style.container}>
        <div className={style.buttons}>
          <Button value='temperature'>
            Температура
          </Button>

          <Button value='precipitation'>
            Осадки
          </Button>
        </div>

        <div>
          <div className={style.selects}>
            <Select
              opts={years}
              selectedYear={yearsState.firstYear}
              yearKey={'firstYear'}
            />

            <Select
              opts={yearsReversed}
              selectedYear={yearsState.lastYear}
              yearKey={'lastYear'}
            />
          </div>
      
          { children }
        </div>
      </form>
    </article>
  )
}