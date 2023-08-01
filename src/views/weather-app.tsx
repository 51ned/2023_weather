import { selectStore } from '../stores/.'

import { Button, Select} from './'

import style from './weather-app.module.css'


export function WeatherApp({ children }: { children: React.ReactNode }) {
  const { years, yearsReversed } = selectStore
  
  return (
    <article className={style.wrap}>
      <form className={style.container}>
        <fieldset className={style.selects}>
          <Select
            opts={years}
            yearKey={'firstYear'}
          />

          <Select
            opts={yearsReversed}
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
