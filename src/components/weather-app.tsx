import { useContext, useMemo } from 'react'
import { useWindowSize } from '../hooks'

import { YearsContext } from '../stores'

import { Button, Select} from './'

import { getYears } from '../utils/get-years'

import { FIRST_YEAR, LAST_YEAR } from '../lib/consts'

import style from './weather-app.module.css'


type WeatherAppProps = { children: React.ReactNode }


export function WeatherApp({ children }: WeatherAppProps) {
  const { yearsState } = useContext(YearsContext)
  const { firstYear, lastYear } = yearsState


  const { height: screenHeight, width: screenWidth } = useWindowSize()

  let articleHeight: number
  let articleWidth: number

  if (screenWidth > 768) {
    articleHeight = screenHeight * (1/2)
    articleWidth = screenWidth * (1/2)
  } else {
    articleHeight = screenHeight
    articleWidth = screenWidth
  }


  const years = useMemo(() => getYears(FIRST_YEAR, +lastYear), [lastYear])
  const yearsReversed = useMemo(() => getYears(+firstYear, LAST_YEAR).reverse(), [firstYear])

  
  return (
    <article
      className={style.wrap}
      style={{height: articleHeight, width: articleWidth}}
    >
      <form className={style.container}>
        <fieldset className={style.selects}>
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
        </fieldset>
      
        { children }

        <fieldset className={style.buttons}>
          <Button value='temperature'>
            Temperature
          </Button>

          <Button value='precipitation'>
            Precipitation
          </Button>
        </fieldset>
      </form>
    </article>
  )
}