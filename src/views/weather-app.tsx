import { selectStore } from '../stores'

import { Button, Range, Select } from './'

import style from './weather-app.module.css'


export function WeatherApp({ children }: { children: React.ReactNode }) {
  const { years, yearsReversed } = selectStore
  
  return (
    <article className={style.wrap}>
      <form className={style.container}>
        <fieldset className={style.top}>
          <div className={style.selects}>
            <Select
              opts={years}
              yearKey={'firstYear'}
            />

            <Select
              opts={yearsReversed}
              yearKey={'lastYear'}
            />
          </div>

          <Range />
        </fieldset>

        { children }

        <fieldset className={style.bottom}>
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
